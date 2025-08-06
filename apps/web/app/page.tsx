"use client";

import {
  GitBranch,
  CheckCircle2,
  Star,
  GitFork,
  Activity,
  Beaker,
  Globe,
  Lock,
  ArrowRight,
  Database,
  ShieldCheck,
  Zap,
  FlaskConical,
  Users,
  Bot,
  Sparkles,
  FileJson,
  Hash,
  Workflow,
  GitMerge,
  Brain,
  Search,
  MessageSquare,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelCard } from "@/components/ui/model-card";

// Three Pillars from design system
const PILLARS = {
  VERSIONED_KNOWLEDGE: { icon: FileJson, color: "primary", emoji: "🗂️" },
  COMPOSABLE_MODELS: { icon: Bot, color: "accent", emoji: "🛠️" },
  HUMAN_AI_COLLAB: { icon: Users, color: "purple", emoji: "🤝" },
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
    pillar: "VERSIONED_KNOWLEDGE" as keyof typeof PILLARS,
    icon: GitFork,
    title: "Fork",
    description: "Create your versioned workspace",
    motion: "snap",
  },
  {
    pillar: "COMPOSABLE_MODELS" as keyof typeof PILLARS,
    icon: Bot,
    title: "Model",
    description: "Drop in a model or simulator",
    motion: "spark-glow",
  },
  {
    pillar: "HUMAN_AI_COLLAB" as keyof typeof PILLARS,
    icon: GitMerge,
    title: "Review",
    description: "Merge results with agents & peers",
    motion: "pulse-success",
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
  return (
    <div className="bg-background text-foreground antialiased">
      {/* Hero Section */}
        <AnimatedHero />

      {/* Proof Runway (Zero-State Flow) */}
      <section className="py-20 sm:py-24">
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
              <Badge variant="outline" className="border-primary/20 bg-primary/5">
                <Sparkles className="w-3 h-3 mr-1 text-primary animate-pulse" />
                Proof Runway
              </Badge>
            </motion.div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              From hypothesis to verified result in 3 steps
            </h2>
          </motion.div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {proofRunwaySteps.map((step, index) => {
                const Icon = step.icon;
                const pillarConfig = PILLARS[step.pillar];
                
                return (
                  <motion.div
                    key={step.title}
                    initial="initial"
                    whileInView="animate"
                    variants={fadeInUp}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative text-center"
                  >
                    {/* Connection line */}
                    {index < proofRunwaySteps.length - 1 && (
                      <div className="absolute left-1/2 top-12 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-border to-transparent sm:block" />
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        step.pillar === "VERSIONED_KNOWLEDGE" ? "bg-primary/10 hover:bg-primary/20" :
                        step.pillar === "COMPOSABLE_MODELS" ? "bg-accent/10 hover:bg-accent/20 spark-glow" :
                        "bg-viz-purple-500/10 hover:bg-viz-purple-500/20"
                      }`}
                    >
                      <Icon className={`h-10 w-10 ${
                        step.pillar === "VERSIONED_KNOWLEDGE" ? "text-primary" :
                        step.pillar === "COMPOSABLE_MODELS" ? "text-accent" :
                        "text-viz-purple-500"
                      }`} strokeWidth={1.5} />
                    </motion.div>
                    
                    <h3 className="mb-2 text-xl font-semibold">
                      {pillarConfig.emoji} {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 1: Versioned Knowledge */}
      <section className="border-t border-border py-24 sm:py-32">
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
              <Badge className="bg-primary/10 text-primary border border-primary/20">
                {PILLARS.VERSIONED_KNOWLEDGE.emoji} Versioned Knowledge
              </Badge>
            </motion.div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
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

          <motion.div
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredRepositories.map((repo) => (
              <motion.div
                key={repo.name}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-elevation-1 transition-all duration-300 hover:shadow-elevation-3 hover:border-primary/20"
              >
                {/* Verification badge */}
                {repo.verified && (
                  <div className="absolute right-4 top-4 z-10">
                    <div className="verify-ring">
                      <CheckCircle2 className="h-5 w-5 text-accent" strokeWidth={2} />
                    </div>
                  </div>
                )}

                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2">
                    {repo.isPrivate ? (
                      <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                    <Link
                      href={`/repo/${repo.owner}/${repo.name}`}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {repo.owner} / <span className="font-bold text-foreground">{repo.name}</span>
                    </Link>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                    </p>

                  <div className="mt-6 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          repo.language === "Python"
                            ? "bg-viz-blue-500"
                            : repo.language === "R"
                            ? "bg-viz-purple-500"
                            : "bg-viz-orange-500"
                        }`}
                      />
                      <span className="text-muted-foreground">{repo.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-accent" />
                      <span className="font-mono text-accent">{repo.reproducibility}%</span>
                    </div>
                  </div>

                  {/* Hash with copy button */}
                  <div className="mt-4 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <code className="flex-1 font-mono text-xs text-muted-foreground">
                        {repo.hash}
                    </code>
                    <motion.button 
                      className="text-muted-foreground hover:text-accent transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </motion.button>
                    </div>
                </div>

                <div className="border-t border-border bg-muted/30 px-6 py-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" strokeWidth={1.5} />
                          <span className="font-mono">{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" strokeWidth={1.5} />
                          <span className="font-mono">{repo.forks}</span>
                      </div>
                      </div>
                    <span>{repo.updatedAt}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pillar 2: Composable Models & Tools */}
      <section className="bg-muted/50 py-24 sm:py-32">
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
              <Badge className="bg-accent/10 text-accent border border-accent/20">
                {PILLARS.COMPOSABLE_MODELS.emoji} Composable Models & Tools
              </Badge>
            </motion.div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
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

          <motion.div
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredModels.map((model) => (
              <ModelCard key={model.name} model={model} variants={fadeInUp} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pillar 3: Human-AI Collaboration */}
      <section className="py-24 sm:py-32">
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
              <Badge className="bg-viz-purple-500/10 text-viz-purple-500 border border-viz-purple-500/20">
                {PILLARS.HUMAN_AI_COLLAB.emoji} Human–AI Collaboration
              </Badge>
            </motion.div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
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
              {/* Agent suggestion card */}
              <motion.div
                variants={fadeInUp}
                className="rounded-xl border border-border bg-card p-6 shadow-elevation-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-viz-purple-500/10">
                    <Brain className="h-5 w-5 text-viz-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Agent Suggestions</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      "Based on your protein folding results, consider testing pH levels between 6.5-7.2 
                      for improved stability. Similar work by Chen et al. (2023) showed 15% better yields."
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" className="bg-viz-purple-500 hover:bg-viz-purple-500/90 text-white">
                          Accept & Run
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" variant="outline" className="border-viz-purple-500/20 hover:border-viz-purple-500/40">
                          View Details
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Peer review card */}
              <motion.div
                variants={fadeInUp}
                className="rounded-xl border border-border bg-card p-6 shadow-elevation-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-viz-purple-500/10">
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
                      <Badge variant="outline" className="text-xs">
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
                className="rounded-xl border border-border bg-card p-6 shadow-elevation-1 lg:col-span-2"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-viz-purple-500/10">
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
                              className={`h-12 w-12 rounded-lg border-2 ${
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
      <section className="border-t border-border bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              A new operating system for science
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
                                className="flex flex-col"
                                initial="initial"
                                whileInView="animate"
                                variants={fadeInUp}
                                viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                      <motion.div 
                        className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                        whileHover={{ 
                          scale: 1.1, 
                          backgroundColor: "rgba(4, 54, 255, 0.2)",
                          rotate: 5 
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" strokeWidth={1.5} />
                      </motion.div>
                      {feature.title}
                    </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
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
      <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <motion.div 
            className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-accent/20 px-6 py-24 text-center shadow-2xl sm:px-16"
                            initial="initial"
                            whileInView="animate"
                            variants={fadeInUp}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
              >
                  <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to transform your research?
                  </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              Join scientists worldwide building the future of reproducible discovery.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/explore">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all">
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
  );
}