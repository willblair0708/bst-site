"use client"

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { EASING } from '@/lib/motion/tokens'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Check if user has a theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-xl relative overflow-hidden border-0 focus:ring-0"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={!prefersReducedMotion ? { opacity: 0, rotate: -180, scale: 0.5 } : { opacity: 1 }}
            animate={!prefersReducedMotion ? { 
              opacity: 1, 
              rotate: 0, 
              scale: 1,
              color: "hsl(var(--muted-foreground))"
            } : { opacity: 1 }}
            exit={!prefersReducedMotion ? { opacity: 0, rotate: 180, scale: 0.5 } : { opacity: 0 }}
            whileHover={!prefersReducedMotion ? {
              color: "hsl(var(--foreground))",
              filter: "drop-shadow(0 0 8px hsl(var(--accent) / 0.4))",
              rotate: [0, -10, 10, 0]
            } : undefined}
            transition={{ duration: 0.3, ease: EASING.smooth }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={!prefersReducedMotion ? { opacity: 0, rotate: 180, scale: 0.5 } : { opacity: 1 }}
            animate={!prefersReducedMotion ? { 
              opacity: 1, 
              rotate: 0, 
              scale: 1,
              color: "hsl(var(--muted-foreground))"
            } : { opacity: 1 }}
            exit={!prefersReducedMotion ? { opacity: 0, rotate: -180, scale: 0.5 } : { opacity: 0 }}
            whileHover={!prefersReducedMotion ? {
              color: "hsl(var(--foreground))",
              filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.4))",
              rotate: [0, 15, -15, 0]
            } : undefined}
            transition={{ duration: 0.3, ease: EASING.smooth }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              animate={!prefersReducedMotion ? {
                rotate: [0, 360]
              } : undefined}
              transition={!prefersReducedMotion ? {
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              } : undefined}
            >
              <Sun className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}