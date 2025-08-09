'use client'
import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  GitFork, 
  Eye, 
  GitBranch,
  Calendar,
  Shield,
  Users,
  Code,
  Download,
  Play,
  Settings,
  Activity,
  Hash,
  Zap,
  CheckCircle2,
  FlaskConical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BranchSelector } from '@/components/repos/BranchSelector'
import { RepoActions } from '@/components/repos/RepoActions'
import { RepoTabs } from '@/components/repos/RepoTabs'
import { trackEvent } from '@/lib/analytics'

async function getRepoData(owner: string, name: string) {
  const { 
    getRepoDetail, 
    mockReadmeContent, 
    mockCommits, 
    mockContributors, 
    mockBranches, 
    mockTags,
    mockRuns 
  } = await import('@/lib/mock-data')
  
  return {
    detail: getRepoDetail(owner, name),
    readme: mockReadmeContent,
    commits: mockCommits,
    contributors: mockContributors,
    branches: mockBranches,
    tags: mockTags,
    runs: mockRuns
  }
}

export default function RepoDetailPage({ params }: { params: Promise<{ owner: string; name: string }> }) {
  const resolvedParams = use(params)
  const [data, setData] = useState<any>(null)
  const [currentBranch, setCurrentBranch] = useState('main')
  const slug = `${resolvedParams.owner}/${resolvedParams.name}`

  useEffect(() => {
    getRepoData(resolvedParams.owner, resolvedParams.name).then(setData)
  }, [resolvedParams.owner, resolvedParams.name])

  if (!data) {
    return <div className="p-6">Loading...</div>
  }

  const { detail, readme, commits, contributors, branches, tags, runs } = data
  const repo = detail.repo

  const handleReproduce = async () => {
    trackEvent('cta_reproduce_click', { slug })
    await fetch(`/api/repos/${slug}/runs`, { 
      method: 'POST', 
      body: JSON.stringify({ inputs: detail.otp?.baseline }) 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-background to-accent-50/20">
      {/* Hero Pastel Bento Header */}
      <div className="bg-primary-100/50 backdrop-blur-sm border-b border-primary-200/30 shadow-elevation-2">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Pillar Declaration: 🗂️ Versioned Knowledge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-soft">
              🗂️
            </div>
            <div>
              <div className="text-xs font-medium text-primary-600 uppercase tracking-wider">Versioned Knowledge</div>
              <div className="text-sm text-muted-foreground">Every claim runnable. Every result verifiable.</div>
            </div>
          </div>

          {/* Repository Identity */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {repo.owner.avatarUrl && (
                <div className="relative">
                  <Image 
                    src={repo.owner.avatarUrl} 
                    alt={repo.owner.handle} 
                    width={48} 
                    height={48} 
                    className="rounded-2xl border-2 border-white shadow-soft" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link href={`/repos?owner=${repo.owner.handle}`} className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                    {repo.owner.handle}
                  </Link>
                  <span className="text-muted-foreground">/</span>
                  <h1 className="text-2xl font-display font-semibold text-foreground">{repo.name}</h1>
                </div>
                <p className="text-muted-foreground mb-3 max-w-2xl">{repo.shortDesc}</p>
                
                {/* Enhanced Verification Status */}
                <div className="flex items-center gap-3">
                  {repo.badges.runnable && (
                    <div className="soft-ui bg-accent-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105">
                      <CheckCircle2 className="w-4 h-4" />
                      Runnable
                    </div>
                  )}
                  <div className="soft-ui bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105">
                    <Shield className="w-4 h-4" />
                    Verified {repo.badges.verifiedCount}
                  </div>
                  {repo.badges.irbReady && (
                    <div className="soft-ui bg-viz-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105">
                      <Users className="w-4 h-4" />
                      IRB-ready
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex items-center gap-3">
              <Button 
                size="lg" 
                onClick={handleReproduce}
                className="soft-ui bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-500 rounded-2xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
              >
                <FlaskConical className="w-5 h-5 mr-2" />
                Reproduce & Verify
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="soft-ui border-primary-300/50 bg-white/80 hover:bg-primary-50 rounded-2xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
              >
                <Code className="w-5 h-5 mr-2" />
                Open in IDE
              </Button>
            </div>
          </div>

          {/* Repository Metrics Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-primary-200/30 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">{repo.stats.runs30d}</div>
                  <div className="text-xs text-muted-foreground">Stars</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-accent-200/30 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-100 rounded-xl flex items-center justify-center">
                  <GitFork className="w-4 h-4 text-accent-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">{repo.stats.replications}</div>
                  <div className="text-xs text-muted-foreground">Forks</div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-viz-purple-200/30 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-viz-purple-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-4 h-4 text-viz-purple-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">47</div>
                  <div className="text-xs text-muted-foreground">Watching</div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-primary-200/30 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">Updated</div>
                  <div className="text-xs text-muted-foreground">{new Date(repo.stats.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Branch Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BranchSelector
                branches={branches}
                tags={tags}
                currentBranch={currentBranch}
                onBranchChange={setCurrentBranch}
              />
              <div className="bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 border border-primary-200/30 shadow-elevation-1">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                    <code className="font-mono font-medium text-primary-600">{commits[0]?.sha.slice(0, 7)}</code>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{commits.length} commits</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="rounded-xl">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="ghost" className="rounded-xl">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Pastel Bento Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-primary-200/30 shadow-elevation-2 overflow-hidden">
              <RepoTabs
                slug={slug}
                readmeContent={readme}
                commits={commits}
                runCount={runs.length}
                issueCount={7}
                prCount={3}
              />
            </div>
          </div>

          {/* Enhanced Sidebar with Pastel Bento Tiles */}
          <div className="space-y-6">
            {/* About - Pastel Bento Tile */}
            <div className="bg-primary-100/60 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 p-6 hover:shadow-elevation-2 transition-all duration-200">
              <h3 className="font-display font-semibold text-primary-900 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-primary-500 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-3 h-3 text-white" />
                </div>
                About
              </h3>
              <p className="text-sm text-primary-700 mb-4 leading-relaxed">{repo.shortDesc}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/50 rounded-lg flex items-center justify-center">
                    <GitBranch className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <span className="text-primary-700 font-medium">{repo.domain.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/50 rounded-lg flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <span className="text-primary-700 font-medium">{repo.license}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/50 rounded-lg flex items-center justify-center">
                    <Code className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <span className="text-primary-700 font-medium">{repo.language}</span>
                </div>
              </div>
            </div>

            {/* Contributors - Collaboration Pastel Tile */}
            <div className="bg-collaboration-100/60 backdrop-blur-sm rounded-2xl border border-viz-purple-200/30 shadow-elevation-1 p-6 hover:shadow-elevation-2 transition-all duration-200">
              <h3 className="font-display font-semibold text-viz-purple-900 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-viz-purple-500 rounded-lg flex items-center justify-center">
                  🤝
                </div>
                Contributors
              </h3>
              <div className="space-y-4">
                {contributors.slice(0, 3).map((contributor: any) => (
                  <div key={contributor.id} className="flex items-center gap-3 p-3 bg-white/40 rounded-xl transition-all duration-200 hover:bg-white/60">
                    <Image
                      src={contributor.avatar}
                      alt={contributor.name}
                      width={32}
                      height={32}
                      className="rounded-xl border-2 border-white shadow-soft"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-viz-purple-900 truncate">{contributor.name}</div>
                      <div className="text-xs text-viz-purple-700">{contributor.role}</div>
                    </div>
                    <div className="bg-viz-purple-500/20 px-2 py-1 rounded-lg">
                      <div className="text-xs font-medium text-viz-purple-700">
                        {contributor.commits}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full mt-3 text-viz-purple-700 hover:bg-viz-purple-500/20 rounded-xl">
                  View all contributors
                </Button>
              </div>
            </div>

            {/* Languages - Accent Pastel Tile */}
            <div className="bg-accent-100/60 backdrop-blur-sm rounded-2xl border border-accent-200/30 shadow-elevation-1 p-6 hover:shadow-elevation-2 transition-all duration-200">
              <h3 className="font-display font-semibold text-accent-900 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-accent-500 rounded-lg flex items-center justify-center">
                  🛠️
                </div>
                Languages
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-soft"></div>
                    <span className="text-sm font-medium text-accent-900">Python</span>
                  </div>
                  <span className="text-sm font-semibold text-accent-700">78.2%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-soft"></div>
                    <span className="text-sm font-medium text-accent-900">YAML</span>
                  </div>
                  <span className="text-sm font-semibold text-accent-700">15.4%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-soft"></div>
                    <span className="text-sm font-medium text-accent-900">Markdown</span>
                  </div>
                  <span className="text-sm font-semibold text-accent-700">6.4%</span>
                </div>
              </div>
            </div>

            {/* Releases - Primary Pastel Tile */}
            <div className="bg-primary-100/60 backdrop-blur-sm rounded-2xl border border-primary-200/30 shadow-elevation-1 p-6 hover:shadow-elevation-2 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-primary-900 flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  Releases
                </h3>
                <div className="bg-primary-500/20 px-2 py-1 rounded-lg">
                  <span className="text-xs font-semibold text-primary-700">3</span>
                </div>
              </div>
              <div className="space-y-3">
                {tags.slice(0, 2).map((tag: any) => (
                  <div key={tag.name} className="flex items-center justify-between p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-all duration-200">
                    <div>
                      <div className="text-sm font-semibold text-primary-900">{tag.name}</div>
                      <div className="text-xs text-primary-700">
                        {new Date(tag.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary-700 hover:bg-primary-500/20 rounded-lg">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full mt-3 text-primary-700 hover:bg-primary-500/20 rounded-xl">
                  View all releases
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


