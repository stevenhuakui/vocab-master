/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Minimalist colors
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#f0f0f0',
      }
    },
  },
  plugins: [],
}
