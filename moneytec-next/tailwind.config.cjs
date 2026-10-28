/** Moneytec "night cinema" tokens: one ink-black world, warm aurora light, quiet glass. */
module.exports = {
  content: [__dirname + '/index.html', __dirname + '/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07060B',
        ink2: '#0E0C14',
        ink3: '#16131E',
        paper: '#F4F1F8',
        haze: 'rgba(244,241,248,0.62)',
        dim: 'rgba(244,241,248,0.42)',
        line: 'rgba(255,255,255,0.09)',
        amber: '#FF9F0A',
        rose: '#FF375F',
        violet: '#BF5AF2',
        mint: '#5BF0B5',
        sky: '#64D2FF',
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
