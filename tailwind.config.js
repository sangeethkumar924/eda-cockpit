/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eda: {
          darkest: '#080D1A',
          bg: '#0B1120',
          surface: '#111827',
          card: '#151F32',
          border: '#1E293B',
          muted: '#334155',
          accent: '#3B82F6',
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          pass: '#10B981',
          warn: '#F59E0B',
          fail: '#EF4444'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'Monaco', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
