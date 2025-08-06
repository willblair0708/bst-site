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
      className="relative text-center"
    >
      {/* Connection line */}
      {index < totalSteps - 1 && (
        <div className="absolute left-1/2 top-12 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-border to-transparent sm:block" />
      )}
      
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl transition-all duration-300 hover:shadow-lg ${pillarConfig.bg}`}
      >
        <Icon 
          className={`h-10 w-10 ${pillarConfig.text}`} 
          strokeWidth={1.5} 
          aria-hidden="true"
        />
      </motion.div>
      
      <h3 className="mb-2 text-xl font-semibold">
        <span role="img" aria-label={`${step.title} pillar`}>
          {step.emoji}
        </span> {step.title}
      </h3>
      <p className="text-sm text-muted-foreground">{step.description}</p>
    </motion.div>
  )
}
