import type { App, Plugin, Ref } from 'vue'
import type { ThemeConfig, ThemePreset, ThemeState } from './types'
import type { CSSOptions } from './utils/css-generator'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { nextTick, ref, watch } from 'vue'
import { useMutationObserver } from '../../lib/src/composables/useMutationObserver'
import { getPreset, mergePresets } from './utils'
import {
  CSS_ID,
  generateCSS,
  injectCSS,
} from './utils/css-generator'
import { getColorMode, getSavedColorMode, getSystemColorMode } from './utils/get-color-mode'
import { updateDocumentClass } from './utils/update-document-class'

export interface MazUiThemeOptions extends Omit<ThemeConfig, 'prefix'> {
  /**
   * Inject critical CSS
   * @description Inject critical CSS to prevent FOUC
   * @default true
   * @private
   */
  injectCriticalCSS?: boolean

  /**
   * Inject full CSS
   * @description Inject full CSS to ensure all styles are loaded
   * @default true
   * @private
   */
  injectFullCSS?: boolean
}

export interface SetupThemeReturn {
  themeState: Ref<ThemeState>
  cleanup: () => void
}

function injectThemeCSS(finalPreset: ThemePreset, config: Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>) {
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

function injectThemeState(app: App, themeState: Ref<ThemeState>) {
  app.provide('mazThemeState', themeState)
  app.config.globalProperties.$mazThemeState = themeState
}

function watchColorSchemeFromMedia(themeState: Ref<ThemeState>): () => void {
  if (isServer())
    return () => {}

  let mediaCleanup: (() => void) | undefined

  if (themeState.value && themeState.value.colorMode === 'auto') {
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)')

    const updateFromMedia = () => {
      if (themeState.value.colorMode === 'auto') {
        const newColorMode = mediaQuery.matches ? 'dark' : 'light'
        updateDocumentClass(newColorMode === 'dark', themeState.value)
        themeState.value.isDark = newColorMode === 'dark'
      }
    }

    mediaQuery.addEventListener('change', updateFromMedia)
    mediaCleanup = () => mediaQuery.removeEventListener('change', updateFromMedia)
  }

  const stopWatch = watch(() => themeState.value.colorMode, (colorMode) => {
    updateDocumentClass(
      colorMode === 'auto' ? getSystemColorMode() === 'dark' : colorMode === 'dark',
      themeState.value,
    )
  })

  return () => {
    mediaCleanup?.()
    stopWatch()
  }
}

function watchMutationClassOnHtmlElement(themeState: Ref<ThemeState>): () => void {
  if (isServer())
    return () => {}

  const { stop } = useMutationObserver(
    document.documentElement,
    () => {
      if (isServer() || !themeState.value)
        return

      const activeColorMode = document.documentElement.classList.contains(themeState.value.darkClass) ? 'dark' : 'light'
      themeState.value.isDark = activeColorMode === 'dark'

      if (themeState.value.colorMode !== activeColorMode && themeState.value.colorMode !== 'auto') {
        themeState.value.colorMode = activeColorMode
      }
    },
    {
      attributes: true,
    },
  )

  return stop
}

/**
 * Sets up the theme state, CSS injection, and watchers without binding to a Vue app.
 * The caller is responsible for calling `app.provide()` and setting `app.config.globalProperties`.
 */
export async function setupTheme(options: MazUiThemeOptions): Promise<SetupThemeReturn> {
  const config = {
    strategy: 'hybrid',
    overrides: {},
    darkModeStrategy: 'class',
    preset: undefined,
    injectCriticalCSS: true,
    injectFullCSS: true,
    mode: 'both',
    darkClass: 'dark',
    ...options,
    colorMode: getSavedColorMode() ?? options.colorMode ?? (options.mode === 'dark' ? 'dark' : 'auto'),
  } satisfies Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>

  const isDark = config.colorMode === 'auto' && config.mode === 'both'
    ? getSystemColorMode() === 'dark' || getColorMode(config.colorMode) === 'dark'
    : getColorMode(config.colorMode) === 'dark' || config.mode === 'dark'

  const themeState = ref<Required<Omit<ThemeState, 'preset'>> & Pick<ThemeState, 'preset'>>({
    strategy: config.strategy,
    darkClass: config.darkClass,
    darkModeStrategy: config.darkModeStrategy,
    colorMode: config.colorMode,
    mode: config.mode,
    preset: undefined,
    // @ts-expect-error _isDark is a private property
    isDark: options._isDark || isDark,
  })

  updateDocumentClass(themeState.value.isDark, themeState.value)

  const preset = config.strategy === 'buildtime' ? config.preset : await getPreset(config.preset)

  const finalPreset = Object.keys(config.overrides).length > 0 && preset
    ? mergePresets(preset, config.overrides)
    : preset

  if (finalPreset) {
    themeState.value.preset = finalPreset
  }

  if (config.strategy === 'buildtime' || !finalPreset) {
    return { themeState: themeState as Ref<ThemeState>, cleanup: () => {} }
  }

  injectThemeCSS(finalPreset, config)

  const cleanupColorScheme = watchColorSchemeFromMedia(themeState)
  const cleanupMutation = watchMutationClassOnHtmlElement(themeState)

  const cleanup = () => {
    cleanupColorScheme()
    cleanupMutation()
  }

  return { themeState: themeState as Ref<ThemeState>, cleanup }
}

/**
 * @example
 * ```ts
 * import { MazUiTheme } from '@maz-ui/themes/plugin'
 * import { mazUi } from '@maz-ui/themes/presets/mazUi'
 *
 * app.use(MazUiTheme, {
 *   preset: mazUi,
 *   strategy: 'hybrid',
 *   darkMode: 'class',
 * })
 * ```
 */
export const MazUiTheme: Plugin<[MazUiThemeOptions]> = {
  async install(app: App, options) {
    const { themeState } = await setupTheme(options)
    injectThemeState(app, themeState)
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Maz theme plugin options
     * @description You should install the plugin to use this property
     * @example
     * ```ts
     * import { MazUi } from 'maz-ui/plugins/maz-ui'
     * import { createApp } from 'vue'
     *
     * const app = createApp(App)
     * app.use(MazUi)
     *
     * const { setColorMode, toggleDarkMode } = useTheme()
     * setColorMode('dark')
     * toggleDarkMode()
     */
    $mazThemeState: Ref<ThemeState>
  }
}
