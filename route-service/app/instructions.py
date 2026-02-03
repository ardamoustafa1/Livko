from typing import Any

NODE_LABELS: dict[str, str] = {
    "Room": "room",
    "Elevator": "elevator",
    "Stair": "stair",
    "Exit": "exit",
}


def generate_instructions(
    path: list[int],
    id_to_external: dict[int, str],
    nodes: dict[int, Any],
    accessibility_mode: str,
) -> list[dict]:
    """Generate step-by-step textual instructions (voice-friendly when accessibility enabled)."""
    instructions = []
    for i, node_id in enumerate(path):
        external_id = id_to_external.get(node_id, str(node_id))
        node_info = nodes.get(node_id, {})
        label = (node_info.get("label") or "Node").lower()
        props = node_info.get("props") or {}
        name = props.get("name") or props.get("id") or external_id

        if label == "room":
            text = f"Go to room {name}."
        elif label == "elevator":
            text = "Take the elevator."
        elif label == "stair":
            text = "Use the stairs."
        elif label == "exit":
            text = f"Exit via {name}."
        else:
            text = f"Continue to {name}."

        if accessibility_mode and accessibility_mode != "none":
            text = text.strip().rstrip(".")
            text = text + "." if text else "Continue."

        instructions.append({
            "nodeId": external_id,
            "instruction": text,
            "order": i + 1,
        })
    return instructions
