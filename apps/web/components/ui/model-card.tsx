"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"
import { Bot } from "lucide-react"
import { GitFork } from "lucide-react"
import { Star } from "lucide-react"
import { MOTION } from "@/lib/motion/tokens"

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
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
      className="border border-border rounded-2xl bg-card shadow-sm overflow-hidden group h-full flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent-100 border border-accent-500/20">
              <Bot className="w-6 h-6 text-accent-500" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <Link 
                href={`/models/${model.name.toLowerCase()}`}
                onClick={() => trackEvent('model_card_clicked', { model: model.name, provider: model.provider })}
                className="group/link"
              >
                <h3 className="text-base font-semibold text-foreground group-hover/link:text-primary-500 transition-colors duration-200">
                  {model.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">by <span className="text-accent-500 font-medium">{model.provider}</span></p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs rounded-full py-1">
            {model.version}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground my-4 leading-relaxed">
          {model.description}
        </p>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/50">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <Star className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono font-medium">{model.stars}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <GitFork className="w-4 h-4" aria-hidden="true" />
            <span className="font-mono font-medium">{model.forks}</span>
          </div>
        </div>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/models/${model.name.toLowerCase()}/playground`}>
            Use Model
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}