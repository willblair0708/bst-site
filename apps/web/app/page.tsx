"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield,
  Zap,
  Users,
  BarChart3,
  GitBranch,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  GitFork,
  Eye,
  Activity,
  FileText,
  Beaker,
  Globe,
  Lock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface Repository {
  name: string
  owner: string
  description: string
  language: string
  stars: number
  forks: number
  isPrivate: boolean
  updatedAt: string
  hash: string
  verified: boolean
  reproducibility: number
}

const featuredRepositories: Repository[] = [
  {
    name: "mitochondrial-ros-sensor",
    owner: "oncology-research",
    description: "Computable plasmid construct protocols + SimPy model for mitochondrial ROS detection",
    language: "Python",
    stars: 47,
    forks: 12,
    isPrivate: false,
    updatedAt: "2 hours ago",
    hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    verified: true,
    reproducibility: 94.2
  },
  {
    name: "faers-safety-digest", 
    owner: "fda-collab",
    description: "OpenFDA pharmacovigilance signal detection pipeline with real-time monitoring",
    language: "R",
    stars: 128,
    forks: 23,
    isPrivate: false,
    updatedAt: "4 hours ago",
    hash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1",
    verified: true,
    reproducibility: 97.8
  },
  {
    name: "CTP-ABC123",
    owner: "mskcc",
    description: "NSCLC Phase I Safety and Efficacy Trial - Multicenter dose-escalation study",
    language: "YAML",
    stars: 23,
    forks: 3,
    isPrivate: true,
    updatedAt: "1 day ago",
    hash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2",
    verified: true,
    reproducibility: 96.5
  }
]

const features = [
  {
    icon: Shield,
    title: "Regulatory Compliance",
    description: "Built-in FDA, ICH-GCP, and 21 CFR Part 11 compliance with automated audit trails and validation"
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Git-based protocol versioning with amendment tracking, approval workflows, and branch management"
  },
  {
    icon: BarChart3,
    title: "Synthetic Controls",
    description: "AI-powered synthetic control arm generation with real-world data integration and bias correction"
  },
  {
    icon: Users,
    title: "Collaborative Research",
    description: "Multi-site collaboration tools with role-based permissions and real-time protocol synchronization"
  },
  {
    icon: Beaker,
    title: "Simulation Engine",
    description: "Monte Carlo trial simulations with adaptive design optimization and endpoint prediction"
  },
  {
    icon: Lock,
    title: "Data Security",
    description: "Enterprise-grade encryption, HIPAA compliance, and secure multi-party computation"
  }
]

