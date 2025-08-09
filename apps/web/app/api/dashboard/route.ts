import { NextRequest, NextResponse } from 'next/server'

type Kpi = { key: string; value: number; unit?: string }
type MyWork = { repos: Array<{ slug: string; updatedAt: string }>; runs: Array<{ id: string; status: string; repo: string; eta_s?: number }> }
type QueueItem = { id: string; status: string; priority: 'low'|'normal'|'high'; cost_est_usd?: number; eta_s?: number }
type Review = { id: string; repo: string; status: 'open'|'approved'|'changes_requested'; diff: string }
type Alert = { id: string; type: 'safety'|'data'|'irb'|'policy'; severity: 'low'|'warn'|'high'|'critical'; msg: string; entity_ref?: string; ack?: boolean }
type Replication = { repo: string; status: 'requested'|'accepted'|'submitted'; due_at?: string }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const org = (searchParams.get('org') || 'vousso').toString()
    const role = (searchParams.get('role') || 'PI').toString()

    const now = new Date()
    const iso = (d: Date) => d.toISOString()

    const data: {
      header: { org: string; role: string }
      kpis: Kpi[]
      myWork: MyWork
      queue: QueueItem[]
      reviews: Review[]
      alerts: Alert[]
      replications: Replication[]
      activity: Array<{ id: string; who: string; what: string; repo?: string; at: string }>
    } = {
      header: { org, role },
      kpis: [
        { key: 'time_to_pilot', value: 39, unit: 'days' },
        { key: 'otp_runnable', value: 0.62 },
        { key: 'verified_runs', value: 148 },
        { key: 'irb_cycle', value: 21, unit: 'days' },
      ],
      myWork: {
        repos: [
          { slug: 'trial-aegis', updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60)) },
          { slug: 'onc-survival', updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 5)) },
          { slug: 'ukb-vitd', updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24)) },
        ],
        runs: [
          { id: 'r_running_1', status: 'running', repo: 'trial-aegis', eta_s: 320 },
          { id: 'r_failed_1', status: 'failed', repo: 'onc-survival' },
          { id: 'r_success_1', status: 'success', repo: 'ukb-vitd' },
        ],
      },
      queue: [
        { id: 'r_queued_1', status: 'queued', priority: 'high', cost_est_usd: 1.83, eta_s: 600 },
        { id: 'r_running_1', status: 'running', priority: 'normal', cost_est_usd: 0.42, eta_s: 320 },
      ],
      reviews: [
        { id: 'fr_123', repo: 'onc-survival', status: 'open', diff: 'metrics+env' },
        { id: 'fr_124', repo: 'ukb-vitd', status: 'open', diff: 'protocol+metrics' },
      ],
      alerts: [
        { id: 'a_1', type: 'safety', severity: 'high', msg: 'Export control flag on weights v1.2', entity_ref: 'weights:v1.2' },
        { id: 'a_2', type: 'irb', severity: 'warn', msg: 'IRB approval expiring in 7 days', entity_ref: 'irb:site-abc' },
      ],
      replications: [
        { repo: 'ukb-vitd', status: 'requested', due_at: iso(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3)) },
      ],
      activity: [
        { id: 'act_1', who: 'sarah', what: 'ran otp verify', repo: 'trial-aegis', at: iso(new Date(now.getTime() - 1000 * 60 * 10)) },
        { id: 'act_2', who: 'ben', what: 'opened review fr_123', repo: 'onc-survival', at: iso(new Date(now.getTime() - 1000 * 60 * 50)) },
      ],
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}