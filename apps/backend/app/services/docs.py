import uuid
from fastapi import APIRouter, Header, Query
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import httpx
import xml.etree.ElementTree as ET

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


@router.get("/docs/crossref")
async def docs_crossref(q: str = Query(..., min_length=2), rows: int = 5, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    url = "https://api.crossref.org/works"
    params = {"query": q, "rows": max(1, min(rows, 20))}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            items = data.get("message", {}).get("items", [])
            results = [{
                "title": (i.get("title") or [""])[0],
                "doi": i.get("DOI"),
                "url": i.get("URL"),
                "issued": i.get("issued"),
                "author": i.get("author"),
            } for i in items]
            return {"results": results}
    except Exception as e:
        return {"error": str(e), "results": []}


@router.get("/docs/arxiv")
async def docs_arxiv(q: str = Query(..., min_length=2), max_results: int = 5, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    # arXiv API: simple Atom feed query
    url = "http://export.arxiv.org/api/query"
    params = {"search_query": f"all:{q}", "start": 0, "max_results": max(1, min(max_results, 20))}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            root = ET.fromstring(resp.text)
            ns = {"a": "http://www.w3.org/2005/Atom"}
            entries = []
            for entry in root.findall("a:entry", ns):
                title = (entry.find("a:title", ns).text or "").strip()
                links = [l.attrib.get("href") for l in entry.findall("a:link", ns)]
                idv = (entry.find("a:id", ns).text or "").strip()
                summary = (entry.find("a:summary", ns).text or "").strip()
                entries.append({"title": title, "id": idv, "links": links, "summary": summary})
            return {"results": entries}
    except Exception as e:
        return {"error": str(e), "results": []}


