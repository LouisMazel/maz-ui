import { defineMazTailwindConfig } from './src/tailwindcss/tailwind.config'

const regex = /<style[^>]*>([\s\S]*?)<\/style>/g

export default defineMazTailwindConfig({
  content: {
    files: ['./src/**/*', 'tailwindcss/**/*'],
    transform: {
      vue: (content) => {
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
