"use client"

import React from 'react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimatedStatCard } from '@/components/ui/animated-stat-card'
import { ModelCard } from '@/components/ui/model-card'
import { 
  AlertTriangle, Beaker, Book, Bot, CheckCircle2, GitBranch, GitCommit, Github, GitPullRequest,
  LifeBuoy, MessageSquare, Plus, Scale, Search, Star, Users
} from 'lucide-react'
import type { DashboardAggregate } from '@/lib/dashboard'

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25,0.46,0.45,0.94] } } }

type Stat = { label: string; value: string; change: string; changeType: 'increase'|'alert'|'neutral'; icon: React.ElementType }

function kpisToStats(kpis: DashboardAggregate['kpis']): Stat[] {
  const map: Record<string, Stat> = {}
  for (const k of kpis) {
    if (k.key === 'time_to_pilot') map[k.key] = { label: 'Time to Pilot', value: `${k.value}${k.unit ? ' ' + k.unit : ''}`, change: '—', changeType: 'neutral', icon: Beaker }
    if (k.key === 'otp_runnable') map[k.key] = { label: '% Runnable OTPs', value: `${Math.round(k.value * 100)}%`, change: '—', changeType: 'increase', icon: CheckCircle2 }
    if (k.key === 'verified_runs') map[k.key] = { label: 'Verified Runs', value: `${k.value}`, change: '+', changeType: 'increase', icon: GitCommit }
    if (k.key === 'irb_cycle') map[k.key] = { label: 'IRB Cycle Time', value: `${k.value}${k.unit ? ' ' + k.unit : ''}`, change: '—', changeType: 'neutral', icon: AlertTriangle }
  }
  return Object.values(map)
}

