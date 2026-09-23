import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          deep: '#0B2B26',      // Backgrounds / Dark sections
          secondary: '#163832', // Cards / Modals / Accent Dark
          muted: '#1F473F',
          darkest: '#061916',
        },
        ivory: {
          sand: '#FBF9F5',      // Primary light background
          light: '#FFFFFF',
          warm: '#F4F0EA',      // Section alternation
          muted: '#ECE6DC',
        },
        gold: {
          dull: '#C5A880',      // Muted Dull Gold
          radiant: '#D4AF37',   // Primary Gold Accent
          light: '#E5D3B3',
          subtle: 'rgba(212, 175, 55, 0.15)',
          border: 'rgba(197, 168, 128, 0.3)',
        },
        charcoal: {
          slate: '#1A201E',     // Primary typography
          muted: '#4A5551',     // Secondary typography
          subtle: '#6B7A75',
        },
        border: {
          hairline: '#E7E2DA',  // 1px hairline dividers for light backgrounds
          dark: 'rgba(231, 226, 218, 0.12)', // 1px hairline for dark backgrounds
          gold: 'rgba(197, 168, 128, 0.25)',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(11, 43, 38, 0.05)',
        'luxury': '0 20px 40px -15px rgba(11, 43, 38, 0.12)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.18)',
        'dark-card': '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      letterSpacing: {
        'widest-luxury': '0.2em',
        'subtle': '0.05em',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #C5A880 100%)',
        'pine-gradient': 'linear-gradient(180deg, #0B2B26 0%, #061916 100%)',
        'sand-gradient': 'linear-gradient(180deg, #FBF9F5 0%, #F4F0EA 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config
