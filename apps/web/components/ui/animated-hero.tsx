"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedHeroProps {
  title: string;
  subtitle: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  enableParallax?: boolean;
}

export function AnimatedHero({
  title,
  subtitle,
  leftIcon = <Brain size={48} />,
  rightIcon = <Sparkles size={24} />,
  className,
  enableParallax = true
}: AnimatedHeroProps) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const heroSpring = useSpring(heroY, springConfig);
  const opacitySpring = useSpring(heroOpacity, springConfig);

  const parallaxStyle = enableParallax 
    ? { y: heroSpring, opacity: opacitySpring }
    : {};

  return (
    <motion.div 
      className={cn("text-center mb-16", className)}
      style={parallaxStyle}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
    >
      <motion.div
        className="flex items-center justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {leftIcon && (
          <motion.div 
            className="relative"
            animate={{
              y: [-2, 2, -2],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-primary drop-shadow-lg">
              {leftIcon}
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}

        <motion.h1 
          className="text-5xl md:text-6xl font-light tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent m-0"
          style={{ 
            fontWeight: 300,
            letterSpacing: '-0.035em',
            lineHeight: 1
          }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {rightIcon && (
          <motion.div
            animate={{
              y: [-2, 2, -2],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-accent drop-shadow-lg">
              {rightIcon}
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed font-light">
          {subtitle}
        </p>
      </motion.div>
    </motion.div>
  );
}
