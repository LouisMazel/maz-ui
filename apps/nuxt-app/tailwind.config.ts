import { defineMazTailwindConfig } from 'maz-ui/tailwindcss/tailwind.config'

export default defineMazTailwindConfig({
  prefix: 'maz-',
  content: ['./../../packages/lib/src/**/*'],
  corePlugins: {
    container: false,
    preflight: true,
  },
})
