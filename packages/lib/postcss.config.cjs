module.exports = {
  plugins: {
    'postcss-url': {},
    '@tailwindcss/postcss': {},
    'postcss-replace': {
      pattern: /(--tw|\*)/g,
      data: {
        '--tw': '--maz-tw',
      },
    },
  },
}
