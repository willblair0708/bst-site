import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const org = searchParams.get('org') || 'vousso'
  const severityGte = searchParams.get('severity') || 'warn'
  const rank: Record<string, number> = { low: 0, warn: 1, high: 2, critical: 3 }
  const threshold = rank[severityGte] ?? 1
  const items = [
    { id: 'a_1', type: 'safety', severity: 'high', msg: 'Export control flag on weights v1.2', entity_ref: 'weights:v1.2' },
    { id: 'a_2', type: 'irb', severity: 'warn', msg: 'IRB approval expiring in 7 days', entity_ref: 'irb:site-abc' },
  ].filter(a => rank[a.severity] >= threshold)
  return NextResponse.json({ org, items })
}


