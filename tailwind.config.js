/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Usa la clase 'dark' para activar el modo oscuro
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors:{
        "dark-orange": "#ad5733",
        "dark-green": "#797b6c",
        "black": "#1e1d1d",
        "light-yellow": "#f1e2c2",
        "light-orange": "#f49167",
        "light-bg": "#f4f2f0",
        "dark-bg": "#1e1d1d",
      }
    },
  },
  plugins: [],
}

