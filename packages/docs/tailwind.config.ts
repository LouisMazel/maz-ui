import type { Config } from 'tailwindcss'
import tailwindConfigBase from 'maz-ui/tailwindcss/tailwind.config'

export default <Config> {
  presets: [tailwindConfigBase],
  prefix: 'maz-',
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
    './docs/**/*.md',
    './../lib/components/**/*.vue',
    './../lib/modules/**/*.vue'
  ]
}
