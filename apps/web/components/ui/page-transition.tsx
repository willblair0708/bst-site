"use client"

import React from "react"
import { motion, useReducedMotion, type MotionProps } from "framer-motion"

type PageTransitionProps = React.PropsWithChildren<{
  className?: string
  motionProps?: MotionProps
}>

export function PageTransition({ children, className, motionProps }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
      transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition


