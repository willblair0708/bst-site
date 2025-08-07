"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { MOTION } from "@/lib/motion/tokens"

interface VerifyButtonProps {
  isVerified?: boolean
  isVerifying?: boolean
  onVerify?: () => void
  className?: string
  children?: React.ReactNode
}

export function VerifyButton({ 
  isVerified = false, 
  isVerifying = false, 
  onVerify,
  className,
  children = "Run & Verify"
}: VerifyButtonProps) {

  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  }

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -90 },
    visible: { scale: 1, rotate: 0 }
  }

  return (
    <motion.button
      onClick={onVerify}
      disabled={isVerifying || isVerified}
      className={cn(
        "soft-ui text-primary-foreground font-semibold",
        "px-6 py-3 rounded-xl",
        "transition-colors duration-150",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-ring",
        "min-h-[48px]",
        isVerified ? "bg-accent-500 hover:bg-accent-600" : "bg-primary-500 hover:bg-primary-600",
        className
      )}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      animate={isVerified ? "hover" : "rest"}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
      <span className="flex items-center justify-center gap-2">
        {isVerifying ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-5 h-5" />
            </motion.div>
            <span>Verifying...</span>
          </>
        ) : isVerified ? (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={iconVariants}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </motion.div>
            <span>Verified</span>
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  )
}
