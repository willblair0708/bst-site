"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/global-search'
import { NotificationCenter } from '@/components/notifications'
import { ThemeToggle } from '@/components/theme-toggle'
import { Shield } from 'lucide-react'



const currentUser = {
  name: "Dr. Sarah Johnson",
  username: "sarah-johnson",
  email: "sarah.johnson@mskcc.org",
  avatar: null,
  role: "Principal Investigator",
  organization: "Memorial Sloan Kettering"
}

export function GitHubHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Pastel glow underlay */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-primary-100/60 via-accent-100/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl">
              <motion.div 
                className="relative bg-primary-500 p-2.5 rounded-2xl border border-primary-600/20 shadow-elevation-1"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="Runix Hub Home"
              >
                {/* sheen */}
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_60%_at_50%_-10%,rgba(255,255,255,0.7),transparent_60%)] opacity-40" />
                <Shield className="w-4 h-4 text-primary-foreground relative" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">Runix Hub</span>
            </Link>
          </div>

          {/* Center - Search and Current Pipeline */}
          <div className="flex-1 flex items-center justify-center space-x-6 max-w-2xl mx-8">
            <div className="hidden md:block">
              <Link href="/repo/mskcc/CTP-ABC123" className="flex items-center space-x-2 text-sm group bg-accent-100/70 px-3 py-1.5 rounded-full border border-accent-500/20 hover:bg-accent-100/90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" title="Pipeline running" />
                <span className="font-mono text-viz-purple-500 group-hover:text-foreground transition-colors">
                  mitochondrial-ros-sensor
                </span>
              </Link>
            </div>
            
            <div className="flex-1 max-w-md">
              <GlobalSearch />
            </div>
          </div>

          {/* Right side - Navigation and User */}
          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Dashboard
              </Link>
              <Link 
                href="/models" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Models
              </Link>
              <Link 
                href="/chat" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Chat
              </Link>
            </nav>



            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <NotificationCenter />

              {/* User avatar */}
              <motion.button 
                className="w-9 h-9 bg-primary-500 dark:bg-primary-600 rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold border border-primary-600/20 dark:border-primary-700/30 shadow-elevation-1 transition-all duration-200 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
                aria-label={`Account for ${currentUser.name}`}
              >
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </motion.button>
            </div>


          </div>
        </div>
      </div>
    </header>
  )
}