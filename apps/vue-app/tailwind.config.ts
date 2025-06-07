import { defineMazTailwindConfig } from 'maz-ui/tailwindcss/tailwind.config.js'

export default defineMazTailwindConfig({
  prefix: 'maz-',
  content: ['./../../packages/lib/src/**/*', './src/**/*', './index.html'],
  corePlugins: {
    container: false,
    preflight: true,
  },
})
