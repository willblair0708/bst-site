import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { MissionMetrics, PillarStats, ProgramCard, ImpactCase, SafetyCard } from '@/lib/types'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Rocket, Users, FileText, BarChart3, CheckCircle2 } from 'lucide-react'
import ClientTracker from '@/components/mission/client-tracker'
import TrackedButtonLink from '@/components/mission/tracked-button'

// For development, use direct imports instead of fetch
import { mockMissionMetrics, mockPillarStats, mockPrograms, mockImpactCases, mockSafetyCard } from '@/lib/mock-data'

async function getMissionMetrics(): Promise<MissionMetrics> {
  // In development, return mock data directly
  if (process.env.NODE_ENV === 'development') {
    return mockMissionMetrics
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`
  const res = await fetch(`${baseUrl}/api/metrics/mission`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to load mission metrics')
  return res.json()
}

async function getPillarStats(): Promise<PillarStats> {
  if (process.env.NODE_ENV === 'development') {
    return mockPillarStats
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`
  const res = await fetch(`${baseUrl}/api/pillars/stats`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to load pillar stats')
  return res.json()
}

async function getPrograms(limit = 6): Promise<ProgramCard[]> {
  if (process.env.NODE_ENV === 'development') {
    return mockPrograms.slice(0, limit)
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`
  const res = await fetch(`${baseUrl}/api/programs?limit=${limit}`, { next: { revalidate: 120 } })
  if (!res.ok) throw new Error('Failed to load programs')
  return res.json()
}

async function getImpactCases(): Promise<ImpactCase[]> {
  if (process.env.NODE_ENV === 'development') {
    return mockImpactCases
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`
  const res = await fetch(`${baseUrl}/api/impact/cases`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Failed to load impact cases')
  return res.json()
}

async function getSafetyCard(): Promise<SafetyCard> {
  if (process.env.NODE_ENV === 'development') {
    return mockSafetyCard
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`
  const res = await fetch(`${baseUrl}/api/governance/safetyCard`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Failed to load safety card')
  return res.json()
}

export default async function MissionPage() {
  const [metrics, pillars, programs, cases, safety] = await Promise.all([
    getMissionMetrics(),
    getPillarStats(),
    getPrograms(6),
    getImpactCases(),
    getSafetyCard(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <ClientTracker page="/mission" />

      {/* Hero */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-card to-background">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6">Mission</Badge>
          <h1 className="text-5xl lg:text-6xl font-display font-light leading-tight mb-4">
            Build the world’s fastest proof engine for science.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Fork a standard package (OTP), run anywhere, mint a signed receipt, and move from lab to trial with policy already in the loop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TrackedButtonLink href="/trials" event="cta_reproduce_click" ariaLabel="Start a Reproduction">
              Start a Reproduction
            </TrackedButtonLink>
            <TrackedButtonLink href="mailto:hello@runixhub.com?subject=Propose%20a%20Program" variant="secondary" event="cta_propose_program_click" ariaLabel="Propose a Program">
              Propose a Program
            </TrackedButtonLink>
            <TrackedButtonLink href="#metrics" variant="outline" event="pillar_card_click" ariaLabel="See Live Metrics">
              See Live Metrics
            </TrackedButtonLink>
          </div>
        </div>
      </section>

      {/* KPI Strip */}
      <section id="metrics" className="py-10 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardDescription>Time-to-pilot (days)</CardDescription>
              <CardTitle className="text-4xl font-light">
                <AnimatedCounter from={0} to={metrics.timeToPilotDays} />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>% runnable OTPs</CardDescription>
              <CardTitle className="text-4xl font-light">
                <AnimatedCounter from={0} to={metrics.otpRunnablePct} suffix="%" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Verified reproductions (30d)</CardDescription>
              <CardTitle className="text-4xl font-light">
                <AnimatedCounter from={0} to={metrics.verifiedReproductions30d} />
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div className="max-w-6xl mx-auto mt-3 text-xs text-muted-foreground">
          Last updated: {new Date(metrics.asOf).toLocaleString()}
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition" aria-label="Policy">
            <CardHeader>
              <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" />
                <CardTitle>Policy</CardTitle>
              </div>
              <CardDescription>Central IRB, sandboxes, change-control.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">Templates adopted</div>
              <div className="text-3xl font-light"><AnimatedCounter from={0} to={pillars.policy.templatesAdopted} /></div>
              <div className="mt-6">
                <TrackedButtonLink href="/explore/templates" variant="outline" event="cta_policy_template_click" ariaLabel="Use templates">
                  Use templates
                </TrackedButtonLink>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition" aria-label="Collaboration">
            <CardHeader>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" />
                <CardTitle>Collaboration</CardTitle>
              </div>
              <CardDescription>OTP registry, badges, community RFCs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">Replications</div>
              <div className="text-3xl font-light"><AnimatedCounter from={0} to={pillars.collaboration.replications} /></div>
              <div className="mt-6">
                <TrackedButtonLink href="/explore" variant="outline" event="pillar_card_click" ariaLabel="Explore OTPs">
                  Explore OTPs
                </TrackedButtonLink>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition" aria-label="Research">
            <CardHeader>
              <div className="flex items-center gap-2"><Rocket className="w-5 h-5 text-primary" />
                <CardTitle>Research</CardTitle>
              </div>
              <CardDescription>Self-driving labs, digital twins, TrialOS.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">Active SDLs</div>
              <div className="text-3xl font-light"><AnimatedCounter from={0} to={pillars.research.activeSDLs} /></div>
              <div className="mt-6">
                <TrackedButtonLink href="/explore/templates" variant="outline" event="pillar_card_click" ariaLabel="Run a template">
                  Run a template
                </TrackedButtonLink>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition" aria-label="Innovation">
            <CardHeader>
              <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle>Innovation</CardTitle>
              </div>
              <CardDescription>Venture studio + Foundry, AMCs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">Spinouts</div>
              <div className="text-3xl font-light"><AnimatedCounter from={0} to={pillars.innovation.spinouts} /></div>
              <div className="mt-6">
                <TrackedButtonLink href="/organizations" variant="outline" event="pillar_card_click" ariaLabel="Partner with the studio">
                  Partner with the studio
                </TrackedButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-light mb-6">How it works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[{title: 'Fork an OTP', desc: 'Start from a standard package.'}, {title:'Run', desc: 'Local or k8s, same receipt.'}, {title:'Get a receipt', desc: 'Signed, DOI-ready provenance.'}, {title:'Deploy', desc: 'Testbed or trial, policy-ready.'}].map((s, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{i+1}. {s.title}</CardTitle>
                  <CardDescription>{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <TrackedButtonLink href="/ide?demo=hello-world" event="cta_reproduce_click" ariaLabel="Run the demo">
              Run the demo
            </TrackedButtonLink>
          </div>
        </div>
      </section>

      {/* Proof of impact */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-light mb-6">Proof of impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{c.title}</CardTitle>
                  <CardDescription>{c.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/evidence?receipt=${encodeURIComponent(c.receiptId)}`} className="inline-flex items-center gap-2 text-primary">
                    Open receipt <CheckCircle2 className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-light mb-6">Programs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((p) => (
              <Card key={p.slug}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{p.title}</CardTitle>
                  <CardDescription>{p.lead} • {p.status}</CardDescription>
                </CardHeader>
                <CardContent>
                  {p.nextMilestoneAt && (
                    <div className="text-sm text-muted-foreground mb-3">Next milestone: {new Date(p.nextMilestoneAt).toLocaleDateString()}</div>
                  )}
                  <div className="flex gap-3">
                    <TrackedButtonLink href="/trials" variant="outline" event="pillar_card_click" ariaLabel="Help replicate">
                      Help replicate
                    </TrackedButtonLink>
                    {p.otpSlug && (
                      <TrackedButtonLink href={`/models/${encodeURIComponent(p.otpSlug)}`} variant="outline" event="pillar_card_click" ariaLabel="Open OTP">
                        Open OTP
                      </TrackedButtonLink>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & governance */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <CardTitle>{safety.title}</CardTitle>
              </div>
              <CardDescription>{safety.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              {safety.policyUrl && (
                <TrackedButtonLink href={safety.policyUrl} variant="outline" event="pillar_card_click" ariaLabel="Read full policy">
                  Read full policy
                </TrackedButtonLink>
              )}
              {safety.incidentReportUrl && (
                <TrackedButtonLink href={safety.incidentReportUrl} variant="outline" event="pillar_card_click" ariaLabel="Report an incident">
                  Report an incident
                </TrackedButtonLink>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Get involved */}
      <section className="py-16 px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-light mb-6">Get involved</h2>
          <Tabs defaultValue="scientist">
            <TabsList>
              <TabsTrigger value="scientist">Scientist</TabsTrigger>
              <TabsTrigger value="clinician">Clinician/PI</TabsTrigger>
              <TabsTrigger value="regulator">Regulator</TabsTrigger>
              <TabsTrigger value="funder">Funder</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
            </TabsList>
            <TabsContent value="scientist" className="mt-4">
              <TrackedButtonLink href="/files" event="pillar_card_click" ariaLabel="Import dataset">Import dataset</TrackedButtonLink>
            </TabsContent>
            <TabsContent value="clinician" className="mt-4">
              <TrackedButtonLink href="/safety" event="pillar_card_click" ariaLabel="Request sIRB onboarding">Request sIRB onboarding</TrackedButtonLink>
            </TabsContent>
            <TabsContent value="regulator" className="mt-4">
              <TrackedButtonLink href="/policy" event="pillar_card_click" ariaLabel="AMC brief">AMC brief</TrackedButtonLink>
            </TabsContent>
            <TabsContent value="funder" className="mt-4">
              <TrackedButtonLink href="/projects" event="pillar_card_click" ariaLabel="Co-fund a program">Co-fund a program</TrackedButtonLink>
            </TabsContent>
            <TabsContent value="student" className="mt-4">
              <TrackedButtonLink href="/ide" event="pillar_card_click" ariaLabel="Open OTP in IDE">Open OTP in IDE</TrackedButtonLink>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-light mb-6">FAQ</h2>
          <div className="space-y-4">
            {[{
              q: 'What is an OTP?', a: 'A standard, runnable package bundling protocol, code, data pointers, and provenance.'
            }, {
              q: 'How do receipts work?', a: 'Every run mints a signed receipt with runtime hashes; they are linkable to publications.'
            }, {
              q: 'Where do I start?', a: 'Open the IDE and run the demo OTP; then fork a template from Explore.'
            }, {
              q: 'How “live” are the metrics?', a: 'Server-rendered with periodic refresh; each stat shows its last-updated time.'
            }, {
              q: 'Is it safe to use patient data?', a: 'We provide export-control tiers and IRB templates; see Safety & Governance.'
            }, {
              q: 'Can programs be co-funded?', a: 'Yes; see Programs or email us to propose a program.'
            }].map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base font-medium">{item.q}</CardTitle>
                  <CardDescription>{item.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Updates CTA */}
      <section className="py-16 px-6 lg:px-8 bg-card">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-display font-light mb-3">Get updates</h2>
          <p className="text-muted-foreground mb-6">Join the newsletter and watch the proof engine ship.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="https://github.com/runix-science" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary">
              GitHub releases <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/api/updates.atom" className="inline-flex items-center gap-2 text-primary">
              Atom feed <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}