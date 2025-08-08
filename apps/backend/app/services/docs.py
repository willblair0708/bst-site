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


@router.get("/docs/pubmed")
async def docs_pubmed(q: str = Query(..., min_length=2), retmax: int = 10, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    esearch = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    esummary = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(esearch, params={"db": "pubmed", "retmode": "json", "term": q, "retmax": max(1, min(retmax, 50))})
            r.raise_for_status()
            ids = (r.json().get("esearchresult", {}).get("idlist", []))
            if not ids:
                return {"results": []}
            s = await client.get(esummary, params={"db": "pubmed", "retmode": "json", "id": ",".join(ids)})
            s.raise_for_status()
            res = s.json().get("result", {})
            uids = res.get("uids", [])
            items = []
            for uid in uids:
                it = res.get(uid) or {}
                items.append({
                    "uid": uid,
                    "title": it.get("title"),
                    "pubdate": it.get("pubdate"),
                    "doi": (it.get("elocationid") or "").split("doi:")[-1].strip() if "doi:" in (it.get("elocationid") or "") else None,
                })
            return {"results": items}
    except Exception as e:
        return {"error": str(e), "results": []}


@router.get("/docs/unpaywall")
async def docs_unpaywall(doi: str, email: str = Query("dev@example.com"), authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    try:
        url = f"https://api.unpaywall.org/v2/{doi}"
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(url, params={"email": email})
            r.raise_for_status()
            return r.json()
    except Exception as e:
        return {"error": str(e)}


# fix arXiv: follow https
@router.get("/docs/arxiv")
async def docs_arxiv(q: str = Query(..., min_length=2), max_results: int = 5, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    import xml.etree.ElementTree as ET
    url = "https://export.arxiv.org/api/query"
    params = {"search_query": f"all:{q}", "start": 0, "max_results": max(1, min(max_results, 20))}
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
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


