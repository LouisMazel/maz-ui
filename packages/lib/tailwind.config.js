// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
/* eslint-disable unicorn/prefer-module */
const path = require('node:path')

module.exports = {
  mode: 'build',
  presets: [require(path.join(__dirname, './tailwindcss/tailwind.config'))],
  content: ['./package/**/*', 'tailwindcss/**/*'],
  prefix: 'maz-',
  corePlugins: {
    preflight: false,
    container: false,
  },
}
