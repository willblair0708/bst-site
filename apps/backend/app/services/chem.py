from typing import List
from fastapi import APIRouter, Header
from pydantic import BaseModel
from fastapi.responses import JSONResponse

router = APIRouter()


class Candidate(BaseModel):
    smiles: str
    score: float
    rationale: str


class DesignRequest(BaseModel):
    constraints: dict | None = None
    n: int = 3


@router.post("/chem/design")
async def chem_design(payload: DesignRequest, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    cands: List[Candidate] = [
        Candidate(smiles="CCO", score=0.42, rationale="Stub candidate: small alcohol").model_dump(),
        Candidate(smiles="c1ccccc1", score=0.35, rationale="Stub candidate: benzene core").model_dump(),
        Candidate(smiles="CC(=O)O", score=0.28, rationale="Stub candidate: acetate motif").model_dump(),
    ]
    n = max(1, min(payload.n, 5))
    return {"candidates": cands[:n], "disclaimer": "Stub output for Phase 0"}


