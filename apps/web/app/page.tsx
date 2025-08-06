"use client";

import { GitBranch, CheckCircle2, Star, GitFork, Activity, Globe, Lock, ArrowRight, Database, ShieldCheck, FlaskConical, Users, Bot, Sparkles, FileJson, Hash, Workflow, GitMerge, Brain, MessageSquare, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AnimatedHero } from "@/components/ui/animated-hero"
import { motion } from "framer-motion"
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
import { MOTION } from "@/lib/motion/tokens"

// Three Pillars - Transparent Bento (Strict Color Separation)
const PILLARS = {
  VERSIONED_KNOWLEDGE: { 
    icon: Hash, 
    color: "primary-500", 
    bg: "primary-100",
    emoji: "🗂️",
    motion: "snap",
    description: "Every claim becomes verifiable, forkable knowledge"
  },
  COMPOSABLE_MODELS: { 
    icon: FlaskConical, 
    color: "accent-500", 
    bg: "accent-100",
    emoji: "🛠️",
    motion: "spark-glow",
    description: "Models and simulations that compose and scale"
  },
  HUMAN_AI_COLLAB: { 
    icon: Users, 
    color: "collaboration-500", 
    bg: "collaboration-100",
    emoji: "🤝",
    motion: "pulse-success",
    description: "Human expertise amplified by AI agents"
  },
};

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
    name: "protein-folding-sim",
    owner: "deepmind-research",
    description: "Real-time protein structure prediction with AlphaFold integration",
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
    name: "crispr-off-target",
    owner: "broad-institute",
    description: "ML pipeline for predicting CRISPR-Cas9 off-target effects",
    language: "R",
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
    name: "neuromorphic-compute",
    owner: "eth-zurich",
    description: "Spiking neural network simulator for brain-inspired computing",
    language: "Julia",
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
    name: "BioGPT-3",
    version: "v2.1.0",
    description: "Foundation model for biomedical text generation and analysis",
    provider: "microsoft-research",
    Icon: Bot,
    stars: 2341,
    forks: 178,
  },
  {
    name: "MolGen-XL",
    version: "v1.4.2",
    description: "Molecular structure generation using graph neural networks",
    provider: "mit-csail",
    Icon: Bot,
    stars: 1567,
    forks: 234,
  },
  {
    name: "CellSim",
    version: "v3.0.1",
    description: "Multi-scale cellular simulation engine with GPU acceleration",
    provider: "stanford-bio",
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
    description: "Create your versioned workspace",
    motion: "snap",
    emoji: "🗂️",
  },
  {
    pillar: "COMPOSABLE_MODELS" as const,
    icon: Bot,
    title: "Model", 
    description: "Drop in a model or simulator",
    motion: "spark-glow",
    emoji: "🛠️",
  },
  {
    pillar: "HUMAN_AI_COLLAB" as const,
    icon: GitMerge,
    title: "Review",
    description: "Merge results with agents & peers",
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
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    trackPageView('landing_page')
  }, [])



  return (
    <div className="bg-background text-foreground antialiased">
      {/* Hero Section - Astra-Lite Story Layer */}
      <header className="relative">
        <div className="bg-primary-100/50 shadow-elevation-2 rounded-2xl mx-4 lg:mx-8 mt-4 border border-black/5">
          <AnimatedHero />
        </div>
      </header>

      <main>
        {/* Proof Runway (Zero-State Flow) */}
        <section className="py-20 sm:py-24" role="region" aria-labelledby="proof-runway-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
                addToast("Demo verification complete! ✓")
                trackEvent('verify_button_demo', { section: 'proof_runway' })
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Experience Soft-UI</span>
            </VerifyButton>
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
              Immutable Git-grade history
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Every dataset, protocol, and result tracked with SHA-256 provenance.
              <br />
              <span className="font-semibold text-foreground">
                Fork → Modify → Verify → Merge
              </span>
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
                    transition={{ duration: 0.6 }}
                    whileHover={MOTION.bento_hover}
                    className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border bg-card shadow-sm`}
                  >
                {/* Verification badge */}
                {repo.verified && (
                  <div className="absolute right-4 top-4 z-10">
                    <div className="bg-accent-100 rounded-full p-1.5 border-2 border-background shadow-md">
                      <CheckCircle2 className="h-4 w-4 text-accent-500" strokeWidth={2.5} />
                    </div>
                  </div>
                )}

                <div className="flex-1 p-6">
                  {/* Pillar Declaration - Transparent Bento (strict color separation) */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{PILLARS[repo.pillar].emoji}</span>
                      <div className={`p-2 rounded-lg bg-${PILLARS[repo.pillar].color}/10 border border-${PILLARS[repo.pillar].color}/20`}>
                        {React.createElement(PILLARS[repo.pillar].icon, { 
                          className: `h-4 w-4 text-${PILLARS[repo.pillar].color}` 
                        })}
                      </div>
                    </div>
                    {repo.isPrivate ? (
                      <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                  </div>
                  
                  <Link
                    href={`/repo/${repo.owner}/${repo.name}`}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
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
                      <span className="font-mono text-accent-500 font-semibold">{repo.reproducibility}%</span>
                    </div>
                  </div>

                  {/* Hash Chip - Design.mdc v0.4 Component Showcase */}
                  <div className="mt-4">
                    <HashChip hash={repo.hash} showToast={addToast} />
                  </div>
                </div>

                <div className="border-t border-border bg-primary-500/5 px-6 py-4">
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
              Plug-and-play foundation models
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Pre-trained models, simulators, and workflows ready to integrate.
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
              Live agent suggestions & social review
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              AI agents assist with hypothesis generation, experiment design, and peer review.
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
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-collaboration-100/80">
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
                        className="soft-ui bg-primary-500 hover:bg-primary-500/90 text-white"
                        onClick={() => {
                          trackEvent('cta_accept_run_clicked')
                          addToast('Running experiment with suggested parameters...')
                        }}
                      >
                        Accept & Run
                      </Button>
                      <Button size="sm" variant="outline" className="soft-ui bg-card hover:bg-muted">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Peer review card */}
              <motion.div
                variants={fadeInUp}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-viz-purple-500/10">
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
                      <Badge variant="outline" className="text-xs rounded-full">
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
                className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-viz-purple-500/10">
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
              A new operating system for science.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Built for the next generation of reproducible, collaborative research.
            </p>
          </motion.div>

              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                  <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  icon: GitBranch,
                  title: "Git-Based Provenance",
                  description:
                    "Every dataset, model, and result is a verifiable commit in a content-addressed repository.",
                },
                {
                  icon: ShieldCheck,
                  title: "Verifiable Pipelines",
                  description:
                    "Execute research workflows in secure, reproducible environments, from anywhere.",
                },
                {
                  icon: Database,
                  title: "Interoperable Data",
                  description:
                    "Connect disparate datasets and models into a single, computable graph of knowledge.",
                },
              ].map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <motion.div 
                                key={feature.title} 
                                className="flex flex-col items-center text-center"
                                initial="initial"
                                whileInView="animate"
                                variants={fadeInUp}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                              <dt className="flex flex-col items-center gap-y-4">
                                <div 
                                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border"
                                >
                                  <Icon className="h-6 w-6 text-foreground" aria-hidden="true" strokeWidth={2} />
                                </div>
                                <span className="text-base font-semibold leading-7 text-foreground">{feature.title}</span>
                              </dt>
                              <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                  <p className="flex-auto">{feature.description}</p>
                              </dd>
                            </motion.div>
                );
                        })}
                  </dl>
              </div>
          </div>
      </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32" role="region" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
                          className="bg-white text-[#0436FF] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
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
              &copy; {new Date().getFullYear()} Runix Hub.
            </p>
            <motion.span 
              className="text-xs text-accent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              •
            </motion.span>
            <p className="text-center text-xs leading-5 text-muted-foreground">
              Turning every scientific claim into a runnable, forkable, verifiable artefact.
            </p>
          </motion.div>
          </div>
      </footer>
    </div>
  )
}