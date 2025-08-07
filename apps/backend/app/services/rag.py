from typing import List, Dict, Tuple
from fastapi import APIRouter, Header
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import os
import sqlite3
import time
import math
import json
import re

try:
    from openai import OpenAI
except Exception:
    OpenAI = None  # type: ignore

router = APIRouter()

DB_PATH = os.getenv("RUNIX_TASKS_DB", os.path.join(os.path.dirname(__file__), "..", "tasks.db"))


def _connect():
    path = os.path.abspath(DB_PATH)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def _init_db():
    conn = _connect()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            doi TEXT,
            url TEXT,
            title TEXT,
            abstract TEXT,
            source_type TEXT,
            created_at TEXT
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS passages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_id TEXT NOT NULL,
            section TEXT,
            span_start INTEGER,
            span_end INTEGER,
            text TEXT
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS embeddings (
            passage_id INTEGER PRIMARY KEY,
            model TEXT,
            vector TEXT
        )
        """
    )
    conn.commit()
    conn.close()


_init_db()


class Passage(BaseModel):
    source: str
    text: str
    span: List[int]


TOKEN_RE = re.compile(r"[A-Za-z0-9_]+")


def _tokenize(text: str) -> List[str]:
    return [t.lower() for t in TOKEN_RE.findall(text or "")]


def _compute_bm25(corpus: List[List[str]], query_terms: List[str], k1: float = 1.5, b: float = 0.75) -> List[float]:
    N = len(corpus)
    avgdl = sum(len(doc) for doc in corpus) / (N or 1)
    # document frequencies
    df: Dict[str, int] = {}
    for doc in corpus:
        seen = set(doc)
        for term in seen:
            df[term] = df.get(term, 0) + 1
    scores: List[float] = []
    for doc in corpus:
        score = 0.0
        dl = len(doc)
        tf: Dict[str, int] = {}
        for t in doc:
            tf[t] = tf.get(t, 0) + 1
        for q in query_terms:
            if q not in df:
                continue
            idf = math.log(1 + (N - df[q] + 0.5) / (df[q] + 0.5))
            freq = tf.get(q, 0)
            denom = freq + k1 * (1 - b + b * (dl / (avgdl or 1)))
            term_score = idf * ((freq * (k1 + 1)) / (denom or 1))
            score += term_score
        scores.append(score)
    return scores


def _cosine(a: List[float], b: List[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def _get_embedding(text: str, model: str = "text-embedding-3-large") -> List[float] | None:
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key or OpenAI is None:
        return None
    try:
        client = OpenAI(api_key=api_key)
        resp = client.embeddings.create(model=model, input=text)
        return resp.data[0].embedding  # type: ignore
    except Exception:
        return None


class IndexRequest(BaseModel):
    doc_id: str
    title: str | None = None
    doi: str | None = None
    url: str | None = None
    text: str
    section: str | None = None


@router.post("/rag/index")
async def rag_index(payload: IndexRequest, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    text = (payload.text or "").strip()
    if not text:
        return JSONResponse({"error": "Missing text"}, status_code=400)
    # Upsert document
    conn = _connect()
    cur = conn.cursor()
    cur.execute(
        "INSERT OR REPLACE INTO documents (id, doi, url, title, abstract, source_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (
            payload.doc_id,
            payload.doi,
            payload.url,
            payload.title,
            None,
            "manual",
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        ),
    )
    # Split into simple passages (paragraphs)
    spans: List[Tuple[int, int, str]] = []
    offset = 0
    for para in re.split(r"\n\n+", text):
        p = para.strip()
        if not p:
            offset += len(para) + 2
            continue
        start = offset
        end = offset + len(p)
        spans.append((start, end, p))
        offset = end + 2
    # Insert passages + embeddings
    inserted = 0
    for (s, e, ptxt) in spans:
        cur.execute(
            "INSERT INTO passages (doc_id, section, span_start, span_end, text) VALUES (?, ?, ?, ?, ?)",
            (payload.doc_id, payload.section or "body", s, e, ptxt),
        )
        pid = cur.lastrowid
        emb = _get_embedding(ptxt)
        if emb is not None:
            cur.execute(
                "INSERT OR REPLACE INTO embeddings (passage_id, model, vector) VALUES (?, ?, ?)",
                (pid, "text-embedding-3-large", json.dumps(emb)),
            )
        inserted += 1
    conn.commit()
    conn.close()
    return {"indexed_passages": inserted}


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


@router.get("/rag/search")
async def rag_search(q: str, k: int = 3, authorization: str | None = Header(default=None)):
    if not authorization:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    conn = _connect()
    cur = conn.cursor()
    cur.execute("SELECT id, doc_id, text FROM passages")
    rows = cur.fetchall()
    conn.close()
    passages = [(r["id"], r["doc_id"], r["text"]) for r in rows]
    tokens = [_tokenize(p[2]) for p in passages]
    q_terms = _tokenize(q)
    bm25_scores = _compute_bm25(tokens, q_terms) if passages else []
    # Prepare initial ranking
    scored = list(zip(passages, bm25_scores))
    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[: max(10, k)]
    # Optional embedding rerank for the top window
    q_emb = _get_embedding(q)
    if q_emb is not None:
        reranked: List[Tuple[Tuple[int, str, str], float]] = []
        for (pid, did, text), bm in top:
            # fetch embedding if available
            conn2 = _connect()
            cur2 = conn2.cursor()
            cur2.execute("SELECT vector FROM embeddings WHERE passage_id=?", (pid,))
            er = cur2.fetchone()
            conn2.close()
            if er:
                try:
                    vec = json.loads(er["vector"])
                    sim = _cosine(q_emb, vec)
                except Exception:
                    sim = 0.0
            else:
                sim = 0.0
            # hybrid score: 0.7 bm25 + 0.3 sim
            score = 0.7 * bm + 0.3 * sim
            reranked.append(((pid, did, text), score))
        reranked.sort(key=lambda x: x[1], reverse=True)
        top = reranked
    # Format output and cluster by doc_id
    results: List[Dict] = []
    cluster_map: Dict[str, List[int]] = {}
    for (pid, did, text), sc in top[:k]:
        results.append(Passage(source=str(did), text=text, span=[0, max(0, min(len(text), 200))]).model_dump())
        cluster_map.setdefault(str(did), []).append(pid)
    clusters = [{"doc_id": d, "passages": pids} for d, pids in cluster_map.items()]
    return {"passages": results, "clusters": clusters}


