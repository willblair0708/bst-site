"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/global-search'
import { NotificationCenter } from '@/components/notifications'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Shield,
  ChevronDown,
  Plus,
  Github,
  Settings,
  User,
  LogOut,
  Building,
  Bookmark,
  Activity,
  Star,
  GitFork,
  TrendingUp,
  Clock
} from 'lucide-react'

interface Repository {
  name: string
  description: string
  isPrivate: boolean
  language: string
  stars: number
  forks: number
  updatedAt: string
}

const mockRepositories: Repository[] = [
  {
    name: "mitochondrial-ros-sensor",
    description: "Computable plasmid construct protocols + SimPy model",
    isPrivate: false,
    language: "Python",
    stars: 47,
    forks: 12,
    updatedAt: "2024-01-20"
  },
  {
    name: "faers-safety-digest", 
    description: "OpenFDA pharmacovigilance signal detection pipeline",
    isPrivate: false,
    language: "R",
    stars: 128,
    forks: 23,
    updatedAt: "2024-01-19"
  },
  {
    name: "variant-insight-brca1",
    description: "Crowd-sourced functional annotations for BRCA1 variants",
    isPrivate: false, 
    language: "JSON",
    stars: 89,
    forks: 15,
    updatedAt: "2024-01-18"
  },
  {
    name: "CTP-ABC123",
    description: "NSCLC Phase I Safety and Efficacy Trial",
    isPrivate: true,
    language: "YAML",
    stars: 23,
    forks: 3,
    updatedAt: "2024-01-15"
  }
]

const currentUser = {
  name: "Dr. Sarah Johnson",
  username: "sarah-johnson",
  email: "sarah.johnson@mskcc.org",
  avatar: null,
  role: "Principal Investigator",
  organization: "Memorial Sloan Kettering"
}

export function GitHubHeader() {
  const [showRepoDropdown, setShowRepoDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showCreateDropdown, setShowCreateDropdown] = useState(false)

  return (
    <div className="bg-background border-b border-border sticky top-0 z-50 paper-layers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div 
                className="bg-foreground p-2 rounded-xl transition-medium hover:bg-primary"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-4 h-4 text-background" />
              </motion.div>
              <span className="text-lg font-display font-medium text-foreground">Runix Hub</span>
            </Link>
          </div>

          {/* Center - Search and Current Pipeline */}
          <div className="flex-1 flex items-center justify-center space-x-8 max-w-2xl mx-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden md:block"
            >
              <Link href="/repo/mskcc/CTP-ABC123" className="flex items-center space-x-2 text-sm group">
                <motion.div 
                  className="w-2 h-2 bg-accent rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  title="Pipeline running"
                />
                <span className="font-mono text-muted-foreground group-hover:text-foreground transition-medium">
                  mitochondrial-ros-sensor
                </span>
              </Link>
            </motion.div>
            
            <div className="flex-1 max-w-md">
              <GlobalSearch />
            </div>
          </div>

          {/* Right side - Navigation and User */}
          <div className="flex items-center space-x-6">
            {/* Navigation */}
            <motion.nav 
              className="hidden lg:flex items-center space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[
                { href: "/explore", label: "Pipelines" },
                { href: "/evidence", label: "Data" },
                { href: "/safety", label: "Runs" }
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Link href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-medium">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Fork button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Button variant="outline" size="sm" className="font-medium">
                <GitFork className="w-4 h-4 mr-2" />
                Fork
              </Button>
            </motion.div>

            {/* Removed create dropdown for simplicity */}
            {false && showCreateDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setShowCreateDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-40 overflow-hidden">
                    <div className="p-2">
                      <Link
                        href="/new/dataset"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowCreateDropdown(false)}
                      >
                        Dataset Card
                      </Link>
                      <Link
                        href="/new/replicate"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowCreateDropdown(false)}
                      >
                        Replicate Paper
                      </Link>
                      <Link
                        href="/new/safety"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowCreateDropdown(false)}
                      >
                        Safety Digest
                      </Link>
                      <Link
                        href="/new/protocol"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowCreateDropdown(false)}
                      >
                        Computable Protocol
                      </Link>
                      <div className="border-t border-gray-100 my-2 mx-3"></div>
                      <Link
                        href="/new/trial"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowCreateDropdown(false)}
                      >
                        Clinical Trial
                      </Link>
                      <div className="border-t border-gray-100/60 my-2 mx-3"></div>
                      <Link
                        href="/import"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowCreateDropdown(false)}
                      >
                        Import trial
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <NotificationCenter />

              {/* User avatar */}
              <motion.div 
                className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background text-xs font-mono transition-medium hover:bg-accent"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 16px rgba(147, 51, 234, 0.4)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </motion.div>
            </div>

            {/* Removed user dropdown for simplicity */}
            {false && showUserDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-40 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                      <div className="text-sm font-semibold text-gray-900">{currentUser.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{currentUser.email}</div>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Your profile</span>
                      </Link>
                      <Link
                        href="/trials"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Your trials</span>
                      </Link>
                      <Link
                        href="/organizations"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Building className="w-4 h-4" />
                        <span>Your organizations</span>
                      </Link>
                      <Link
                        href="/stars"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Star className="w-4 h-4" />
                        <span>Your stars</span>
                      </Link>
                      <div className="border-t border-gray-100/60 my-2 mx-3"></div>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-gray-100/60 my-2 mx-3"></div>
                      <button
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 w-full text-left transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
  )
}