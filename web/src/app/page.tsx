"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight,
  GitCommit,
  ShieldCheck,
  FileCode,
  Beaker,
  Cpu,
  Fingerprint,
  ChevronRight,
  Dna
} from 'lucide-react'
import Link from 'next/link'
import { cn } from "@/lib/utils";

const MissionTimer = () => {
    const [days, setDays] = useState(0);

    useEffect(() => {
        const startDate = new Date("2023-01-01T00:00:00Z");
        const interval = setInterval(() => {
            const now = new Date();
            const difference = now.getTime() - startDate.getTime();
            const calculatedDays = Math.floor(difference / (1000 * 60 * 60 * 24) * 3.7); // Fictional accelerator
            setDays(calculatedDays);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-4 right-4 bg-panel border border-border rounded-lg px-3 py-1 text-xs text-muted-foreground font-mono">
            Life-days Accelerated: <span className="text-primary font-semibold">{days.toLocaleString()}</span>
        </div>
    )
}

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    link: string;
    linkText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, link, linkText }) => (
  <div className="bg-panel p-6 rounded-lg border border-border transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-4 border border-border">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm mb-4">{description}</p>
    <Button asChild variant="link" className="p-0 text-primary hover:text-primary/90">
      <Link href={link}>
        {linkText} <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
  </div>
);

export default function HomePage() {
  return (
    <div className="bg-space text-foreground relative">
        <MissionTimer />
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(25,167,206,0.1),transparent)] -z-10" />

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-24 text-center">
        <Dna className="w-24 h-24 text-primary/50 mx-auto mb-6" />
        <h1 className="text-4xl md:text-6xl font-semibold text-foreground mb-6">
          The OS for Scientific Translation
        </h1>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
          In 1953 we cracked the double helix. In 2023 we approved a CRISPR cure.
          Two diseases down—thousands to go. Bastion is our forge: a place where every protocol, dataset and digital‑twin model is hammered into something fork‑able, test‑able and provably safe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link href="/docs/quickstart">
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Building
            </Link>
          </Button>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-24 px-4 bg-secondary/50 border-y border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              From Concept to Clinic, Verifiably.
            </h2>
            <p className="text-md text-muted-foreground">
              Bastion integrates the entire trial lifecycle into a single, scriptable workflow, built on three core principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={FileCode}
              title="Protocol-as-Code"
              description="Define studies in version-controlled YAML. Eliminate ambiguity and enable programmatic validation."
              link="/docs/protocol-as-code"
              linkText="Explore Schemas"
            />
            <FeatureCard 
              icon={Cpu}
              title="Digital Twin Simulation"
              description="De-risk trial designs and optimize parameters against millions of virtual patients before enrolling patient one."
              link="/docs/simulation"
              linkText="Learn about AEGIS"
            />
            <FeatureCard 
              icon={Fingerprint}
              title="Cryptographic Audit"
              description="Every action is signed and anchored to an immutable ledger for a verifiable, Part 11-compliant audit trail."
              link="/docs/auditing"
              linkText="Review Compliance"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Estelion, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
