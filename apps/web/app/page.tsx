"use client";

import { GitBranch, CheckCircle2, Star, GitFork, Activity, Globe, Lock, ArrowRight, Database, ShieldCheck, FlaskConical, Users, Bot, Sparkles, Hash, Workflow, Brain, MessageSquare } from "lucide-react"
import Link from "next/link"
import { AnimatedHero } from "@/components/ui/animated-hero"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModelCard } from "@/components/ui/model-card"
import { ProofRunwayCard } from "@/components/ui/proof-runway-card"
import { useToast } from "@/components/ui/toast"
import { getLangColor } from "@/lib/icon-utils"
import { MicroTooltip } from "@/components/ui/micro-tooltip"
import { RepoCardSkeleton, ModelCardSkeleton } from "@/components/ui/skeleton-loader"
import { HashChip } from "@/components/ui/hash-chip"
import { VerifyButton } from "@/components/ui/verify-button"
import React, { Suspense, useState, useEffect } from "react"
import { trackEvent, trackPageView } from "@/lib/analytics"
import { MOTION, EASING } from "@/lib/motion/tokens"

// Three Pillars - Transparent Bento (Strict Color Separation)
const PILLARS = {
  VERSIONED_KNOWLEDGE: { 
    icon: Hash, 
    color: "primary-500", 
    bg: "primary-100",
    emoji: "🗂️",
    motion: "snap",
    description: "Every claim becomes a citable, forkable, machine-checkable artifact (DOI + hash)"
  },
  COMPOSABLE_MODELS: { 
    icon: FlaskConical, 
    color: "accent-500", 
    bg: "accent-100",
    emoji: "🛠️",
    motion: "spark-glow",
    description: "Pin workflows to containers and digests; compose datasets→models→analyses as graphs"
  },
  HUMAN_AI_COLLAB: { 
    icon: Users, 
    color: "collaboration-500", 
    bg: "collaboration-100",
    emoji: "🤝",
    motion: "pulse-success",
    description: "Explainable agent help, peer review, and compute receipts for each suggestion"
  },
};

const PILLAR_STYLES: Record<keyof typeof PILLARS, { bg: string; border: string; text: string }> = {
  VERSIONED_KNOWLEDGE: {
    bg: "bg-primary-500/10",
    border: "border-primary-500/20",
    text: "text-primary-500",
  },
  COMPOSABLE_MODELS: {
    bg: "bg-accent-500/10",
    border: "border-accent-500/20",
    text: "text-accent-500",
  },
  HUMAN_AI_COLLAB: {
    bg: "bg-collaboration-500/10",
    border: "border-collaboration-500/20",
    text: "text-collaboration-500",
  },
}

interface Repository {
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  isPrivate: boolean;
  updatedAt: string;
  hash: string;
  verified: boolean;
  reproducibility: number;
  pillar: keyof typeof PILLARS;
}

const featuredRepositories: Repository[] = [
  {
    name: "recurrence-risk-sim",
    owner: "estelion",
    description: "Platform-trial response-adaptive randomization simulator (RAR) with interim analyses",
    language: "Python",
    stars: 1234,
    forks: 89,
    isPrivate: false,
    updatedAt: "2 hours ago",
    hash: "7f3a9b2c",
    verified: true,
    reproducibility: 99.2,
    pillar: "VERSIONED_KNOWLEDGE",
  },
  {
    name: "eligibility-nlp",
    owner: "estelion",
    description: "Structured eligibility & outcomes extraction pipeline with evaluation set (no PHI)",
    language: "Python",
    stars: 892,
    forks: 156,
    isPrivate: false,
    updatedAt: "12 hours ago",
    hash: "e4d5c6b7",
    verified: true,
    reproducibility: 97.8,
    pillar: "VERSIONED_KNOWLEDGE",
  },
  {
    name: "compute-receipts",
    owner: "estelion",
    description: "Spec + CLI to generate and verify compute receipts and attestations",
    language: "TypeScript",
    stars: 445,
    forks: 67,
    isPrivate: false,
    updatedAt: "1 day ago",
    hash: "a8f9e0d1",
    verified: true,
    reproducibility: 96.5,
    pillar: "VERSIONED_KNOWLEDGE",
  },
];

