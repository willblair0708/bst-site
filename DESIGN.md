# Bastion Design Constitution

*Revision v0.4 · August 2025*

---

> **The Story We’re Writing**
> In 1953 we cracked the double helix. In 2023 we approved a CRISPR cure.
> **Two** diseases down—**thousands** to go.
> **Estelion’s charge** is to bring the velocity of software to the cure curve.
> **Bastion** is our forge: a place where every protocol, dataset and digital‑twin model is hammered into something fork‑able, test‑able and provably safe.

This constitution translates that narrative into colour tokens, interaction scaffolds, and performance budgets so every pixel whispers the same mission.

---

## 0 · Purpose

Bastion is the **translation OS**—the GitHub × Hugging Face for trials, the launchpad on which the next 9 998 cures will debut.  This document is the *single source of design truth* for everyone shipping code, copy, or pixels.

## 1 · Inspirational DNA

| House Spirit           | Borrowed Principle                       | Bastion Manifestation                                              |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| **SpaceX**             | *Industrial minimalism + live telemetry* | Dark cockpit UI; CI streams as real‑time mission data.             |
| **OpenAI**             | *Clarity over flair; API‑first*          | One accent colour; every UI action maps to a documented endpoint.  |
| **Palantir / Foundry** | *Object lineage graph*                   | Breadcrumbs expose provenance—every badge drills down to raw JSON. |
| **Anduril**            | *Operator‑first situational awareness*   | Ops Dashboard shows site enrolment like a Lattice command centre.  |
| **GitHub**             | *Social coding rituals*                  | Branch → PR → merge → contribution graph, but for protocols.       |

---

## 2 · Narrative‑Driven Tenets

1. **Evidence is Plot.**  Numbers without provenance are plot holes. Every metric links to its raw source.
2. **Progress = Feedback.**  The UI celebrates each green CI run with micro‑confetti DNA helices—reminding teams they just shaved days off suffering.
3. **Equity is a First‑Class Character.**  Diversity badges share the status ribbon with power and twin‑AUC—because representation is as non‑negotiable as statistical validity.
4. **Speed Serves Hope.**  FCP < 1 s is not vanity; it is the heartbeat of an ICU patient waiting on trial data. Performance budgets are moral budgets.
5. **Auditability = Trust.**  Every commit is hashed, signed, and anchored weekly to QLDB. Regulators scroll in “motion‑safe mode” where timestamps lock and animations cease.

---

## 3 · Visual Language

### 3.1 Palette

| Token             | Hex     | Story Cue                   |
| ----------------- | ------- | --------------------------- |
| `bg-space`        | #0A0C10 | Night sky / launchpad steel |
| `bg-panel`        | #16181D | Instrument panel            |
| `text-primary`    | #E6E8EC | White‑paper clarity         |
| `accent-progress` | #19A7CE | Forward thrust (pass)       |
| `accent-risk`     | #FF6B6B | Mission abort (fail)        |
| `accent-warn`     | #FFB454 | Course‑correct (warn)       |
| `badge-gold`      | #F3C94C | Equity gold standard        |

### 3.2 Type

* **Inter V** – UI copy (13/15/18/22 px).
* **IBM Plex Mono** – Code, YAML, logs (developer trust).
* 1.5 × line‑height for narrative air.

### 3.3 Icon & Motion

* **Lucide + custom helix/syringe/shield**.
* Framer Motion 180 ms; disabled with `?audit=1`.

---

## 4 · Information Architecture

```
🏠 Home
 ├─ Discover      ↦ Search & facets  (Trial · Twin · Dataset)
 ├─ Workspace     ↦ My repos, PRs, CI streams
 ├─ Ops Dashboard ↦ Live enrolment map (Anduril‑style)
 ├─ Marketplace   ↦ Plug‑ins, widgets
 └─ Governance    ↦ Org roles, FDA portals
```

Breadcrumbs carry commit hash + signer fingerprint for citation.

---

## 5 · Hero Screens

### 5.1 Protocol Pull Request

```
[Power 0.83✓] [Diversity Gold🏅] [Twin‑AUC 0.79✓] [Part 11 Signed]
───────────────────────────────────────────────────────────
- dose: 150 mg      │ + dose: 200 mg
```

*Hover a badge → sparkline preview; click → Evidence Drawer with notebook & JSON.*

### 5.2 Digital‑Twin Explorer

* Drag variables onto axes → WebGL scatter updates live.
* Right rail shows SHAP cards; export Jupyter kit in one click.

### 5.3 Ops Dashboard

* Map grid of sites; real‑time counts; dropout alerts.
* Left timeline feeds like Falcon‑9 launch log.

### 5.4 Marketplace

* Cards show install count, update cadence, license.
* Installing creates auto‑PR (transparent infra‑as‑code).

---

## 6 · Interaction Patterns

| Pattern              | Story Outcome                                                    |
| -------------------- | ---------------------------------------------------------------- |
| **Peek‑n‑Pin**       | Quick look; pin for deep audit.                                  |
| **Inline Suggest**   | Democracy of ideas—clinician can suggest YAML patch.             |
| **Follow‑Me Review** | Remote IRB chair sees live cursor “FDA‑Jane”.                    |
| **Mission Timer**    | Top‑right ticker: life‑days accelerated by Bastion (global KPI). |

---

## 7 · Accessibility & Inclusivity

* WCAG AA+; dyslexia mode (Atkinson Hyperlegible).
* Screen‑reader diff narration (“Removed upper age limit from 65 → 75”).

---

## 8 · Performance & Engineering

| Metric         | Target       | Rationale                             |
| -------------- | ------------ | ------------------------------------- |
| FCP            | < 1 s        | Feels instantaneous; clinician trust. |
| LCP            | < 2 s        | Reduces abandon rate.                 |
| CI log latency | < 200 ms P95 | Real‑time telemetry.                  |
| Bundle         | ≤ 150 kB     | Mobile field users.                   |

Stack: Next.js 15 + RSC; edge caching; Sentry + Web Vitals to Supabase.

---

## 9 · Compliance Overlay

* **Rust Part 11 signer** → SHA‑256 + JWS → weekly QLDB anchor.
* **pg\_audit** + WAL to immutable S3.
* **Privacy kit** flags PHI and applies Safe Harbor masks.

---

## 10 · Dev‑Ex

* Turborepo mono‑repo: `web/`, `cli/`, `services/`, `infra/`.
* `bst` CLI spawns `.ctrepo`, runs local Argo‑lite.
* Storybook + Chromatic; Figma tokens → Tailwind via figma‑tokens.

---

## 11 · Looking Ahead

1. **Copilot‑for‑Clinicians** – GPT‑4o suggests eligibility patches.
2. **Spatial Trials** – 3‑D organ twins for radiotherapy.
3. **zk‑Data‑Dividend** – Proof‑of‑participation token payouts.
4. **VR Mission Control** – Global regulators review in shared VR.

---

### End of Design Constitution
