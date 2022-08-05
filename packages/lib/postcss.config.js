module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('postcss-simple-vars'),
    require('postcss-url'),
    require('postcss-nested'),
    require('postcss-import'),
    require('autoprefixer'),
    require('tailwindcss'),
  ],
}
