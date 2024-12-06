/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.js",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        arial: ['Arial', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        customFont: ['"Your Custom Font"', 'serif'],
    },
    },
  },
  plugins: [],
}

