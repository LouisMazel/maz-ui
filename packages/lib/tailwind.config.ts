// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import type { Config } from 'tailwindcss'
import tailwindConfigBase from './src/tailwindcss/tailwind.config'

export default <Config>{
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
