import type { Config } from "tailwindcss";

// Tailwind is scoped to the mobile portfolio components only.
// SIGNAL's pure-CSS desktop build is untouched.
const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/_mobile/**/*.{js,jsx,ts,tsx}",
    "./app/_mobile.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        instrument: ['Instrument Serif', 'serif'],
        geist: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        bg: '#f4f1ea',
        'bg-2': '#ebe6dc',
        paper: '#fbf9f4',
        ink: '#0f0e0d',
        'ink-2': '#2a2723',
        muted: '#6a655d',
        line: 'rgba(26,24,22,0.05)',
        'line-strong': 'rgba(26,24,22,0.10)',
        accent: '#ff5a1f',
        'accent-2': '#ffb547',
        'accent-glow': 'rgba(255,90,31,0.20)',
        green: '#2f7d4f',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        'drift-slow': 'drift 18s ease-in-out infinite',
        bob: 'bob 5.5s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
