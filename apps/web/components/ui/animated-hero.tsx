"use client"

import React from 'react'
import { motion, useMotionValue, useTransform, Variants } from 'framer-motion'
import { 
  Hash,
  FlaskConical,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
        <Hash className="w-12 h-12 text-primary" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  )
}

export function AnimatedHero() {
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm font-medium">Scientific-punk optimism</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              transition={{ duration: 0.7 }}
              className="text-display font-display tracking-tight text-foreground"
            >
              Every scientific claim
              <br />
              <span className="text-primary">becomes runnable</span>
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
                  className="group bg-primary hover:bg-primary-600 text-primary-foreground transition-all duration-200 btn-primary-glow"
                >
                  <FlaskConical className="w-4 h-4 mr-2 group-hover:animate-snap" strokeWidth={1.5} />
                  Run & Verify
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
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
                <div className="text-2xl font-mono font-bold text-foreground">1.2K+</div>
                <div className="text-sm text-muted-foreground">Pipelines</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-foreground">98.2%</div>
                <div className="text-sm text-muted-foreground">Reproducible</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span>256</span>
                    <Zap className="w-4 h-4 text-accent animate-pulse" />
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
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 blur-3xl"
          animate={{
            opacity: [0.5, 0.3, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-accent/10 to-primary/10 blur-3xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}