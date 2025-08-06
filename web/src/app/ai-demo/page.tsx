"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles,
  ChevronRight,
  FileCode,
  Cpu,
  Fingerprint,
  Rocket
} from 'lucide-react';
import { cn } from "@/lib/utils";

import { Badge } from '@/components/ui/badge';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 border-b border-border flex items-center justify-between">
        {children}
    </div>
)

const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-base font-semibold text-foreground">{children}</h2>
)

const Step = ({ icon: Icon, title, status, children }: { icon: React.ElementType, title: string, status: string, children: React.ReactNode }) => (
    <Card>
        <CardHeader>
            <CardTitle>
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <span>{title}</span>
                </div>
            </CardTitle>
            <Badge variant={status === 'Completed' ? 'default' : 'secondary'}>{status}</Badge>
        </CardHeader>
        <div className="p-4 text-sm text-muted-foreground">
            {children}
        </div>
    </Card>
)

export default function AIDemoPage() {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{
        protocol: { name: string, arms: number, patients: number },
        simulation: { power: string, status: string },
        audit: { hash: string }
    } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            setResults({
                protocol: { name: "CTP-AI-DEMO-001", arms: 3, patients: 150 },
                simulation: { power: "92.1%", status: "Success" },
                audit: { hash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') }
            });
            setIsLoading(false);
        }, 2000);
    }

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-foreground">AI Protocol Generator</h1>
            <p className="text-lg text-muted-foreground mt-2">From natural language prompt to production-ready trial in 3 steps.</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A Phase II oncology trial for NSCLC with 3 arms..."
                        className="w-full p-4 pr-32 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                        rows={3}
                    />
                    <Button 
                        type="submit" 
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        disabled={isLoading || !prompt}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isLoading ? "Generating..." : "Generate"}
                    </Button>
                </div>
            </form>
        </div>
        
        {results && (
            <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                    <Step icon={FileCode} title="1. Protocol Generation" status="Completed">
                        <p>Generated protocol <span className="font-semibold text-foreground">{results.protocol.name}</span> with {results.protocol.arms} arms and {results.protocol.patients} patients.</p>
                    </Step>
                     <div className="text-center mt-12 hidden md:block"><ChevronRight className="w-8 h-8 text-muted-foreground"/></div>
                    <Step icon={Cpu} title="2. AEGIS Simulation" status="Completed">
                        <p>Simulation successful with <span className="font-semibold text-foreground">{results.simulation.power}</span> statistical power.</p>
                    </Step>
                    <div className="text-center mt-12 hidden md:block"><ChevronRight className="w-8 h-8 text-muted-foreground"/></div>
                    <Step icon={Fingerprint} title="3. Cryptographic Audit" status="Completed">
                       <p>Immutable audit trail created with Merkle hash:</p>
                       <code className="text-xs break-all text-accent-warn mt-2 block">{results.audit.hash}</code>
                    </Step>
                </div>

                <div className="text-center mt-16">
                     <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
                         <Rocket className="w-5 h-5 mr-2"/>
                         Deploy to Vigil OS
                     </Button>
                </div>
            </div>
        )}
    </div>
    )
}
