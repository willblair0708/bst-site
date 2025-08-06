"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/global-search'
import { NotificationCenter } from '@/components/notifications'
import { ThemeToggle } from '@/components/theme-toggle'
import { Shield, GitFork } from 'lucide-react'



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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="bg-gray-900 p-2.5 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Shield className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-lg font-semibold text-gray-900">Runix Hub</span>
            </Link>
          </div>

          {/* Center - Search and Current Pipeline */}
          <div className="flex-1 flex items-center justify-center space-x-6 max-w-2xl mx-8">
            <div className="hidden md:block">
              <Link href="/repo/mskcc/CTP-ABC123" className="flex items-center space-x-2 text-sm group">
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Pipeline running" />
                <span className="font-mono text-gray-600 group-hover:text-gray-900 transition-colors">
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
            <nav className="hidden lg:flex items-center space-x-6">
              <Link 
                href="/models" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Models
              </Link>
            </nav>

            {/* Fork button */}
            <div className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm" 
                className="font-medium h-9 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                <GitFork className="w-4 h-4 mr-2" />
                Fork
              </Button>
            </div>



            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <NotificationCenter />

              {/* User avatar */}
              <motion.button 
                className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium hover:bg-gray-800 transition-colors ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
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