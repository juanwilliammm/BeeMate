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
          black: '#0F1115',
          card: '#181B22',
          elevated: '#222631',
          border: '#2E3440',
          amber: '#F59E0B',
          amberLight: '#FBBF24',
          onPrimary: '#0F1115',
          blue: '#38BDF8',
          blueDeep: '#0284C7',
          muted: '#94A3B8'
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
