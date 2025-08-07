import json
import os
from typing import Any, Dict, List

try:
    from agents.mcp import MCPServerStdioParams, MCPServerStdio, MCPServerStreamableHttp, MCPServerStreamableHttpParams  # type: ignore
except Exception:  # pragma: no cover
    MCPServerStdioParams = None  # type: ignore
    MCPServerStdio = None  # type: ignore
    MCPServerStreamableHttp = None  # type: ignore
    MCPServerStreamableHttpParams = None  # type: ignore


def _load_config() -> Dict[str, Any]:
    env = os.getenv("MCP_SERVERS", "{}")
    try:
        return json.loads(env) if env else {}
    except Exception:
        return {}


def build_mcp_servers() -> List[Any]:
    cfg = _load_config().get("mcpServers") or _load_config()
    servers: List[Any] = []
    if not cfg:
        return servers
    for name, spec in cfg.items():
        # Two styles supported:
        # 1) stdio: {"command": "uvx", "args": ["mcp-science","web-fetch"]}
        # 2) http/streamable: {"url": "https://...", "headers": {...}}
        if "url" in spec and MCPServerStreamableHttp and MCPServerStreamableHttpParams:
            params = MCPServerStreamableHttpParams(
                url=spec["url"],
                headers=spec.get("headers", {}),
                timeout=float(spec.get("timeout", 30.0)),
            )
            servers.append(MCPServerStreamableHttp(params, name=name))
        elif "command" in spec and MCPServerStdio and MCPServerStdioParams:
            params = MCPServerStdioParams(
                command=spec["command"],
                args=spec.get("args", []),
                env=spec.get("env", {}),
                cwd=spec.get("cwd"),
            )
            servers.append(MCPServerStdio(params, name=name))
    return servers


