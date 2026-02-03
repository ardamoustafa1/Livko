from neo4j import GraphDatabase
from app.config import settings


class Neo4jClient:
    def __init__(self):
        self._driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_username, settings.neo4j_password),
        )

    def close(self):
        self._driver.close()

    def get_session(self):
        return self._driver.session()

    def get_all_nodes_and_edges(self):
        """Fetch nodes and relationships for in-memory graph algorithms."""
        with self.get_session() as session:
            result = session.run(
                """
                MATCH (a)-[r:CONNECTS_TO|ACCESSIBLE_PATH|EMERGENCY_PATH]->(b)
                RETURN id(a) AS source_id, id(b) AS target_id, type(r) AS rel_type,
                       r.distance AS distance,
                       coalesce(r.accessibility_score, 1.0) AS accessibility_score,
                       coalesce(r.time_cost, 1.0) AS time_cost
                """
            )
            edges = []
            node_ids = set()
            for record in result:
                edges.append({
                    "source": record["source_id"],
                    "target": record["target_id"],
                    "type": record["rel_type"],
                    "distance": float(record["distance"] or 1.0),
                    "accessibility_score": float(record["accessibility_score"] or 1.0),
                    "time_cost": float(record["time_cost"] or 1.0),
                })
                node_ids.add(record["source_id"])
                node_ids.add(record["target_id"])

            nodes = {}
            if node_ids:
                result2 = session.run(
                    """
                    MATCH (n) WHERE id(n) IN $ids
                    RETURN id(n) AS id, labels(n)[0] AS label, properties(n) AS props
                    """,
                    ids=list(node_ids),
                )
                for record in result2:
                    nodes[record["id"]] = {
                        "label": record["label"] or "Node",
                        "props": record["props"] or {},
                    }
            return nodes, edges

    def get_exit_node_ids(self) -> list[int]:
        """Return internal node ids for all Exit nodes."""
        with self.get_session() as session:
            result = session.run(
                "MATCH (n:Exit) RETURN id(n) AS id"
            )
            return [record["id"] for record in result]

    def get_node_id_by_identifier(self, identifier: str):
        """Resolve string identifier (e.g. UUID) to internal Neo4j node id if needed."""
        with self.get_session() as session:
            result = session.run(
                """
                MATCH (n) WHERE n.id = $identifier OR toString(id(n)) = $identifier
                RETURN id(n) AS internal_id LIMIT 1
                """,
                identifier=identifier,
            )
            record = result.single()
            return record["internal_id"] if record else None

    def get_all_node_identifiers(self):
        """Map internal id to external id for response."""
        with self.get_session() as session:
            result = session.run(
                "MATCH (n) RETURN id(n) AS internal_id, coalesce(n.id, toString(id(n))) AS external_id"
            )
            return {record["internal_id"]: record["external_id"] for record in result}

    def get_node_by_internal_id(self, internal_id: int):
        """Return external id for internal id."""
        with self.get_session() as session:
            result = session.run(
                "MATCH (n) WHERE id(n) = $id RETURN coalesce(n.id, toString(id(n))) AS external_id",
                id=internal_id,
            )
            record = result.single()
            return record["external_id"] if record else str(internal_id)
