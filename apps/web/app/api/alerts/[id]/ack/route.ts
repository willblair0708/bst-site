import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  return NextResponse.json({ ok: true, id, ack: true })
}


