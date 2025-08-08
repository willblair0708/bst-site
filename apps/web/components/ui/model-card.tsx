"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"
import { GitFork, Star } from "lucide-react"
import { MOTION, EASING } from "@/lib/motion/tokens"

import { Variants } from "framer-motion"

interface Model {
    name: string;
    version: string;
    description: string;
    provider: string;
    Icon: React.ElementType;
    stars: number;
    forks: number;
}

export const ModelCard = ({ model, variants }: { model: Model, variants: Variants }) => {
  const prefersReducedMotion = useReducedMotion()
  const Icon = model.Icon

  return (
    <motion.div
      variants={variants}
      whileHover={!prefersReducedMotion ? { y: -2, scale: 1.01 } : undefined}
      transition={{ duration: 0.25, ease: EASING.runix as any }}
      className="border rounded-3xl bg-card shadow-elevation-1 hover:shadow-elevation-2 overflow-hidden group h-full flex flex-col transition-all"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="flex items-center justify-center h-12 w-12 rounded-2xl bg-muted border"
              whileHover={!prefersReducedMotion ? { rotate: 3, scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: EASING.smooth as any }}
            >
              <Icon className="w-6 h-6 text-muted-foreground" />
            </motion.div>
            <div className="flex-1">
              <Link 
                href={`/models/${model.name.toLowerCase()}`}
                onClick={() => trackEvent('model_card_clicked', { model: model.name, provider: model.provider })}
                className="group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {model.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">by {model.provider}</p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs rounded-2xl py-1 px-2">
            {model.version}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground my-4 leading-relaxed">
          {model.description}
        </p>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Star className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono">{model.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <GitFork className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono">{model.forks.toLocaleString()}</span>
          </div>
        </div>
        <Button 
          size="sm"
          variant="outline"
          asChild
          className="rounded-xl px-3 py-1 text-sm"
        >
          <Link href={`/models/${model.name.toLowerCase()}`}>
            Use Model
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}