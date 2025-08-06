"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Zap,
  Target,
  Users,
  Rocket,
  Shield,
  Globe,
  Brain,
  Code2,
  GitBranch,
  CheckCircle2,
  ArrowRight,
  Star,
  DollarSign,
  Award,
  TrendingUp,
  Clock,
  FileText,
  Database
} from 'lucide-react'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const tailwinds = [
  {
    trend: "AI mainstreaming in hospitals (35% adoption, AMA 2024)",
    hook: "One-click GPU Re-run—every pipeline ships with an auto-scaled CUDA image; ChatGPT-style Copilot suggests env fixes & provenance notes.",
    impact: "Clinicians can test an LLM-powered phenotyping model on their cohort overnight—no DevOps friction.",
    icon: Brain
  },
  {
    trend: "ARPA-H $1.5B appropriation for radical translation tools",
    hook: "Proving-Ground Mode— toggle generates an ARPA-H-ready dossier (SBOM + impact metrics) and uploads directly to the agency's sandbox API.",
    impact: "Aligns with funding mandates; lowers proposal friction for grantees.",
    icon: Rocket
  },
  {
    trend: "FDA push for Diversity Action Plans & Computational Evidence",
    hook: "Built-in Cohort Equity Meter—Runix warns when branch diffs reduce demographic balance; exports DEPICT JSON.",
    impact: "Sponsors show compliance early; reviewers gain instant transparency.",
    icon: Shield
  },
  {
    trend: "Cost of rare disease ≈ $966B (GAO)",
    hook: "Micro-Trial Templates—wizard scaffolds N-of-1 or <50-patient protocols, pins consent forms & ePRO flows.",
    impact: "Foundations iterate faster; data lands in a reuse-ready graph rather than PDFs.",
    icon: Users
  }
]

const stakeholders = [
  {
    type: "For Agencies",
    value: "Turn months of Q-Subs into auto-verifiable SBOMs.",
    icon: FileText
  },
  {
    type: "For Pharma", 
    value: "Slash post-hoc replication costs; pipeline diffs surface drift before the FDA does.",
    icon: TrendingUp
  },
  {
    type: "For Patient Foundations",
    value: "Earn Evidence Credits every time a micro-trial is reused in bigger approvals.",
    icon: Award
  }
]

const lexicon = [
  { term: "❖ Rune", definition: "Immutable hash that bundles code + data + environment + SBOM. A paper's claim distilled to a single Rune.", analogy: "commit + container" },
  { term: "Aerie", definition: "A versioned collection of Runes that describe one hypothesis or product line.", analogy: "repo" },
  { term: "Constellation", definition: "Interactive map showing how Runes depend on one another.", analogy: "DAG / pipeline" },
  { term: "Glyph", definition: "Minimal alteration to a Rune (e.g., swap library, add dataset slice).", analogy: "diff / patch" },
  { term: "Fuse Request", definition: "Proposal to merge a Glyph (or whole Constellation branch) back into an Aerie.", analogy: "pull request" },
  { term: "Helm", definition: "Ephemeral runner that reproduces a Rune; logs stream back to UI.", analogy: "GitHub Actions" },
  { term: "Proof-Karat (PKT)", definition: "Cryptographic credit minted when your Rune is reused downstream.", analogy: "GitHub Star × credit" },
  { term: "Seal of Re-Run", definition: "Appears next to Rune hash once ≥2 external Helms reproduce it bit-for-bit.", analogy: "CI green check" }
]

