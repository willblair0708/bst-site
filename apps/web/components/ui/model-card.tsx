"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"
import { Bot } from "lucide-react"
import { GitFork } from "lucide-react"
import { Star } from "lucide-react"

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
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-card border border-border/50 rounded-xl shadow-elevation-1 overflow-hidden hover:shadow-elevation-2 transition-all duration-300 hover:border-accent-500/30 group backdrop-blur-md"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative bg-gradient-to-br from-accent-500/10 to-accent-500/5 p-3 rounded-xl border border-accent-500/20 group-hover:border-accent-500/30 transition-colors">
              <Bot className="w-6 h-6 text-accent-500" aria-hidden="true" />
              <div className="absolute inset-0 bg-accent-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1">
              <Link 
                href={`/models/${model.name.toLowerCase()}`}
                onClick={() => trackEvent('model_card_clicked', { model: model.name, provider: model.provider })}
                className="group/link"
              >
                <h3 className="text-lg font-semibold text-foreground group-hover/link:text-primary-500 transition-colors duration-200">
                  {model.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">by <span className="text-accent-500 font-medium">{model.provider}</span></p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs border-primary-500/20 bg-primary-500/5 text-primary-500">
            {model.version}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground my-5 leading-relaxed">
          {model.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Star className="w-4 h-4 text-viz-orange-500" aria-hidden="true" />
              <span className="font-mono font-medium">{model.stars}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <GitFork className="w-4 h-4 text-viz-blue-500" aria-hidden="true" />
              <span className="font-mono font-medium">{model.forks}</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="hover:bg-accent-500/10 hover:text-accent-500 font-medium" asChild>
            <Link href={`/models/${model.name.toLowerCase()}/playground`}>
              Use Model
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}