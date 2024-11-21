/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        warning: "#ddaa44",
        success: "#99cc33",
        danger: "#cc3300",
      },
    },
  },
  plugins: [],
};
