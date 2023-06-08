// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)

import type { Config } from 'tailwindcss'
import tailwindConfigBase from 'maz-ui/tailwindcss/tailwind.config'

export default <Config>{
  prefix: 'maz-',
  presets: [tailwindConfigBase],
  content: ['./src/**/*', './../lib/modules/**/*', './../lib/components/**/*'],
  corePlugins: {
    container: false,
  },
}
