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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-card border border-border rounded-xl shadow-elevation-1 overflow-hidden hover:shadow-elevation-3 transition-all duration-300 hover:border-accent/20 spark-glow"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-accent-500/10 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-accent-500" aria-hidden="true" />
            </div>
            <div>
              <Link 
                href={`/models/${model.name.toLowerCase()}`}
                onClick={() => trackEvent('model_card_clicked', { model: model.name, provider: model.provider })}
              >
                <h3 className="text-md font-semibold text-foreground hover:text-primary-500 transition-colors">
                  {model.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground">by {model.provider}</p>
            </div>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {model.version}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground my-4">
          {model.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3" aria-hidden="true" />
              <span className="font-mono">{model.stars}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="w-3 h-3" aria-hidden="true" />
              <span className="font-mono">{model.forks}</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="hover:bg-accent-500/10 hover:text-accent-500" asChild>
            <Link href={`/models/${model.name.toLowerCase()}/playground`}>
              Use Model
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}