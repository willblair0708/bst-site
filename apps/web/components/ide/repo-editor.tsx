"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Save, FileText, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

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

export function RepoEditor({ repoId, path }: { repoId: string; path?: string }) {
  const [content, setContent] = useState("")
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(false)
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
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [repoId, path])

  const save = useCallback(async () => {
    if (!path) return
    setLoading(true)
    try {
      const res = await fetch(`/api/repo/file`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: repoId, path, content }) })
      await res.json().catch(() => ({}))
      setDirty(false)
    } finally {
      setLoading(false)
    }
  }, [repoId, path, content])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b bg-background/70">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4" />
          <div className="truncate max-w-[48vw] font-mono text-xs">{path || "Select a file"}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="rounded-xl" onClick={save} disabled={!dirty || loading || !path}>
            {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 pt-1">
        {path ? (
          <Editor
            height="100%"
            language={language as any}
            value={content}
            onChange={(v) => { setContent(v || ""); setDirty(true) }}
            options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }}
            theme="vs-light"
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Open a file from the Files tab
          </motion.div>
        )}
      </div>
    </div>
  )
}


