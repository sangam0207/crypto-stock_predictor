/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-opacity': 'rgba(128, 128, 128, 0.5)', // semi-transparent gray
      },
    },
  },
  plugins: [],
}