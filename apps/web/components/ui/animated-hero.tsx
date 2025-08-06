"use client"

import React from 'react'
import { motion, useMotionValue, useTransform, Variants } from 'framer-motion'
import { Hash } from 'lucide-react'
import { FlaskConical } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { trackEvent } from '@/lib/analytics'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0
  }
}

const PaperStack = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useTransform(mouseY, [-100, 100], [2, -2])
  const rotateY = useTransform(mouseX, [-100, 100], [-2, 2])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <motion.div 
      className="relative w-32 h-32"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Paper layers */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 bg-card border border-border rounded-lg shadow-elevation-1"
          style={{
            transform: `translateZ(${i * 15}px) translateY(${i * -5}px)`,
            opacity: 1 - i * 0.2
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.5 + i * 0.1,
            duration: 0.3,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Light beam effect */}
      <motion.div
        className="absolute inset-0 rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/10 to-accent/20 blur-xl" />
      </motion.div>
      
      {/* Hash icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 1.2,
          duration: 0.7,
          type: "spring",
          stiffness: 150,
          damping: 12
        }}
      >
                  <Hash className="w-12 h-12 text-primary" strokeWidth={1.5} aria-hidden="true" />
      </motion.div>
    </motion.div>
  )
}

export function AnimatedHero() {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="relative overflow-hidden py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="grid lg:grid-cols-12 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left content */}
          <div className="lg:col-span-7">
            <motion.div 
              variants={itemVariants}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-500/20 bg-accent-500/5 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-accent-500 animate-pulse" />
                <span className="text-sm font-medium">Scientific-punk optimism</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={prefersReducedMotion ? { initial: { opacity: 1 }, animate: { opacity: 1 } } : itemVariants}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
              className="text-display font-display tracking-tight text-foreground"
            >
              Every scientific claim
              <br />
              <span className="text-primary-500">becomes runnable</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl"
            >
              Turn static papers into <span className="font-semibold text-foreground">versioned, forkable, verifiable</span> artefacts. 
              Git-grade provenance meets AI-accelerated discovery.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              transition={{ duration: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/explore">
                <Button 
                  size="lg" 
                  className="group bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200"
                  onClick={() => trackEvent('cta_run_verify_clicked')}
                >
                  <FlaskConical className={`w-4 h-4 mr-2 ${!prefersReducedMotion && 'group-hover:animate-snap'}`} strokeWidth={1.5} aria-hidden="true" />
                  Run & Verify
                  <ArrowRight className={`w-4 h-4 ml-2 ${!prefersReducedMotion && 'group-hover:translate-x-1'} transition-transform`} strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </Link>
              
              <Link href="/docs">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group hover:shadow-elevation-2 transition-all duration-200"
                >
                  View Documentation
                </Button>
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              transition={{ duration: 1 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-md"
            >
              <div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  <AnimatedCounter from={0} to={1200} suffix="+" className="text-2xl font-mono font-bold text-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">Pipelines</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  <AnimatedCounter from={0} to={98.2} decimals={1} suffix="%" className="text-2xl font-mono font-bold text-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">Reproducible</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  <span className="inline-flex items-center gap-1">
                    <AnimatedCounter from={0} to={3421} className="text-2xl font-mono font-bold text-foreground" />
                    <Zap className={`w-4 h-4 text-accent-500 ${!prefersReducedMotion && 'animate-pulse'}`} aria-hidden="true" />
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Running now</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right visual */}
          <motion.div 
            className="lg:col-span-5 flex justify-center lg:justify-end"
            variants={itemVariants}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PaperStack />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <motion.div 
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 blur-3xl backdrop-blur-sm"
          animate={prefersReducedMotion ? {} : {
            opacity: [0.5, 0.3, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-accent/10 to-primary/10 blur-3xl backdrop-blur-sm"
          animate={prefersReducedMotion ? {} : {
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={prefersReducedMotion ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}