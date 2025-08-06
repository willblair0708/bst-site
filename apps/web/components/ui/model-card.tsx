"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, GitFork, Star } from "lucide-react"

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
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0, 0.05)" }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Link href={`/models/${model.name.toLowerCase()}`}>
                <h3 className="text-md font-semibold text-foreground hover:text-primary transition-colors">
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
              <Star className="w-3 h-3" />
              <span>{model.stars}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="w-3 h-3" />
              <span>{model.forks}</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/models/${model.name.toLowerCase()}/playground`}>
              Use Model
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}