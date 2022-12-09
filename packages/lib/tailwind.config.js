// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
/* eslint-disable unicorn/prefer-module */
const path = require('node:path')

module.exports = {
  mode: 'build',
  presets: [
    require(path.join(__dirname, './package/tailwindcss/tailwind.config')),
  ],
  content: [
    './package/**/*',
    'tailwindcss/**/*',
    '!package/components_tmp/**/*',
  ],
  prefix: 'maz-',
  corePlugins: {
    preflight: false,
    container: false,
  },
}
