"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "card" | "avatar" | "button"
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-xl relative overflow-hidden shadow-elevation-1"
  
  const variantClasses = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24"
  }

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "200%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  )
}

export function ModelCardSkeleton() {
  return (
    <div className="glass-card border border-border/50 rounded-3xl shadow-elevation-1 overflow-hidden p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-4">
          <Skeleton variant="avatar" className="rounded-xl w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
          <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      <div className="space-y-2 mb-5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function RepoCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-3xl shadow-elevation-1 overflow-hidden group backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-36" />
        </div>
        
        <div className="space-y-3 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        <div className="flex items-center gap-2 rounded-xl bg-primary-500/5 border border-primary-500/15 px-3 py-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-3 ml-auto rounded" />
        </div>
      </div>
      
      <div className="border-t border-border bg-primary-100/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}
