import { defineMazTailwindConfig } from './tailwindcss/tailwind.config'

export default defineMazTailwindConfig({
  content: {
    files: ['./src/**/*', 'tailwindcss/**/*'],
    transform: {
      vue: (content) => {
        const regex = /<style[^>]*>([\s\S]*?)<\/style>/g
        return content.replaceAll(regex, '')
      },
    },
  },
  prefix: 'maz-',
  corePlugins: {
    preflight: false,
    container: false,
  },
})
