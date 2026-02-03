from collections import defaultdict
from typing import Optional


def build_adjacency(
    edges: list[dict],
    nodes: dict[int, dict],
    accessibility_mode: str,
    emergency_mode: bool,
) -> dict[int, list[tuple[int, float, float]]]:
    """
    Build adjacency list.
    - emergency_mode: only EMERGENCY_PATH edges.
    - accessibility_mode in (disabled, elderly, stroller): exclude stairs, prefer elevators/wide.
    """
    adj: dict[int, list[tuple[int, float, float]]] = defaultdict(list)

    def is_stair(nid: int) -> bool:
        label = (nodes.get(nid) or {}).get("label") or ""
        return str(label).lower() == "stair"

    for e in edges:
        rel_type = e.get("type") or "CONNECTS_TO"
        if emergency_mode and rel_type != "EMERGENCY_PATH":
            continue
        if not emergency_mode and rel_type == "EMERGENCY_PATH":
            continue
        if accessibility_mode and accessibility_mode != "none":
            if is_stair(e["source"]) or is_stair(e["target"]):
                continue
        distance = e["distance"]
        time_cost = e["time_cost"]
        accessibility_score = e["accessibility_score"]
        if accessibility_mode and accessibility_mode != "none":
            weight = distance * (2.0 - accessibility_score)
        else:
            weight = distance
        adj[e["source"]].append((e["target"], weight, time_cost))
    return dict(adj)


def dijkstra(
    adj: dict[int, list[tuple[int, float, float]]],
    start: int,
    target: Optional[int],
    node_count: int,
    exit_ids: Optional[set[int]] = None,
) -> tuple[list[int], float, float]:
    """
    Dijkstra: returns path (node ids), total distance, total time.
    If target is None and exit_ids given, find nearest exit. Otherwise target is required.
    """
    import heapq
    INF = 10**18
    dist: dict[int, float] = defaultdict(lambda: INF)
    time_so_far: dict[int, float] = defaultdict(float)
    parent: dict[int, Optional[int]] = {start: None}
    dist[start] = 0.0
    time_so_far[start] = 0.0
    heap: list[tuple[float, int]] = [(0.0, start)]
    exit_ids = exit_ids or set()

    end: Optional[int] = None
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        if target is not None and u == target:
            end = u
            break
        if exit_ids and u in exit_ids:
            end = u
            break
        for v, w, t in adj.get(u, []):
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                time_so_far[v] = time_so_far[u] + t
                parent[v] = u
                heapq.heappush(heap, (dist[v], v))

    if end is None and target is not None:
        end = target
    if end is None and exit_ids:
        best = None
        best_d = INF
        for eid in exit_ids:
            if dist[eid] < best_d:
                best_d = dist[eid]
                best = eid
        end = best
    if end is None or dist[end] >= INF:
        return [], 0.0, 0.0

    path = []
    cur = end
    while cur is not None:
        path.append(cur)
        cur = parent.get(cur)
    path.reverse()
    return path, dist[end], time_so_far[end]


def astar(
    adj: dict[int, list[tuple[int, float, float]]],
    start: int,
    target: int,
    node_count: int,
) -> tuple[list[int], float, float]:
    """
    A* with heuristic 0 (equivalent to Dijkstra but typically faster for single target).
    Returns path, total distance, total time.
    """
    import heapq
    INF = 10**18
    dist = [INF] * (node_count + 1)
    time_so_far = [0.0] * (node_count + 1)
    parent: dict[int, Optional[int]] = {start: None}
    dist[start] = 0.0
    time_so_far[start] = 0.0
    heap: list[tuple[float, int]] = [(0.0, start)]

    while heap:
        _, u = heapq.heappop(heap)
        if u == target:
            break
        if dist[u] >= INF:
            continue
        for v, w, t in adj.get(u, []):
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                time_so_far[v] = time_so_far[u] + t
                parent[v] = u
                heapq.heappush(heap, (dist[v], v))

    if dist[target] >= INF:
        return [], 0.0, 0.0
    path = []
    cur = target
    while cur is not None:
        path.append(cur)
        cur = parent.get(cur)
    path.reverse()
    return path, dist[target], time_so_far[target]
