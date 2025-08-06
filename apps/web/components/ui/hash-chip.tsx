"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MOTION } from "@/lib/motion/tokens"

interface HashChipProps {
  hash: string
  className?: string
  showToast?: (message: string) => void
}

export function HashChip({ hash, className, showToast }: HashChipProps) {
  const [copied, setCopied] = useState(false)

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      showToast?.("Hash copied to clipboard!")
      
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      showToast?.("Failed to copy hash")
    }
  }

  return (
    <motion.button
      onClick={copyHash}
      className={cn(
        // Design.mdc v0.5 Hash Chip - mono, copy-toast, rounded-full
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-primary-100 border border-primary-500/20",
        "font-mono text-sm text-primary-500",
        "transition-all duration-150",
        "hover:bg-primary-100/80 hover:border-primary-500/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "min-h-[24px]", // EAA compliance
        className
      )}
      whileTap={{ scale: 0.98 }}
      transition={MOTION.snap}
    >
      <span className="font-mono text-xs font-medium">
        {hash}
      </span>
      
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: copied ? 1.1 : 1 }}
        transition={{ duration: 0.15 }}
      >
        {copied ? (
          <Check className="w-3 h-3 text-accent-500" />
        ) : (
          <Copy className="w-3 h-3 text-primary-500 opacity-60 hover:opacity-100 transition-opacity" />
        )}
      </motion.div>
    </motion.button>
  )
}
