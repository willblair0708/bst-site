import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json().catch(() => ({})) as { decision?: 'approve'|'changes_requested', note?: string }
  const decision = body.decision || 'approve'
  return NextResponse.json({ ok: true, review: { id, status: decision === 'approve' ? 'approved' : 'changes_requested' } })
}


