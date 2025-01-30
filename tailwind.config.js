/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#3872FA",
        lightGray:"#F8F8F8",
        darkGray:"#DBDBDB",
        red:'#F44336'
      }
    },
  },
  plugins: [],
}

