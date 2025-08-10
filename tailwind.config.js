/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "suit-100": ["SUIT-Thin", "sans-serif"],
        "suit-200": ["SUIT-ExtraLight", "sans-serif"],
        "suit-300": ["SUIT-Light", "sans-serif"],
        "suit-400": ["SUIT-Regular", "sans-serif"],
        "suit-500": ["SUIT-Medium", "sans-serif"],
        "suit-600": ["SUIT-SemiBold", "sans-serif"],
        "suit-700": ["SUIT-Bold", "sans-serif"],
        "suit-800": ["SUIT-ExtraBold", "sans-serif"],
        "suit-900": ["SUIT-Heavy", "sans-serif"],
      },
      colors: {
        main: "#a8f1ff",
      },
    },
  },
  plugins: [],
};
