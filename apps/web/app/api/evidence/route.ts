import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const defaultBase = process.env.RUNIX_BACKEND_BASE || 'http://localhost:8787';
  const auth = req.headers.get('authorization') || '';
  const url = new URL(req.url);
  const taskId = url.searchParams.get('task_id');
  const target = taskId ? `${defaultBase}/v1/evidence?task_id=${encodeURIComponent(taskId)}` : `${defaultBase}/v1/evidence`;
  const res = await fetch(target, {
    method: 'GET',
    headers: {
      ...(auth ? { 'Authorization': auth } : {}),
    },
  });
  const jsonRes = await res.json().catch(() => ({ error: 'Invalid backend response' }));
  return new Response(JSON.stringify(jsonRes), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}