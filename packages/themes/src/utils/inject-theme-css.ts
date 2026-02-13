import type { MazUiThemeOptions } from '../plugin'
import type { ThemePreset } from '../types'
import type { CSSOptions } from './css-generator'
import { nextTick } from 'vue'
import { CSS_ID, generateCSS, injectCSS } from './css-generator'

export function injectThemeCSS(finalPreset: ThemePreset, config: Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>) {
  if (typeof document === 'undefined')
    return

  const cssOptions: CSSOptions = {
    mode: config.mode,
    darkSelectorStrategy: config.darkModeStrategy,
    darkClass: config.darkClass,
  }

  if (config.injectCriticalCSS) {
    const criticalCSS = generateCSS(finalPreset, {
      ...cssOptions,
      onlyCritical: true,
    })
    injectCSS(CSS_ID, criticalCSS)
  }

  if (!config.injectFullCSS) {
    return
  }

  const fullCSS = generateCSS(finalPreset, cssOptions)

  if (config.strategy === 'runtime') {
    injectCSS(CSS_ID, fullCSS)
  }
  else if (config.strategy === 'hybrid') {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        injectCSS(CSS_ID, fullCSS)
      }, { timeout: 100 })
    }
    else {
      nextTick(() => {
        injectCSS(CSS_ID, fullCSS)
      })
    }
  }
}
