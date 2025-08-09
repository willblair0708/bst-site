import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest, { params }: { params: { slug: string } }) {
  // Stub publish endpoint: would validate artifacts, compute digests, write versions, and revalidate
  return NextResponse.json({ ok: true, slug: params.slug })
}


