import type { Config } from 'tailwindcss'
import tailwindConfig from 'maz-ui/tailwindcss/tailwind.config.js'

export default <Config>{
  presets: [tailwindConfig],
  prefix: 'maz-',
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md',
    './../lib/src/components/**/*.vue',
    './../lib/src/modules/**/*.vue',
  ],
}
