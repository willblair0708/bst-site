"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Download, GitFork, Activity, CheckCircle2, Verified } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  author: string;
  authorAvatar?: string;
  featured?: boolean;
  trending?: boolean;
  verified?: boolean;
  tags: string[];
  downloads: number;
  likes: number;
  accuracy: number;
  framework: string;
  className?: string;
  delay?: number;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -4, scale: 1.01 }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function ModelCard({
  id,
  name,
  description,
  author,
  authorAvatar,
  featured,
  trending,
  verified,
  tags,
  downloads,
  likes,
  accuracy,
  framework,
  className,
  delay = 0
}: ModelCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay, duration: 0.3 }}
      className={cn("group", className)}
    >
      <Link href={`/models/${id}`} className="block h-full">
        <div className="bg-card rounded-2xl p-6 hover:bg-background transition-colors duration-300 border border-border h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md font-mono">
                {framework}
              </span>
              {verified && (
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center" title={`Verified reproducible (${accuracy}%)`}>
                    <CheckCircle2 className="w-4 h-4 text-background" />
                  </div>
                  {trending && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )}
            </div>
            {featured && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Model Name & Author */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={authorAvatar} alt={author} />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <div className="text-sm text-muted-foreground">{author}</div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
            {description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-muted/30 border-border/50">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-muted/30 border-border/50">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
          
          {/* Stats - Fixed at bottom */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span className="font-mono">{formatNumber(downloads)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span className="font-mono">{formatNumber(likes)}</span>
              </div>
              <div className="flex items-center space-x-1" title="Accuracy">
                <Activity className="w-3 h-3 text-accent" />
                <span className="font-mono text-accent">{accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
