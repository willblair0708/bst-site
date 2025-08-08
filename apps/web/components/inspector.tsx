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
    <aside className="hidden lg:flex flex-col max-h-full overflow-hidden border-l border-border/20 bg-background/60 backdrop-blur-xl">
      {/* Simple Header */}
      <div className="px-4 py-4 border-b border-border/20">
        <h2 className="font-medium text-foreground mb-3">Inspector</h2>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-muted-foreground">Events</div>
            <div className="font-medium text-foreground">{events.length}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Tools</div>
            <div className="font-medium text-foreground">{Array.from(new Set(toolTrace.map(t=>t.tool))).length}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Time</div>
            <div className="font-medium text-foreground">{runDuration!==null?`${(runDuration/1000).toFixed(1)}s`:'—'}</div>
          </div>
        </div>
      </div>
      
      {/* Simple Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Events */}
        {events.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Events</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {events.slice(-MAX_EVENTS).map((e,i)=> (
                <div key={i} className="text-xs text-muted-foreground font-mono">
                  {new Date(e.ts).toLocaleTimeString()} {e.type}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {toolTrace.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Tools</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {toolTrace.slice(-MAX_TOOLS).map((t,i)=> (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-foreground truncate" title={t.tool}>
                    {t.tool}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {Number.isFinite(t.t_ms) ? `${t.t_ms}ms` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence */}
        {evidence.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Evidence</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {evidence.slice(0, 12).map((e:any, i:number)=> (
                <div key={i} className="text-xs">
                  <div className="font-medium text-foreground truncate" title={e.doc_id || ''}>
                    {e.doc_id || 'Unknown'}
                  </div>
                  {e.raw_text && (
                    <div className="text-muted-foreground line-clamp-2 mt-1">
                      {e.raw_text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear Action */}
        {onClear && (
          <div className="pt-4 border-t border-border/20">
            <button 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClear}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}


