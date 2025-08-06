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
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="bg-primary-500 p-2.5 rounded-2xl border border-primary-600/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-4 h-4 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">Runix Hub</span>
            </Link>
          </div>

          {/* Center - Search and Current Pipeline */}
          <div className="flex-1 flex items-center justify-center space-x-6 max-w-2xl mx-8">
            <div className="hidden md:block">
              <Link href="/repo/mskcc/CTP-ABC123" className="flex items-center space-x-2 text-sm group bg-muted/80 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-all duration-200">
                <div className="w-2 h-2 bg-accent-500 rounded-full" title="Pipeline running" />
                <span className="font-mono text-muted-foreground group-hover:text-foreground transition-colors">
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-muted/80"
              >
                Dashboard
              </Link>
              <Link 
                href="/models" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-muted/80"
              >
                Models
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
                className="w-9 h-9 bg-primary-500 dark:bg-primary-600 rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold border border-primary-600/20 dark:border-primary-700/30 transition-all duration-200 ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
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