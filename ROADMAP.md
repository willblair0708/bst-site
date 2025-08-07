## Runix Research Platform — Product Roadmap (Open Source)

### Vision
Build the best open-source AI research assistant for advanced scientific discovery — exceeding commercial offerings — by combining rigor (grounded citations, provenance, reproducibility), powerful multi-agent orchestration, and a rich ecosystem of tools via MCP and function tools. The system should help researchers form hypotheses, gather and critique evidence, run analyses/simulations, generate artifacts, and publish traceable outputs.

### Design Principles
- Evidence-first: every claim is backed by sources, with confidence and limits.
- Reproducible-by-default: notebooks, code, data, and environment captured and re-runnable.
- Explainable workflows: every tool call, prompt, and decision is inspectable.
- Modularity: agents, tools, and models are pluggable (OpenAI, local, OSS models).
- Open protocols: MCP for tools, OpenAPI/HTTP for services; standard schemas.
- Privacy & safety: least-privilege, data governance, red-teaming, guardrails.
- Human-in-the-loop: suggestions, critiques, approvals; collaborative editing.

### North Star Outcomes (12–18 months)
- Researchers routinely use Runix to produce publishable-quality reviews/analyses with verifiable citations, reproducible notebooks, and versioned knowledge graphs.
- Multi-domain support (bio/chem/physics/CS) with specialized toolchains and evaluators.
- A vibrant OSS ecosystem of MCP servers and function tools maintained by the community.

---

## Phased Plan

### Phase 0.5 — Hardening & UX of Current MVP (2–3 weeks)
- Multi-agent streaming UX:
  - UI “Orchestration Timeline” (done) with filters and collapsible tool-call details (request/response, duration).
  - Token streaming with partial render; show agent handoffs; error toast with retry path.
- Stability & Observability:
  - Structured JSON logs for every tool call (input hash, latency, token cost).
  - Health dashboards (Grafana) and alerting for tool failures and model rate limits.
- CLI & DevEx:
  - One-command bootstrap (shell + Makefile + uv) and smoke tests.
  - Golden path scripts for local MCP (e.g., `web-fetch`) and fake mode.
- Testing:
  - Unit tests for routes, tools, MCP manager; golden SSE snapshots.
  - Contract tests for Agents SDK versions; pinned integration matrix.

Acceptance: 99% successful DIRECTOR streams on sample prompts; UI shows tool calls/results; MCP listing returns tools consistently.

### Phase 1 — Core Research Stack (4–6 weeks)
- Literature stack:
  - Ingestors: arXiv, PubMed/PMC, Crossref, Semantic Scholar, Unpaywall (hybrid: HTTP + MCP servers).
  - PDF parsing: GROBID/Science Parse; figure/table extraction; reference graph.
  - Retrieval: hybrid BM25 + embeddings; reranking; deduplication; citation clustering.
- Provenance & Knowledge Graph:
  - Evidence objects (doc, span, figure) with DOIs, sections, and claims linked.
  - Versioned knowledge store (e.g., Postgres + pgvector + Neo4j) and lineage.
- Agents:
  - Scholar (deep review), Scout (QA), Archivist (prior art) with proper tool schemas.
  - Critic/Verifier agent to cross-check claims and flag contradictions.
- UI:
  - Evidence drawer with inline cite navigation; diff views across drafts.

Acceptance: Given a topic, system produces a referenced review with linked primary sources and a browsable evidence graph.

### Phase 2 — Computation & Reproducibility (6–8 weeks)
- Execution sandbox:
  - Notebook/Mini-runner MCP (Python/Julia/R) with package pinning, artifacts to S3.
  - Policy sandboxing (seccomp, firejail, or containerized runners).
- Domain tools:
  - Chem/Bio: RDKit, OpenFF, OpenMM, BioSimulators; docking (local/remote); simple ADMET.
  - Data analysis: pandas/polars, statsmodels, scikit-learn, Xarray for timeseries.
- Reproducibility:
  - Research “bundle” exporter: prompt+tools+artifacts+citations+env lockfile.
  - Deterministic reruns; artifact registry with checksums.

Acceptance: Users can request an analysis that creates a runnable notebook and datasets; bundle re-exec reproduces results.

### Phase 3 — Reasoning, Guardrails, and Evaluation (6–8 weeks)
- Reasoning strategies:
  - Plan-Execute, Debate, Self-Consistency; CoT traces toggleable.
  - Routing policies (e.g., small model for retrieval; large for synthesis; critic on demand).
- Guardrails & Safety:
  - Output guardrails per domain (hallucination, over-claiming, biosafety checks).
  - Sensitive data filters (PII/PHI) and red-team prompts; audit trails.
- Evaluation:
  - Benchmarks: citation accuracy, answer grounding, faithfulness, latency, cost.
  - CI eval suite with regression thresholds; human eval loop with disagreement analysis.

