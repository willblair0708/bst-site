/**
 * Motion Tokens for Pastel-Bento × Soft-UI 2.0 Theme
 * Standardized animation values to avoid magic numbers in components
 */
export const MOTION = {
  // Transparent Bento - Three Layer Motion System
  
  // Story Layer - Light beam effects (never animates blur itself)
  beam: { 
    duration: 1.6, 
    ease: "linear" 
  },
  
  // Action Layer - Pillar-specific micro-motions
  snap: { 
    duration: 0.07, 
    ease: "easeOut" 
  },
  
  pulse_success: { 
    type: "spring" as const, 
    stiffness: 150,
    scale: [1, 1.12, 1]
  },
  
  spark_glow: { 
    keyframes: [0.6, 1, 0.6],
    duration: 0.8,
    ease: "easeInOut"
  },
  
  // Data Layer - Bento tile interactions
  bento_hover: {
    duration: 0.3,
    ease: "easeOut",
    rotate: 2,
    y: -2
  },
  
  // Error feedback - 3×8px x-shake
  shake_fail: { 
    times: 3, 
    distance: 8,
    duration: 0.24 
  }
} as const;

// Animation variants for Framer Motion
export const VARIANTS = {
  snap: {
    initial: { scale: 1 },
    animate: { scale: 0.95 },
    exit: { scale: 1 }
  },
  
  glass: {
    initial: { 
      opacity: 0, 
      backdropFilter: "blur(0px)",
      y: 20 
    },
    animate: { 
      opacity: 1, 
      backdropFilter: "blur(12px)",
      y: 0 
    },
    exit: { 
      opacity: 0, 
      backdropFilter: "blur(0px)",
      y: -20 
    }
  },
  
  softUI: {
    initial: { 
      scale: 1,
      y: 0,
      boxShadow: "var(--soft-inner), var(--soft-outer)"
    },
    hover: { 
      scale: 1.02,
      y: -1,
      boxShadow: "var(--soft-inner), 0 4px 8px rgba(0,0,0,0.12)"
    },
    tap: { 
      scale: 0.98,
      y: 0
    }
  }
} as const;

// Preset easing functions
export const EASING = {
  runix: [0.22, 0.61, 0.36, 1] as const,
  spring: [0.68, -0.55, 0.265, 1.55] as const,
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  swift: [0.55, 0, 0.1, 1] as const,
} as const;
