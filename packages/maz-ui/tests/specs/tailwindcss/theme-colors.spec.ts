import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getRelativeColorScale } from '@maz-ui/themes/utils/css-generator'
import { SCALED_COLORS } from '@maz-ui/themes/utils/resolve-preset'

const themeColors = readFileSync(resolve(__dirname, '../../../src/tailwindcss/theme-colors.css'), 'utf8')

describe('given the Tailwind colors of maz-ui', () => {
  describe('when reading the scale steps of theme-colors.css', () => {
    it('then every step matches getRelativeColorScale of @maz-ui/themes', () => {
      for (const color of SCALED_COLORS) {
        for (const [step, value] of Object.entries(getRelativeColorScale(`var(--maz-${color})`)))
          expect(themeColors).toContain(`--color-${color}-${step}: ${value};`)
      }
    })
  })
})
