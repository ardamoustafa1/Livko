from pydantic import BaseModel, Field
from typing import Literal


AccessibilityModeType = Literal["none", "disabled", "elderly", "stroller"]


class ComputeRouteRequest(BaseModel):
    start_node_id: str = Field(..., description="Start graph node ID or QR mapping")
    target_node_id: str = Field(..., description="Target graph node ID or 'nearest_exit' for emergency")
    accessibility_mode: AccessibilityModeType = "none"
    emergency_mode: bool = False


class RouteStep(BaseModel):
    nodeId: str
    instruction: str
    order: int = 0


class ComputeRouteResponse(BaseModel):
    path: list[str] = Field(..., description="Ordered list of node IDs")
    instructions: list[RouteStep] = Field(..., description="Step-by-step instructions")
    totalDistance: float = Field(..., description="Total distance in meters")
    estimatedTimeSeconds: float = Field(..., description="Estimated time in seconds")
