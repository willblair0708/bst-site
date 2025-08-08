import { NextRequest } from 'next/server'

const defaultBase = process.env.RUNIX_BACKEND_BASE || 'http://localhost:8787'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const repo = searchParams.get('repo') || 'demo'
  const res = await fetch(`${defaultBase}/repo/branches?repo=${encodeURIComponent(repo)}`)
  return new Response(res.body, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' } })
}


