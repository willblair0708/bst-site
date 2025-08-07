# Runix Research Platform — Detailed Roadmap & Architecture

> **Goal:** Build the best open‑source AI scientist for advanced discovery with grounded citations, full provenance, reproducibility, and powerful multi‑agent orchestration via MCP + function tools. Ship value every 1–2 weeks while laying the rails for a thriving ecosystem.

---

## Executive Summary (≤200 words)

Runix will be an OSS, Python‑first research OS that blends agentic literature analysis, computation, and publishing. The v1 stack couples an **OpenAI Agents SDK** orchestrator (DIRECTOR) with **MCP servers** for literature, code‑exec, chemistry/biology, and graph retrieval. Evidence is first‑class: every answer carries sources, confidence, and limits. Reproducibility is default: notebooks, data, and environments are captured into a signed **Research Bundle** you can rerun anywhere.

In 3–4 months we target: topic‑to‑**referenced review** with a browsable evidence graph; **deterministic notebooks** for analyses; a **bundle exporter**; guardrails + evals that steadily reduce hallucination and boost citation precision. By 12–18 months: multi‑domain agents (bio/chem/physics/CS), collaborative projects with review/approvals, DOI publishing, and a thriving MCP ecosystem.

North‑star metrics: citation precision/recall, faithfulness, time‑to‑first‑insight, % outputs with executable bundles, community adoption (stars, contributors, MCP servers).

---

## Vision & Design Principles

* **Evidence‑first** (grounded, confidence, limits)
* **Reproducible‑by‑default** (env lock + bundles)
* **Explainable workflows** (inspect every tool call)
* **Modular & open** (models & tools are pluggable)
* **Open protocols** (MCP, OpenAPI, standard schemas)
* **Privacy & safety** (least privilege; guardrails)
* **Human‑in‑the‑loop** (suggestions, critiques, approvals)

---

## North‑Star Outcomes (12–18 months)

* Publishable reviews/analyses with **verifiable citations** and reproducible bundles
* **Multi‑domain** support with domain packs + evaluators
* A vibrant **MCP ecosystem** (servers, tools, templates)

**KPIs:** citation precision/recall ≥ 0.9/0.8 (review tasks), faithfulness ↑, TTFI ↓ 50–70 %, ≥ 20 community MCP servers.

---

## System Architecture (v1)

```
Client (Next.js) ── SSE/WS ──► API (FastAPI)
                             │
                             ├─► DIRECTOR (OpenAI Agents SDK)
                             │     ├─► Function tools (JSON‑schema)
                             │     └─► MCP Manager (stdio/HTTP)
                             │             ├─ Literature MCPs (search/parse/graph)
                             │             ├─ Code‑Exec MCP (py/julia/R)
                             │             ├─ Chem/Bio MCPs (RDKit, BLAST, OpenMM)
                             │             └─ Vector/Graph MCPs (Qdrant/Neo4j)
                             │
                             ├─► Retrieval service (BM25 + vectors + rerank)
                             ├─► Evidence/Bundle service (provenance, signing)
                             └─► Guardrails & Evals (faithfulness, citations)

Persistence: Postgres (tasks, runs, evidence), S3/MinIO (artifacts), pgvector, Neo4j (citations/lineage)
Observability: Prometheus/Grafana, OpenTelemetry, JSON logs
```

**Evidence Object (core):** `{doc_id, doi/url, source_type, section, span_start, span_end, text_hash, figure_id?, table_id?, claim_id?}`

---

## Agent Cohort & Orchestration

**DIRECTOR** orchestrates specialists:

* **Scout** — short, cited QA; fast PaperQA‑style retrieval
* **Scholar** — deep review; iterative evidence growth + synthesis
* **Archivist** — prior‑art & precedent via citation graph
* **Analyst** — data analysis & plotting (notebook runner)
* **Alchemist** — chem planning (RDKit, enumerators, docking hooks)
* **Biologist** — bio/omics tools (BLAST, scanpy, qc)
* **Critic/Verifier** — cross‑checks claims; contradiction flags; calibration
* **Editor** — polish, de‑dup citations; assemble bundles

**Patterns:** Plan‑Execute, Self‑Consistency, Debate, Multi‑hop citation traversal, Robin‑style multi‑agent DAGs.

**Routing:** small model for retrieval/ranking, large for synthesis, critic on demand; cost and latency budgets per run.

---

## Ideal MCP Server Set (v1–v2)

**Literature & Knowledge**

* `crossref` (DOI metadata)
* `arxiv` / `pubmed` / `pmc` / `semantic-scholar`
* `openalex` / `orcid`
* `pdf-parse` (GROBID/ScienceParse, tables/figures)
* `qdrant` (vector search)
* `neo4j` (citation/claim graph)

