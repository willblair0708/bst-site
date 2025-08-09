"use client"

import React, { useEffect, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { TerminalConsole } from "@/components/ide/terminal-console"
import { QuickActions } from "@/components/ide/quick-actions"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Layers, Plus, X, Play, Download } from "lucide-react"
import { WorkspaceTabs } from "@/components/ide/workspace-tabs"
import { RepoEditor } from "@/components/ide/repo-editor"
import { AgentChat } from "@/components/ide/agent-chat"
import { ArtifactsPanel } from "@/components/ide/artifacts-panel"
import { EvidencePanel, EvidenceJob } from "@/components/ide/evidence-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DAGGraph } from "@/components/dag-graph"

function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue] as const
}

export function Shell({ repoId }: { repoId?: string }) {
  const repoKey = repoId || 'demo'
  const prefersReducedMotion = useReducedMotion()
  const [selectedPath, setSelectedPath] = React.useState<string | undefined>(undefined)
  const [artifacts, setArtifacts] = React.useState<any[]>([])
  const [jobs, setJobs] = React.useState<EvidenceJob[]>([])

  // Editor open tabs (paths)
  const [openFiles, setOpenFiles] = useLocalStorageState<string[]>(`ide:${repoKey}:openFiles`, [])
  const addOpenFile = React.useCallback((p: string) => {
    setOpenFiles((prev) => prev.includes(p) ? prev : [...prev, p])
    setSelectedPath(p)
  }, [setOpenFiles])
  const closeOpenFile = React.useCallback((p: string) => {
    setOpenFiles((prev) => prev.filter((x) => x !== p))
    setSelectedPath((cur) => (cur === p ? (openFiles.find((x) => x !== p) || undefined) : cur))
  }, [openFiles, setOpenFiles])

  // Pane sizes with persistence
  const [leftWidth, setLeftWidth] = useLocalStorageState<number>(`ide:${repoKey}:leftWidth`, 240)
  const [rightWidth, setRightWidth] = useLocalStorageState<number>(`ide:${repoKey}:rightWidth`, 360)
  const [bottomHeight, setBottomHeight] = useLocalStorageState<number>(`ide:${repoKey}:bottomHeight`, 160)

  const startHorizontalDrag = (side: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startLeft = leftWidth
    const startRight = rightWidth
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      if (side === 'left') {
        const w = Math.max(180, Math.min(560, startLeft + dx))
        setLeftWidth(w)
      } else {
        const w = Math.max(280, Math.min(560, startRight - dx))
        setRightWidth(w)
      }
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const resetGolden = () => { setLeftWidth(240); setRightWidth(360) }

  const startVerticalDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY
    const startH = bottomHeight
    const onMove = (ev: MouseEvent) => {
      const dy = ev.clientY - startY
      const h = Math.max(100, Math.min(480, startH - dy))
      setBottomHeight(h)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }

  // Right rail tabs persistence + keyboard toggle
  const [rightTab, setRightTab] = useLocalStorageState<'agents' | 'evidence' | 'provenance'>(`ide:${repoKey}:rightTab`, 'agents')
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ']' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setRightTab((t) => (t === 'agents' ? 'evidence' : t === 'evidence' ? 'provenance' : 'agents'))
      }
      if (e.key === '[' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setRightTab((t) => (t === 'provenance' ? 'evidence' : t === 'evidence' ? 'agents' : 'provenance'))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setRightTab])

  // Terminal tabs (basic)
  type TermTab = { id: string; label: string }
  const [termTabs, setTermTabs] = useLocalStorageState<TermTab[]>(`ide:${repoKey}:termTabs`, [{ id: 't1', label: 'Terminal 1' }])
  const [activeTerm, setActiveTerm] = useLocalStorageState<string>(`ide:${repoKey}:activeTerm`, 't1')
  const addTerm = () => {
    const id = `t${Date.now()}`
    setTermTabs((t) => [...t, { id, label: `Terminal ${t.length + 1}` }])
    setActiveTerm(id)
  }
  const closeTerm = (id: string) => {
    setTermTabs((t) => t.filter((x) => x.id !== id))
    setActiveTerm((cur) => (cur === id ? (termTabs.find((x) => x.id !== id)?.id || '') : cur))
  }

  const runProtocol = React.useCallback(async () => {
    await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoKey, cmd: 'python3 run_demo.py' }) })
    const cat = await fetch('/api/repo/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoKey, cmd: `cat artifact.csv` }) })
    const catJson = await cat.json()
    const rows = (catJson.stdout || '').trim().split('\n').map((r: string) => r.split(',').map((s: string) => s.trim()))
    if (rows.length) {
      const a = { name: 'artifact.csv', path: 'artifact.csv', type: 'csv' as const, preview: rows }
      setArtifacts([a])
      setJobs([{ id: String(Date.now()), name: 'Analyst · Notebook run', status: 'success', startedAt: new Date().toISOString(), durationSec: 6, costCents: 12, artifacts: [a] }])
    }
  }, [repoKey])

  // Secondary editor (open to side)
  const [secondaryPath, setSecondaryPath] = React.useState<string | undefined>(undefined)
  useEffect(() => {
    const onOpenSide = (e: any) => {
      const path = e?.detail?.path as string
      if (path) setSecondaryPath(path)
    }
    window.addEventListener('ide:openToSide' as any, onOpenSide)
    return () => window.removeEventListener('ide:openToSide' as any, onOpenSide)
  }, [])

  useEffect(() => {
    // ensure selectedPath becomes an open tab
    if (selectedPath) addOpenFile(selectedPath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPath])

  // Quick switch open editor tabs Cmd/Ctrl+1..9
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault()
        const idx = parseInt(e.key, 10) - 1
        const p = openFiles[idx]
        if (p) setSelectedPath(p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openFiles])

  const exportBundle = async () => {
    try {
      await fetch("/api/protocol", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "export", repo: repoKey }) })
    } catch {}
  }

  // Define grid columns via inline style so Tailwind JIT doesn't strip dynamic values
  const gridTemplateColumns = `${leftWidth}px minmax(0,1fr) ${rightWidth}px`

  const rowsStyle = { gridTemplateRows: `minmax(0,1fr) ${Math.max(100, bottomHeight || 160)}px` } as const

  return (
    <div className="h-full overflow-hidden">
      {/* Main column */}
      <div className="h-full flex flex-col min-w-0 overflow-hidden">
        {/* Center work area */}
        <div className="flex-1 grid" style={{ ...rowsStyle, height: '100%' }}>
          <div className={"grid gap-2 min-h-0 overflow-hidden p-2"} style={{ gridTemplateColumns }}>
            {/* Explorer */}
            <div className="relative rounded-2xl bg-card border border-border shadow-elevation-1 overflow-hidden min-h-0">
              <WorkspaceTabs repoId={repoKey} onOpenFile={(p) => setSelectedPath(p)} selectedPath={selectedPath} />
              {/* Resize handle */}
              <div
                role="separator"
                aria-orientation="vertical"
                onMouseDown={startHorizontalDrag('left')}
                onDoubleClick={resetGolden}
                className="absolute right-[-5px] top-0 h-full w-2 cursor-col-resize"
              >
                <div className="mx-auto h-full w-[2px] bg-transparent hover:bg-primary-200/80 transition-colors" />
              </div>
            </div>

            {/* Notebook/Protocol editor with open file tabs */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative rounded-2xl bg-primary-100/60 border border-border shadow-elevation-2 overflow-hidden min-h-0"
            >
              <div className="flex items-center gap-1 px-2 py-1 border-b bg-background/60 overflow-x-auto">
                {openFiles.length === 0 && (
                  <div className="text-[11px] text-muted-foreground">No file open</div>
                )}
                {openFiles.map((p) => (
                  <button 
                    key={p} 
                    onClick={() => setSelectedPath(p)} 
                    title={p} 
                    className={`group flex items-center gap-2 px-2 py-1 rounded-lg border text-xs mr-1 ${selectedPath === p ? 'bg-card border-border' : 'bg-background/40 border-transparent hover:border-border'}`}
                  >
                    <span className="relative truncate max-w-[22ch] font-mono">
                      <span>{p.split('/').pop()}</span>
                      {/* dirty dot via data attribute toggled on editor save/dirty */}
                      <span data-dirty-for={p} className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-amber-500 align-middle opacity-0" />
                    </span>
                    <X 
                      className="w-3 h-3 opacity-60 group-hover:opacity-100" 
                      onClick={(e) => { e.stopPropagation(); closeOpenFile(p) }} 
                    />
                  </button>
                ))}
              </div>
              <div className="flex h-[calc(100%-32px)]">
                <div className={secondaryPath ? 'w-1/2 min-w-0' : 'w-full min-w-0'}>
                  <RepoEditor
                    repoId={repoKey}
                    path={selectedPath}
                    onDirtyChange={(dirty) => {
                      if (!selectedPath) return
                      const el = document.querySelector(`span[data-dirty-for=\"${CSS.escape(selectedPath)}\"]`) as HTMLElement | null
                      if (el) el.style.opacity = dirty ? '1' : '0'
                    }}
                  />
                </div>
                {secondaryPath && (
                  <div className="w-1/2 min-w-0 border-l">
                    <RepoEditor repoId={repoKey} path={secondaryPath} />
                  </div>
                )}
              </div>
              {/* Resize handle */}
              <div
                role="separator"
                aria-orientation="vertical"
                onMouseDown={startHorizontalDrag('right')}
                onDoubleClick={resetGolden}
                className="absolute right-[-5px] top-0 h-full w-2 cursor-col-resize"
              >
                <div className="mx-auto h-full w-[2px] bg-transparent hover:bg-primary-200/80 transition-colors" />
              </div>
            </motion.div>

            {/* Right rail: Agents / Evidence tabs */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="flex flex-col min-h-0 overflow-hidden"
            >
              <Tabs value={rightTab} onValueChange={(v) => setRightTab(v as any)} className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between px-1 pb-2">
                  <TabsList className="h-8 rounded-lg">
                    <TabsTrigger value="agents" className="px-3">Agents</TabsTrigger>
                    <TabsTrigger value="evidence" className="px-3">
                      <div className="flex items-center gap-1"><Layers className="w-4 h-4 text-viz-purple-500" /><span>Evidence</span></div>
                    </TabsTrigger>
                    <TabsTrigger value="provenance" className="px-3">Provenance</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="rounded-lg" onClick={runProtocol} title="Run Protocol" aria-label="Run Protocol"><Play className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="rounded-lg" onClick={exportBundle} title="Export Bundle" aria-label="Export Bundle"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>

                <TabsContent value="agents" className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="rounded-xl bg-card border border-border flex-1">
                    <AgentChat />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="evidence" className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="rounded-xl bg-card border border-border p-2 flex-1">
                    <EvidencePanel jobs={jobs} />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="provenance" className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="rounded-xl bg-card border border-border p-2 flex-1">
                    <DAGGraph height={300} />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              {/* floating quick actions */}
              <div className="absolute right-2 bottom-2">
                <QuickActions />
              </div>
            </motion.div>
          </div>

          {/* Bottom: Terminal with tabs and resizer */}
          <div className="relative px-2 pb-2 min-h-0">
            <div
              role="separator"
              aria-orientation="horizontal"
              onMouseDown={startVerticalDrag}
              className="absolute -top-1 left-2 right-2 h-2 cursor-row-resize z-10"
            >
              <div className="mx-auto h-[2px] w-full bg-transparent hover:bg-primary-200/80 transition-colors rounded" />
            </div>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
              className="rounded-2xl bg-collaboration-100/70 border border-border shadow-elevation-2 overflow-hidden h-full flex flex-col"
            >
              <div className="flex items-center justify-between px-2 py-1 border-b bg-background/60">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {termTabs.map((t) => (
                    <button key={t.id} onClick={() => setActiveTerm(t.id)} onAuxClick={(e) => { if (e.button === 1) closeTerm(t.id) }} className={`group flex items-center gap-2 px-2 py-1 rounded-lg border text-xs ${activeTerm === t.id ? 'bg-card border-border' : 'bg-background/40 border-transparent hover:border-border'}`}>
                      <span>{t.label}</span>
                      {termTabs.length > 1 && (
                        <X className="w-3 h-3 opacity-60 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); closeTerm(t.id) }} />
                      )}
                    </button>
                  ))}
                  <button onClick={addTerm} className="ml-1 p-1 rounded-md hover:bg-muted/60" aria-label="New terminal"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="text-[10px] text-muted-foreground">Ctrl+L to clear · Middle-click tab to close</div>
              </div>
              <div className="flex-1 min-h-0">
                {/* Render one TerminalConsole for now; multi-terminals can be wired by id if needed */}
                <div className="h-full min-h-0">
                  <TerminalConsole repoId={repoKey} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

