"use client"

import React, { use } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  GitFork, 
  Download, 
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  FileText,
  Activity,
  GitBranch,
  Calendar,
  MapPin,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { DAGGraph } from '@/components/dag-graph'

const trialInfo = {
  id: "CTP-ABC123",
  title: "NSCLC Phase I Safety and Efficacy Trial",
  description: "A multicenter, open-label, dose-escalation phase I clinical trial evaluating the safety, tolerability, pharmacokinetics, and preliminary efficacy of XYZ-789 in patients with advanced non-small cell lung cancer.",
  status: "Active",
  phase: "Phase I",
  sponsor: "Oncology Research Institute",
  piName: "Dr. Sarah Johnson, MD",
  sites: 12,
  enrolled: 24,
  target: 36,
  startDate: "2024-01-15",
  estimatedCompletion: "2024-12-31",
  lastUpdated: "2024-01-20T10:30:00Z",
  stars: 23,
  watchers: 47,
  forks: 3
}

const recentActivity = [
  {
    type: "commit",
    message: "Update eligibility criteria for elderly patients",
    author: "Dr. Johnson",
    timestamp: "2 hours ago",
    icon: GitBranch
  },
  {
    type: "simulation",
    message: "Generated 50 new synthetic control twins",
    author: "System",
    timestamp: "4 hours ago", 
    icon: BarChart3
  },
  {
    type: "issue",
    message: "Amendment request: Add biomarker collection",
    author: "Dr. Chen",
    timestamp: "1 day ago",
    icon: AlertCircle
  }
]

const quickStats = [
  { label: "Protocol Version", value: "v2.1", icon: FileText },
  { label: "Sites Active", value: "12/12", icon: MapPin },
  { label: "Enrollment", value: "24/36", icon: Users },
  { label: "Power Analysis", value: "94.2%", icon: Target }
]

export default function RepositoryPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = use(params)
  
  return (
    <div className="min-h-screen bg-background">
      {/* Pipeline Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-display font-medium text-foreground">{repo}</h1>
                <div className="checksum-ribbon" data-hash="a1b2c3d4e5f6">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent font-mono text-xs">
                    ✓ Verified
                  </Badge>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  {owner}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">A multicenter, open-label, dose-escalation phase I clinical trial evaluating safety and efficacy</p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span className="font-mono">23</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4" />
                  <span className="font-mono">3</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span className="font-mono">47</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated 2 hours ago</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="font-medium">
                <Star className="w-4 h-4 mr-1" />
                Star
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                <GitFork className="w-4 h-4 mr-1" />
                Fork
              </Button>
              <Button size="sm" className="font-medium">
                <Download className="w-4 h-4 mr-1" />
                Clone
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* DAG Graph + Logs (Main Content) */}
          <div className="lg:col-span-3 space-y-6">
            {/* DAG Graph */}
            <DAGGraph 
              onNodeClick={(node) => console.log('Node clicked:', node)}
              onRunPipeline={() => console.log('Run pipeline')}
            />

            {/* Reproduce Log / Diff Pane */}
            <div className="bg-card border border-border rounded-2xl">
              <div className="border-b border-border p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-medium text-foreground">Pipeline Logs</h3>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Build
                    </Button>
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                      Provenance
                    </Button>
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                      SBOM
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                  <div className="text-accent">✓ [2024-01-20 14:30:42] Starting pipeline execution...</div>
                  <div className="text-foreground">[2024-01-20 14:30:43] Loading patient data (1,247 records)</div>
                  <div className="text-foreground">[2024-01-20 14:30:45] Data validation passed</div>
                  <div className="text-accent">✓ [2024-01-20 14:31:12] Data cleaning completed (2.3s)</div>
                  <div className="text-primary animate-pulse">⟳ [2024-01-20 14:31:15] Feature engineering in progress...</div>
                  <div className="text-muted-foreground">[2024-01-20 14:31:16] Computing biomarker correlations</div>
                  <div className="text-muted-foreground">[2024-01-20 14:31:18] Encoding categorical variables</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Versions */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-display font-medium text-foreground mb-4">Versions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-mono text-sm text-foreground">v2.1</div>
                    <div className="text-xs text-muted-foreground">Current</div>
                  </div>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                    ✓ Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-medium">
                  <div>
                    <div className="font-mono text-sm text-foreground">v2.0</div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    Draft
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contributors */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-display font-medium text-foreground mb-4">Contributors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-mono">
                    SJ
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Dr. Sarah Johnson</div>
                    <div className="text-xs text-muted-foreground">Principal Investigator</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent text-xs font-mono">
                    LC
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Dr. Lisa Chen</div>
                    <div className="text-xs text-muted-foreground">Data Scientist</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checksums */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-display font-medium text-foreground mb-4">Checksums</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Pipeline Hash</div>
                  <div className="font-mono text-sm text-foreground bg-muted/30 p-2 rounded">
                    a1b2c3d4e5f6g7h8
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Data Hash</div>
                  <div className="font-mono text-sm text-foreground bg-muted/30 p-2 rounded">
                    i9j0k1l2m3n4o5p6
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Environment Hash</div>
                  <div className="font-mono text-sm text-foreground bg-muted/30 p-2 rounded">
                    q7r8s9t0u1v2w3x4
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-display font-medium text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full justify-start font-medium">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}