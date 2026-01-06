/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f1f1f1e3",
        palmGreen: "#1B5E20",
        rusticBrown: "#8C5E2C",
        brandOrange: "#FF8A00"
      },
      fontFamily: {
        heading: ["Merriweather", "serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },

  // ⭐ ADD THIS
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",   // IE and Edge
          "scrollbar-width": "none",     // Firefox
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",               // Chrome, Safari
        },
        
      });
    },
  ],
};
