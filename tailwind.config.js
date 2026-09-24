/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ner: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          primary: '#0284c7', // Deep sky blue
          primaryHover: '#0369a1',
          accent: '#10b981', // Emerald green
          warning: '#f59e0b', // Amber
          danger: '#ef4444', // Red
          lightBg: '#f8fafc',
          brand: '#0b4f6c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
