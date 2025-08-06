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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
            "purple-500": "#A855F7",
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
        // Motion Grammar from @design.mdc
        "confirm-success": {
            "0%, 100%": { transform: "scale(1)"},
            "50%": { transform: "scale(1.1)"}
        },
        "negative-feedback": {
            "0%, 100%": { transform: "translateX(0)" },
            "25%, 75%": { transform: "translateX(-5px)" },
            "50%": { transform: "translateX(5px)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "confirm-success": "confirm-success 400ms ease-in-out",
        "negative-feedback": "negative-feedback 240ms ease-in-out",
      },
      transitionTimingFunction: {
          'runix-nav': 'cubic-bezier(.22,.61,.36,1)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
