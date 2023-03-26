/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      minHeight: {
        "1/2": "50vh",
        "3/4": "70vh",
        "hero-height": "820px",
        "1/3": "30vh",
        "booking-from": "336px",
      },
      width: {
        "200px": "200px",
        card: "370px",
      },
      height: {
        "580px": "580px",
        card: "380px",
      },
      minWidth: {
        "200px": "200px",
      },
      backgroundPosition: {
        "left-1/4": "30% 0%",
      },
      backgroundColor: {
        "bg-dark": "#1b1b1b",
      },
      colors: {
        "input-border": "#e8e8e8",
        "input-place-holder": "#74787c",
        "char-black": "#1b1b1b",
      },
      screens: {
        "3xl": "1320px",
      },
    },
  },
  plugins: [],
};
