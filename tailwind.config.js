/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'saisa-red': '#FF0000',
        'saisa-yellow': '#FFA500',
        'saisa-pink': '#FF66B2',
        'saisa-cyan': '#00FFFF',
        'saisa-dark': '#0A0A2A',
        'saisa-bg': '#1A1A3A',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'red-glow': '0 0 20px rgba(255, 0, 0, 0.5)',
        'yellow-glow': '0 0 20px rgba(255, 165, 0, 0.5)',
        'pink-glow': '0 0 20px rgba(255, 102, 178, 0.5)',
      },
      textShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor',
      }
    },
  },
  plugins: [],
  // Enable JIT mode for better performance
  mode: 'jit',
  // Purge unused styles in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [
        // Keep dynamic classes that might be missed
        'animate-spin',
        'animate-pulse',
        'animate-bounce',
        'saisa-bg',
        'saisa-bg-red',
        'saisa-bg-yellow',
        'saisa-bg-dark',
        'saisa-text-yellow',
        'gradient-text',
        'neon-glow',
        'red-glow',
        'text-shadow-neon',
      ]
    }
  }
}