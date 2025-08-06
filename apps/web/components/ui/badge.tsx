import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center soft-ui px-3 py-1.5 text-xs font-semibold transition-all duration-150 focus-ring rounded-full",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-500",
        secondary:
          "border-secondary/20 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
        destructive:
          "border-destructive-500/20 bg-destructive-500/10 text-destructive-500 hover:bg-destructive-500/20",
        outline: "border-primary-500/30 bg-primary-500/5 text-primary-500 hover:bg-primary-500/10 hover:border-primary-500/50",
        success: "border-accent-500/30 bg-accent-500/10 text-accent-500 hover:bg-accent-500/20",
        warning: "border-viz-orange-500/30 bg-viz-orange-500/10 text-viz-orange-500 hover:bg-viz-orange-500/20",
        info: "border-viz-blue-500/30 bg-viz-blue-500/10 text-viz-blue-500 hover:bg-viz-blue-500/20",
        purple: "border-viz-purple-500/30 bg-viz-purple-500/10 text-viz-purple-500 hover:bg-viz-purple-500/20",
        gold: "border-equity-gold/30 bg-equity-gold/10 text-equity-gold hover:bg-equity-gold/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }