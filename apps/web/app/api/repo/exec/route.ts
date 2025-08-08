import { NextRequest } from 'next/server'

const defaultBase = process.env.RUNIX_BACKEND_BASE || 'http://localhost:8787'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const res = await fetch(`${defaultBase}/repo/exec`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return new Response(await res.text(), { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' } })
}


