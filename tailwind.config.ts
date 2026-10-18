import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#06110D',
        forest: '#0C1F18',
        moss: '#163328',
        bone: '#F3EEE5',
        paper: '#EAE3D6',
        ink: '#13201B',
        gold: { DEFAULT: '#D9AE5B', soft: '#E9CD8F', deep: '#A9802F' },
        ember: '#C4622D',
        sage: '#8FA89A',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        deva: ['"Tiro Devanagari Sanskrit"', '"Instrument Serif"', 'serif'],
      },
      letterSpacing: {
        eyebrow: '0.28em',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(8px)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        float: 'float 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
