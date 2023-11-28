// @ts-check

// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

import { utilities } from './variables/utilities'
import { screens, getNumericScreensFromTailwind } from './variables/breakpoints'
import { zIndex } from './variables/z-indexes'
import { getColors } from './utils/colors'

export { getNumericScreensFromTailwind }

export default {
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
} satisfies Config
