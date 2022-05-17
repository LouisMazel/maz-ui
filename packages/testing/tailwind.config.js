// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)

const tailwindConfig = require('maz-ui/tailwindcss/tailwind.config')

module.exports = {
  mode: 'jit',
  prefix: 'maz-',
  presets: [tailwindConfig],
  purge: ['./src/**/*'],
  corePlugins: {
    container: false,
  },
}
