/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      animation: {
        'animate-ping-small': 'animate-ping scale-105 ',
       }
    },
  },
  plugins: [],
}

