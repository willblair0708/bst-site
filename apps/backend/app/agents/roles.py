import os
import json
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
async def rag_search(q: str, k: int = 3) -> str:
    start = time.perf_counter()
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=20) as client:
        resp = await client.get("/services/rag/search", params={"q": q, "k": k}, headers=await _get_headers())
        resp.raise_for_status()
        out = resp.json()
    elapsed = int((time.perf_counter() - start) * 1000)
    trace = TOOL_TRACE_CVAR.get()
    if trace is not None:
        trace.append({"tool": "rag.search", "args": {"q": q, "k": k}, "t_ms": elapsed})
    return json.dumps(out)


@function_tool
@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.2, min=0.2, max=2),
    retry=retry_if_exception_type(httpx.HTTPError),
)
async def rag_expand(q: str, n: int = 3) -> str:
    start = time.perf_counter()
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=20) as client:
        resp = await client.post("/services/rag/expand", json={"q": q, "n": n}, headers=await _get_headers())
        resp.raise_for_status()
        out = resp.json()
    elapsed = int((time.perf_counter() - start) * 1000)
    trace = TOOL_TRACE_CVAR.get()
    if trace is not None:
        trace.append({"tool": "rag.expand", "args": {"q": q, "n": n}, "t_ms": elapsed})
    return json.dumps(out)


@function_tool
def format_markdown_with_refs(blocks_json: str) -> str:
    from app.tools.local import format_markdown_with_refs as _fmt
    try:
        blocks = json.loads(blocks_json)
    except Exception:
        blocks = []
    return _fmt(blocks)


@function_tool
def chem_calc(smiles: str) -> str:
    from app.tools.local import chem_calc as _chem
    return json.dumps(_chem(smiles))


@function_tool
@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.2, min=0.2, max=2),
    retry=retry_if_exception_type(Exception),
)
async def web_search_openai(q: str, max_results: int = 5) -> str:
    # Uses OpenAI Responses API built-in Web Search tool
    start = time.perf_counter()
    api_key = os.getenv("OPENAI_API_KEY", "")
    fake = os.getenv("RUNIX_FAKE_OAI", "") == "1"
    if not api_key and not fake:
        return json.dumps({"error": "Missing OPENAI_API_KEY"})
    try:
        from openai import OpenAI  # lazy import
        client = OpenAI(api_key=api_key) if api_key else OpenAI()
        resp = client.responses.create(
            model=os.getenv("MODEL_WEB_SEARCH", "gpt-4o-mini"),
            input=q,
            tools=[{"type": "web_search"}],
            tool_choice="auto",
            max_output_tokens=1000,
            extra_body={"web_search": {"max_results": max_results}},
        )
        text = getattr(resp, "output_text", "") or ""
        out = {"text": text}
    except Exception as e:
        out = {"error": str(e)}
    elapsed = int((time.perf_counter() - start) * 1000)
    trace = TOOL_TRACE_CVAR.get()
    if trace is not None:
        trace.append({"tool": "web.openai_search", "args": {"q": q[:200], "max_results": max_results}, "t_ms": elapsed})
    return json.dumps(out)

@function_tool
@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.2, min=0.2, max=2),
    retry=retry_if_exception_type(httpx.HTTPError),
)
async def chem_design(constraints_json: str | None = None, n: int = 3) -> str:
    start = time.perf_counter()
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=20) as client:
        constraints: Dict[str, Any] = {}
        if constraints_json:
            try:
                constraints = json.loads(constraints_json)
            except Exception:
                constraints = {}
        resp = await client.post("/services/chem/design", json={"constraints": constraints, "n": n}, headers=await _get_headers())
        resp.raise_for_status()
        out = resp.json()
    elapsed = int((time.perf_counter() - start) * 1000)
    trace = TOOL_TRACE_CVAR.get()
    if trace is not None:
        trace.append({"tool": "chem.design", "args": {"n": n}, "t_ms": elapsed})
    return json.dumps(out)


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


def _critic_instructions() -> str:
    return (
        "You are CRITIC, a verification agent. Cross-check claims for contradictions or overreach. "
        "Flag weak evidence and suggest additional queries. Output flags + suggestions."
    )


ALIASES = {
    # legacy → new canonical
    "CROW": "SCOUT",
    "FALCON": "SCHOLAR",
    "OWL": "ARCHIVIST",
    "PHOENIX": "ALCHEMIST",
    "FINCH": "ANALYST",
    "AUTO": "DIRECTOR",
}


def normalize_agent_name(name: str) -> str:
    key = (name or "").strip().upper()
    return ALIASES.get(key, key)


