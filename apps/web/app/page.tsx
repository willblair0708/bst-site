"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { trackEvent, trackPageView } from "@/lib/analytics";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    trackPageView("landing_page");
  }, []);

  return (
    <div className="relative bg-background text-foreground antialiased overflow-hidden">
      {/* Hero */}
      <header className="relative">
        <div className="relative mx-4 mt-4 rounded-3xl border border-black/5 bg-primary-100/40 shadow-elevation-2 lg:mx-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-display font-display tracking-tight text-foreground">
                Organize proof. Accelerate tools. Orchestrate agents.
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Estelion makes science versioned, reproducible, and AI-driven—from first sketch to published result.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/explore" passHref>
                  <Button
                    size="lg"
                    className="group soft-ui bg-primary-500 hover:bg-primary-500/90 text-primary-foreground active:translate-y-px"
                    onClick={() => trackEvent("cta_start_building_clicked")}
                  >
                    Try the live demo
                    <ArrowRight className={`w-4 h-4 ml-2 ${!prefersReducedMotion && "group-hover:translate-x-1"} transition-transform`} />
                  </Button>
                </Link>
                <Link href="/dashboard" passHref>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group soft-ui bg-background/50 hover:bg-muted"
                    onClick={() => trackEvent("cta_start_building_clicked")}
                  >
                    Join early access
                  </Button>
                </Link>
              </div>
              <div className="mt-8 grid gap-2 text-sm text-muted-foreground">
                <div>Organize: Version control for data, protocols, analyses, and claims.</div>
                <div>Accelerate: One-line access to science models and toolboxes.</div>
                <div>Orchestrate: Coordinate agent teams to plan, run, and review experiments.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main>
        {/* Pillar strip */}
        <section className="py-10 sm:py-12 border-b border-border" role="region" aria-label="Pillars overview">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-5">
                <div className="text-sm font-semibold">Organize</div>
                <p className="mt-2 text-sm text-muted-foreground">A shared schema + best practices for how modern science is structured and collaborated on.</p>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <div className="text-sm font-semibold">Accelerate</div>
                <p className="mt-2 text-sm text-muted-foreground">A unified stack of models and tools that removes setup friction and lowers the barrier to entry.</p>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <div className="text-sm font-semibold">Orchestrate</div>
                <p className="mt-2 text-sm text-muted-foreground">Agent ensembles that draft, run, and critique work under your direction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pillar 1 — Organize */}
        <section className="py-20 sm:py-24" role="region" aria-labelledby="organize-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="organize-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
                Make science a first-class, versioned object.
              </h2>
              <ul className="mt-6 space-y-3 text-left mx-auto max-w-2xl">
                <li className="text-muted-foreground">Unified schema: datasets / protocols / analyses / claims / results (typed metadata).</li>
                <li className="text-muted-foreground">Provenance & lineage for every figure, table, and claim.</li>
                <li className="text-muted-foreground">Reproducible-by-default bundles (env lockfile, data pointers, prompts, tool versions).</li>
                <li className="text-muted-foreground">Human-in-the-loop diffs and approvals; immutable audit trail.</li>
              </ul>
              <div className="mt-8">
                <Link href="/docs" className="inline-flex items-center text-sm font-medium text-primary hover:underline" onClick={() => trackEvent("cta_start_building_clicked")}>
                  See the schema
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pillar 2 — Accelerate */}
        <section className="bg-muted/40 py-20 sm:py-24" role="region" aria-labelledby="accelerate-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="accelerate-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
                Turn scattered tools into one simple stack.
              </h2>
              <ul className="mt-6 space-y-3 text-left mx-auto max-w-2xl">
                <li className="text-muted-foreground">Foundation models & simulators (structure, chem, omics, stats) behind clean APIs.</li>
                <li className="text-muted-foreground">Tool servers (RDKit, OpenMM, BLAST, scanpy, vector search, PDF parse).</li>
                <li className="text-muted-foreground">One-line runs with visible cost/latency; sample notebooks that execute instantly.</li>
                <li className="text-muted-foreground">Versioned cards with evaluations and usage examples.</li>
              </ul>
              <div className="mt-8">
                <Link href="/models" className="inline-flex items-center text-sm font-medium text-primary hover:underline" onClick={() => trackEvent("cta_start_building_clicked")}>
                  Browse the stack
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pillar 3 — Orchestrate */}
        <section className="py-20 sm:py-24" role="region" aria-labelledby="orchestrate-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="orchestrate-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
                Coordinate a team of research agents—at your command.
              </h2>
              <ul className="mt-6 space-y-3 text-left mx-auto max-w-2xl">
                <li className="text-muted-foreground">A Director plans tasks and routes to the right specialist agent.</li>
                <li className="text-muted-foreground">Scout · Scholar · Analyst · Simulator · Critic · Editor.</li>
                <li className="text-muted-foreground">Plan → Diff → Apply: agents propose changes, you review diffs with citations, merges are reproducible.</li>
                <li className="text-muted-foreground">Background jobs for long literature runs, simulations, and figure generation—with guardrails.</li>
              </ul>
              <div className="mt-8">
                <Link href="/mission" className="inline-flex items-center text-sm font-medium text-primary hover:underline" onClick={() => trackEvent("cta_start_building_clicked")}>
                  Meet the agents
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works (one screen) */}
        <section className="bg-muted/40 py-20 sm:py-24" role="region" aria-labelledby="how-it-works-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="how-it-works-heading" className="font-display text-3xl tracking-tight sm:text-4xl">How it works</h2>
              <ol className="mt-8 space-y-4 text-left mx-auto max-w-2xl list-decimal list-inside text-muted-foreground">
                <li>Import & organize your project into the shared schema.</li>
                <li>Run tools & models with one command; outputs become reproducible bundles.</li>
                <li>Orchestrate agents to draft protocols, run analyses, and open reviewable PRs.</li>
              </ol>
              <div className="mt-8">
                <Link href="/explore" passHref>
                  <Button size="lg" className="group soft-ui bg-primary-500 hover:bg-primary-500/90 text-primary-foreground" onClick={() => trackEvent("cta_start_building_clicked")}>
                    Watch the 90-second walkthrough
                    <ArrowRight className={`w-4 h-4 ml-2 ${!prefersReducedMotion && "group-hover:translate-x-1"} transition-transform`} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Proof points band */}
        <section className="py-16 sm:py-20" role="region" aria-labelledby="proof-points-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
            <h3 id="proof-points-heading" className="font-display text-2xl sm:text-3xl tracking-tight">Time-to-reproduce ↓, Repro success ↑, Cost per run ↓</h3>
            <p className="mt-4 text-sm text-muted-foreground">“Click Reproduce on any example to verify the result on your machine or in the browser.”</p>
            <div className="mt-6">
              <Link href="/explore" passHref>
                <Button size="lg" variant="outline" className="group">
                  Reproduce this result
                  <ArrowRight className={`w-4 h-4 ml-2 ${!prefersReducedMotion && "group-hover:translate-x-1"} transition-transform`} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust & Safety band */}
        <section className="bg-muted/40 py-14 sm:py-16 border-t border-border" role="region" aria-label="Trust and Safety">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
            <div className="text-sm font-medium">Evidence-first · Reproducible-by-default · Explainable · Safe</div>
            <div className="mt-3 text-sm text-muted-foreground">PII/PHI redaction · Dual-use gating · Versioned tool calls · Hash-chained audit logs</div>
          </div>
        </section>
      </main>

      {/* SHA-256 Verified Watermark */}
      <div className="fixed bottom-4 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-accent">SHA-256 Verified</span>
        </motion.div>
      </div>

      {/* Footer (unchanged) */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            {[
              { href: "/docs", label: "Documentation" },
              { href: "/explore", label: "Explore" },
              { href: "/models", label: "Models" },
              { href: "/mission", label: "Mission" },
            ].map((link) => (
              <motion.div
                key={link.href}
                className="pb-6"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={link.href} prefetch={false} className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors duration-200">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <p className="text-center text-xs leading-5 text-muted-foreground">&copy; {new Date().getFullYear()} Estelion.</p>
            <motion.span className="text-xs text-accent" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
              •
            </motion.span>
            <p className="text-center text-xs leading-5 text-muted-foreground">Turning every scientific claim into a runnable, forkable, verifiable artifact.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}