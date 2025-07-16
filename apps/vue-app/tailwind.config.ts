import { defineMazTailwindConfig } from 'maz-ui/src/tailwindcss/tailwind.config.js'

export default defineMazTailwindConfig({
  prefix: 'maz-',
  content: ['./../../packages/lib/src/**/*', './src/**/*', './index.html'],
  corePlugins: {
    container: false,
    preflight: true,
  },
})
