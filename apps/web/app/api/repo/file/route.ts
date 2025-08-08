import { NextRequest, NextResponse } from 'next/server'
const defaultBase = process.env.RUNIX_BACKEND_BASE || 'http://localhost:8787'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const repo = searchParams.get('repo') || 'demo'
  const file = searchParams.get('path') || ''
  const target = `${defaultBase}/repo/file?repo=${encodeURIComponent(repo)}&path_q=${encodeURIComponent(file)}`
  const res = await fetch(target)
  return new Response(res.body, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' } })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const res = await fetch(`${defaultBase}/repo/file`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return new Response(await res.text(), { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' } })
}


