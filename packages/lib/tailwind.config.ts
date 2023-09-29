// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import type { Config } from 'tailwindcss'
import tailwindConfigBase from './tailwindcss/tailwind.config'

export default <Config>{
  mode: 'build',
  presets: [tailwindConfigBase],
  content: {
    files: ['modules/**/*', 'components/**/*'],
  },
  // transform: {
  // vue: (content) => {
  // const regex = /<style[^>]*>([\S\s]*?)<\/style>/g
  // return content.replaceAll(regex, '')
  // },
  // },
  prefix: 'maz-',
  corePlugins: {
    preflight: false,
    container: false,
  },
}
