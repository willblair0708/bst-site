import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        },
        // Runix Hub Design System Colors
        runix: {
          "proof-black": "#0F1116",
          "graph-deep-blue": "#0436FF", 
          "quantum-teal": "#18E0C8",
          "commit-lilac": "#A887FF",
          "sand-paper": "#F4F4F2",
          "oxide-grey": "#9CA3AF",
          "alert-red": "#FF4664"
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Satoshi", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "data-flow": "dataFlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "matrix-rain": "matrixRain 3s linear infinite",
        "neural-pulse": "neuralPulse 4s ease-in-out infinite",
        "confetti": "confetti 2s ease-out",
        "badge-flip": "badgeFlip 0.6s ease-in-out",
        "celebration": "celebration 1s ease-out",
        "orbit": "orbit 30s linear infinite",
        "pulse-once": "pulseOnce 0.6s ease-out",
        "shake": "shake 0.5s ease-in-out",
        "progress-ring": "progressRing 2s ease-in-out"
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        },
        dataFlow: {
          "0%, 100%": { opacity: "0.3", transform: "translateX(-10px)" },
          "50%": { opacity: "1", transform: "translateX(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        },
        matrixRain: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        neuralPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)" },
          "70%": { boxShadow: "0 0 0 10px rgba(59, 130, 246, 0)" }
        },
        confetti: {
          "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" }
        },
        badgeFlip: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(0deg)" }
        },
        celebration: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" }
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(20px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(20px) rotate(-360deg)" }
        },
        pulseOnce: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" }
        },
        progressRing: {
          "0%": { "stroke-dasharray": "0 100" },
          "100%": { "stroke-dasharray": "100 0" }
        }
      },
      backdropBlur: {
        xs: "2px"
      },
      fontSize: {
        "2xs": "0.625rem"
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem"
      },
      transitionTimingFunction: {
        'runix': 'cubic-bezier(0.22, 0.61, 0.36, 1)'
      },
      transitionDuration: {
        'fast': '100ms',
        'medium': '250ms'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;