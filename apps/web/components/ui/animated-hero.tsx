"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield,
  Zap,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function AnimatedHero() {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
        >
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-12"
          >
            <motion.div 
              className="bg-foreground p-3 rounded-xl paper-layers"
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-8 h-8 text-background" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            Every Scientific Claim<br />
            <motion.span 
              className="text-primary font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Becomes Runnable
            </motion.span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            <span className="font-display font-medium text-foreground">Runix Hub</span> turns research into 
            reproducible pipelines. Fork, verify, and build upon any scientific workflow with git-based protocols 
            and automated reproducibility checking.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/repo/mskcc/CTP-ABC123">
                <Button size="lg" className="px-8 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-lg font-medium transition-medium group">
                  <div className="flex items-center">
                    <motion.div 
                      className="w-5 h-5 mr-2 relative"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="w-5 h-5 progress-ring" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" 
                                strokeDasharray="50.26" strokeDashoffset="0" 
                                className="group-hover:animate-progress-ring" />
                      </svg>
                      <Zap className="w-3 h-3 absolute inset-1 text-current" />
                    </motion.div>
                    Run Demo Pipeline
                  </div>
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/explore">
                <Button variant="outline" size="lg" className="px-8 py-3 text-base border-border text-foreground hover:bg-muted rounded-lg font-medium transition-medium">
                  Explore Pipelines
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
