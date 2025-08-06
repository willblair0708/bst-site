"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface AnimatedStatCardProps {
  label: string
  value: string
  growth: string
  index: number
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function AnimatedStatCard({ label, value, growth, index }: AnimatedStatCardProps) {
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
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.0 + index * 0.1, duration: 0.6, type: "spring" }}
      >
        <span className="font-mono">{value}</span>
      </motion.div>
      <div className="text-sm text-muted-foreground mb-2 font-medium">{label}</div>
      <div className="text-xs text-accent font-medium font-mono flex items-center justify-center">
        <TrendingUp className="w-4 h-4 mr-1" />
        {growth}
      </div>
    </motion.div>
  )
}
