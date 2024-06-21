/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        wide: ['var(--font-michroma)'],
        header: ['var(--font-cinzel)'],
        sans: ['var(--font-mplus)', ...defaultTheme.fontFamily.sans],
      },
    }
  },
  plugins: [],
}

