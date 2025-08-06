"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  Star,
  GitFork,
  Clock,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  FileText,
  MessageSquare,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

const recentTrials = [
  {
    name: "CTP-ABC123",
    title: "NSCLC Phase I Safety Trial",
    owner: "bastion-research",
    status: "Active",
    lastUpdated: "2024-08-15T15:30:00Z",
    stars: 128,
    forks: 12,
    language: "YAML"
  },
  {
    name: "CTP-XYZ789", 
    title: "CAR-T Optimization Study",
    owner: "bastion-research",
    status: "Planning",
    lastUpdated: "2024-08-14T09:45:00Z",
    stars: 72,
    forks: 3,
    language: "YAML"
  },
  {
    name: "CTP-BIO007", 
    title: "Next-Gen Sequencing Biomarker Validation",
    owner: "genomics-guild",
    status: "Active",
    lastUpdated: "2024-08-15T11:00:00Z",
    stars: 345,
    forks: 48,
    language: "YAML"
  }
]

const recentActivity = [
    {
        type: "COMMIT",
        actor: "Dr. Chen",
        action: "pushed 2 commits to",
        target: "main",
        timestamp: "2024-08-15T14:30:00Z",
        trial: "CTP-ABC123"
    },
    {
        type: "PR_OPENED",
        actor: "Dr. Valenti",
        action: "opened pull request #15",
        description: "Feat: Add adaptive randomization arm",
        timestamp: "2024-08-15T11:45:00Z",
        trial: "CTP-ABC123"
    },
    {
        type: "COMMENT",
        actor: "regulators:fda",
        action: "commented on issue #8",
        description: "Clarification requested on primary endpoint definition.",
        timestamp: "2024-08-14T18:00:00Z",
        trial: "CTP-XYZ789"
    },
    {
        type: "SAFETY_ALERT",
        actor: "vigil-bot",
        action: "reported a Grade 3 safety alert",
        description: "AE-089: Neutropenia reported for patient P-042 at MSKCC.",
        timestamp: "2024-08-15T09:15:00Z",
        trial: "CTP-BIO007"
    }
]


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

const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'COMMIT': return <GitCommit className="w-4 h-4 text-muted-foreground" />;
        case 'PR_OPENED': return <GitFork className="w-4 h-4 text-muted-foreground" />;
        case 'COMMENT': return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
        case 'SAFETY_ALERT': return <AlertTriangle className="w-4 h-4 text-destructive" />;
        default: return <CheckCircle2 className="w-4 h-4 text-muted-foreground" />;
    }
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>My Trials</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/new/trial"><Plus className="w-4 h-4 mr-2" />New Trial</Link>
                        </Button>
                    </CardHeader>
                    <div className="divide-y divide-border">
                        {recentTrials.map((trial) => (
                            <div key={trial.name} className="p-4 hover:bg-secondary/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link href={`/${trial.owner}/${trial.name.toLowerCase()}`} className="font-semibold text-primary hover:underline">
                                                {trial.owner} / {trial.name}
                                            </Link>
                                            <Badge variant={trial.status === 'Active' ? 'default' : 'secondary'} className="text-xs">{trial.status}</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">{trial.title}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4" />
                                            <span>{trial.stars}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <GitFork className="w-4 h-4" />
                                            <span>{trial.forks}</span>
                                        </div>
                                        <span>Updated {formatRelativeTime(trial.lastUpdated)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                         <Button variant="ghost" size="sm" asChild>
                            <Link href="/activity">View all</Link>
                        </Button>
                    </CardHeader>
                    <div className="divide-y divide-border">
                        {recentActivity.map((activity, index) => (
                           <div key={index} className="p-4 flex items-start gap-4">
                               <ActivityIcon type={activity.type} />
                               <div className="flex-1 text-sm">
                                   <p className="text-foreground">
                                        <span className={activity.type === 'SAFETY_ALERT' ? 'font-bold text-destructive' : 'font-semibold'}>{activity.actor}</span> {activity.action} {activity.trial && <Link href={`/${activity.trial}`} className="font-semibold text-primary hover:underline">{activity.trial}</Link>}
                                   </p>
                                   {activity.description && <p className="text-muted-foreground mt-1">{activity.description}</p>}
                                   <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(activity.timestamp)}</p>
                               </div>
                           </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="space-y-8">
                 <Card>
                    <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
                     <div className="p-4 text-center text-sm text-muted-foreground">
                         <p>You're all caught up!</p>
                     </div>
                 </Card>
                 <Card>
                    <CardHeader><CardTitle>Watching</CardTitle></CardHeader>
                     <div className="divide-y divide-border">
                         {recentTrials.slice(0,2).map(trial => (
                            <div key={trial.name} className="p-4 flex justify-between items-center hover:bg-secondary/50">
                                <div>
                                    <Link href={`/${trial.owner}/${trial.name}`} className="font-semibold text-foreground hover:text-primary hover:underline text-sm">{trial.owner}/{trial.name}</Link>
                                    <p className="text-xs text-muted-foreground">{trial.stars} stars</p>
                                </div>
                                 <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Watch</Button>
                            </div>
                         ))}
                     </div>
                 </Card>
                 <Card>
                     <CardHeader><CardTitle>Documentation</CardTitle></CardHeader>
                     <div className="p-4 space-y-2">
                        <Link href="/docs/quickstart" className="block text-sm text-primary hover:underline">Getting Started with Bastion</Link>
                        <Link href="/docs/protocol-as-code" className="block text-sm text-primary hover:underline">Protocol-as-Code Tutorial</Link>
                        <Link href="/docs/cli" className="block text-sm text-primary hover:underline">CLI Reference</Link>
                     </div>
                 </Card>
            </div>
        </div>
    </div>
  )
}
