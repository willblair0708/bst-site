import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const assignee = searchParams.get('assignee') || undefined
  const status = searchParams.get('status') || 'open'
  const items = [
    { id: 'fr_123', repo: 'onc-survival', status: 'open', diff: 'metrics+env' },
    { id: 'fr_124', repo: 'ukb-vitd', status: 'open', diff: 'protocol+metrics' },
  ].filter(r => (!assignee || assignee === 'me') && r.status === status)
  return NextResponse.json({ items })
}


