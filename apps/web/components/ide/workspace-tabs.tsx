"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileExplorer } from "@/components/ide/file-explorer"
import { Search, GitBranch, Bot, Files } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function WorkspaceTabs({ repoId, onOpenFile }: { repoId: string; onOpenFile: (p: string) => void }) {
  return (
    <Tabs defaultValue="files" className="h-full flex flex-col">
      <TabsList className="grid grid-cols-4 rounded-xl m-2 h-9">
        <TabsTrigger value="files" aria-label="Files" className="p-0"><Files className="w-4 h-4" /></TabsTrigger>
        <TabsTrigger value="search" aria-label="Search" className="p-0"><Search className="w-4 h-4" /></TabsTrigger>
        <TabsTrigger value="branch" aria-label="Branch" className="p-0"><GitBranch className="w-4 h-4" /></TabsTrigger>
        <TabsTrigger value="agents" aria-label="Agents" className="p-0"><Bot className="w-4 h-4" /></TabsTrigger>
      </TabsList>

      <TabsContent value="files" className="flex-1 overflow-hidden">
        <FileExplorer repoId={repoId} onOpen={onOpenFile} />
      </TabsContent>

      <TabsContent value="search" className="flex-1 overflow-hidden">
        <RepoSearch repoId={repoId} onOpenFile={onOpenFile} />
      </TabsContent>

      <TabsContent value="branch" className="flex-1 overflow-hidden">
        <RepoBranches repoId={repoId} />
      </TabsContent>

      <TabsContent value="agents" className="flex-1 overflow-hidden">
        <div className="p-2 text-sm space-y-2">
          <div className="font-medium">Quick agents</div>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Scout: search literature on topic</li>
            <li>Scholar: write referenced section</li>
            <li>Analyst: generate notebook and run</li>
            <li>Critic: check contradictions</li>
          </ul>
        </div>
      </TabsContent>
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
  const search = React.useCallback(async (val: string) => {
    const res = await fetch(`/api/repo/search?repo=${encodeURIComponent(repoId)}&q=${encodeURIComponent(val)}`)
    const json = await res.json()
    setResults(json?.results || [])
  }, [repoId])
  return (
    <div className="p-2 space-y-2 h-full">
      <Input value={q} onChange={(e) => { setQ(e.target.value); search(e.target.value) }} placeholder="Search in repo…" className="rounded-xl" />
      <ScrollArea className="h-[calc(100%-48px)]">
        <div className="space-y-1">
          {results.map((r, idx) => (
            <button key={idx} className="w-full text-left px-2 py-1 rounded hover:bg-muted/50" onClick={() => onOpenFile(r.path)}>
              <div className="text-sm">{r.path}</div>
              {r.preview && <div className="text-xs text-muted-foreground truncate">{r.preview}</div>}
            </button>
          ))}
          {!results.length && <div className="text-xs text-muted-foreground p-2">Type to search files</div>}
        </div>
      </ScrollArea>
    </div>
  )
}


