/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gs-blue': '#7297c5',
        'gs-blue-dark': '#5a7aa8',
        'gs-navy': '#1a1a1a',
        'gs-gray': '#f8f9fa',
      },
      fontFamily: {
        'serif': ['Libre Baskerville', 'serif'],
        'sans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

