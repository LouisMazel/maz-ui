import { defineMazTailwindConfig } from 'maz-ui/src/tailwindcss/tailwind.config.js'

export default defineMazTailwindConfig({
  prefix: 'maz-',
  darkMode: ['class', '[class~="dark"]'],
  content: [
    './.vitepress/**/*.{js,ts,vue,css}',
    './src/**/*.{md,js,ts,vue,css}',
    './components/**/*.{js,ts,vue,css}',
    './../lib/src/components/**/*.vue',
    './../lib/src/modules/**/*.vue',
  ],
})
