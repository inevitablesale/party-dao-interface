import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
        polygon: {
          primary: "#8247E5",
          secondary: "#A379FF",
        },
        toxic: {
          neon: "#39FF14",
          glow: "#00FF41",
          dark: "#0D1F0F",
          muted: "#00BB13",
          faint: "rgba(57, 255, 20, 0.25)",
          army: "#4B5320",
          olive: "#556B2F",
        },
        apocalypse: {
          red: "#ea384c",
          dark: "#1A1F2C",
          ash: "#403E43",
          charcoal: "#221F26",
          rust: "#8B4D2D",
          metal: "#6E7A89",
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "wave": "wave 8s ease-in-out infinite",
        "wave-slow": "wave 12s ease-in-out infinite",
        "gradient": "gradient 3s ease infinite",
        "singularity": "singularity 20s ease-in-out infinite",
        "cosmic-pulse": "cosmic-pulse 4s ease-in-out infinite",
        "star-field": "star-field 30s linear infinite",
        "parallax-slow": "parallax-scroll 15s linear infinite",
        "parallax-medium": "parallax-scroll 10s linear infinite",
        "parallax-fast": "parallax-scroll 5s linear infinite",
        "orbit": "orbit 20s linear infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce": "bounce 1s infinite",
        "toxic-pulse": "toxic-pulse 2s ease-in-out infinite",
        "toxic-drip": "toxic-drip 5s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
        "radiation": "radiation 4s ease-in-out infinite",
        "glitch": "glitch 3s ease-in-out infinite",
        "flash-critical": "flash-critical 1s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "wave": {
          "0%, 100%": { transform: "translateY(0) scale(1.5)" },
          "50%": { transform: "translateY(-20px) scale(1.3)" }
        },
        "gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        "singularity": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.1) rotate(180deg)" }
        },
        "cosmic-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        },
        "star-field": {
          "0%": { transform: "translateZ(0) rotate(0deg)" },
          "100%": { transform: "translateZ(400px) rotate(360deg)" }
        },
        "parallax-scroll": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" }
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" }
        },
        "pulse": {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        "bounce": {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
        },
        "toxic-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(57, 255, 20, 0.3), 0 0 10px rgba(57, 255, 20, 0.2), 0 0 15px rgba(57, 255, 20, 0.1)" },
          "50%": { boxShadow: "0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.4), 0 0 30px rgba(57, 255, 20, 0.3)" },
        },
        "toxic-drip": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "radiation": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "10%": { transform: "translate(-2px, 2px)" },
          "20%": { transform: "translate(2px, -2px)" },
          "30%": { transform: "translate(-2px, -2px)" },
          "40%": { transform: "translate(2px, 2px)" },
          "50%": { transform: "translate(-2px, 2px)" },
          "60%": { transform: "translate(2px, -2px)" },
          "70%": { transform: "translate(-2px, -2px)" },
          "80%": { transform: "translate(2px, 2px)" },
          "90%": { transform: "translate(-2px, 2px)" },
        },
        "flash-critical": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 10px rgba(234, 56, 76, 0.8), 0 0 20px rgba(234, 56, 76, 0.6)" },
          "50%": { opacity: "0.5", boxShadow: "0 0 5px rgba(234, 56, 76, 0.3), 0 0 10px rgba(234, 56, 76, 0.2)" },
        },
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
