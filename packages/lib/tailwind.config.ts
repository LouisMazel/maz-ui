// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import type { Config } from 'tailwindcss'
import { tailwindConfig } from './tailwindcss/tailwind.config'

export default <Config>{
  mode: 'build',
  presets: [tailwindConfig],
  content: {
    files: ['./modules/**/*', './components/**/*', 'tailwindcss/**/*', '!components_tmp/**/*'],
    transform: {
      vue: (content) => {
        const regex = /<style[^>]*>([\s\S]*?)<\/style>/g
        return content.replaceAll(regex, '')
      },
    },
  },
  prefix: 'maz-',
}
