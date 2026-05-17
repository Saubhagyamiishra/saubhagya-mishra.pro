/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
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
                        sm: 'calc(--radius) - 4px)'
                },
                colors: {
                        // New Editorial Tech Lab color system
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
                        // Keep shadcn colors for backward compatibility
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
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
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
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
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'drift': 'drift 14s ease-in-out infinite',
                        'drift-slow': 'drift 18s ease-in-out infinite',
                        'bob': 'bob 5.5s ease-in-out infinite',
                        'float': 'float 3s ease-in-out infinite',
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
