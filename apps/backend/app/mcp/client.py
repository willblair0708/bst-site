import asyncio
import json
import os
from typing import Any, Dict, List, Optional

try:
    # Prefer modern API
    from mcp.transport.stdio import stdio_client, StdioServerParameters  # type: ignore
except Exception:  # pragma: no cover
    StdioServerParameters = None  # type: ignore
    try:
        from mcp.client.stdio import stdio_client, StdioServerParameters  # type: ignore
    except Exception:
        stdio_client = None  # type: ignore
        StdioServerParameters = None  # type: ignore

try:
    from mcp import ClientSession  # type: ignore
except Exception:  # pragma: no cover
    ClientSession = None  # type: ignore


MCP_DEFAULT_SERVERS = json.loads(os.getenv("MCP_SERVERS", "{}"))
# Example env format:
# MCP_SERVERS='{"web-fetch":{"command":"uvx","args":["mcp-science","web-fetch"]}}'


def _connect(server_name: str, server_cfg: Dict[str, Any]):
    if stdio_client is None:
        raise RuntimeError("mcp not installed. pip install mcp")
    if StdioServerParameters is None or ClientSession is None:
        raise RuntimeError("mcp client APIs unavailable; update mcp package")
    command = server_cfg.get("command")
    args = server_cfg.get("args", [])
    if not command:
        raise ValueError("Missing command for MCP server")
    params = StdioServerParameters(command=command, args=args)  # type: ignore
    return stdio_client(params)


async def list_tools(server_name: str, server_cfg: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    cfg = server_cfg or MCP_DEFAULT_SERVERS.get(server_name)
    if not cfg:
        return []
    async with _connect(server_name, cfg) as streams:
        async with ClientSession(*streams) as session:  # type: ignore[misc]
            await session.initialize()
            resp = await session.list_tools()
            tools = getattr(resp, "tools", [])
            out: List[Dict[str, Any]] = []
            for t in tools:
                try:
                    out.append(t.model_dump())  # type: ignore[attr-defined]
                except Exception:
                    try:
                        out.append(json.loads(json.dumps(t)))
                    except Exception:
                        out.append({"name": str(getattr(t, "name", "unknown"))})
            return out


async def call_tool(server_name: str, tool_name: str, arguments: Dict[str, Any], server_cfg: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    cfg = server_cfg or MCP_DEFAULT_SERVERS.get(server_name)
    if not cfg:
        raise ValueError("Unknown MCP server; configure MCP_SERVERS env")
    async with _connect(server_name, cfg) as streams:
        async with ClientSession(*streams) as session:  # type: ignore[misc]
            await session.initialize()
            result = await session.call_tool(tool_name, arguments)
            # Normalize result object to plain dict
            try:
                return result.model_dump()  # type: ignore[attr-defined]
            except Exception:
                return json.loads(json.dumps(result, default=lambda o: getattr(o, "model_dump", lambda: str(o))()))


def _sync(coro):
    return asyncio.get_event_loop().run_until_complete(coro)


# Expose agent tools
try:
    from agents import function_tool  # type: ignore
except Exception:  # pragma: no cover
    def function_tool(fn=None, **_kwargs):  # type: ignore
        def deco(f):
            return f
        return deco if fn is None else deco(fn)


@function_tool(name_override="mcp_invoke", description_override="Invoke an MCP tool on a configured server. Args: server, tool, args_json")
async def mcp_invoke_tool(server: str, tool: str, args_json: str) -> str:
    args: Dict[str, Any] = {}
    try:
        args = json.loads(args_json) if args_json else {}
    except Exception:
        args = {}
    out = await call_tool(server, tool, args)
    return json.dumps(out)


@function_tool(name_override="mcp_web_fetch", description_override="Fetch a URL via MCP web-fetch server. Args: url")
async def mcp_web_fetch(url: str) -> str:
    server = "web-fetch"
    args = {"url": url}
    out = await call_tool(server, "web_fetch", args)
    return json.dumps(out)


