import { defineMazTailwindConfig } from 'maz-ui/src/tailwindcss/tailwind.config.js'

export default defineMazTailwindConfig({
  prefix: 'maz-',
  darkMode: ['class', '[class~="dark"]'],
  content: [
    './.vitepress/**/*.{js,ts,vue}',
    './src/**/*.md',
    './../lib/src/components/**/*.vue',
    './../lib/src/modules/**/*.vue',
  ],
})
