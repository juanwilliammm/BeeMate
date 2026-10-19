/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy palette (still used by untouched screens: Login, Verify, Chat, Profile, Calls)
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
        },
        // BeeMate design tokens (theme-aware, defined in index.css)
        surface: token('surface'),
        card: token('card'),
        subtle: token('subtle'),
        line: token('line'),
        ink: {
          DEFAULT: token('ink'),
          2: token('ink-2'),
          3: token('ink-3')
        },
        brand: {
          DEFAULT: token('brand'),
          ink: token('brand-ink'),
          soft: token('brand-soft'),
          on: token('brand-on')
        },
        success: token('success'),
        danger: token('danger')
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Type scale: title / heading / body / caption / meta
        title: ['22px', { lineHeight: '28px', letterSpacing: '-0.02em', fontWeight: '600' }],
        heading: ['16px', { lineHeight: '22px', letterSpacing: '-0.01em', fontWeight: '600' }],
        body: ['14px', { lineHeight: '20px' }],
        caption: ['12px', { lineHeight: '16px' }],
        meta: ['11px', { lineHeight: '14px' }]
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 24 40 / 0.04), 0 4px 16px -4px rgb(16 24 40 / 0.08)',
        float: '0 12px 32px -8px rgb(16 24 40 / 0.25)'
      }
    },
  },
  plugins: [],
}
