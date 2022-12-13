// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
/* eslint-disable unicorn/prefer-module */
const path = require('node:path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'build',
  presets: [
    require(path.join(__dirname, './package/tailwindcss/tailwind.config')),
  ],
  content: {
    files: [
      './package/**/*',
      'tailwindcss/**/*',
      '!package/components_tmp/**/*',
    ],
    transform: {
      vue: (content) => {
        const regex = /<style[^>]*>([\S\s]*?)<\/style>/g
        return content.replace(regex, '')
      },
    },
  },
  prefix: 'maz-',
  corePlugins: {
    preflight: false,
    container: false,
  },
}
