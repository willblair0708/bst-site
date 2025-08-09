"use client"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileBrowser } from './FileBrowser'
import { RunsTable } from './RunsTable'
import { ReadmeViewer } from './ReadmeViewer'
import { CommitHistory } from './CommitHistory'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Play, 
  GitBranch, 
  Settings, 
  Shield, 
  Users,
  Workflow,
  History,
  GitPullRequest,
  Star
} from 'lucide-react'

interface Props {
  slug: string
  readmeContent: string
  commits: any[]
  runCount: number
  issueCount?: number
  prCount?: number
}

export function RepoTabs({ 
  slug, 
  readmeContent, 
  commits, 
  runCount,
  issueCount = 0,
  prCount = 0
}: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-8 bg-primary-50/50 p-2 rounded-2xl border border-primary-200/30">
        <TabsTrigger 
          value="overview" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <FileText className="w-4 h-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="files" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <GitBranch className="w-4 h-4" />
          Files
        </TabsTrigger>
        <TabsTrigger 
          value="runs" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <Play className="w-4 h-4" />
          Runs
          <div className="bg-accent-100 text-accent-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
            {runCount}
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="workflows" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <Workflow className="w-4 h-4" />
          Workflows
        </TabsTrigger>
        <TabsTrigger 
          value="commits" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <History className="w-4 h-4" />
          Commits
        </TabsTrigger>
        <TabsTrigger 
          value="issues" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <Shield className="w-4 h-4" />
          Issues
          {issueCount > 0 && (
            <div className="bg-error-100 text-destructive-500 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {issueCount}
            </div>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="prs" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <GitPullRequest className="w-4 h-4" />
          PRs
          {prCount > 0 && (
            <div className="bg-viz-purple-100 text-viz-purple-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {prCount}
            </div>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-soft rounded-xl transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
          Settings
        </TabsTrigger>
      </TabsList>

      <div className="mt-8 p-6">
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 overflow-hidden">
                <ReadmeViewer content={readmeContent} />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-primary-100/40 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 overflow-hidden">
                <FileBrowser slug={slug} onFileSelect={setSelectedFile} />
              </div>
              <div className="bg-accent-100/40 backdrop-blur-sm rounded-2xl border border-accent-200/30 shadow-elevation-1 overflow-hidden">
                <CommitHistory commits={commits.slice(0, 3)} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-primary-100/40 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 overflow-hidden">
              <FileBrowser slug={slug} onFileSelect={setSelectedFile} />
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 overflow-hidden">
              <div className="bg-primary-50/50 px-6 py-4 border-b border-primary-200/30">
                <h3 className="font-display font-semibold text-primary-900 flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  {selectedFile ? selectedFile : 'Select a file to preview'}
                </h3>
              </div>
              <div className="p-6 text-muted-foreground">
                {selectedFile ? (
                  <div className="font-mono text-sm bg-primary-50/50 p-4 rounded-xl border border-primary-200/30">
                    File preview for {selectedFile} would go here...
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p>Click on a file in the tree to preview its contents.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="runs">
          <div className="bg-accent-100/40 backdrop-blur-sm rounded-2xl border border-accent-200/30 shadow-elevation-1 overflow-hidden">
            <RunsTable slug={slug} />
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <div className="bg-accent-100/40 backdrop-blur-sm rounded-2xl border border-accent-200/30 shadow-elevation-1 p-8">
            <h3 className="font-display font-semibold text-accent-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-500 rounded-xl flex items-center justify-center">
                🛠️
              </div>
              Workflows & DAG Visualization
            </h3>
            <div className="text-accent-700 bg-white/40 p-6 rounded-xl">
              Workflow definitions and interactive DAG visualization would go here...
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commits">
          <div className="bg-primary-100/40 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 overflow-hidden">
            <CommitHistory commits={commits} />
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <div className="bg-error-100/40 backdrop-blur-sm rounded-2xl border border-destructive-200/30 shadow-elevation-1 p-8">
            <h3 className="font-display font-semibold text-destructive-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-destructive-500 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              Issues & Safety Reports
            </h3>
            <div className="text-destructive-700 bg-white/40 p-6 rounded-xl">
              Issue tracking, safety reports, and protocol compliance would go here...
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prs">
          <div className="bg-collaboration-100/40 backdrop-blur-sm rounded-2xl border border-viz-purple-200/30 shadow-elevation-1 p-8">
            <h3 className="font-display font-semibold text-viz-purple-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-viz-purple-500 rounded-xl flex items-center justify-center">
                🤝
              </div>
              Pull Requests & Receipt Diffs
            </h3>
            <div className="text-viz-purple-700 bg-white/40 p-6 rounded-xl">
              Pull request management with receipt diffs and collaboration features would go here...
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-primary-100/40 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 p-8">
            <h3 className="font-display font-semibold text-primary-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              Repository Settings & Governance
            </h3>
            <div className="text-primary-700 bg-white/40 p-6 rounded-xl">
              Collaborators, secrets, policies, and governance settings would go here...
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
