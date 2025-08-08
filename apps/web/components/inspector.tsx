"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export type TraceEvent = { ts: number; type: string; detail?: string };
export type ToolTrace = { tool: string; t_ms?: number; phase?: string };

type InspectorProps = {
  events: TraceEvent[];
  toolTrace: ToolTrace[];
  runDuration: number | null;
  evidence: any[];
  onClear?: () => void;
};

const MAX_EVENTS = 24;
const MAX_TOOLS = 12;

export default function Inspector({ events, toolTrace, runDuration, evidence, onClear }: InspectorProps) {
  return (
    <aside className="hidden lg:flex flex-col max-h-full overflow-hidden border-l bg-background/40">
      <div className="px-4 py-3 border-b bg-background/80 backdrop-blur">
        <div className="text-sm font-semibold">Run Inspector</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full border bg-primary-100/40 text-foreground">Events: {events.length}</span>
          <span className="text-[10px] px-2 py-1 rounded-full border bg-accent-100/40 text-foreground">Tools: {Array.from(new Set(toolTrace.map(t=>t.tool))).length}</span>
          <span className="text-[10px] px-2 py-1 rounded-full border bg-collaboration-100/40 text-foreground">{runDuration!==null?`${(runDuration/1000).toFixed(1)}s`:'—'}</span>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {events.length > 0 && (
          <Card variant="bento" className="bg-primary-100 shadow-elevation-1">
            <CardHeader className="py-3 px-3"><CardTitle className="text-xs">Events</CardTitle></CardHeader>
            <CardContent className="px-3 pb-3">
              <ul className="text-xs space-y-1">
                {events.slice(-MAX_EVENTS).map((e,i)=> (
                  <li key={i} className="font-mono truncate">[{new Date(e.ts).toLocaleTimeString()}] {e.type}{e.detail?` — ${e.detail}`:''}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {toolTrace.length > 0 && (
          <Card variant="bento" className="bg-collaboration-100 shadow-elevation-1">
            <CardHeader className="py-3 px-3"><CardTitle className="text-xs">Tools</CardTitle></CardHeader>
            <CardContent className="px-3 pb-3">
              <ul className="text-xs space-y-2">
                {toolTrace.slice(-MAX_TOOLS).map((t,i)=> (
                  <li key={i} className="flex items-center justify-between gap-2 border-b last:border-b-0 pb-1">
                    <span className="font-mono truncate max-w-[120px]" title={t.tool}>{t.tool}</span>
                    <span className="text-muted-foreground">{t.phase || ''}</span>
                    <span className="text-muted-foreground">{Number.isFinite(t.t_ms)?t.t_ms:''}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {evidence.length > 0 && (
          <Card variant="bento" className="bg-accent-100 shadow-elevation-1">
            <CardHeader className="py-3 px-3"><CardTitle className="text-xs">Evidence</CardTitle></CardHeader>
            <CardContent className="px-3 pb-3">
              <ul className="text-xs space-y-2 max-h-56 overflow-auto">
                {evidence.slice(0, 12).map((e:any, i:number)=> (
                  <li key={i} className="border-b last:border-b-0 pb-1">
                    <div className="font-medium truncate" title={e.doc_id || ''}>{e.doc_id || 'Unknown source'}</div>
                    {e.raw_text && <div className="text-muted-foreground line-clamp-2">{e.raw_text}</div>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          {onClear && (
            <button className="rounded border px-2 py-1 text-xs" onClick={onClear}>Clear</button>
          )}
        </div>
      </div>
    </aside>
  );
}


