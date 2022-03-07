// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  mode: 'jit',
  prefix: 'maz-',
  presets: [
    require(path.join(__dirname, './../lib/tailwindcss/tailwind.config')),
  ],
  purge: ['./src/**/*'],
  corePlugins: {
    container: false,
  },
}
