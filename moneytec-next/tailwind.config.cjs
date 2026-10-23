/** Moneytec design tokens: near-black base, acid lime + electric violet, chunky display type. */
module.exports = {
  content: [__dirname + '/index.html', __dirname + '/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#09090B',
        coal: '#121215',
        ash: '#1C1C21',
        line: 'rgba(255,255,255,0.09)',
        chalk: '#F4F2EC',
        lime: { DEFAULT: '#D4FF3A', deep: '#A8D400' },
        volt: { DEFAULT: '#8B6CFF', soft: '#B9A8FF' },
        coral: '#FF6B4A',
        sky: '#5CE1E6',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
    },
  },
  plugins: [],
};
