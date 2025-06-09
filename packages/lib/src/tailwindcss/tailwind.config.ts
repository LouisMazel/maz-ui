import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import { getColors } from './utils/colors'
import { getNumericScreensFromTailwind, screens } from './variables/breakpoints'
import { designTokens } from './variables/design-tokens'
import { utilities } from './variables/utilities'
import { zIndex } from './variables/z-indexes'

export { getNumericScreensFromTailwind }

export function defineMazTailwindConfig(config?: Partial<Config> & { content: Config['content'] }) {
  return {
    darkMode: ['class', '[class~="dark"]'],
    content: [],
    theme: {
      extend: {
        ...designTokens,
        colors: getColors(),
        screens,
        zIndex,
      },
    },
    plugins: [
      plugin(({ addUtilities }) => {
        addUtilities(utilities)
      }),
    ],
    ...config,
  } satisfies Config
}
