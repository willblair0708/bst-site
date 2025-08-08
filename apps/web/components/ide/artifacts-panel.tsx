"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, ExternalLink, FileSpreadsheet, GitBranch, Hash } from "lucide-react"
import Sparkline from "@/components/ui/sparkline"

type Artifact = {
  name: string
  path: string
  type: 'csv' | 'txt' | 'unknown'
  preview?: string[][]
}

export function ArtifactsPanel({ artifacts }: { artifacts: Artifact[] }) {
  if (!artifacts.length) return (
    <div className="text-xs text-muted-foreground p-3 rounded-xl border bg-background/60">No artifacts yet. Run the protocol to generate outputs.</div>
  )
  return (
    <AnimatePresence>
      <div className="space-y-3">
        {artifacts.map((a) => (
          <motion.div
            key={a.path}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border p-2 bg-background/70"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileSpreadsheet className="w-4 h-4 text-primary-600" />
                <div className="truncate text-sm font-medium">{a.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded-md hover:bg-muted/60" aria-label="Open"><ExternalLink className="w-4 h-4" /></button>
                <button className="p-1 rounded-md hover:bg-muted/60" aria-label="Download"><Download className="w-4 h-4" /></button>
              </div>
            </div>
            {a.type === 'csv' && a.preview && (
              <div className="overflow-auto rounded-lg border bg-card/40">
                <table className="w-full text-xs">
                  <tbody>
                    {a.preview.slice(0, 8).map((row, i) => (
                      <tr key={i} className="border-t/50">
                        {row.slice(0, 6).map((cell, j) => (
                          <td key={j} className="px-2 py-1 whitespace-nowrap text-muted-foreground">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(!a.preview || a.type !== 'csv') && (
              <div className="text-xs text-muted-foreground">{a.path}</div>
            )}

            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <GitBranch className="w-3 h-3" /> main
                <span className="mx-2">·</span>
                <Hash className="w-3 h-3" /> 3f2c9a
              </div>
              <Sparkline data={[1,4,2,5,3,6,4,5]} width={60} height={18} />
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}


