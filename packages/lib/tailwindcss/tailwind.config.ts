import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import { getColors } from './utils/colors'
import { getNumericScreensFromTailwind, screens } from './variables/breakpoints'
import { designTokens } from './variables/design-tokens'
import { utilities } from './variables/utilities'
import { zIndex } from './variables/z-indexes'

export { getNumericScreensFromTailwind }

export function defineMazTailwindConfig(config?: Partial<Config> & { content: Config['content'] }): Config {
  return {
    darkMode: ['class', 'media'],
    content: [],
    theme: {
      extend: {
        // Design tokens du système de thèmes
        ...designTokens,

        // Couleurs avec support alpha
        colors: getColors(),

        // Écrans responsives
        screens,

        // Z-index
        zIndex,
      },
    },
    plugins: [
      // Plugin utilitaires personnalisés
      plugin(({ addUtilities }) => {
        addUtilities(utilities)
      }),
    ],
    ...config,
  } satisfies Config
}

// Export de la config par défaut
export default defineMazTailwindConfig()