export default function DashboardClient({ initial }: { initial: DashboardAggregate }) {
  const stats = kpisToStats(initial.kpis)

  return (
    <motion.div className="min-h-screen bg-background text-foreground" variants={containerVariants} initial="hidden" animate="visible">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
        <motion.div className="mb-10 rounded-2xl bg-primary-100 shadow-elevation-2 border border-primary-100/60 overflow-hidden" variants={itemVariants} whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 h-20 bg-gradient-to-b from-primary-100/50 via-accent-100/20 to-transparent" />
          <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 p-6 sm:p-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200/70 bg-white/50 text-xs font-semibold text-primary-700/90">
                <span>Dashboard</span>
              </div>
              <h1 className="mt-3 text-4xl lg:text-5xl font-display font-light tracking-tight text-foreground">Welcome back</h1>
              <p className="text-base lg:text-lg text-muted-foreground mt-2">Every claim runnable. Every result verifiable.</p>
            </div>
            <div className="flex items-center md:justify-end gap-2">
              <Button variant="outline" className="rounded-xl">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Run & Verify
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8 flex flex-wrap items-center gap-2">
          {['All', 'Runs', 'Reviews', 'Alerts'].map(label => (
            <button key={label} className="rounded-full px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm text-foreground border border-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors">
              {label}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const pastelBg = stat.changeType === 'alert' ? 'bg-[#FFD5DD] border-[#FFD5DD]/60' : stat.changeType === 'increase' ? 'bg-accent-100 border-accent-100/60' : 'bg-primary-100 border-primary-100/60'
                return (
                  <motion.div key={index} className={`rounded-2xl p-4 shadow-elevation-1 border ${pastelBg}`} whileTap={{ scale: 0.99, transition: { duration: 0.07, ease: 'easeOut' } }}>
                    <AnimatedStatCard label={stat.label} value={stat.value} growth={stat.change} index={index} tone={stat.changeType === 'alert' ? 'alert' : stat.changeType === 'increase' ? 'positive' : 'neutral'} />
                  </motion.div>
                )
              })}
            </div>

            <DashboardCard title="My Work" icon={Beaker} action={{ label: 'View All', href: '/explore' }} pillar="versioned">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Repositories</h3>
                  <ul className="space-y-2">
                    {initial.myWork.repos.map(r => (
                      <li key={r.slug} className="flex items-center justify-between text-sm">
                        <Link href={`/explore/repos?repo=${encodeURIComponent(r.slug)}`} className="text-foreground hover:text-primary">{r.slug}</Link>
                        <span className="text-muted-foreground text-xs">{new Date(r.updatedAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Runs</h3>
                  <ul className="space-y-2">
                    {initial.myWork.runs.map(run => (
                      <li key={run.id} className="flex items-center justify-between text-sm">
                        <Link href={`/runs/${run.id}`} className="text-foreground hover:text-primary">{run.repo}</Link>
                        <Badge variant={run.status === 'running' ? 'outline' : run.status === 'failed' ? 'destructive' : 'success'} className="ml-2 capitalize">{run.status}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Run Queue" icon={GitBranch} action={{ label: 'Runs', href: '/runs' }} pillar="versioned">
              <ul className="space-y-3">
                {initial.queue.map(q => (
                  <li key={q.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant={q.status === 'queued' ? 'outline' : 'secondary'} className="capitalize">{q.status}</Badge>
                      <span className="text-muted-foreground">{q.priority} priority</span>
                      {q.eta_s ? <span className="text-muted-foreground">ETA {Math.ceil(q.eta_s/60)}m</span> : null}
                      {q.cost_est_usd ? <span className="text-muted-foreground">${q.cost_est_usd?.toFixed(2)}</span> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/70" onClick={async () => { await fetch(`/api/runs/${q.id}/retry`, { method: 'POST' }) }}>Retry</button>
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="Reviews" icon={GitPullRequest} action={{ label: 'Open Reviews', href: '/pull-requests' }} pillar="collab">
              <ul className="space-y-3">
                {initial.reviews.map(r => (
                  <li key={r.id} className="flex items-center justify-between text-sm">
                    <div>
                      <Link href={`/pull-requests/${r.id}`} className="text-foreground hover:text-primary">{r.repo}</Link>
                      <span className="ml-2 text-muted-foreground">{r.diff}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs px-2 py-1 rounded-md bg-accent/60 hover:bg-accent" onClick={async () => { await fetch(`/api/reviews/${r.id}/decision`, { method: 'POST', body: JSON.stringify({ decision: 'approve' }) }) }}>Approve</button>
                      <button className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/70" onClick={async () => { await fetch(`/api/reviews/${r.id}/decision`, { method: 'POST', body: JSON.stringify({ decision: 'changes_requested' }) }) }}>Request changes</button>
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <DashboardCard title="Replication Feed" icon={Beaker} action={{ label: 'Replications', href: '/community/reproductions' }} pillar="collab">
              <ul className="space-y-3">
                {initial.replications.map((r, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{r.repo}</span>
                      <Badge variant="outline" className="ml-2 capitalize">{r.status}</Badge>
                      {r.due_at ? <span className="ml-2 text-muted-foreground">due {new Date(r.due_at).toLocaleDateString()}</span> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {r.status === 'requested' && (
                        <button className="text-xs px-2 py-1 rounded-md bg-accent/60 hover:bg-accent" onClick={async () => {/* accept mock */}}>Accept</button>
                      )}
                      <Link href={`/repo/${r.repo}`} className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/70">Open</Link>
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardCard>
            <DashboardCard title="Alerts" icon={AlertTriangle} action={{ label: 'All Alerts', href: '/safety' }} pillar="versioned">
              <ul className="space-y-3">
                {initial.alerts.map(a => (
                  <li key={a.id} className="flex items-center justify-between text-sm">
                    <div>
                      <Badge variant={a.severity === 'high' || a.severity === 'critical' ? 'destructive' : 'outline'} className="mr-2 capitalize">{a.severity}</Badge>
                      <span>{a.msg}</span>
                    </div>
                    <button className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/70" onClick={async () => { await fetch(`/api/alerts/${a.id}/ack`, { method: 'POST' }) }}>Acknowledge</button>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="Suggested Next Step" icon={Star} action={{ label: 'Explore', href: '/explore' }} pillar="models">
              <div className="space-y-4">
                {[{ name: 'ToxicityPredict', version: 'v1.2', description: 'Predict adverse event probability from patient data.', provider: 'OpenAI', Icon: Bot, stars: 128, forks: 12 }, { name: 'SurvivalRate', version: 'v2.0', description: 'Estimate patient survival rates', provider: 'Anthropic', Icon: Bot, stars: 72, forks: 3 }].map(model => (
                  <ModelCard key={model.name} model={model as any} variants={itemVariants} />
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Activity" icon={GitBranch} action={{ label: 'Timeline', href: '/dashboard' }} pillar="versioned">
              <ul className="space-y-4 relative pl-4 border-l border-border/70">
                {initial.activity.map(item => (
                  <li key={item.id} className="relative flex items-start gap-4">
                    <span className="absolute -left-[9px] mt-1 inline-block h-2 w-2 rounded-full bg-accent-500" />
                    <GitCommit className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 text-sm">
                      <p className="text-foreground"><span className="font-medium">{item.who}</span> {item.what} {item.repo ? `in ${item.repo}` : ''}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(item.at).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            <DashboardCard title="Learn & Contribute" icon={LifeBuoy} action={null} pillar="versioned">
              <div className="space-y-3">
                <ResourceLink icon={Book} title="Protocol-as-Code Docs" href="#" />
                <ResourceLink icon={Scale} title="Regulatory Guidelines" href="#" />
                <ResourceLink icon={Github} title="Contribute on GitHub" href="#" />
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function DashboardCard({ title, icon: Icon, action, children, pillar = 'versioned' }: { title: string, icon: React.ElementType, action: { label: string; href: string } | null, children: React.ReactNode, pillar?: 'versioned'|'models'|'collab' }) {
  const capClass = pillar === 'models' ? 'bg-accent-100 border border-accent-100/60' : pillar === 'collab' ? 'bg-[#EBD4FF] border border-[#EBD4FF]/60' : 'bg-primary-100 border border-primary-100/60'
  return (
    <motion.div className="bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80 border border-border rounded-3xl shadow-elevation-1" variants={itemVariants} whileHover={{ y: -2 }} whileTap={{ scale: 0.99, transition: { duration: 0.07, ease: 'easeOut' } }} transition={{ duration: 0.2 }}>
      <div className="p-5 border-b border-border/70 flex items-center justify-between rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${capClass}`}>
            <Icon className="w-4 h-4 text-foreground/80" />
          </div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
        </div>
        {action && (
          <Button variant="outline" size="sm" asChild className="rounded-xl">
            <Link href={action.href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl">{action.label}</Link>
          </Button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}

function ResourceLink({ icon: Icon, title, href }: { icon: React.ElementType, title: string, href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-foreground">{title}</span>
    </Link>
  )
}


