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
        mathjax: ['MathJax_Math', 'serif']
    },
    },
  },
  plugins: [],
}

