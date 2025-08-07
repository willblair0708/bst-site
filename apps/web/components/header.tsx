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
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl">
              <motion.div 
                className="relative bg-primary-500 p-3 rounded-2xl border border-primary-600/20 shadow-elevation-1"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="Runix Hub Home"
              >
                {/* sheen */}
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_60%_at_50%_-10%,rgba(255,255,255,0.7),transparent_60%)] opacity-40" />
                <Shield className="w-5 h-5 text-primary-foreground relative" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">Runix Hub</span>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="flex-1 flex items-center justify-center mx-4 lg:mx-8">
            <div className="w-full max-w-2xl lg:max-w-3xl">
              <GlobalSearch />
            </div>
          </div>

          {/* Right side - Navigation and User */}
          <div className="flex items-center space-x-5">
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              <Link 
                href="/ide" 
                className="text-sm font-medium text-foreground px-4 py-2 rounded-full bg-primary-100 hover:bg-primary-100/80 border border-primary-100/60 shadow-elevation-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                IDE
              </Link>
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Dashboard
              </Link>
              <Link 
                href="/models" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Models
              </Link>
              <Link 
                href="/chat" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
                className="w-10 h-10 bg-primary-500 dark:bg-primary-600 rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold border border-primary-600/20 dark:border-primary-700/30 shadow-elevation-1 transition-all duration-200 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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