/** Moneytec "daylight" tokens: a warm ivory page, ink-dark type, the same amber, rose and violet light. */
module.exports = {
  content: [__dirname + '/index.html', __dirname + '/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#FBF8F3',
        ink2: '#F4EFE8',
        ink3: '#FFFFFF',
        paper: '#17131D',
        haze: 'rgba(23,19,29,0.78)',
        dim: 'rgba(23,19,29,0.62)',
        line: 'rgba(23,19,29,0.10)',
        amber: '#FF9F0A',
        rose: '#FF375F',
        violet: '#BF5AF2',
        mint: '#047857',
        sky: '#0284C7',
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
