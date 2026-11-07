import type { MazUiThemeOptions } from '@maz-ui/themes'
import { folio } from '@maz-ui/themes/presets/folio'
import { DOCS_COLOR_SCALE } from './color-scale.ts'

/** Theme of the docs, shared by the app (`theme/index.ts`) and the CSS baked into the static HTML (`config.mts`). */
export const DOCS_THEME = {
  preset: folio,
  darkModeStrategy: 'class',
  strategy: 'runtime',
  persistPreset: true,
  overrides: {
    scales: {
      color: DOCS_COLOR_SCALE,
    },
  },
} satisfies MazUiThemeOptions
