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
} from "lucide-react";
import Link from "next/link";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
}

const featuredRepositories: Repository[] = [
  {
    name: "MitoROS-Sensor",
    owner: "genentech-research",
    description: "Computable plasmid construct protocols for mitochondrial ROS detection using SimPy.",
    language: "Python",
    stars: 88,
    forks: 21,
    isPrivate: false,
    updatedAt: "4 hours ago",
    hash: "a1b2c3d4e5f6g7h8",
    verified: true,
    reproducibility: 95.8,
  },
  {
    name: "FAERS-Signal-Detection",
    owner: "fda-collaborate",
    description: "OpenFDA pharmacovigilance pipeline with real-time adverse event monitoring.",
    language: "R",
    stars: 256,
    forks: 45,
    isPrivate: false,
    updatedAt: "1 day ago",
    hash: "b2c3d4e5f6g7h8i9",
    verified: true,
    reproducibility: 98.2,
  },
  {
    name: "OncoSim-NSCLC",
    owner: "broad-institute",
    description: "Agent-based model simulating tumor microenvironment in non-small cell lung cancer.",
    language: "Julia",
    stars: 102,
    forks: 18,
    isPrivate: true,
    updatedAt: "3 days ago",
    hash: "c3d4e5f6g7h8i9j0",
    verified: false,
    reproducibility: 89.1,
  },
];

const features = [
  {
    icon: GitBranch,
    title: "Git-Based Provenance",
    description: "Every dataset, model, and result is a verifiable commit in a content-addressed repository.",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable Pipelines",
    description: "Execute research workflows in secure, reproducible environments, from anywhere.",
  },
  {
    icon: Database,
    title: "Interoperable Data",
    description: "Connect disparate datasets and models into a single, computable graph of knowledge.",
  },
];

const sections = [
  {
    title: "From Static Papers to Dynamic Pipelines",
    description: "Runix Hub transforms static research papers into forkable, runnable, and verifiable pipelines. We provide the infrastructure for scientists to build, share, and collaborate on computable research, ensuring that every claim is backed by auditable data and code.",
    icon: Zap,
  },
  {
    title: "A New Foundation for Scientific Collaboration",
    description: "Built on a decentralized architecture, Runix Hub provides a new foundation for scientific collaboration. Our platform enables researchers to work together on complex projects, share results in real-time, and build upon each other's work with confidence and trust.",
    icon: Globe,
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground font-body antialiased">
      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <AnimatedHero />
      </div>

      {/* Featured Repositories */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial="initial"
            whileInView="animate"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="font-headline text-3xl tracking-tight sm:text-4xl">
              Featured Research Pipelines
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
              Explore verifiable, reproducible research pipelines ready to be forked and executed.
            </p>
          </motion.div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredRepositories.map((repo) => (
              <motion.div
                key={repo.name}
                initial="initial"
                whileInView="animate"
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col rounded-lg bg-card paper-layers"
              >
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                          {repo.isPrivate ? <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> : <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />}
                          <Link href={`/repo/${repo.owner}/${repo.name}`} className="text-sm font-medium hover:text-primary">{repo.owner} / <span className="font-bold">{repo.name}</span></Link>
                        </div>
                        <Badge variant={repo.verified ? 'default' : 'secondary'} className="flex items-center gap-x-1">
                          {repo.verified ? <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} /> : <Activity className="h-3 w-3" strokeWidth={1.5} />}
                          {repo.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground h-12">
                        {repo.description}
                    </p>
                    <div className="mt-4 font-mono text-xs text-muted-foreground truncate border-t border-dashed border-border pt-4">
                        {repo.hash}
                    </div>
                </div>
                <div className="flex flex-1 items-end rounded-b-lg bg-muted/30 p-6 mt-auto border-t border-border">
                  <div className="flex w-full items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-x-1">
                          <Star className="h-4 w-4" strokeWidth={1.5} />
                          <span className="font-mono">{repo.stars}</span>
                      </div>
                      <div className="ml-4 flex items-center gap-x-1">
                          <GitFork className="h-4 w-4" strokeWidth={1.5} />
                          <span className="font-mono">{repo.forks}</span>
                      </div>
                      <div className="ml-auto flex items-center gap-x-1">
                         <div className={`h-2 w-2 rounded-full ${repo.language === 'Python' ? 'bg-blue-500' : repo.language === 'R' ? 'bg-purple-500' : 'bg-orange-500'}`}/>
                         <span>{repo.language}</span>
                      </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-muted/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div 
                className="mx-auto max-w-2xl text-center"
                initial="initial"
                whileInView="animate"
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                  <h2 className="font-headline text-3xl tracking-tight sm:text-4xl">
                      A New Operating System for Science
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                      Runix Hub provides the core infrastructure for the next generation of reproducible, collaborative, and transparent scientific research.
                  </p>
              </motion.div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                  <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                      {features.map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <motion.div 
                                key={feature.title} 
                                className="flex flex-col"
                                initial="initial"
                                whileInView="animate"
                                variants={fadeInUp}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                            >
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" strokeWidth={1.5} />
                                    </div>
                                    {feature.title}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </motion.div>
                          )
                        })}
                  </dl>
              </div>
          </div>
      </section>

      {/* Manifesto Sections */}
      <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                  {sections.map((section, index) => {
                      const Icon = section.icon;
                      return (
                        <motion.div 
                            key={section.title} 
                            className={`lg:pt-4 ${index === 0 ? 'lg:pr-8' : 'sm:order-first lg:pl-8'}`}
                            initial="initial"
                            whileInView="animate"
                            variants={fadeInUp}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="lg:max-w-lg">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                                    <Icon className="h-6 w-6 text-accent" aria-hidden="true" strokeWidth={1.5} />
                                </div>
                                <h2 className="mt-8 font-headline text-3xl tracking-tight text-foreground sm:text-4xl">
                                    {section.title}
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                    {section.description}
                                </p>
                                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground lg:max-w-none">
                                    {/* Additional points can be added here */}
                                </dl>
                            </div>
                        </motion.div>
                      )
                    })}
              </div>
          </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary/5 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div 
                className="relative isolate overflow-hidden bg-primary shadow-2xl rounded-2xl px-6 py-24 text-center sm:px-16"
                initial="initial"
                whileInView="animate"
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                  <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                      Ready to bring your research to life?
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
                      Start building your first verifiable research pipeline today.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                      <Button asChild size="lg">
                          <Link href="/auth/signup">Get Started for Free</Link>
                      </Button>
                      <Button asChild variant="link" size="lg" className="text-primary-foreground">
                          <Link href="/docs">View Documentation <span aria-hidden="true">→</span></Link>
                      </Button>
                  </div>
                  <svg
                      viewBox="0 0 1024 1024"
                      className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                      aria-hidden="true"
                  >
                      <circle cx={512} cy={512} r={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
                      <defs>
                          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                              <stop stopColor="#18E0C8" />
                              <stop offset={1} stopColor="#0436FF" />
                          </radialGradient>
                      </defs>
                  </svg>
              </motion.div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
          <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
              <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                  {/* Footer links can be added here */}
              </nav>
              <div className="mt-10 flex justify-center space-x-10">
                  {/* Social links can be added here */}
              </div>
              <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
                  &copy; {new Date().getFullYear()} Runix Hub, Inc. All rights reserved.
              </p>
          </div>
      </footer>
    </div>
  );
}
