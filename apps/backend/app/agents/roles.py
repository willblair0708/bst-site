import os
from typing import Any, Dict

import httpx
import time
from contextvars import ContextVar
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

try:
    from agents import Agent, Runner, function_tool, ModelSettings  # type: ignore
except Exception as _e:  # pragma: no cover
    Agent = None  # type: ignore
    Runner = None  # type: ignore
    ModelSettings = None  # type: ignore
    def function_tool(fn=None, **_kwargs):  # type: ignore
        def deco(f):
            return f
        return deco if fn is None else deco(fn)


INTERNAL_BEARER = os.getenv("ACTIONS_BEARER", "dev-token")
BASE_URL = os.getenv("RUNIX_BASE_URL", "http://localhost:8787")


async def _get_headers() -> Dict[str, str]:
    return {"Authorization": f"Bearer {INTERNAL_BEARER}"}


# Context var for capturing tool traces during a task
TOOL_TRACE_CVAR: ContextVar[list[dict] | None] = ContextVar("tool_trace", default=None)


@function_tool
@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.2, min=0.2, max=2),
    retry=retry_if_exception_type(httpx.HTTPError),
)
async def rag_search(q: str, k: int = 3) -> Dict[str, Any]:
    start = time.perf_counter()
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=20) as client:
        resp = await client.get("/services/rag/search", params={"q": q, "k": k}, headers=await _get_headers())
        resp.raise_for_status()
        out = resp.json()
    elapsed = int((time.perf_counter() - start) * 1000)
    trace = TOOL_TRACE_CVAR.get()
    if trace is not None:
        trace.append({"tool": "rag.search", "args": {"q": q, "k": k}, "t_ms": elapsed})
    return out


@function_tool
@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.2, min=0.2, max=2),
    retry=retry_if_exception_type(httpx.HTTPError),
)
async def rag_expand(q: str, n: int = 3) -> Dict[str, Any]:
    start = time.perf_counter()
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=20) as client:
        resp = await client.post("/services/rag/expand", json={"q": q, "n": n}, headers=await _get_headers())
        resp.raise_for_status()
        out = resp.json()
    elapsed = int((time.perf_counter() - start) * 1000)
    trace = TOOL_TRACE_CVAR.get()
    if trace is not None:
        trace.append({"tool": "rag.expand", "args": {"q": q, "n": n}, "t_ms": elapsed})
    return out


@function_tool
def format_markdown_with_refs(blocks: list[dict]) -> str:
    from app.tools.local import format_markdown_with_refs as _fmt
    return _fmt(blocks)


@function_tool
def chem_calc(smiles: str) -> Dict[str, Any]:
    from app.tools.local import chem_calc as _chem
    return _chem(smiles)


@function_tool
@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.2, min=0.2, max=2),
    retry=retry_if_exception_type(httpx.HTTPError),
)
async def chem_design(constraints: dict | None = None, n: int = 3) -> Dict[str, Any]:
    start = time.perf_counter()
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=20) as client:
        resp = await client.post("/services/chem/design", json={"constraints": constraints or {}, "n": n}, headers=await _get_headers())
        resp.raise_for_status()
        out = resp.json()
    elapsed = int((time.perf_counter() - start) * 1000)
    trace = TOOL_TRACE_CVAR.get()
    if trace is not None:
        trace.append({"tool": "chem.design", "args": {"n": n}, "t_ms": elapsed})
    return out


def _scout_instructions() -> str:
    return (
        "You are SCOUT, a fast literature QA agent. Answer succinctly with [1]-style citations. "
        "Prefer recent primary sources. If confidence is low, state it clearly."
    )


def _scholar_instructions() -> str:
    return (
        "You are SCHOLAR, a deep review agent. Follow: plan → gather → synthesize → critique → finalize. "
        "Answer with citations and a short critique section."
    )


def _archivist_instructions() -> str:
    return (
        "You are ARCHIVIST, a precedent search agent. Focus on prior art and 'has anyone done X'. "
        "Emphasize novelty assessment and cite sources."
    )


def _alchemist_instructions() -> str:
    return (
        "You are ALCHEMIST, a chemistry planning agent. Use chem tools. "
        "Output a table of candidates, reasoning, and a safety disclaimer."
    )


def _analyst_instructions() -> str:
    return (
        "You are ANALYST, an analysis agent. For Phase 0, provide a structured template with placeholders."
    )


ALIASES = {
    # legacy → new canonical
    "CROW": "SCOUT",
    "FALCON": "SCHOLAR",
    "OWL": "ARCHIVIST",
    "PHOENIX": "ALCHEMIST",
    "FINCH": "ANALYST",
}


def normalize_agent_name(name: str) -> str:
    key = (name or "").strip().upper()
    return ALIASES.get(key, key)


def build_agents() -> dict[str, Any]:
    if Agent is None:
        raise ImportError("openai-agents is not installed")

    common_settings = ModelSettings(parallel_tool_calls=True) if ModelSettings else None

    scout = Agent(
        name="SCOUT",
        instructions=_scout_instructions(),
        tools=[rag_search, rag_expand, format_markdown_with_refs],
        model=os.getenv("MODEL_SCOUT", "gpt-4o-mini"),
        model_settings=common_settings,
    )

    scholar = Agent(
        name="SCHOLAR",
        instructions=_scholar_instructions(),
        tools=[rag_search, rag_expand, format_markdown_with_refs],
        model=os.getenv("MODEL_SCHOLAR", "gpt-4o"),
        model_settings=common_settings,
    )

    archivist = Agent(
        name="ARCHIVIST",
        instructions=_archivist_instructions(),
        tools=[rag_search, format_markdown_with_refs],
        model=os.getenv("MODEL_ARCHIVIST", "gpt-4o-mini"),
        model_settings=common_settings,
    )

    alchemist = Agent(
        name="ALCHEMIST",
        instructions=_alchemist_instructions(),
        tools=[chem_design, chem_calc],
        model=os.getenv("MODEL_ALCHEMIST", "gpt-4o-mini"),
        model_settings=common_settings,
    )

    analyst = Agent(
        name="ANALYST",
        instructions=_analyst_instructions(),
        tools=[],
        model=os.getenv("MODEL_ANALYST", "gpt-4o-mini"),
        model_settings=common_settings,
    )

    return {
        "SCOUT": scout,
        "SCHOLAR": scholar,
        "ARCHIVIST": archivist,
        "ALCHEMIST": alchemist,
        "ANALYST": analyst,
    }


_AGENTS_CACHE: dict[str, Any] | None = None


def get_agent(name: str):
    global _AGENTS_CACHE
    if _AGENTS_CACHE is None:
        _AGENTS_CACHE = build_agents()
    return _AGENTS_CACHE.get(normalize_agent_name(name))


