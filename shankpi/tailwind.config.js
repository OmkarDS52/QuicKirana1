/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF6B35',
          dark: '#E55A28',
          light: '#FF8F66',
        },
        forest: {
          DEFAULT: '#2D6A4F',
          dark: '#1B4332',
          light: '#40916C',
        },
        cream: '#FFFBF5',
        warm: {
          50: '#FFFBF5',
          100: '#FFF5E8',
          200: '#FFE8CC',
          800: '#3D2E1F',
          900: '#2A1F14',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(42, 31, 20, 0.08)',
        lift: '0 8px 24px rgba(42, 31, 20, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'cart-bounce': 'cartBounce 0.5s ease',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.35s ease',
      },
      keyframes: {
        cartBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
