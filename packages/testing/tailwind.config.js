// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)

const tailwindConfig = require('maz-ui/package/tailwindcss/tailwind.config')

module.exports = {
  mode: 'jit',
  prefix: 'maz-',
  presets: [tailwindConfig],
  content: ['./src/**/*'],
  corePlugins: {
    container: false,
  },
}
