/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/index.html', './src/renderer/src/**/*.tsx'],
  theme: {
    colors: {
      white: '#FFF',
      gray: {
        lighter: '#656976',
        light: '#555862',
        DEFAULT: '#44474E',
        dark: '#34353A',
        darker: '#232426',
      },
      black: '#111213',
      blue: {
        lighter: '#72C2F0',
        light: '#45AEEA',
        DEFAULT: '#1B99E0',
        dark: '#177AB2',
        darker: '#125B84',
      },
      yellow: {
        DEFAULT: '#ECC917',
      },
      transparent: '#ffffff00',
    },
    boxShadow: {
      DEFAULT:
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    dropShadow: {
      DEFAULT:
        'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
    },
    extend: {},
  },
  plugins: [],
};
