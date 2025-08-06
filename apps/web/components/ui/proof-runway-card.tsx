"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { getPillarColor } from "@/lib/icon-utils"

interface ProofRunwayStep {
  pillar: "VERSIONED_KNOWLEDGE" | "COMPOSABLE_MODELS" | "HUMAN_AI_COLLAB"
  icon: LucideIcon
  title: string
  description: string
  motion: string
  emoji: string
}

interface ProofRunwayCardProps {
  step: ProofRunwayStep
  index: number
  totalSteps: number
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

export function ProofRunwayCard({ step, index, totalSteps }: ProofRunwayCardProps) {
  const Icon = step.icon
  const pillarConfig = getPillarColor(step.pillar)
  
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      variants={fadeInUp}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative text-center group"
    >
      {/* Enhanced connection line with gradient */}
      {index < totalSteps - 1 && (
        <div className="absolute left-1/2 top-12 hidden h-0.5 w-full translate-x-1/2 sm:block">
          <div className="h-full bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-transparent" />
        </div>
      )}
      
      {/* Enhanced icon container */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl transition-all duration-300 hover:shadow-lg relative overflow-hidden ${pillarConfig.bg} border ${pillarConfig.border}`}
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon with enhanced styling */}
        <Icon 
          className={`h-10 w-10 ${pillarConfig.text} relative z-10 transition-transform duration-300 group-hover:scale-110`} 
          strokeWidth={1.5} 
          aria-hidden="true"
        />
        
        {/* Subtle inner shadow */}
        <div className="absolute inset-0 rounded-2xl shadow-inner opacity-20" />
      </motion.div>
      
      {/* Enhanced text with better spacing */}
      <h3 className="mb-3 text-xl font-semibold text-foreground">
        <span role="img" aria-label={`${step.title} pillar`} className="mr-2">
          {step.emoji}
        </span>
        <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {step.title}
        </span>
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
        {step.description}
      </p>
      
      {/* Step number indicator */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
        {index + 1}
      </div>
    </motion.div>
  )
}
