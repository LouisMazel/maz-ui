import { defineMazTailwindConfig } from 'maz-ui/tailwindcss/tailwind.config.js'

export default defineMazTailwindConfig({
  prefix: 'maz-',
  content: ['./../lib/src/**/*'],
  corePlugins: {
    container: false,
    preflight: true,
  },
})
