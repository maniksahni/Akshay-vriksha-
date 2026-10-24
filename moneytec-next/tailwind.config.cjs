/** Apple-style tokens: paper white, near-black, quiet greys, one signature gradient. */
module.exports = {
  content: [__dirname + '/index.html', __dirname + '/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        snow: '#FBFBFD',
        cloud: '#F5F5F7',
        mist: '#E8E8ED',
        graphite: '#86868B',
        slate: '#6E6E73',
        coal: '#1D1D1F',
        night: '#000000',
        link: '#0071E3',
        linkdark: '#2997FF',
        mint: '#30D158',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter2: '-0.03em',
      },
    },
  },
  plugins: [],
};
