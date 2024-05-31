const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  darkMode: ['class'],
  prefix: '',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        softYellow: {
          500: '#F6F49D',
        },
        softRed: {
          500: '#FF7676',
        },
        softGreen: {
          500: '#5DAE8B',
        },
        softBlue: {
          500: '#466C95',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('tw-elements/dist/plugin.cjs'), require('tailwindcss-dark-mode')()],
  variants: ['dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd'],
};
