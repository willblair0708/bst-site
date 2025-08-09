import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  // Accept retry and return a mocked updated run
  return NextResponse.json({ ok: true, run: { id, status: 'queued', priority: 'normal' } })
}


