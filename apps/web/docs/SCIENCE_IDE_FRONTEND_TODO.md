# Science IDE – Frontend To‑Do (Astra‑Soft · @design.mdc)

Use this as the single source of truth for polishing the IDE into a production‑quality, modern, VS Code–class experience. Scope: frontend only. Backend/data hooks can be stubbed with existing API routes.

## Vision & Differentiators (from landscape/personas)
- [ ] Evidence‑first UI: every result, claim, and artifact is citation‑linked and inspectable.
- [ ] Reproducible‑by‑default surfaces: clear environment/status badges; “Export Research Bundle” everywhere.
- [ ] Agentic workflow designed for science (Scout/Scholar/Analyst/Alchemist/Biologist/Critic/Editor) with provenance.
- [ ] Provenance graph & audit: explainable agent/tool traces; cost/time badges.
- [ ] Familiar IDE affordances (files, tabs, terminal) with soft, modern @design.mdc visuals.

## Global Shell & Layout
- [ ] Three‑pane layout (Files · Editor · Right rail) with draggable resizers; persist widths per repo.
- [ ] Right rail tabs: Agents | Evidence (remember last tab per repo); keyboard toggle (Ctrl/Cmd+]).
- [ ] Pane resize handles with subtle glow; double‑click to reset to golden‑ratio widths.
- [ ] Floating Quick Actions (contextual to focused pane) with shortcut hints.
- [ ] Dark mode parity and high‑contrast theme.

## Files (Left Rail)
- [ ] Header toolbar: New file/folder, Refresh, Collapse‑all with tooltips + shortcuts (N, Shift+N, R, 0).
- [ ] Fuzzy filter; highlight matches in tree; clear button.
- [ ] Virtualized tree for large repos; smooth expand/collapse with spring motion.
- [ ] Context menu (kebab/right‑click): Open to side, Reveal in tree, Rename (F2), Duplicate, Delete, Download.
- [ ] Multi‑select with Shift/Cmd; bulk actions; drag & drop with drop markers.
- [ ] "Open Editors" section; dirty dot; close buttons; middle‑click to close.
- [ ] File type badges; pin favorites; recently opened quick‑jump.
- [ ] Full keyboard nav: ↑/↓ select, →/← expand/collapse, Enter open, Backspace delete (confirm).

## Editor (Center)
- [ ] Monaco theme aligned to @design.mdc (soft surfaces, clean gutter, subtle caret glow).
- [ ] Tabs for open files; scrollable with close/dirty indicators; Cmd/Ctrl+1..9 quick switch; tooltip full path.
- [ ] Breadcrumbs (repo › path) above editor; clickable for quick nav.
- [ ] Inline diagnostics: gutter markers, underline, hover tooltips; Problems panel drawer.
- [ ] Command palette (⌘K): go to file/symbol, run formatter, toggle wrap, fold all, etc.
- [ ] Markdown preview split view; image zoom/pan; code fences themed.
- [ ] Diff view (working vs saved) and inline review comments (UI stubs).
- [ ] Evidence chips embedded in text (claim/citation pills) → hover card with source + open in Evidence.
- [ ] Save feedback tokens: pulse_success on success; shake_fail on error.
- [ ] Empty state when no file selected with helpful shortcuts and recent files.

## Search (Left Rail Tab)
- [ ] Debounced fuzzy search; modes: Filenames | Content.
- [ ] Show path + two context lines; highlight matches; keyboard open (Enter) or open‑to‑side (Alt+Enter).
- [ ] Filters: type (code/docs/data), size, modified time; clear‑all.
- [ ] Virtualized results for large sets; loading shimmer.

## Branches (Left Rail Tab)
- [ ] Current branch card with actions: switch (UI), create, rename; ahead/behind counters.
- [ ] List with PR pill if tracking; quick “Create PR” CTA (stub).
- [ ] Sparkline of recent commits (visual polish only).