const timeline = [
  { quarter: "Q1-Q2", title: "AI Hospital Pilot", description: "Cedars-Sinai uploads sepsis-alert pipeline; 12 external ICUs fork it in two weeks." },
  { quarter: "Q3", title: "ARPA-H Fast-Track", description: "Consortium submits Runix SBOM in lieu of 200-page appendix; review cycle cut by 35%." },
  { quarter: "Q4", title: "Rare-Disease Micro-Trials", description: "Three foundations publish N-of-1 gene-therapy runs; evidence graph links them, unlocking pooled statistics." }
]

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-24 px-6 lg:px-8 bg-gradient-to-b from-card to-background">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Badge className="mb-4 px-4 py-2">Our Mission</Badge>
            <h1 className="text-5xl lg:text-6xl font-display font-light text-foreground mb-6 leading-tight">
              The GitHub-for-Science
              <br />
              <span className="text-primary font-normal">Moment</span>
            </h1>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Runix Hub turns AI agility + government urgency into a reproducibility flywheel—so that every 
            federally-funded experiment is a forkable software artefact, not a sunk PDF.
          </motion.p>

          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-card border border-border rounded-2xl p-8 text-left max-w-2xl mx-auto">
              <h3 className="text-lg font-display font-medium text-foreground mb-4">The "Big Secret" Insight</h3>
              <blockquote className="text-foreground font-medium border-l-4 border-primary pl-4">
                "Re-runnable context <em>is</em> the scientific asset. A claim without its byte-for-byte runtime 
                is dead on arrival; version the execution layer, and replication becomes a button-press."
              </blockquote>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/explore">
              <Button size="lg" className="px-8 py-4 text-lg font-medium group">
                Explore the Platform
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Riding the Macro Tailwinds */}
      <div className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-light text-foreground mb-4">Riding the Macro Tailwinds</h2>
            <p className="text-lg text-muted-foreground">Four converging forces that make reproducible science inevitable</p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tailwinds.map((tailwind, index) => {
              const Icon = tailwind.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-medium text-foreground mb-2">2025 Tailwind</h3>
                      <p className="text-sm text-muted-foreground">{tailwind.trend}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Runix Design Hook</h4>
                    <p className="text-sm text-muted-foreground italic">{tailwind.hook}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Why It Compounds</h4>
                    <p className="text-sm text-muted-foreground">{tailwind.impact}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Stakeholder Value */}
      <div className="py-20 px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-light text-foreground mb-4">Narrative Upgrade for Stakeholders</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stakeholders.map((stakeholder, index) => {
              const Icon = stakeholder.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-8 bg-background border border-border rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">{stakeholder.type}</h3>
                  <p className="text-muted-foreground">{stakeholder.value}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Runix Lexicon */}
      <div className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-light text-foreground mb-4">Runix Lexicon</h2>
            <p className="text-lg text-muted-foreground">The platform's own language</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {lexicon.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-display font-medium text-foreground mb-1">{item.term}</h3>
                  <span className="text-xs text-accent font-mono">{item.analogy}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.definition}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 bg-muted/30 rounded-2xl p-8 text-center"
          >
            <h3 className="text-lg font-display font-medium text-foreground mb-4">Example Usage</h3>
            <blockquote className="text-foreground italic max-w-4xl mx-auto">
              "I cloned the <strong>CRISPR-Screen Aerie</strong>, applied a <strong>Glyph</strong> to update the antibody firmware, 
              spun a <strong>Helm</strong> to verify, and opened a <strong>Fuse Request</strong>. My Rune earned a <strong>Seal of Re-Run</strong> plus 
              12 <strong>Proof-Karats</strong>—all visible on my <strong>Atlas</strong> profile."
            </blockquote>
          </motion.div>
        </div>
      </div>

      {/* First-Year Impact Timeline */}
      <div className="py-20 px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-light text-foreground mb-4">First-Year Impact Storyboard</h2>
            <p className="text-lg text-muted-foreground">Projected milestones for transformative adoption</p>
          </motion.div>

          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {timeline.map((milestone, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-6 bg-background border border-border rounded-2xl p-8"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-display font-medium">{milestone.quarter}</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-6 lg:px-8 bg-foreground">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-display font-light text-background mb-6">
            The Future of Science is Executable
          </h2>
          <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
            Join us in building the platform where every scientific claim becomes a forkable, verifiable asset.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button variant="secondary" size="lg" className="px-8 py-4 text-lg font-medium">
                Start Exploring
              </Button>
            </Link>
            <Link href="mailto:hello@runixhub.com">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium border-background/20 text-background hover:bg-background/10">
                Get In Touch
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}