module.exports = {
  syntax: 'postcss-scss',
  plugins: {
    'postcss-url': {},
    'postcss-nested': {},
    'tailwindcss/nesting': {},
    'postcss-import': {},
    'autoprefixer': {},
    'tailwindcss': {},
    'postcss-replace': {
      pattern: /(--tw|\*)/g,
      data: {
        '--tw': '--maz-tw',
      },
    },
  },
}