const stats = [
  { label: "Active Trials", value: "1,247", growth: "+12%" },
  { label: "Researchers", value: "8,900", growth: "+23%" },
  { label: "Protocols", value: "3,456", growth: "+34%" },
  { label: "Publications", value: "89", growth: "+67%" }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -8, scale: 1.02 }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
        >
          <motion.div 
            variants={itemVariants}
          transition={{ duration: 0.6 }}
            className="flex justify-center mb-12"
          >
            <motion.div 
              className="bg-foreground p-3 rounded-xl paper-layers"
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-8 h-8 text-background" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
          transition={{ duration: 0.6 }}
            className="text-6xl md:text-7xl font-display font-light text-foreground mb-8 tracking-tight leading-none"
          >
            Every Scientific Claim<br />
            <motion.span 
              className="text-primary font-normal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Becomes Runnable
            </motion.span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
          transition={{ duration: 0.6 }}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            <span className="font-display font-medium text-foreground">Runix Hub</span> turns research into 
            reproducible pipelines. Fork, verify, and build upon any scientific workflow with git-based protocols 
            and automated reproducibility checking.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
          transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/repo/mskcc/CTP-ABC123">
                <Button size="lg" className="px-8 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-lg font-medium transition-medium group">
                  <div className="flex items-center">
                    <motion.div 
                      className="w-5 h-5 mr-2 relative"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="w-5 h-5 progress-ring" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" 
                                strokeDasharray="50.26" strokeDashoffset="0" 
                                className="group-hover:animate-progress-ring" />
                      </svg>
                      <Zap className="w-3 h-3 absolute inset-1 text-current" />
                    </motion.div>
                    Run Demo Pipeline
                  </div>
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/explore">
                <Button variant="outline" size="lg" className="px-8 py-3 text-base border-border text-foreground hover:bg-muted rounded-lg font-medium transition-medium">
                  Explore Pipelines
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-20"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
          transition={{ duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="text-center group"
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-display font-light text-foreground mb-2 transition-medium group-hover:text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.6, type: "spring" }}
                >
                  <span className="font-mono">{stat.value}</span>
                </motion.div>
                <div className="text-sm text-muted-foreground mb-2 font-medium">{stat.label}</div>
                <div className="text-xs text-accent font-medium font-mono">
                  ✓ {stat.growth}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Pipelines */}
      <div className="bg-card py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-light text-foreground mb-4">Featured Pipelines</h2>
            <p className="text-lg text-muted-foreground font-light">Verified, reproducible research workflows ready to fork and run</p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featuredRepositories.map((repo, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                transition={{ duration: 0.6 }}
                className="block"
              >
                <Link 
                  href={`/repo/${repo.owner}/${repo.name}`}
                  className="block bg-background rounded-2xl border border-border p-8 checksum-ribbon paper-layers group transition-shadow duration-300"
                  data-hash={repo.hash.substring(0, 8)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center transition-medium group-hover:bg-accent/20"
                        whileHover={{ rotate: 5 }}
                      >
                        {repo.isPrivate ? 
                          <Lock className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-medium" /> : 
                          <Globe className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-medium" />
                        }
                      </motion.div>
                      <span className="text-sm text-muted-foreground font-medium">{repo.owner}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md font-mono">
                        {repo.language}
                      </span>
                      {repo.verified && (
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center" title={`Verified reproducible (${repo.reproducibility}%)`}>
                            <CheckCircle2 className="w-4 h-4 text-background" />
                          </div>
                          <motion.div 
                            className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-medium text-foreground mb-3 group-hover:text-primary transition-medium">
                    {repo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                  
                  {/* Hash preview */}
                  <motion.div 
                    className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50"
                    whileHover={{ backgroundColor: "hsl(var(--muted)/0.5)" }}
                  >
                    <div className="text-2xs text-muted-foreground mb-1">Pipeline Hash (SHA-256)</div>
                    <div className="font-mono text-xs text-foreground break-all leading-relaxed">
                      {repo.hash}
                    </div>
                  </motion.div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span className="font-mono">{repo.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-3 h-3" />
                        <span className="font-mono">{repo.forks}</span>
                      </div>
                      <div className="flex items-center space-x-1" title="Reproducibility rate">
                        <Activity className="w-3 h-3 text-accent" />
                        <span className="font-mono text-accent">{repo.reproducibility}%</span>
                      </div>
                    </div>
                    <span>Updated {repo.updatedAt}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-light text-foreground mb-4">Why Researchers Trust Runix</h2>
            <p className="text-lg text-muted-foreground font-light">Enterprise-grade reproducibility for the next generation of science</p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div 
                  key={index} 
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.02
                  }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-2xl p-8 hover:bg-background transition-medium group border border-border paper-layers dag-node"
                >
                  <motion.div 
                    className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-medium"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Icon className="w-6 h-6 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-foreground py-20">
        <motion.div 
          className="max-w-4xl mx-auto px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-display font-light text-background mb-6"
          >
            Make Science Reproducible
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-background/80 mb-12 font-light"
          >
            Join researchers turning claims into <span className="text-accent font-mono">runnable artifacts</span>
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="px-8 py-3 text-base bg-accent text-background hover:bg-accent/90 rounded-lg font-medium transition-medium">
                Fork Your First Pipeline
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="px-8 py-3 text-base border-background/20 text-background hover:bg-background/10 rounded-lg font-medium transition-medium">
                View Documentation
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <motion.div 
          className="max-w-6xl mx-auto px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-foreground p-2 rounded-lg">
                  <Shield className="w-4 h-4 text-background" />
                </div>
                <span className="font-display font-medium text-foreground">Runix Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making scientific research reproducible, one pipeline at a time.
              </p>
            </motion.div>
            
            {[
              { 
                title: 'Product', 
                links: [
                  { label: 'Features', href: '#' },
                  { label: 'Pricing', href: '#' },
                  { label: 'Security', href: '#' },
                  { label: 'API', href: '#' }
                ]
              },
              { 
                title: 'Resources', 
                links: [
                  { label: 'Documentation', href: '#' },
                  { label: 'Tutorials', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Support', href: '#' }
                ]
              },
              { 
                title: 'Company', 
                links: [
                  { label: 'Mission', href: '/mission' },
                  { label: 'About', href: '#' },
                  { label: 'Careers', href: '#' },
                  { label: 'Contact', href: '#' }
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              >
                <h4 className="font-medium text-foreground mb-4">{section.title}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="hover:text-foreground transition-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="font-mono">© 2024 Runix Hub. All rights reserved.</span>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  )
}