Acceptance: Measurable reduction in hallucination rates and improved citation precision; performance dashboards in CI.

### Phase 4 — Collaboration, Publishing, and Ecosystem (8–10 weeks)
- Collaboration:
  - Real-time multi-user sessions; comments; suggestion mode; review requests.
  - Roles/permissions; project spaces; organization-level settings.
- Publishing:
  - Export to arXiv/JATS/LaTeX/Markdown; Zenodo/DOI minting for bundles.
  - “Living review” mode with PR-like updates and changelogs.
- Ecosystem:
  - MCP marketplace directory; template repo for MCP servers/tools.
  - Plugin guidelines, security model, and signing.

Acceptance: Teams co-author reviews/analyses, publish versioned artifacts with DOIs, and extend via community MCP servers.

---

## Architecture Blueprint

### Backend
- FastAPI + Uvicorn; REST and SSE interfaces.
- Agents via OpenAI Agents SDK:
  - Multi-agent: DIRECTOR orchestrates Scout/Scholar/Archivist/Alchemist/Analyst.
  - Tools: function tools (JSON-schema) + MCP servers (stdio/streamable HTTP).
  - Tracing, handoffs, guardrails; model routing; session contexts.
- Persistence: Postgres (tasks, messages, artifacts), pgvector; optional Neo4j for knowledge graph; S3-compatible object storage.
- Services: RAG, PDF parse, embedding, rerank; chem/bio microservices; action specs via OpenAPI/GPT Actions.
- Observability: structured JSON logs, Prometheus/Grafana, OpenTelemetry traces.

### Frontend (Next.js)
- Chat app with:
  - Streaming SSE + orchestration timeline (tool_call/tool_result, durations).
  - Evidence drawer (source cards, highlights, figures/tables), compare drafts.
  - Project workspace: artifacts, notebooks, datasets, citations manager.
  - Admin/Settings for model providers, rate limits, API keys.

### MCP & Tools
- MCP manager loads servers from env/config (e.g., `mcp-science web-fetch`, Databricks MCP).
- Function tools for local code (PDF parsing, citation extraction, formatters) with strict schemas.
- External actions: OpenAPI-based RAG/corpora; auth via service tokens.

---

## Data & Knowledge Management
- Ingestion policies (rate, licensing); source attribution; cache invalidation.
- Document store (parsed sections, citations, entities); embedding pipelines.
- Knowledge graph linking claims↔evidence↔experiments; provenance with W3C PROV-like schema.
- Dataset/Model cards; lineage from input to published artifacts.

## Security & Compliance
- Secrets management (dotenv in dev; Vault in prod). Least-privilege tokens.
- PII/PHI detection and redaction; opt-in data retention; audit trails.
- Sandboxed execution; resource quotas; abuse/rate limiting; SOC2-ready logging.

## Testing & CI/CD
- Unit/integration tests (backend, UI, tools, MCP). SSE golden tests.
- Eval harness for faithfulness and citation accuracy; nightly regression dashboards.
- Docker images; docker-compose for local; Helm charts/Kubernetes for prod.
- CI (GitHub Actions): lint, type-check, tests, security scans, e2e smoke.

## Open Source Program
- License: Apache-2.0 or MIT + third-party NOTICE.
- Governance: Maintainers, RFC process, CODEOWNERS, ADRs, issue templates.
- Contribution guide: templates for MCP servers/tools, examples, starter kits.
- Community: monthly roadmap calls, public backlog, Discord/Matrix.

---

## Milestone Backlog (Selected)
- Literature ingestion (arXiv, PubMed, Crossref, S2, Unpaywall) with retries and dedupe.
- GROBID+tables+figures to evidence graph; DOI resolver and backref linking.
- MCP servers: web-fetch, PDF-to-text, vector search, code-exec.
- Domain packs: Bio/Chem/Clin/Physics with curated toolchains and guardrails.
- Reproducible bundle exporter and DOI minting integration.
- Evaluators: citation correctness, source coverage, reasoning self-critique.
- UI: inline citations, evidence compare, tool inspector, timeline filters.

## Success Metrics (examples)
- Citation precision/recall vs. human baseline.
- Faithfulness score (automated + human eval) > target.
- Time-to-first-insight reduced vs. baseline workflow.
- Community adoption: stars, contributors, MCP server count.

---

## References & Prior Art
- OpenAI Agents SDK (MCP, agents, guardrails): `https://openai.github.io/openai-agents-python/ref/mcp/server/`
- MCP servers (scientific tooling): [pathintegral-institute/mcp.science](https://github.com/pathintegral-institute/mcp.science)

---

## Next Actions (immediate)
- Finalize Phase 0.5 acceptance tests and docs.
- Implement ingestion → evidence graph v1 (arXiv + Crossref) and UI evidence drawer.
- Add MCP code-exec server and notebook artifact export.
- Stand up CI eval harness for citation accuracy on 10 seeded topics.


