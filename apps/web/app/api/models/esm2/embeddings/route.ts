import { NextRequest } from 'next/server'

const defaultBase = process.env.RUNIX_BACKEND_BASE || 'http://localhost:8787'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const res = await fetch(`${defaultBase}/services/models/esm2/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const headers = new Headers({ 'Content-Type': res.headers.get('content-type') || 'application/json' })
  return new Response(res.body, { status: res.status, headers })
}


