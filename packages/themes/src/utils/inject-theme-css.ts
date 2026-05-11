import type { MazUiThemeOptions } from '../plugin'
import type { ThemePreset, ThemeState } from '../types'
import { CSS_ID, generateCSS, injectCSS } from './css-generator'

export function injectThemeCSS(
  finalPreset: ThemePreset,
  config: Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>,
  resolvedTransition: ThemeState['colorTransition'],
) {
  if (typeof document === 'undefined' || config.strategy === 'buildtime')
    return

  injectCSS(CSS_ID, generateCSS(finalPreset, {
    mode: config.mode,
    darkSelectorStrategy: config.darkModeStrategy,
    darkClass: config.darkClass,
    lightClass: config.lightClass,
    scaleColorVariables: true,
    colorTransition: resolvedTransition,
  }))
}
