/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Viking: '#7EB2DD',
        Harry : '#FFE8D4',
      }
    },
  },
  plugins: [],
}

