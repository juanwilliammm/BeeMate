/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bee: {
          black: '#0A0A0E',
          card: '#15151E',
          elevated: '#1E1E2A',
          border: '#2A2A3A',
          pink: '#FF4D8D',
          pinkLight: '#FF85B3',
          pinkSoft: '#FF6B9E',
          pinkDark: '#D92B6B',
          muted: '#9494A8'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'sans-serif'],
        display: ['Montserrat', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
