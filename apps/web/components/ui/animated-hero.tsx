"use client"

import React from 'react'
import { motion, Variants, useReducedMotion } from 'framer-motion'
import { Hash, FlaskConical, Users, ArrowRight, Zap, Sparkles, DollarSign, CalendarDays } from 'lucide-react'
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const pillars = [
  {
    name: 'Versioned',
    icon: Hash,
    color: 'text-primary-500',
    bg: 'bg-primary-100/50',
    border: 'border-primary-500/20',
    shadow: 'shadow-primary-500/10',
    emoji: '🗂️',
    rotation: -6,
    x: -110,
    y: 10,
  },
  {
    name: 'Composable',
    icon: FlaskConical,
    color: 'text-accent-500',
    bg: 'bg-accent-100/50',
    border: 'border-accent-500/20',
    shadow: 'shadow-accent-500/10',
    emoji: '🛠️',
    rotation: 0,
    x: 0,
    y: 0,
  },
  {
    name: 'Collaborative',
    icon: Users,
    color: 'text-viz-purple-500',
    bg: 'bg-collaboration-100/50',
    border: 'border-purple-500/20',
    shadow: 'shadow-purple-500/10',
    emoji: '🤝',
    rotation: 6,
    x: 110,
    y: 10,
  },
];

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const HeroViz = () => {
  const prefersReducedMotion = useReducedMotion()
  return (
    <div className="relative flex items-center justify-center w-full h-64 lg:h-80">
      {/* Grid background */}
      <motion.div className="absolute inset-0 z-0" initial={false} animate={!prefersReducedMotion ? { y: [0, -6, 0] } : undefined} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background to-transparent" />
      </motion.div>

      {/* Pillar Cards */}
      <motion.div 
        className="relative z-10 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return(
                <motion.div
                    key={pillar.name}
                    className={`absolute w-36 h-44 rounded-2xl border ${pillar.border} ${pillar.bg} shadow-lg ${pillar.shadow}`}
                    variants={itemVariants}
                    transition={{duration: 0.5, delay: 0.3 + i * 0.15}}
                    style={{
                        rotate: pillar.rotation,
                        x: pillar.x,
                        y: pillar.y,
                        transformOrigin: 'bottom center',
                    }}
                    whileHover={
                      !prefersReducedMotion
                        ? {
                            scale: 1.04,
                            rotate: pillar.rotation + (pillar.rotation > 0 ? 2 : -2),
                            y: pillar.y - 8,
                            zIndex: 20,
                            transition: { type: 'spring', stiffness: 300 }
                          }
                        : undefined
                    }
                    animate={!prefersReducedMotion ? { y: [pillar.y, pillar.y + 2, pillar.y], transition: { duration: 6 + i, repeat: Infinity, ease: 'easeInOut' } } : undefined}
                >
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <div className={`p-3 mb-3 rounded-full ${pillar.bg} border ${pillar.border}`}>
                            <Icon className={`w-7 h-7 ${pillar.color}`} strokeWidth={2}/>
                        </div>
                        <p className="font-semibold text-base">{pillar.name}</p>
                        <p className="text-2xl mt-1">{pillar.emoji}</p>
                    </div>
                </motion.div>
            )
        })}
      </motion.div>
    </div>
  )
}

export function AnimatedHero() {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="relative overflow-hidden py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-x-12 gap-y-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left content */}
          <div className="z-10">
            <motion.div 
              variants={itemVariants}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted mb-6">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-semibold text-accent-500">Astra-Lite UI</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-display font-display tracking-tight text-foreground"
            >
              Turn every scientific claim
              <br />
              <span className="text-primary-500">into a runnable, citable artifact.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl"
            >
              Fork the dataset and protocol, reproduce the result, and mint an attested record—with agents that help, and provenance you can trust.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/explore" passHref>
                <Button 
                  size="lg" 
                  className="group soft-ui bg-primary-500 hover:bg-primary-500/90 text-primary-foreground active:translate-y-px"
                  onClick={() => trackEvent('cta_start_building_clicked')}
                >
                  <FlaskConical className={`w-4 h-4 mr-2 ${!prefersReducedMotion && 'group-hover:animate-snap'}`} strokeWidth={2} aria-hidden="true" />
                  Start Building
                  <ArrowRight className={`w-4 h-4 ml-2 ${!prefersReducedMotion && 'group-hover:translate-x-1'} transition-transform`} strokeWidth={2} aria-hidden="true" />
                </Button>
              </Link>
              
              <Link href="/docs" passHref>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group soft-ui bg-background/50 hover:bg-muted"
                >
                  Read Docs
                </Button>
              </Link>
            </motion.div>
          </div>
          
          {/* Right visual */}
          <motion.div 
            className="lg:row-start-1 lg:col-start-2"
            variants={itemVariants}
          >
            <HeroViz />
          </motion.div>
        </motion.div>
        
        {/* Proof Progress Bar (mocked KPI widget) */}
        <motion.div 
          className="mt-10 w-full"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{once: true}}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border bg-card/70 p-3 shadow-elevation-1">
            <div className="flex-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted border">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Cost / pt</span>
                <div className="font-mono font-semibold">$
                  <AnimatedCounter from={0} to={12.4} decimals={2} />
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted border">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Days to answer</span>
                <div className="font-mono font-semibold">
                  <AnimatedCounter from={0} to={4.2} decimals={1} />
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted border">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Diversity</span>
                <div className="font-mono font-semibold">+
                  <AnimatedCounter from={0} to={18} decimals={0} />%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{once: true}}
        >
          {[
            {label: "Pipelines", value: 1200, suffix: "+"},
            {label: "Reproducibility", value: 98.2, decimals: 1, suffix: "%"},
            {label: "Models", value: 430, suffix: "+"},
            {label: "Active Runs", value: 3421, icon: Zap},
          ].map(stat => (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
                  <span className="inline-flex items-center gap-1">
                    <AnimatedCounter from={0} to={stat.value} decimals={stat.decimals || 0} className="text-3xl font-mono font-bold text-foreground" />
                    {stat.suffix}
                    {stat.icon && <stat.icon className={`w-5 h-5 ml-1 ${stat.label === 'Active Runs' ? 'text-accent-500 animate-pulse' : 'text-muted-foreground'}`} aria-hidden="true" />}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
