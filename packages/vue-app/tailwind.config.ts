// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)

import { tailwindConfig } from 'maz-ui/tailwindcss/tailwind.config.js'
import type { Config } from 'tailwindcss'

export default <Config>{
  prefix: 'maz-',
  presets: [tailwindConfig],
  content: ['./../lib/src/**/*', './src/**/*', './index.html'],
  corePlugins: {
    container: false,
    preflight: true,
  },
}
