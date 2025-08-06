"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Calendar, Activity, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  author: string;
  authorAvatar?: string;
  featured?: boolean;
  tags: string[];
  lastModified: string;
  size: string;
  accuracy: number;
  className?: string;
  delay?: number;
}

const cardVariants = {
  initial: { opacity: 0, y: 30, rotateY: -15 },
  animate: { 
    opacity: 1, 
    y: 0, 
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -12,
    rotateY: 5,
    scale: 1.03,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export function ModelCard({
  id,
  name,
  description,
  author,
  authorAvatar,
  featured,
  tags,
  lastModified,
  size,
  accuracy,
  className,
  delay = 0
}: ModelCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay }}
      className={className}
    >
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={authorAvatar} 
                  alt={author}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/models/${id}`}>
                  <CardTitle className="hover:text-primary cursor-pointer text-base">
                    {name}
                  </CardTitle>
                </Link>
                <div className="text-sm text-muted-foreground">{author}</div>
              </div>
            </div>
            {featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                Featured
              </Badge>
            )}
          </div>
          <CardDescription className="mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Model Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(lastModified).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>{size}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>{accuracy}% acc</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button asChild className="flex-1">
                <Link href={`/models/${id}`}>
                  View Model
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
