"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileExplorer } from "@/components/ide/file-explorer"
import { Search, GitBranch, Bot, Files } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WorkspaceTabs({ repoId, onOpenFile, selectedPath }: { repoId: string; onOpenFile: (p: string) => void; selectedPath?: string }) {
  const [tab, setTab] = React.useState("files")
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['1','2','3','4'].includes(e.key)) {
        e.preventDefault()
        setTab(['files','search','branch','agents'][parseInt(e.key)-1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const triggers = [
    { key: 'files', icon: Files, label: 'Files' },
    { key: 'search', icon: Search, label: 'Search' },
    { key: 'branch', icon: GitBranch, label: 'Branches' },
    { key: 'agents', icon: Bot, label: 'Agents' },
  ] as const

  return (
    <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col">
      <TabsList className="sticky top-0 z-10 relative grid grid-cols-4 rounded-xl m-2 mt-2 mb-2 h-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
        <TooltipProvider>
          {triggers.map(({ key, icon: Icon, label }) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <TabsTrigger value={key} aria-label={label} className="relative p-0 rounded-xl data-[state=active]:text-foreground">
                  {tab === key && (
                    <motion.span layoutId="ws-active" className="absolute inset-0 rounded-xl bg-primary-100 border border-primary-100/70" transition={{ type: 'spring', stiffness: 350, damping: 25 }} />
                  )}
                  <motion.span className="relative inline-flex items-center justify-center w-10 h-10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Icon className="w-4 h-4" />
                  </motion.span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TabsList>

      <AnimatePresence mode="wait">
        {tab === 'files' && (
          <TabsContent value="files" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <FileExplorer repoId={repoId} onOpen={onOpenFile} selectedPath={selectedPath} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tab === 'search' && (
          <TabsContent value="search" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <RepoSearch repoId={repoId} onOpenFile={onOpenFile} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tab === 'branch' && (
          <TabsContent value="branch" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <RepoBranches repoId={repoId} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tab === 'agents' && (
          <TabsContent value="agents" className="flex-1 overflow-hidden" forceMount>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="p-2 text-sm space-y-2">
              <div className="font-medium">Quick agents</div>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Scout: search literature on topic</li>
                <li>Scholar: write referenced section</li>
                <li>Analyst: generate notebook and run</li>
                <li>Critic: check contradictions</li>
              </ul>
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>
    </Tabs>
  )
}

function RepoBranches({ repoId }: { repoId: string }) {
  const [branches, setBranches] = React.useState<string[]>([])
  React.useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/repo/branches?repo=${encodeURIComponent(repoId)}`)
      const json = await res.json()
      setBranches(json?.branches || [])
    }
    load()
  }, [repoId])
  return (
    <div className="p-2 text-sm">
      <div className="mb-2 font-medium">Branches</div>
      <ul className="space-y-1">
        {branches.map((b) => (
          <li key={b} className="px-2 py-1 rounded hover:bg-muted/50 cursor-pointer">{b}</li>
        ))}
      </ul>
    </div>
  )
}

function RepoSearch({ repoId, onOpenFile }: { repoId: string; onOpenFile: (p: string) => void }) {
  const [q, setQ] = React.useState("")
  const [results, setResults] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [debounceId, setDebounceId] = React.useState<any>(null)
  const search = React.useCallback(async (val: string) => {
    if (!val) { setResults([]); return }
    setLoading(true)
    const res = await fetch(`/api/repo/search?repo=${encodeURIComponent(repoId)}&q=${encodeURIComponent(val)}`)
    const json = await res.json().catch(() => ({}))
    setResults(json?.results || [])
    setLoading(false)
  }, [repoId])
  return (
    <div className="p-2 space-y-2 h-full">
      <div className="relative">
        <Input
          value={q}
          onChange={(e) => {
            const val = e.target.value
            setQ(val)
            if (debounceId) clearTimeout(debounceId)
            setDebounceId(setTimeout(() => search(val), 180))
          }}
          placeholder="Search in repo…"
          className="rounded-xl pl-3 pr-10"
        />
        {loading && <motion.span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />}
      </div>
      <ScrollArea className="h-[calc(100%-48px)]">
        <div className="space-y-1">
          {results.map((r, idx) => (
            <button key={idx} className="w-full text-left px-2 py-2 rounded-xl border border-transparent hover:bg-muted/40 hover:border-border/80 transition-colors" onClick={() => onOpenFile(r.path)}>
              <div className="text-[13px] font-medium truncate">{r.path}</div>
              {r.preview && <div className="text-xs text-muted-foreground line-clamp-2">{r.preview}</div>}
            </button>
          ))}
          {!results.length && !q && <div className="text-xs text-muted-foreground p-2">Type to search files</div>}
          {!results.length && !!q && !loading && <div className="text-xs text-muted-foreground p-2">No results</div>}
        </div>
      </ScrollArea>
    </div>
  )
}


