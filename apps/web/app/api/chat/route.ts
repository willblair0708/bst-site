import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Proxy to Python backend to support agents and streaming
export async function POST(req: NextRequest) {
  const defaultBase = process.env.RUNIX_BACKEND_BASE || 'http://localhost:8787';
  const bodyText = await req.text();
  let json: any = {};
  try { json = JSON.parse(bodyText || '{}'); } catch {}
  const stream = !!json?.stream;
  const agent = (json?.agent || '').toString();
  const messages = Array.isArray(json?.messages) ? json.messages : [];
  const lastUser = [...messages].reverse().find((m: any) => m?.author === 'User' || m?.role === 'user');
  const query = (lastUser?.content || '').toString();
  const auth = req.headers.get('authorization') || '';
  // Route streaming to multi-agent endpoint only for DIRECTOR/AUTO/auto
  const wantsDirector = /^(director|auto)$/i.test(agent || '');
  const targetUrl = stream && wantsDirector
    ? `${defaultBase}/v1/tasks`
    : `${defaultBase}/chat`;

  const bodyToSend = stream && wantsDirector
    ? JSON.stringify({ agent: 'DIRECTOR', query, stream: true })
    : bodyText;

  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { 'Authorization': auth } : {}),
    },
    body: bodyToSend,
  });

  // passthrough streaming if SSE
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/event-stream')) {
    return new Response(res.body, {
      status: res.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  const jsonRes = await res.json().catch(() => ({ error: 'Invalid backend response' }));
  return new Response(JSON.stringify(jsonRes), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
