import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const body = await request.json().catch(() => ({}))
  // In a real implementation, enqueue an eval run and return its ID
  const runId = `run_${Date.now()}`
  return NextResponse.json({ ok: true, slug: params.slug, runId, request: body })
}