const featuredModels = [
  {
    name: "ESM2 Embeddings",
    version: "v0.1.0",
    description: "Protein sequence embeddings via ESM2; pinned container and digest",
    provider: "facebookresearch",
    Icon: Bot,
    stars: 2341,
    forks: 178,
  },
  {
    name: "Trial Simulator",
    version: "v1.4.2",
    description: "Response-adaptive randomization simulator for platform trials",
    provider: "estelion",
    Icon: Bot,
    stars: 1567,
    forks: 234,
  },
  {
    name: "Consent-Checker",
    version: "v0.9.3",
    description: "License and consent policy checks for datasets and workflows",
    provider: "estelion",
    Icon: Bot,
    stars: 987,
    forks: 89,
  },
];

const proofRunwaySteps = [
  {
    pillar: "VERSIONED_KNOWLEDGE" as const,
    icon: GitFork,
    title: "Fork",
    description: "Create a versioned workspace (commit inputs + environment digest)",
    motion: "snap",
    emoji: "🗂️",
  },
  {
    pillar: "COMPOSABLE_MODELS" as const,
    icon: FlaskConical,
    title: "Reproduce", 
    description: "Execute a pinned workflow; capture a compute receipt",
    motion: "spark-glow",
    emoji: "🛠️",
  },
  {
    pillar: "HUMAN_AI_COLLAB" as const,
    icon: ShieldCheck,
    title: "Attest",
    description: "Sign the result and mint a DOI; open a review",
    motion: "pulse-success",
    emoji: "🤝",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const { addToast } = useToast()
  // removed unused isLoading
  const prefersReducedMotion = useReducedMotion()
  
  useEffect(() => {
    trackPageView('landing_page')
  }, [])



  return (
    <div className="relative bg-background text-foreground antialiased overflow-hidden">
      {/* Subtle decorative background accents (respect reduced motion) */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-40 -left-24 h-[38rem] w-[38rem] rounded-full bg-gradient-to-br from-primary-100/60 via-accent-100/40 to-transparent blur-3xl"
            animate={{ y: [0, 12, 0], opacity: [0.6, 0.7, 0.6] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-24 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-accent-100/50 via-primary-100/30 to-transparent blur-3xl"
            animate={{ y: [0, -10, 0], opacity: [0.5, 0.65, 0.5] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </>
      )}
      {/* Hero Section - Astra-Lite Story Layer */}
      <header className="relative">
        <div className="relative mx-4 mt-4 rounded-3xl border border-black/5 bg-primary-100/40 shadow-elevation-2 lg:mx-8">
          <AnimatedHero />
        </div>
      </header>

      <main>
        {/* Pillar strip (immediately under hero) */}
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
        {/* Proof Runway (Zero-State Flow) */}
        <section className="py-20 sm:py-24" role="region" aria-labelledby="proof-runway-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASING.smooth as any }}
          >
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block mb-4">
              <Badge variant="outline" className="border-accent-500/30 bg-accent-100 text-accent-500 rounded-full px-4 py-1.5">
                <Sparkles className="w-4 h-4 mr-2 text-accent-500" />
                <span className="font-semibold">Proof Runway</span>
              </Badge>
            </motion.div>
            <h2 id="proof-runway-heading" className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              From hypothesis to verified result in 3 steps.
            </h2>
          </motion.div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {proofRunwaySteps.map((step, index) => (
                  <motion.div 
                    key={step.title}
                    onMouseEnter={() => trackEvent('proof_runway_step_hovered', { step: step.title })}
                    variants={fadeInUp}
                    custom={index}
                  >
                    <ProofRunwayCard
                      step={step}
                      index={index}
                      totalSteps={proofRunwaySteps.length}
                    />
                  </motion.div>
                ))}
            </div>
          </div>
          
          {/* Component Showcase CTA - Design.mdc v0.4 */}
          <motion.div 
            className="mt-20 text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
          >
            <VerifyButton 
              onVerify={() => {
                trackEvent('verify_button_demo', { section: 'proof_runway' })
                addToast("Attestation verified ✓")
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Run a Reproduction Demo (5 min)</span>
            </VerifyButton>
            <p className="mt-3 text-sm text-muted-foreground">Alpha: not for clinical decision-making. Audit logs and attestations included.</p>
          </motion.div>
        </div>
      </section>

        {/* Pillar 1: Versioned Knowledge */}
        <section className="border-t border-border py-24 sm:py-32" role="region" aria-labelledby="versioned-knowledge-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block mb-4">
              <MicroTooltip content="🗂️ Immutable history - Every change tracked with SHA-256 provenance">
                <Badge className="bg-primary-500/15 text-primary-500 border border-primary-500/30 font-medium rounded-full px-4 py-1.5">
                  {PILLARS.VERSIONED_KNOWLEDGE.emoji} Versioned Knowledge
                </Badge>
              </MicroTooltip>
            </motion.div>
            <h2 id="versioned-knowledge-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
              Content-addressed, citable knowledge
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Every dataset, protocol, and result is a commit with SHA-256 provenance. Link ORCID, mint DOIs, and export W3C PROV graphs.
              <br />
              <span className="font-semibold text-foreground">
                Fork → Reproduce → Attest
              </span>
              <br />
              <span className="mt-2 inline-block text-sm">Make a <span className="font-semibold">discovery commit</span>, open a <span className="font-semibold">hypothesis branch</span>, request an <span className="font-semibold">insight merge</span>.</span>
            </p>
          </motion.div>

          {/* Data Layer - Pastel Bento Tiles with perfect 12-column grid */}
          <motion.div
            className="mx-auto mt-16 max-w-7xl"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <Suspense fallback={
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="lg:col-span-4">
                    <RepoCardSkeleton />
                  </div>
                ))
              }>
              {featuredRepositories.map((repo) => (
                <div key={repo.name} className="lg:col-span-4">
                    <motion.div
                      variants={fadeInUp}
                      transition={{ duration: 0.6, ease: EASING.smooth as any }}
                      whileHover={!prefersReducedMotion ? MOTION.bento_hover : undefined}
                      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl glass-card transition-shadow hover:shadow-elevation-2`}
                    >
                {/* Top-right micro status pill: verified + visibility */}
                <div className="absolute right-3 top-3 z-10" aria-label="Repository status">
                  <div className="flex items-center gap-1 rounded-full border bg-card/90 backdrop-blur px-2 py-1 shadow-elevation-1">
                    {repo.verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" strokeWidth={2.5} aria-label="Verified" />
                    )}
                    {repo.isPrivate ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} aria-label="Private" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} aria-label="Public" />
                    )}
                  </div>
                </div>

                <div className="flex-1 p-6">
                  {/* Pillar Declaration - Transparent Bento (strict color separation) */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{PILLARS[repo.pillar].emoji}</span>
                      <div className={`rounded-xl border p-2 ${PILLAR_STYLES[repo.pillar].bg} ${PILLAR_STYLES[repo.pillar].border}`}>
                        {React.createElement(PILLARS[repo.pillar].icon, { 
                          className: `h-4 w-4 ${PILLAR_STYLES[repo.pillar].text}` 
                        })}
                      </div>
                    </div>
                    {/* right-side spacer removed; status moved to top-right micro pill */}
                    <div className="w-5" />
                  </div>
                  
                  <Link
                    href={`/repo/${repo.owner}/${repo.name}`}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    onClick={() => trackEvent('repo_card_clicked', { repo: repo.name, owner: repo.owner })}
                  >
                    {repo.owner} / <span className="font-bold text-foreground">{repo.name}</span>
                  </Link>

                  <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                    </p>

                  <div className="mt-6 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${getLangColor(repo.language)}`} />
                      <span className="text-muted-foreground">{repo.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-accent-500" />
                      <MicroTooltip content="Reproducibility: % of independent runs reproducing within tolerance (n=12)">
                        <span className="font-mono text-accent-500 font-semibold">{repo.reproducibility}%</span>
                      </MicroTooltip>
                    </div>
                  </div>

                  {/* Hash Chip - Design.mdc v0.4 Component Showcase */}
                  <div className="mt-4">
                    <HashChip hash={repo.hash} showToast={addToast} />
                  </div>
                </div>

                <div className="border-t border-border bg-primary-100/40 px-6 py-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" strokeWidth={1.5} />
                          <span className="font-mono text-primary-500 font-semibold">{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" strokeWidth={1.5} />
                          <span className="font-mono text-primary-500 font-semibold">{repo.forks}</span>
                      </div>
                      </div>
                    <span>{repo.updatedAt}</span>
                  </div>
                </div>
                  </motion.div>
                </div>
              ))}
              </Suspense>
            </div>
          </motion.div>
        </div>
      </section>

        {/* Pillar 2: Composable Models & Tools */}
        <section className="bg-muted/50 py-24 sm:py-32" role="region" aria-labelledby="composable-models-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div 
                className="mx-auto max-w-2xl text-center"
                initial="initial"
                whileInView="animate"
                variants={fadeInUp}
                viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block mb-4">
              <MicroTooltip content="🛠️ Plug-and-play - Foundation models and simulators ready to integrate">
                <Badge className="bg-accent-500/15 text-accent-500 border border-accent-500/30 font-medium rounded-full px-4 py-1.5">
                  {PILLARS.COMPOSABLE_MODELS.emoji} Composable Models & Tools
                </Badge>
              </MicroTooltip>
            </motion.div>
            <h2 id="composable-models-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
              Composable models and workflows
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Pin workflows to OCI digests, declare I/O contracts, and compose datasets→models→analyses as graphs (export W3C PROV with each run).
              <br />
              <span className="font-semibold text-foreground">
                Import → Configure → Run → Share
              </span>
            </p>
          </motion.div>

          {/* Data Layer - Model Bento Tiles (Composable Models Pillar) */}
          <motion.div
            className="mx-auto mt-16 max-w-7xl"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <Suspense fallback={
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="lg:col-span-4">
                    <ModelCardSkeleton />
                  </div>
                ))
              }>
              {featuredModels.map((model) => (
                <div key={model.name} className="lg:col-span-4">
                  <ModelCard model={model} variants={fadeInUp} />
                </div>
              ))}
              </Suspense>
            </div>
          </motion.div>
        </div>
      </section>

        {/* Pillar 3: Human-AI Collaboration */}
        <section className="py-24 sm:py-32" role="region" aria-labelledby="human-ai-collab-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block mb-4">
              <MicroTooltip content="🤝 Social science - Live agent suggestions and peer review workflows">
                <Badge className="bg-viz-purple-500/15 text-viz-purple-500 border border-viz-purple-500/30 font-medium rounded-full px-4 py-1.5">
                  {PILLARS.HUMAN_AI_COLLAB.emoji} Human–AI Collaboration
                </Badge>
              </MicroTooltip>
            </motion.div>
            <h2 id="human-ai-collab-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
              Human–AI collaboration with provenance
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Explainable agent help, peer review workflows, and compute receipts for each suggestion. Each agent suggestion carries a compute receipt and attestation.
              <br />
              <span className="font-semibold text-foreground">
                Suggest → Validate → Iterate → Publish
              </span>
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-5xl">
            <motion.div
              className="grid gap-8 lg:grid-cols-2"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* Agent suggestion card - Human-AI Collaboration Pillar (Action Layer) */}
              <motion.div
                variants={fadeInUp}
                className="rounded-3xl glass-card p-6 shadow-elevation-1"
                whileHover={!prefersReducedMotion ? { y: -2, scale: 1.01, transition: { duration: 0.2, ease: EASING.runix as any } } : undefined}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                    <Brain className="h-5 w-5 text-viz-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Agent Suggestions</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      "Based on your protein folding results, consider testing pH levels between 6.5-7.2 
                      for improved stability."
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="soft-ui bg-primary-500 hover:bg-primary-500/90 text-primary-foreground"
                        onClick={() => {
                          trackEvent('cta_accept_run_clicked')
                          addToast('Running experiment with suggested parameters...')
                        }}
                      >
                        Accept & Run
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Peer review card */}
              <motion.div
                variants={fadeInUp}
                className="rounded-3xl glass-card p-6 shadow-elevation-1"
                whileHover={!prefersReducedMotion ? { y: -2, scale: 1.01, transition: { duration: 0.2, ease: EASING.runix as any } } : undefined}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-viz-purple-500/10 shadow-soft">
                    <MessageSquare className="h-5 w-5 text-viz-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Social Review</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Dr. Sarah Chen:</span>{" "}
                            <span className="text-muted-foreground">
                              "Great work! Have you considered controlling for temperature variations?"
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="outline" className="rounded-full text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        12 reviewers
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Lineage graph card */}
              <motion.div
                variants={fadeInUp}
                className="rounded-3xl glass-card p-6 shadow-elevation-1 lg:col-span-2"
                whileHover={!prefersReducedMotion ? { y: -2, scale: 1.01, transition: { duration: 0.2, ease: EASING.runix as any } } : undefined}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-viz-purple-500/10 shadow-soft">
                    <Workflow className="h-5 w-5 text-viz-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Experiment Lineage</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Track every fork, modification, and result in a visual knowledge graph.
                    </p>
                    
                    {/* Simple lineage visualization */}
                    <div className="mt-6 flex items-center justify-center gap-4">
                      {["Initial", "Fork A", "Fork B", "Merged"].map((stage, i) => (
                        <motion.div 
                          key={stage} 
                          className="flex items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                          <div className="flex flex-col items-center">
                            <motion.div 
                              className={`h-12 w-12 rounded-xl border-2 ${
                                i === 3 ? "border-accent bg-accent/10" : "border-border bg-card"
                              } flex items-center justify-center`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {i === 3 ? (
                                <CheckCircle2 className="h-5 w-5 text-accent" />
                              ) : (
                                <GitBranch className="h-5 w-5 text-muted-foreground" />
                              )}
                            </motion.div>
                            <span className="mt-2 text-xs text-muted-foreground">{stage}</span>
                          </div>
                          {i < 3 && (
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                              className="origin-left"
                            >
                              <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Core Features Grid */}
        <section className="py-24 sm:py-32" role="region" aria-labelledby="core-features-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 id="core-features-heading" className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Versioned, verifiable, interoperable.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Built for citable, reproducible, clinically oriented research.
            </p>
          </motion.div>

              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                  {[
                    {
                      icon: GitBranch,
                      title: "Content-Addressed Science",
                      description:
                        "Every dataset, model, workflow, and result is a commit; environments pinned by OCI digest; lineage via W3C PROV.",
                      bg: "",
                      text: "text-foreground",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Compute Receipts & Attestations",
                      description:
                        "One-click reproduce in a sandboxed runner. Outputs include inputs, env, logs, checksums, and a cryptographic attestation.",
                      bg: "",
                      text: "text-foreground",
                    },
                    {
                      icon: Database,
                      title: "FAIR + Contracts",
                      description:
                        "FAIR metadata by default; explicit I/O contracts for workflows; automatic license and consent checks. Model cards + SHAP + hash-chained audit logs.",
                      bg: "",
                      text: "text-foreground",
                    },
                  ].map((feature, idx) => {
                    const Icon = feature.icon
                    return (
                      <motion.div
                        key={feature.title}
                        initial="initial"
                        whileInView="animate"
                        variants={fadeInUp}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: EASING.smooth as any }}
                        className={`group relative flex h-full flex-col items-center justify-start overflow-hidden rounded-3xl border bg-card p-8 text-center shadow-elevation-1 transition-all`}
                        whileHover={!prefersReducedMotion ? { y: -2, scale: 1.01 } : undefined}
                      >
                        {!prefersReducedMotion && (
                          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_60%_at_50%_-10%,rgba(255,255,255,0.6),transparent_60%)]" />
                        )}
                        <div className="relative z-10 flex flex-col items-center gap-y-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted border">
                            <Icon className={`h-7 w-7 ${feature.text}`} aria-hidden="true" strokeWidth={2} />
                          </div>
                          <span className="text-base font-semibold leading-7 text-foreground">{feature.title}</span>
                          <p className="mt-2 text-base leading-7 text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                      </motion.div>
                    )
                  })}
                </div>
              </div>
          </div>
      </section>

        {/* Translation Trials Section */}
        <section className="bg-muted/40 py-24 sm:py-32" role="region" aria-labelledby="translation-trials-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial="initial"
              whileInView="animate"
              variants={fadeInUp}
              viewport={{ once: true }}
            >
              <h2 id="translation-trials-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
                Translation Trials · Ready-to-fork templates
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Platform-trial scaffolds, eligibility extraction, safety monitoring, governance, and observability.
              </p>
            </motion.div>

            <div className="mx-auto mt-16 max-w-5xl grid gap-8 sm:grid-cols-2">
              <motion.div className="rounded-3xl glass-card p-6 shadow-elevation-1" variants={fadeInUp}>
                <h3 className="font-semibold">AEGIS-0 (twin design)</h3>
                <p className="mt-2 text-sm text-muted-foreground">Arms, response-adaptive randomization, and interim analyses with a simulator notebook.</p>
              </motion.div>
              <motion.div className="rounded-3xl glass-card p-6 shadow-elevation-1" variants={fadeInUp}>
                <h3 className="font-semibold">SENTINEL (adaptive engine)</h3>
                <p className="mt-2 text-sm text-muted-foreground">NLP pipelines with test datasets (no PHI) and evaluation harnesses.</p>
              </motion.div>
              <motion.div className="rounded-3xl glass-card p-6 shadow-elevation-1" variants={fadeInUp}>
                <h3 className="font-semibold">SENTINEL (Safety monitoring)</h3>
                <p className="mt-2 text-sm text-muted-foreground">Drift and adverse event signal dashboards fed by compute receipts.</p>
              </motion.div>
              <motion.div className="rounded-3xl glass-card p-6 shadow-elevation-1" variants={fadeInUp}>
                <h3 className="font-semibold">AEGIS (Governance)</h3>
                <p className="mt-2 text-sm text-muted-foreground">Role-based approvals, protocol diffs, and Part 11–style audit records.</p>
              </motion.div>
              <motion.div className="rounded-3xl glass-card p-6 shadow-elevation-1 sm:col-span-2" variants={fadeInUp}>
                <h3 className="font-semibold">Vigil (Telemetry)</h3>
                <p className="mt-2 text-sm text-muted-foreground">Lineage graphs for every dataset→analysis→result with provenance views.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32" role="region" aria-labelledby="cta-heading">
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            {/* CTA glow accents */}
            <div aria-hidden className="pointer-events-none absolute -top-8 left-12 -z-10 h-48 w-48 rounded-full bg-foreground/20 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-8 right-12 -z-10 h-56 w-56 rounded-full bg-accent-100/60 blur-3xl" />
               <motion.div 
            className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-accent/30 px-6 py-24 text-center shadow-2xl sm:px-16 border border-primary/20"
                            initial="initial"
                            whileInView="animate"
                            variants={fadeInUp}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
              >
                  <h2 id="cta-heading" className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to transform your research?
                  </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              Join scientists worldwide building the future of reproducible discovery.
            </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/explore">
                      <Button 
                          size="lg" 
                          className="bg-card text-primary hover:bg-card/90 border border-border shadow-lg hover:shadow-xl transition-all"
                          onClick={() => {
                            trackEvent('cta_start_building_clicked')
                            addToast('Redirecting to explore page...')
                          }}
                        >
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Start Building
                      </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/docs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
                  >
                    View Docs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                </Link>
              </motion.div>
                  </div>

                        {/* Background decoration */}
              <motion.div 
              className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" 
                      aria-hidden="true"
              animate={{
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div
                className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-accent to-accent/50 opacity-25"
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
              />
            </motion.div>
              </motion.div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Compliance: HIPAA Safe Harbor de-ID, differential-privacy budgets, 21 CFR Part 11-style audit chains. See docs.
              </p>
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
          <ShieldCheck className="h-3 w-3 text-accent" aria-hidden="true" />
          <span className="font-mono text-accent">SHA-256 Verified</span>
        </motion.div>
      </div>

      {/* Footer */}
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
                <Link 
                  href={link.href} 
                  prefetch={false}
                  className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
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
            <p className="text-center text-xs leading-5 text-muted-foreground">
              &copy; {new Date().getFullYear()} Estelion.
            </p>
            <motion.span 
              className="text-xs text-accent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              •
            </motion.span>
            <p className="text-center text-xs leading-5 text-muted-foreground">
              Turning every scientific claim into a runnable, forkable, verifiable artifact.
            </p>
          </motion.div>
          </div>
      </footer>
    </div>
  )
}