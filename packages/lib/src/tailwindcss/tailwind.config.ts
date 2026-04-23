import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import { getColors } from './utils/colors'
import { getNumericScreensFromTailwind, screens } from './variables/breakpoints'
import { designTokens } from './variables/design-tokens'
import { utilities as defaultUtilities } from './variables/utilities'
import { zIndex } from './variables/z-indexes'

export { getNumericScreensFromTailwind }

/**
 * @deprecated Tailwind v4 is configured in CSS, not JavaScript. Consumers should
 * write their own `@import "tailwindcss"` entry and import the maz-ui bridge via
 * `@import "maz-ui/tailwindcss/theme.css"` (see the migration guide in
 * `apps/docs/src/guide/migration/v4-to-v5.md`). This helper still produces a
 * valid v3-shaped config object for projects that haven't migrated yet but it
 * is no longer used by maz-ui itself and will be removed in v6.
 */
export function defineMazTailwindConfig(config?: Partial<Config> & { content: Config['content'] }, { utilities }: { utilities?: Record<string, any> } = {}) {
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
        addUtilities({
          ...defaultUtilities,
          ...utilities,
        })
      }),
    ],
    ...config,
  } satisfies Config
}
