/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
      colors: {
        primary: '#3b82f6', // blue
        success: '#10b981', // green
        danger: '#ef4444',  // red
      }
    },
  },
  plugins: [],
}
