// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import type { Config } from 'tailwindcss'
import tailwindConfigBase from './tailwindcss/tailwind.config'

export default <Config>{
  mode: 'build',
  presets: [tailwindConfigBase],
  content: {
    files: ['./modules/**/*', './components/**/*', 'tailwindcss/**/*', '!components_tmp/**/*'],
    transform: {
      vue: (content) => {
        const regex = /<style[^>]*>([\s\S]*?)<\/style>/g
        // @ts-expect-error - not include in tsconfig
        return content.replaceAll(regex, '')
      },
    },
  },
  prefix: 'maz-',
  corePlugins: {
    preflight: false,
    container: false,
  },
}
