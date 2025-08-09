import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const me = searchParams.has('me')
  const status = searchParams.get('status') || undefined
  const limit = Number(searchParams.get('limit') || 20)

  const runs = [
    { id: 'r_running_1', status: 'running', repo: 'trial-aegis', eta_s: 320 },
    { id: 'r_failed_1', status: 'failed', repo: 'onc-survival' },
    { id: 'r_queued_1', status: 'queued', repo: 'trial-aegis', eta_s: 600 },
  ]
  const filtered = runs.filter(r => !status || r.status === status).slice(0, limit)
  return NextResponse.json({ me, items: filtered })
}


