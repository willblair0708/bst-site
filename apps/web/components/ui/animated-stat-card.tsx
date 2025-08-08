"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface AnimatedStatCardProps {
  label: string
  value: string
  growth: string
  index: number
  tone?: 'positive' | 'alert' | 'neutral'
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function AnimatedStatCard({ label, value, growth, index, tone = 'neutral' }: AnimatedStatCardProps) {
  return (
    <motion.div 
      variants={itemVariants}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="text-center group"
    >
      <motion.div 
        className="text-3xl md:text-4xl font-display font-light text-foreground mb-2 transition-medium group-hover:text-primary"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={tone === 'positive' ? { scale: [1, 1.12, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={tone === 'positive' 
          ? { duration: 0.6, times: [0, 0.5, 1], type: 'tween', ease: 'easeInOut', delay: 0.8 + index * 0.1 }
          : { delay: 0.8 + index * 0.1, duration: 0.6, type: 'spring' }
        }
      >
        <span className="font-mono">{value}</span>
      </motion.div>
      <div className="text-sm text-muted-foreground mb-2 font-medium">{label}</div>
      <div className={`text-xs font-medium font-mono flex items-center justify-center ${tone === 'positive' ? 'text-accent' : tone === 'alert' ? 'text-destructive' : 'text-muted-foreground'}`}>
        <TrendingUp className="w-4 h-4 mr-1" />
        {growth}
      </div>
    </motion.div>
  )
}
