/** Moneytec "dark luxury" tokens: warm black, ivory type, champagne gold, hairline rules. */
module.exports = {
  content: [__dirname + '/index.html', __dirname + '/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0A09',
        ink2: '#100E0C',
        ink3: '#17140F',
        paper: '#EFE8DC',
        haze: 'rgba(239,232,220,0.64)',
        dim: 'rgba(239,232,220,0.42)',
        line: 'rgba(233,215,180,0.12)',
        amber: '#E8CFA0',
        rose: '#C9A06A',
        violet: '#8E6A43',
        mint: '#B8C4A2',
        sky: '#A8B4C2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      letterSpacing: { tightest: '-0.05em' },
    },
  },
  plugins: [],
};
