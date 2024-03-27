// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)

// import type { Config } from 'tailwindcss'
import tailwindConfigBase from 'maz-ui/tailwindcss/tailwind.config.ts'

export default {
  prefix: 'maz-',
  presets: [tailwindConfigBase],
  content: ['./src/**/*.{ts,tsx,html,css,pcss}'],
  corePlugins: {
    container: false,
  },
}
