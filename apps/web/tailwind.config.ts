import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          500: "hsl(var(--primary))",
          600: "#002BCC",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          500: "#FF4664",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          500: "hsl(var(--accent))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neutral: {
          100: "#F4F4F2",
          900: "#0F1116",
        },
        // Semantic colors from @design.mdc
        warn: {
            DEFAULT: "hsl(var(--warn-bg))",
        },
        info: {
            DEFAULT: "hsl(var(--info-bg))"
        },
        // Data-viz palette from @design.mdc
        viz: {
            "blue-200": "#BBE1FF",
            "blue-500": "#4DA3FF",
            "orange-500": "#FF9A3C",
            "green-400": "#34D399",
            "purple-500": "hsl(var(--viz-purple))",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-satoshi)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Motion Grammar from @design.mdc v0.3
        "snap": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" }
        },
        "verify-ring-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        },
        "pulse-success": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" }
        },
        "loop-spinner": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        },
        "shake-fail": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" }
        },
        "spark-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(24, 224, 200, 0)" },
          "50%": { boxShadow: "0 0 20px 5px rgba(24, 224, 200, 0.3)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "snap": "snap 70ms ease-out",
        "verify-ring-spin": "verify-ring-spin 1.6s linear infinite",
        "pulse-success": "pulse-success 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "loop-spinner": "loop-spinner 800ms linear infinite",
        "shake-fail": "shake-fail 240ms ease-out",
        "spark-glow": "spark-glow 600ms ease-in-out",
      },
      transitionTimingFunction: {
          'runix': 'cubic-bezier(.22,.61,.36,1)',
      },
      boxShadow: {
        'elevation-1': '0 1px 4px rgba(0,0,0,0.03)',
        'elevation-2': '0 4px 8px rgba(0,0,0,0.06)',
        'elevation-3': '0 8px 16px rgba(0,0,0,0.09)',
        'elevation-4': '0 12px 32px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