**Analysis & Compute**

* `code-exec` (py/julia/R, sandboxed)
* `notebook-runner` (nbclient/papermill)
* `plot-export` (PNG/SVG/HTML)

**Chem/Bio**

* `rdkit` (props, substructure, enumeration)
* `docking` (local/remote)
* `openmm` / `openff`
* `blast` / `biopython`
* `scanpy` (single‑cell)

**Utilities**

* `dataframes` (CSV/Parquet ingestion)
* `s3-blob` (artifact I/O)
* `signing` (bundle signing, hash chain)

> Start with 6–8 core MCPs (crossref, arxiv, pdf‑parse, qdrant, code‑exec, notebook‑runner, s3‑blob); grow to 20+.

---

## Retrieval & Evidence Graph

* **Ingest:** DOI/URL/PDF → parse sections, references, figures/tables → normalize
* **Index:** BM25 (OpenSearch) + embeddings (pgvector/Qdrant)
* **Graph:** build citation/author/source graph; optional entity linking
* **Agentic retrieval:** query expansion → hybrid search → LLM rerank → evidence extraction → citation traversal hops (1–2)
* **Synthesis:** inline cites, confidence; contradiction notes from Critic

---

## Research Bundles & Reproducibility

**Bundle contents:** prompts, agent graph, tool calls, evidence set, datasets, notebooks, outputs, environment lockfile, signatures.

* **Env lock:** `uv/poetry` for Python; package hashes
* **Rerun:** `runix bundle reexec` reproduces outputs deterministically
* **Registry:** artifact checksums and lineage; diff view for results & evidence changes

---

## Guardrails & Evals

**Guardrails:** citation‑required modes, claim limiter, domain filters (biosafety), PII/PHI redaction, dual‑use denylists.

**Eval tracks (CI + nightly):**

* Citation precision/recall; source coverage
* Faithfulness scores (model‑graded + human QA)
* Latency/cost budgets; reliability (successful streams %)
* Domain‑specific checks (chem/bio safety)

**Acceptance bars (v1):** ≥ 0.85 citation precision; ≤ 2 % broken links; ≤ 1 % privacy violations on seeded PHI set.

---

## Product Phases → Sprints & Exit Criteria

### Phase 0.5 — Hardening & UX (2–3 weeks)

**Streams UX:** orchestration timeline, collapsible tool calls, token streaming, handoffs, retry.
**Stability:** structured logs for every tool call (input hash, latency, token cost); health dashboards + alerts.
**CLI/DevEx:** one‑command bootstrap; smoke tests; golden SSE snapshots.
**Testing:** unit + contract tests for Agents SDK versions; pinned integration matrix.
**Exit:** ≥ 99 % successful streams on sample prompts; MCP listing stable; p95 end‑to‑end latency targets met.

### Phase 1 — Core Research Stack (4–6 weeks)

**Literature:** arXiv/PubMed/Crossref/Unpaywall ingestors; PDF parsing with figures/tables; reference graph.
**Retrieval:** hybrid (BM25+vec) + rerank; dedupe; citation clustering.
**Agents:** Scout/Scholar/Archivist + Critic; tool schemas; PaperQA‑style retrieval.
**UI:** Evidence drawer with inline cite navigation; diff views across drafts.
**Exit:** Topic → **referenced review** + browsable evidence graph; ≥ 0.85 cite precision on 10 seeded topics.

### Phase 2 — Computation & Reproducibility (6–8 weeks)

**Execution sandbox:** code‑exec + notebook‑runner MCPs; package pinning; artifacts → S3.
**Domain tools:** RDKit/OpenMM/BLAST/scanpy MCPs; scikit‑learn/polars.
**Reproducibility:** Research Bundle exporter; deterministic reruns; artifact registry with checksums.
**Exit:** User prompt → runnable notebook + datasets; bundle re‑exec reproduces results bit‑for‑bit.

### Phase 3 — Reasoning, Guardrails & Evaluation (6–8 weeks)

**Reasoning:** plan‑execute/debate/self‑consistency toggles; routing policies; Critic pass by default on high‑stakes.
**Guardrails:** hallucination limiter; biosafety checks; PII/PHI filters; audit chain.
**Evaluation:** CI harness; regression thresholds; human eval loop with disagreement analysis.
**Exit:** measurable ↓ in hallucination; ↑ in citation precision; dashboards wired into CI.

### Phase 4 — Collaboration, Publishing & Ecosystem (8–10 weeks)

**Collab:** real‑time co‑edit; comments; suggestion mode; review requests; roles/permissions.
**Publishing:** arXiv/JATS/LaTeX/Markdown export; DOI minting; “living review” PR‑style updates.
**Ecosystem:** MCP directory; tool templates; signing & security model.
**Exit:** teams co‑author; publish versioned artifacts with DOIs; 10+ community MCP servers listed.

