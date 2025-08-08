"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"

type Artifact = {
  name: string
  path: string
  type: 'csv' | 'txt' | 'unknown'
  preview?: string[][]
}

export function ArtifactsPanel({ artifacts }: { artifacts: Artifact[] }) {
  if (!artifacts.length) return (
    <div className="text-xs text-muted-foreground p-2">No artifacts yet. Run the protocol to generate outputs.</div>
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
            className="border rounded-lg p-2"
          >
            <div className="text-sm font-medium mb-1">{a.name}</div>
            {a.type === 'csv' && a.preview && (
              <div className="overflow-auto">
                <table className="w-full text-xs">
                  <tbody>
                    {a.preview.slice(0, 8).map((row, i) => (
                      <tr key={i} className="border-t">
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
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}


