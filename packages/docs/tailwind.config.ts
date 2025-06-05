import { defineMazTailwindConfig } from 'maz-ui/tailwindcss/tailwind.config.js'

export default defineMazTailwindConfig({
  prefix: 'maz-',
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md',
    './../lib/src/components/**/*.vue',
    './../lib/src/modules/**/*.vue',
  ],
})
