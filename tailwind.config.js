/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FBF8F1',
          200: '#F4ECE1',
          300: '#EAE0D0',
          400: '#DCCDB8',
          500: '#CBB79C',
          DEFAULT: '#FBF8F1',
        },
        caramel: {
          50: '#FEF9F3',
          100: '#FDF1E2',
          200: '#F9DEC1',
          300: '#F4C698',
          400: '#EAA668',
          500: '#DF8839',
          600: '#C56B22',
          700: '#A1511B',
          800: '#81411B',
          900: '#693619',
          DEFAULT: '#DF8839',
        },
        brown: {
          50: '#F9F8F6',
          100: '#EFECE7',
          200: '#DFD8CE',
          300: '#C6B9A9',
          400: '#A79480',
          500: '#8A735E', // medium brown for secondary
          600: '#6F5948',
          700: '#564436',
          800: '#3D2F25',
          900: '#2A1F18', // deep espresso brown for text & navigation
          DEFAULT: '#2A1F18',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
