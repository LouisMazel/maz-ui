// @ts-check

// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

import { utilities } from './variables/utilities'
import { screens } from './variables/breakpoints'
import { zIndex } from './variables/z-indexes'
import { getColors } from './utils/colors'

import tailwindCSSVariable from 'tailwind-css-variables'

export default <Config>{
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      // backgroundColor: ['even', 'odd'],
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
    tailwindCSSVariable({
      colors: false,
      screens: 'screen',
      fontFamily: false,
      fontSize: false,
      fontWeight: false,
      lineHeight: false,
      letterSpacing: false,
      backgroundSize: false,
      borderWidth: false,
      borderRadius: false,
      width: false,
      height: false,
      minWidth: false,
      minHeight: false,
      maxWidth: false,
      maxHeight: false,
      padding: false,
      margin: false,
      boxShadow: false,
      zIndex: false,
      opacity: false,
    }),
    plugin(({ addUtilities }) => {
      addUtilities(utilities)
    }),
  ],
}