---

## Backend Interfaces (v1)

* `POST /v1/tasks` → create task (agent, query, runtime)
* `GET /v1/tasks/{id}` → status, formatted\_answer, citations, evidence, trace
* `POST /v1/tasks/{id}/continue` → continue with same state & evidence
* `POST /v1/workflows` → run multi‑agent DAGs
* `POST /v1/documents:ingest` → DOI/URL/PDF intake; parse status
* `GET /v1/evidence?task_id=` → retrieve passages/DOIs used
* `WS /v1/streams/tasks/{id}` → live step updates

---

## Data & Knowledge Management

* Ingestion policies (rate, licensing); source attribution; cache invalidation
* Document store (parsed sections, citations, entities); embedding pipeline
* Knowledge graph linking **claims ↔ evidence ↔ experiments** (W3C‑PROV‑like)
* Dataset/Model cards; lineage; signed provenance (hash chain)

---

## Security & Compliance

* Secrets management; least‑privilege tokens
* PII/PHI detection & redaction; opt‑in retention; audit trails
* Sandboxed execution; quotas; abuse/rate limiting; SOC2‑ready logs
* 21 CFR Part 11‑aligned signatures/audit; export controls for dual‑use tools

---

## Open‑Source Program (Runix‑OSS)

* **License:** Apache‑2.0 (libs) + MIT (templates)
* **Governance:** Maintainers, CODEOWNERS, RFCs, ADRs, issue templates
* **Contribution:** MCP server templates, examples, starter kits, nightly e2e tests
* **Community:** monthly office hours; roadmap calls; Discord/Matrix; public backlog

**Starter repos:** `runix-core`, `runix-agents`, `runix-mcp-*`, `runix-ui`, `runix-evals`.

---

## Milestone Timeline (Quarter‑snap)

* **Q3 2025:** Phase 0.5 complete; Phase 1 kickoff (ingestion + evidence graph v1)
* **Q4 2025:** Phase 1 done; Phase 2 mid (bundles + code‑exec)
* **Q1 2026:** Phase 2 done; Phase 3 in flight (guardrails + evals)
* **Q2 2026:** Phase 4 (collab + publishing + ecosystem); 10–20 community MCPs

---

## Risk Register (abridged)

* **Source reliability** → whitelist venues; link‑check; archive snapshots
* **Dual‑use/abuse** → domain gating; human‑in‑loop
* **Model drift** → nightly evals; routing updates
* **Licensing** → metadata capture; policy checks per source

---

## Resourcing (lean plan)

* 1 Lead Eng (backend/orchestrator), 1 Infra/DevOps, 1 Full‑stack, 1 Agent/RAG Eng, 1 Eval/Guardrails Eng, 0.5 PM/Writer

---

## “Day‑0 to Week‑2” Checklist

* Repo skeletons + CI (lint/type/tests); docker‑compose (pg, minio, qdrant, neo4j)
* DIRECTOR + mock agents streaming via SSE
* MCP manager + `pdf-parse`, `crossref`, `qdrant`
* Evidence object + storage schema; evidence drawer stub in UI

---

## Next 10 Actions (concrete)

1. Land **MCP set A** (crossref, arxiv, pdf‑parse, qdrant, code‑exec)
2. Implement **hybrid retrieval + rerank**; citation traversal (1‑hop)
3. Ship **Scout/Scholar/Archivist** + **Critic**
4. Add **bundle exporter** & **re‑exec** CLI
5. Wire **eval harness** (10 seeded topics) into CI; publish dashboard
6. Author **contrib guide** + MCP templates; open a Discord
7. Add **guardrails** (citation‑required mode; PII filter)
8. Publish **v0.1 roadmap** & demo video
9. Write **model/tool cards** for transparency
10. Start **community MCP bounty** round

---

## Appendix — Agent Specs (abridged)

* **Scout**: tools = {paper\_search, gather\_evidence, citation\_traversal}; budget: low; output: cite‑dense snippets
* **Scholar**: tools = Scout + `evidence_expand`, `synthesize_review`; budget: med/high; output: sections + tables + limits
* **Critic**: tools = {contradiction\_scan, claim\_checker}; budget: low; output: flags + suggestions
* **Analyst**: tools = {code‑exec, dataset\_load, plot\_export}; output: notebook + figures
* **Alchemist/Biologist**: tools = {rdkit/docking/openmm, blast/scanpy}; output: designs/analyses + safety notes

---

*This canvas is the working product spec + build plan. Comment where you want deeper drill‑downs or add‑ons (e.g., physics/CS packs, marketplace UX).*
