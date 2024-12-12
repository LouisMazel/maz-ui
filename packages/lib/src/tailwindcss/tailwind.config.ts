// @ts-check

import type { Config } from 'tailwindcss'
// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import plugin from 'tailwindcss/plugin'

import { getColors } from './utils/colors'
import { getNumericScreensFromTailwind, screens } from './variables/breakpoints'
import { utilities } from './variables/utilities'
import { zIndex } from './variables/z-indexes'

export { getNumericScreensFromTailwind }

export const baseConfig = {
  darkMode: ['class', '[class~="dark"]'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        base: 'var(--maz-font-family)',
      },
      zIndex,
      screens,
      colors: getColors(),
      borderWidth: {
        0: '0',
        1: '1px',
        DEFAULT: 'var(--maz-border-width)',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      borderRadius: {
        DEFAULT: 'var(--maz-border-radius)',
      },
      spacing: {},
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(utilities)
    }),
  ],
  corePlugins: {
    preflight: false,
  },
} satisfies Config

export const tailwindConfig = { ...baseConfig, corePlugins: { preflight: true } } satisfies Config

export default baseConfig
