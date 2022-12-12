// @ts-check

// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
/* eslint-disable unicorn/prefer-module */
const plugin = require('tailwindcss/plugin')

const UTILITIES = require('./variables/utilities')
const BREAKPOINTS = require('./variables/breakpoints')
const Z_INDEXES = require('./variables/z-indexes')
const { colors } = require('./utils/colors')

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: ['even', 'odd'],
      fontFamily: {
        base: 'var(--maz-font-family)',
      },
      zIndex: Z_INDEXES,
      screens: BREAKPOINTS,
      colors: colors(),
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
    require('tailwind-css-variables')({
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
      addUtilities(UTILITIES)
    }),
  ],
}