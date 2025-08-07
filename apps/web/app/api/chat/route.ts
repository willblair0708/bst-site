import { NextRequest } from 'next/server';

// Proxy to Python backend to support agents and streaming
export async function POST(req: NextRequest) {
  const backendUrl = process.env.RUNIX_BACKEND_URL || 'http://localhost:8787/chat';
  const body = await req.text();
  const auth = req.headers.get('authorization') || '';
  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { 'Authorization': auth } : {}),
    },
    body,
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

  const json = await res.json().catch(() => ({ error: 'Invalid backend response' }));
  return new Response(JSON.stringify(json), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
