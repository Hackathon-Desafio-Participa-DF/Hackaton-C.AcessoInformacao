/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ed',
          100: '#cce5db',
          200: '#99cbb7',
          300: '#66b193',
          400: '#33976f',
          500: '#006341',
          600: '#005236',
          700: '#00422b',
          800: '#003120',
          900: '#002115',
        },
        secondary: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#ffc300',
          600: '#cc9c00',
          700: '#997500',
          800: '#664e00',
          900: '#332700',
        },
      },
    },
  },
  plugins: [],
}
