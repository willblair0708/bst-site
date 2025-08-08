from fastapi import APIRouter, Header
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uuid

router = APIRouter()


class WorkflowRequest(BaseModel):
    name: str
    nodes: list[dict]
    edges: list[dict]


@router.post("/v1/workflows")
async def run_workflow(payload: WorkflowRequest, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    return {"workflowId": str(uuid.uuid4()), "status": "queued", "note": "Phase 0 stub"}