"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Save, FileText, Loader2, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function extToLang(path: string): string {
  const lower = path.toLowerCase()
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript"
  if (lower.endsWith(".js") || lower.endsWith(".jsx")) return "javascript"
  if (lower.endsWith(".py")) return "python"
  if (lower.endsWith(".json")) return "json"
  if (lower.endsWith(".md")) return "markdown"
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "yaml"
  if (lower.endsWith(".sh")) return "shell"
  return "plaintext"
}

export function RepoEditor({ repoId, path, onDirtyChange, onSaved }: { repoId: string; path?: string; onDirtyChange?: (dirty: boolean) => void; onSaved?: (ok: boolean) => void }) {
  const [content, setContent] = useState("")
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savePulse, setSavePulse] = useState<"idle" | "success" | "error">("idle")
  const [wrap, setWrap] = useState<'on' | 'off'>("on")
  const [showProblems, setShowProblems] = useState(false)
  const [markers, setMarkers] = useState<any[]>([])
  const [showPalette, setShowPalette] = useState(false)
  const [splitMarkdown, setSplitMarkdown] = useState(false)
  const editorRef = React.useRef<any>(null)
  const monacoRef = React.useRef<any>(null)
  const language = useMemo(() => (path ? extToLang(path) : "plaintext"), [path])

  useEffect(() => {
    const load = async () => {
      if (!path) return
      setLoading(true)
      try {
        const res = await fetch(`/api/repo/file?repo=${encodeURIComponent(repoId)}&path=${encodeURIComponent(path)}`)
        const json = await res.json()
        setContent(json?.content || "")
        setDirty(false)
        onDirtyChange?.(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [repoId, path])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save() }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setShowPalette(true) }
    }
    window.addEventListener('keydown', onKey)
    const onInsert = (ev: any) => {
      const text = ev?.detail?.text as string
      if (text && editorRef.current) {
        editorRef.current.trigger('keyboard', 'type', { text })
      }
    }
    window.addEventListener('ide:insert' as any, onInsert)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('ide:insert' as any, onInsert) }
  }, [content, path])

  const save = useCallback(async () => {
    if (!path) return
    setLoading(true)
    try {
      const res = await fetch(`/api/repo/file`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, path, content }) })
      const ok = res.ok
      await res.json().catch(() => ({}))
      setDirty(false)
      onDirtyChange?.(false)
      setSavePulse(ok ? 'success' : 'error')
      onSaved?.(ok)
      setTimeout(() => setSavePulse('idle'), 500)
    } catch {
      setSavePulse('error')
      onSaved?.(false)
      setTimeout(() => setSavePulse('idle'), 600)
    } finally {
      setLoading(false)
    }
  }, [repoId, path, content])

  const crumbs = useMemo(() => {
    if (!path) return [] as string[]
    const parts = path.split('/').filter(Boolean)
    return parts
  }, [path])

  const onMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    monacoRef.current = monaco
    // Diagnostics capture
    editor.onDidChangeModelDecorations(() => {
      const model = editor.getModel()
      if (!model || !monaco) return
      const m = monaco.editor.getModelMarkers({ resource: model.uri })
      setMarkers(m)
    })
    // Custom light theme
    try {
      monaco.editor.defineTheme('runix-light', {
        base: 'vs', inherit: true,
        rules: [
          { token: '', background: 'FAFAFA' },
        ],
        colors: {
          'editor.background': '#FAFAFA',
          'editorGutter.background': '#FFFFFF',
          'editorLineNumber.foreground': '#A0A0A0',
          'editorCursor.foreground': '#333333',
        }
      })
      monaco.editor.setTheme('runix-light')
    } catch {}
  }

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between p-2 border-b bg-background/70 ${savePulse === 'success' ? 'animate-pulse-success' : ''} ${savePulse === 'error' ? 'animate-shake-fail' : ''}`}>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <FileText className="w-4 h-4" />
          <div className="truncate max-w-[48vw] font-mono text-xs flex items-center gap-1">
            <span className="text-muted-foreground">{repoId}</span>
            {crumbs.map((c, i, arr) => {
              const seg = arr.slice(0, i + 1).join('/')
              return (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <button className="truncate max-w-[18ch] hover:underline" onClick={() => window.dispatchEvent(new CustomEvent('ide:reveal', { detail: { path: seg } }))}>
                    {c}
                  </button>
                </span>
              )
            })}
            {!path && <span className="text-muted-foreground">Open a file from the Files tab</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {language === 'markdown' && (
            <Button size="sm" variant="secondary" className="rounded-xl" onClick={() => setSplitMarkdown((s) => !s)}>
              {splitMarkdown ? 'Hide Preview' : 'Split Preview'}
            </Button>
          )}
          <Button size="sm" variant="outline" className="rounded-xl" onClick={save} disabled={!dirty || loading || !path}>
            {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 pt-1 flex">
        {path ? (
          <>
            <div className={splitMarkdown ? 'w-1/2 min-w-0' : 'w-full min-w-0'}>
              <Editor
                height="100%"
                language={language as any}
                value={content}
                onChange={(v) => { setContent(v || ""); if (!dirty) { setDirty(true); onDirtyChange?.(true) } }}
                options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: wrap }}
                theme="runix-light"
                onMount={onMount}
              />
            </div>
            {splitMarkdown && (
              <div className="w-1/2 border-l bg-card/40 overflow-auto p-3 prose prose-sm max-w-none">
                {/* @ts-ignore */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Open a file from the Files tab
          </motion.div>
        )}
      </div>
      {/* Problems drawer */}
      {showProblems && (
        <div className="border-t bg-background/70 p-2 text-xs max-h-32 overflow-auto">
          {markers.length ? markers.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-destructive">{m.severity}</span>
              <span>{m.message}</span>
              <span className="ml-auto text-muted-foreground">L{m.startLineNumber}:{m.startColumn}</span>
            </div>
          )) : <div className="text-muted-foreground">No problems</div>}
        </div>
      )}
      {/* Command palette */}
      {showPalette && (
        <div className="fixed inset-0 z-50" onClick={() => setShowPalette(false)}>
          <div className="mx-auto mt-24 w-full max-w-lg rounded-2xl border bg-popover shadow-elevation-4 p-2" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-medium px-2 pb-1">Command Palette</div>
            <div className="space-y-1 text-sm">
              <button className="w-full text-left px-2 py-1 rounded hover:bg-muted/50" onClick={() => { setWrap((w) => w === 'on' ? 'off' : 'on'); setShowPalette(false) }}>Toggle Word Wrap</button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-muted/50" onClick={() => { editorRef.current?.getAction('editor.foldAll')?.run(); setShowPalette(false) }}>Fold All</button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-muted/50" onClick={() => { editorRef.current?.getAction('editor.unfoldAll')?.run(); setShowPalette(false) }}>Unfold All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


