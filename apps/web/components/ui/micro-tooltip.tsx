"use client"

import { ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MicroTooltipProps {
  children: ReactNode
  content: string
  delay?: number
  position?: "top" | "bottom" | "left" | "right"
}

export function MicroTooltip({ 
  children, 
  content, 
  delay = 0.5, 
  position = "top" 
}: MicroTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2", 
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === "top" ? 8 : -8 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          >
            <div className="bg-card/90 border border-primary-500/20 shadow-elevation-2 rounded-xl px-3 py-2 backdrop-blur-sm">
              <div className="text-xs font-medium text-foreground whitespace-nowrap">
                {content}
              </div>
              {/* Subtle arrow indicator */}
              <div className={`absolute w-2 h-2 bg-card border-l border-t border-primary-500/20 transform rotate-45 ${
                position === "top" ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2" :
                position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2" :
                position === "left" ? "left-full top-1/2 -translate-y-1/2 -translate-x-1/2" :
                "right-full top-1/2 -translate-y-1/2 translate-x-1/2"
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
