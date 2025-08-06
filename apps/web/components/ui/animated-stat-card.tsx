"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedStatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
  iconColor?: "primary" | "accent" | "secondary";
  delay?: number;
}

const statsVariants = {
  initial: { opacity: 0, scale: 0.8, rotateX: -45 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0,
    transition: {
      duration: 0.7
    }
  },
  hover: {
    scale: 1.05,
    rotateX: 5,
    transition: {
      duration: 0.3
    }
  }
};

const iconColorClasses = {
  primary: "text-primary",
  accent: "text-accent", 
  secondary: "text-secondary"
};

export function AnimatedStatCard({ 
  icon, 
  value, 
  label, 
  className,
  iconColor = "primary",
  delay = 0
}: AnimatedStatCardProps) {
  return (
    <motion.div
      variants={statsVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      transition={{ delay }}
      className={cn("h-32", className)}
    >
      <Card className="text-center h-full bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <motion.div 
            className="flex items-center justify-center gap-2 mb-1"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cn("text-lg", iconColorClasses[iconColor])}>
              {icon}
            </div>
            <span className={cn(
              "text-2xl font-bold font-mono",
              iconColorClasses[iconColor]
            )}>
              {value}
            </span>
          </motion.div>
          <span className="text-muted-foreground text-sm">{label}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
