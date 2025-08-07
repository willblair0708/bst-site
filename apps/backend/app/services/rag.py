from typing import List
from fastapi import APIRouter, Header
from pydantic import BaseModel
from fastapi.responses import JSONResponse

router = APIRouter()


class Passage(BaseModel):
    source: str
    text: str
    span: List[int]


@router.get("/rag/search")
async def rag_search(q: str, k: int = 3, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    canned = [
        Passage(source="doi:10.1038/nature12345", text=f"Stub passage about {q} (Nature).", span=[0, 120]).model_dump(),
        Passage(source="doi:10.1126/science.abc123", text=f"Stub passage about {q} (Science).", span=[0, 110]).model_dump(),
        Passage(source="arXiv:2101.00001", text=f"Stub passage about {q} (arXiv).", span=[0, 90]).model_dump(),
    ]
    return {"passages": canned[: max(1, min(k, 5))]}


class ExpandRequest(BaseModel):
    q: str
    n: int = 3


@router.post("/rag/expand")
async def rag_expand(payload: ExpandRequest, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    q = payload.q.strip()
    rewrites = [
        f"{q} recent systematic reviews",
        f"{q} randomized controlled trials 2020..now",
        f"{q} mechanisms and biomarkers",
    ]
    return {"queries": rewrites[: max(1, min(payload.n, 5))]}


