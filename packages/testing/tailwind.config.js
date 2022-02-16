// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  presets: [
    require(path.join(
      __dirname,
      './../lib/package/tailwindcss/tailwind.config',
    )),
  ],
  purge: ['./src/**/*'],
}
