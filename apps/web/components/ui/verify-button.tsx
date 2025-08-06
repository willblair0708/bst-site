"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
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
  // Fix: convert MOTION.pulse_success to a valid animate+transition pair
  // Framer Motion expects scale to be mutable, not readonly
  const animate = isVerified
    ? { scale: [...MOTION.pulse_success.scale] as number[] }
    : {}
  const transition = isVerified
    ? { type: MOTION.pulse_success.type, stiffness: MOTION.pulse_success.stiffness }
    : MOTION.snap

  return (
    <motion.button
      onClick={onVerify}
      disabled={isVerifying || isVerified}
      className={cn(
        // Design.mdc v0.4 Soft-UI 2.0 - tactile shadows + haptic
        "soft-ui bg-primary-500 text-primary-foreground",
        "px-6 py-3 rounded-lg font-medium",
        "transition-all duration-150",
        "hover:bg-primary-600 active:translate-y-px",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "min-h-[44px] min-w-[44px]", // EAA compliance - larger for primary CTA
        isVerified && "bg-accent-500 hover:bg-accent-600",
        className
      )}
      whileTap={!isVerifying && !isVerified ? { scale: 0.98 } : {}}
      animate={animate}
      transition={transition}
    >
      <span className="flex items-center gap-2">
        {isVerifying ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4" />
            </motion.div>
            Verifying...
          </>
        ) : isVerified ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </motion.div>
            Verified ✓
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  )
}
