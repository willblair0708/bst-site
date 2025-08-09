import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  // Stub publish endpoint: would validate artifacts, compute digests, write versions, and revalidate
  const { slug } = await params
  return NextResponse.json({ ok: true, slug })
}


