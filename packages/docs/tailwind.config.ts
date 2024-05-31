import type { Config } from 'tailwindcss'
import { tailwindConfig } from 'maz-ui/tailwindcss/tailwind.config.ts'

export default <Config>{
  presets: [tailwindConfig],
  prefix: 'maz-',
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md',
    './../lib/components/**/*.vue',
    './../lib/modules/**/*.vue'
  ]
}
