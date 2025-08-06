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
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative text-center group h-full"
    >
      {/* Connection line */}
      {index < totalSteps - 1 && (
        <div className="absolute left-1/2 top-12 hidden h-[2px] w-full translate-x-1/2 sm:block bg-gradient-to-r from-border via-border to-transparent" />
      )}
      
      <div className="flex flex-col items-center h-full">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl transition-all duration-300 relative overflow-hidden ${pillarConfig.bg} border-2 ${pillarConfig.border} shadow-lg shadow-black/5`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
          
          <Icon 
            className={`h-10 w-10 ${pillarConfig.text} relative z-10 transition-transform duration-300 group-hover:scale-105`} 
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className={`absolute -bottom-4 -right-4 w-16 h-16 ${pillarConfig.bg} rounded-full blur-xl opacity-50`} />
        </motion.div>
        
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          <span role="img" aria-label={`${step.title} pillar`} className="mr-1.5">
            {step.emoji}
          </span>
          {step.title}
        </h3>
        <p className="text-sm text-muted-foreground mx-auto leading-relaxed px-2">
          {step.description}
        </p>
        
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md border-2 border-background">
          {index + 1}
        </div>
      </div>
    </motion.div>
  )
}
