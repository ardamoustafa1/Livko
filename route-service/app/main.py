from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.neo4j_client import Neo4jClient
from app.graph import build_adjacency, dijkstra, astar
from app.instructions import generate_instructions
from app.schemas import ComputeRouteRequest, ComputeRouteResponse, RouteStep

neo4j_client: Neo4jClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global neo4j_client
    neo4j_client = Neo4jClient()
    yield
    if neo4j_client:
        neo4j_client.close()


app = FastAPI(
    title="Indoor Navigation Route Service",
    description="Computes routes on the graph (Dijkstra / A*) with accessibility and emergency support.",
    version="1.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/compute-route", response_model=ComputeRouteResponse)
def compute_route(body: ComputeRouteRequest):
    global neo4j_client
    if not neo4j_client:
        raise HTTPException(status_code=503, detail="Neo4j not connected")

    nodes, edges = neo4j_client.get_all_nodes_and_edges()
    id_to_external = neo4j_client.get_all_node_identifiers()

    def resolve_node(identifier: str) -> int | None:
        if identifier == "nearest_exit":
            return None
        internal = neo4j_client.get_node_id_by_identifier(identifier)
        if internal is not None:
            return internal
        try:
            return int(identifier)
        except ValueError:
            return None

    start_internal = resolve_node(body.start_node_id)
    target_internal = resolve_node(body.target_node_id) if body.target_node_id != "nearest_exit" else None

    if start_internal is None:
        raise HTTPException(status_code=400, detail="Start node not found")

    node_count = max(nodes.keys(), default=0) + 1
    adj = build_adjacency(
        edges,
        nodes,
        accessibility_mode=body.accessibility_mode,
        emergency_mode=body.emergency_mode,
    )

    exit_ids = set(neo4j_client.get_exit_node_ids()) if body.emergency_mode or body.target_node_id == "nearest_exit" else None
    if body.emergency_mode or target_internal is None:
        path_internal, total_distance, total_time = dijkstra(
            adj, start_internal, target_internal, node_count, exit_ids=exit_ids
        )
    else:
        path_internal, total_distance, total_time = astar(
            adj, start_internal, target_internal, node_count
        )

    if not path_internal:
        raise HTTPException(status_code=404, detail="No route found")

    path_external = [id_to_external.get(i, str(i)) for i in path_internal]
    instructions = generate_instructions(
        path_internal,
        id_to_external,
        nodes,
        body.accessibility_mode,
    )
    steps = [RouteStep(nodeId=s["nodeId"], instruction=s["instruction"], order=s["order"]) for s in instructions]

    return ComputeRouteResponse(
        path=path_external,
        instructions=steps,
        totalDistance=round(total_distance, 2),
        estimatedTimeSeconds=round(total_time, 2),
    )


@app.get("/health")
def health():
    return {"status": "ok"}