## Agents (Right Rail Tab) — Cursor‑like Chat for Science
- [ ] Header: presence dot, agent name, role chips (Auto, Scholar, Analyst, Critic), Shortcuts hint.
- [ ] Session switcher: list recent threads; rename, archive; search sessions.
- [ ] Message bubbles with streaming; code blocks styled; copy button; quote‑reply; “Insert into editor”.
- [ ] Tool‑call trace blocks (mini): tool name, duration, cost, link to expanded trace in Evidence.
- [ ] Suggestion chips and slash commands (`/summarize`, `/explain`, `/search`, `/bundle`).
- [ ] Composer: multiline, attachments chips (file/drop), Enter to send, Shift+Enter newline, loading state.
- [ ] Thinking indicator; error/retry affordance; jump‑to‑bottom button.

## Evidence (Right Rail Tab) — Evidence‑native Viewer
- [ ] Empty state with illustration + “Run Protocol” CTA.
- [ ] Jobs grouped; sticky job headers with status chips (success/running/fail) and time/cost.
- [ ] Artifact viewers:
  - [ ] CSV table (virtualized rows, copy/export, type‑aware formatting, mini sparklines on numeric cols).
  - [ ] JSON tree, text viewer, image zoom/pan, HTML preview, Markdown render.
- [ ] Actions: Pin, Copy path, Copy hash, Open new; link to source in repo.
- [ ] Evidence card header shows claim links and backlink to editor chip.

## Terminal (Bottom)
- [ ] Tabs: Terminal 1, Agent Logs, Python REPL; + to create; close with middle‑click.
- [ ] Resizable height; persist height; Ctrl+L to clear; autocomplete; history navigation.
- [ ] ANSI colors; copy on select; click to copy paths/commit hashes.

## Provenance Graph (Future in right rail/drawer)
- [ ] Mini graph of evidence ↔ claims ↔ protocols ↔ artifacts; focus+zoom; click to open node.
- [ ] Filter by agent/task; time slider; layout animate on selection.

## Motion & Visual Polish
- [ ] Shared layout spring for active tab/file indicators.
- [ ] Use `spark_glow`, `pulse_success`, `shake_fail` tokens consistently.
- [ ] No scale expansion on core panes; use elevation/hover depth only.

## Accessibility
- [ ] Keyboard reachability for all controls; visible focus rings; ARIA roles (tree, tabs, dialog, menu).
- [ ] Respect reduced motion; color contrast WCAG AA; screen‑reader labels.

## State & Persistence
- [ ] Persist: active repo, open editors, right‑rail tab, panel sizes, theme, recent sessions.
- [ ] Resume snackbar: “Pick up where you left off”.

## Performance & Quality
- [ ] Virtualize long lists (files, search, tables); memoize heavy views.
- [ ] Lazy‑load viewers (CSV/JSON/image) and Monaco languages; code‑split right rail.
- [ ] Storybook for FileExplorer, AgentChat, ArtifactsPanel, RepoEditor; visual regression tests.
- [ ] Lint rules for tokens/contrast; type‑check clean.

## Docs & DX
- [ ] IDE shortcuts reference; onboarding tour; mini help drawer.
- [ ] Theming tokens documented (colors, elevation, radii, motion); component prop docs.

## Acceptance Criteria
- [ ] No global scroll; panes resizable; state persists.
- [ ] Keyboard navigation across Files, Search, Editor, Right rail, Terminal.
- [ ] Agents/Evidence tab switches are instant; zero layout jank.
- [ ] Light/Dark parity; consistent tokens & motion.
- [ ] Type‑check and ESLint clean.

---
### Suggested Implementation Order
1) Files & Editor polish → 2) Right rail tabs & AgentChat upgrades → 3) Evidence viewers → 4) Terminal polish → 5) Search/Branches → 6) Motion/Polish → 7) Accessibility → 8) Tests/Docs.
