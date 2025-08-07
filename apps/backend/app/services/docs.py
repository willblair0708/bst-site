import uuid
from fastapi import APIRouter, Header
from pydantic import BaseModel
from fastapi.responses import JSONResponse

router = APIRouter()


class IngestRequest(BaseModel):
    doi: str | None = None
    url: str | None = None


@router.post("/docs/ingest")
async def docs_ingest(payload: IngestRequest, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    return {"docId": str(uuid.uuid4()), "status": "queued", "note": "Stub ingestion for Phase 0"}


@router.post("/v1/documents:ingest")
async def v1_documents_ingest(payload: IngestRequest, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    # Reuse the same stub behavior for Phase 0
    return {"docId": str(uuid.uuid4()), "status": "queued", "note": "Stub ingestion for Phase 0"}