def build_agents(mcp_servers: list[Any] | None = None) -> dict[str, Any]:
    if Agent is None:
        raise ImportError("openai-agents is not installed")

    common_settings = ModelSettings(parallel_tool_calls=True) if ModelSettings else None

    scout = Agent(
        name="SCOUT",
        instructions=_scout_instructions(),
        tools=[rag_search, rag_expand, format_markdown_with_refs],
        model=os.getenv("MODEL_SCOUT", "gpt-4o-mini"),
        mcp_servers=mcp_servers or [],
        model_settings=common_settings,
    )

    scholar = Agent(
        name="SCHOLAR",
        instructions=_scholar_instructions(),
        tools=[rag_search, rag_expand, format_markdown_with_refs, web_search_openai],
        model=os.getenv("MODEL_SCHOLAR", "gpt-4o"),
        mcp_servers=mcp_servers or [],
        model_settings=common_settings,
    )

    archivist = Agent(
        name="ARCHIVIST",
        instructions=_archivist_instructions(),
        tools=[rag_search, format_markdown_with_refs, web_search_openai],
        model=os.getenv("MODEL_ARCHIVIST", "gpt-4o-mini"),
        mcp_servers=mcp_servers or [],
        model_settings=common_settings,
    )

    alchemist = Agent(
        name="ALCHEMIST",
        instructions=_alchemist_instructions(),
        tools=[chem_design, chem_calc],
        model=os.getenv("MODEL_ALCHEMIST", "gpt-4o-mini"),
        mcp_servers=mcp_servers or [],
        model_settings=common_settings,
    )

    analyst = Agent(
        name="ANALYST",
        instructions=_analyst_instructions(),
        tools=[],
        model=os.getenv("MODEL_ANALYST", "gpt-4o-mini"),
        mcp_servers=mcp_servers or [],
        model_settings=common_settings,
    )

    critic = Agent(
        name="CRITIC",
        instructions=_critic_instructions(),
        tools=[rag_search, rag_expand, web_search_openai],
        model=os.getenv("MODEL_CRITIC", "gpt-4o-mini"),
        mcp_servers=mcp_servers or [],
        model_settings=common_settings,
    )

    # Wrap specialists as tools for a Director orchestrator
    def _make_agent_tool(agent_obj: Any, tool_name: str, description: str):
        @function_tool(name_override=tool_name, description_override=description)
        async def _tool(input: str) -> str:
            # record start
            trace = TOOL_TRACE_CVAR.get()
            if trace is not None:
                trace.append({"tool": f"agent.{tool_name}", "args": {"input": input[:120]}, "phase": "start"})
            result = await Runner.run(agent_obj, input, max_turns=16)
            # record end
            if trace is not None:
                trace.append({"tool": f"agent.{tool_name}", "phase": "end"})
            return getattr(result, "final_output", "")
        return _tool

    scout_tool = _make_agent_tool(scout, "scout", "Fast literature QA with citations")
    scholar_tool = _make_agent_tool(scholar, "scholar", "Deep review with plan→gather→synthesize→critique→finalize")
    archivist_tool = _make_agent_tool(archivist, "archivist", "Precedent/novelty search")
    alchemist_tool = _make_agent_tool(alchemist, "alchemist", "Chem design and planning")
    analyst_tool = _make_agent_tool(analyst, "analyst", "Analysis template/synthesis")

    @function_tool(name_override="run_all_specialists_parallel", description_override="Run SCOUT, SCHOLAR, ARCHIVIST in parallel and return a dict of results (as JSON string)")
    async def run_all_specialists_parallel(input: str) -> str:
        # Parallel fan-out using asyncio.gather via Runner
        import asyncio
        results = await asyncio.gather(
            Runner.run(scout, input, max_turns=8),
            Runner.run(scholar, input, max_turns=16),
            Runner.run(archivist, input, max_turns=8),
        )
        names = ["scout", "scholar", "archivist"]
        out: Dict[str, str] = {}
        for name, res in zip(names, results):
            out[name] = getattr(res, "final_output", "")
        return json.dumps(out)

    # Load director prompt if available
    director_prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "director.md")
    director_prompt = _alchemist_instructions()
    try:
        if os.path.exists(director_prompt_path):
            with open(director_prompt_path, "r", encoding="utf-8") as f:
                director_prompt = f.read()
    except Exception:
        pass

    director = Agent(
        name="DIRECTOR",
        instructions=director_prompt,
        tools=[
            scout_tool,
            scholar_tool,
            archivist_tool,
            alchemist_tool,
            analyst_tool,
            run_all_specialists_parallel,
        ],
        mcp_servers=mcp_servers or [],
        model=os.getenv("MODEL_DIRECTOR", "gpt-4o"),
        model_settings=ModelSettings(parallel_tool_calls=True, tool_choice="required") if ModelSettings else None,
    )

    return {
        "SCOUT": scout,
        "SCHOLAR": scholar,
        "ARCHIVIST": archivist,
        "ALCHEMIST": alchemist,
        "ANALYST": analyst,
        "CRITIC": critic,
        "DIRECTOR": director,
    }


_AGENTS_CACHE: dict[str, Any] | None = None


def get_agent(name: str):
    global _AGENTS_CACHE
    if _AGENTS_CACHE is None:
        _AGENTS_CACHE = build_agents()
    return _AGENTS_CACHE.get(normalize_agent_name(name))


