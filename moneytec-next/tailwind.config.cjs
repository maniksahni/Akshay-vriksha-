/** "The Moneytec Times": newsprint + three riso inks + black. */
module.exports = {
  content: [__dirname + '/index.html', __dirname + '/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1ECE1',
        newsprint: '#E7E0D1',
        ink: '#141413',
        pink: '#FF3EA5',
        blue: '#2B50FF',
        sun: '#FFD83D',
        mint: '#16B57F',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        hand: ['Caveat', 'cursive'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        wiggle: { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        wiggle: 'wiggle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
