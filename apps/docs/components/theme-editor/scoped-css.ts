import type { ThemePreset } from '@maz-ui/themes'
import { generateCSS } from '@maz-ui/themes/utils/css-generator'
import themeColorsCss from '../../../../packages/maz-ui/src/tailwindcss/theme-colors.css?raw'

/** Attribute of the elements that render the draft theme instead of the theme of the docs */
export const PREVIEW_ATTRIBUTE = 'data-theme-preview'

const SELECTOR = `[${PREVIEW_ATTRIBUTE}]`

/**
 * The Tailwind colors are computed on `:root` from the `--maz-*` variables of the docs: they are declared
 * again on the preview so the scales follow the draft. The other tokens are inlined (`@theme inline`).
 */
const COLOR_BRIDGE = [
  ...themeColorsCss.matchAll(/^\s*--color-([\w-]+): ([^;]+);$/gm),
]
  .map(([, name, value]) => `--maz-color-${name}: ${value};`)
  .join('')

/** CSS of the preset scoped to the preview elements. The color scheme stays the one of the page. */
export function getScopedThemeCss(preset: ThemePreset): string {
  const css = generateCSS(preset, { mode: 'both', darkSelectorStrategy: 'class', darkClass: 'dark' })
    .split('\n')
    .filter(line => !line.includes('color-scheme'))
    .join('\n')
    .replaceAll(':root:root', `${SELECTOR}${SELECTOR}`)
    .replaceAll(':root', SELECTOR)

  return `@layer theme { ${SELECTOR} { ${COLOR_BRIDGE} } }\n${css}`
}
