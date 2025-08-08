import os
from typing import Optional
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

HF_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")
HF_API = "https://api-inference.huggingface.co/pipeline/feature-extraction/facebook/esm2_t33_650M_UR50D"


class ESM2Request(BaseModel):
    sequence: str


@router.post("/models/esm2/embeddings")
def esm2_embeddings(body: ESM2Request):
    if not HF_TOKEN:
        raise HTTPException(500, "Missing HUGGINGFACE_API_TOKEN")
    seq = body.sequence.strip().upper()
    if not seq:
        raise HTTPException(400, "Empty sequence")
    # Validate simple protein alphabet
    for ch in seq:
        if ch not in "ACDEFGHIKLMNPQRSTVWYBXZJUO*":
            raise HTTPException(400, f"Invalid residue: {ch}")
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    try:
        r = requests.post(HF_API, headers=headers, json={"inputs": seq}, timeout=60)
        if r.status_code != 200:
            raise HTTPException(502, f"HF error: {r.text}")
        arr = r.json()
        # arr: [tokens x hidden] — compute mean embedding
        if not isinstance(arr, list) or not arr:
            raise HTTPException(502, "Invalid HF response")
        # Some deployments wrap as [[...]]; flatten once
        if isinstance(arr[0], list) and isinstance(arr[0][0], list):
            arr = arr[0]
        hidden = len(arr[0])
        means = [sum(row[i] for row in arr) / len(arr) for i in range(hidden)]
        return {"length": len(seq), "hidden": hidden, "mean": means[:64]}  # preview first 64 dims
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, "Embedding failed")


