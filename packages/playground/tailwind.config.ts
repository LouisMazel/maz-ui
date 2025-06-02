// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)

import type { Config } from 'tailwindcss'
import { tailwindConfig } from 'maz-ui/tailwindcss/tailwind.config.js'

export default <Config>{
  prefix: 'maz-',
  presets: [tailwindConfig],
  content: ['./../lib/src/**/*'],
  corePlugins: {
    container: false,
    preflight: true,
  },
}
