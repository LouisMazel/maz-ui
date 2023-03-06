const tailwindConfig = require('maz-ui/package/tailwindcss/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tailwindConfig],
  prefix: 'maz-',
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md',
    './../lib/package/**/*.vue'
  ]
}
