import type { MazUiThemeOptions } from '../plugin.ts'
import type { ThemePreset } from '../types/index.ts'
import { CSS_ID, generateCSS, injectCSS } from './css-generator.ts'

export function injectThemeCSS(
  finalPreset: ThemePreset,
  config: Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>,
) {
  if (typeof document === 'undefined' || config.strategy === 'buildtime')
    return

  injectCSS(CSS_ID, generateCSS(finalPreset, {
    mode: config.mode,
    darkSelectorStrategy: config.darkModeStrategy,
    darkClass: config.darkClass,
    lightClass: config.lightClass,
  }))
}
