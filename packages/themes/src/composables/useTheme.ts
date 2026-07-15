import type { Ref } from 'vue'
import type { ColorMode, ThemePreset, ThemePresetName, ThemePresetOverrides, ThemeState } from '../types'
import type { CSSOptions } from '../utils/css-generator'
import { setCookie } from '@maz-ui/utils/helpers/cookie'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { computed, getCurrentInstance, inject, ref, watch } from 'vue'

import { noTransition } from '../utils'
import { saveResolvedPresetName } from '../utils/cookie-storage'
import { CSS_ID, generateCSS, injectCSS } from '../utils/css-generator'
import { getSystemColorMode, saveResolvedColorMode } from '../utils/get-color-mode'
import { getPreset } from '../utils/get-preset'
import { mergePresets } from '../utils/preset-merger'

const themeState = ref<ThemeState>()

const colorMode = computed<ColorMode>({
  get: () => themeState.value?.colorMode as ColorMode,
  /**
   * Setter fires `setColorMode(mode)` synchronously (Promise<void> is discarded).
   * If you need to await the change (e.g., when `animate: true` is used), call
   * `setColorMode(mode)` directly to receive the Promise.
   */
  set: mode => void setColorMode(mode),
})

const isDark = computed(() => themeState.value?.isDark || false)
const strategy = computed(() => themeState.value?.strategy as Required<ThemeState>['strategy'])
const mode = computed(() => themeState.value?.mode as Required<ThemeState>['mode'])
const darkModeStrategy = computed(() => themeState.value?.darkModeStrategy as Required<ThemeState>['darkModeStrategy'])
const preset = computed(() => themeState.value?.preset as Required<ThemeState>['preset'])
const presetName = computed(() => preset.value?.name as string)

async function updateTheme(preset: ThemePreset | ThemePresetOverrides | ThemePresetName) {
  if (!themeState.value)
    return

  const _preset = typeof preset === 'string' ? await getPreset(preset) : preset

  if (!_preset || !themeState.value.preset) {
    console.error('[@maz-ui/themes] No preset found — with buildtime strategy you must pass a full preset')
    return
  }

  const newPreset = 'name' in _preset && _preset.name !== themeState.value.preset.name
    ? _preset as ThemePreset
    : mergePresets(themeState.value.preset, _preset)

  themeState.value.preset = newPreset
  if (themeState.value.persistPreset) {
    saveResolvedPresetName(newPreset.name)
  }

  if (themeState.value.strategy === 'runtime') {
    const cssOptions: CSSOptions = {
      mode: themeState.value.mode,
      darkSelectorStrategy: themeState.value.darkModeStrategy,
      prefix: 'maz',
      darkClass: themeState.value.darkClass,
      lightClass: themeState.value.lightClass,
    }

    const fullCSS = generateCSS(newPreset, cssOptions)
    injectCSS(CSS_ID, fullCSS)
  }
}

async function setColorMode(colorMode: ColorMode, options: { animate?: boolean } = {}): Promise<void> {
  if (!themeState.value)
    return

  const apply = () => {
    themeState.value!.colorMode = colorMode
    setCookie('maz-color-mode', colorMode)
    if (colorMode === 'auto') {
      saveResolvedColorMode(getSystemColorMode() === 'dark' ? 'dark' : 'light')
    }
  }

  if (options.animate) {
    const { runViewTransition } = await import('../utils/view-transition')
    await runViewTransition(apply)
  }
  else {
    apply()
  }
}

function toggleDarkMode(options: { animate?: boolean } = {}): Promise<void> {
  return setColorMode(isDark.value ? 'light' : 'dark', options)
}

let stopInjectedWatch: (() => void) | undefined

function setThemeStateFromGlobalProperties() {
  themeState.value = undefined
  stopInjectedWatch?.()
  stopInjectedWatch = undefined

  try {
    const injectedState = inject<Ref<ThemeState> | undefined>('mazThemeState', undefined)
    themeState.value = injectedState?.value

    if (injectedState) {
      stopInjectedWatch = watch(injectedState, (newState) => {
        if (newState) {
          themeState.value = newState
        }
      }, { deep: true })
    }

    if (!themeState.value) {
      throw new Error('mazThemeState not found')
    }
  }
  catch {
    const instance = getCurrentInstance()
    if (instance?.appContext?.app?.config?.globalProperties) {
      themeState.value = instance.appContext.app.config.globalProperties.$mazThemeState.value
    }
  }
}

export function useTheme() {
  if (isServer()) {
    themeState.value = undefined
  }
  try {
    if (!themeState.value) {
      setThemeStateFromGlobalProperties()
    }

    if (!themeState.value) {
      throw new Error('[@maz-ui/themes] no theme state found')
    }
  }
  catch {
    throw new Error('[@maz-ui/themes] useTheme requires the MazUi/MazUiTheme plugin or a MazUiProvider wrapper')
  }

  return {
    /**
     * Current theme preset
     */
    preset,
    /**
     * Current theme name
     */
    presetName,
    /**
     * Current color mode
     * @description The color mode - Can be 'auto', 'dark' or 'light'
     */
    colorMode,
    /**
     * Whether the current color mode is dark
     */
    isDark,
    /**
     * Strategy used to apply the theme
     */
    strategy,
    /**
     * Update the theme
     * @param preset The new theme preset
     * @description Update the theme with a new preset or override some tokens
     */
    updateTheme(preset: ThemePreset | ThemePresetOverrides | ThemePresetName): ReturnType<typeof updateTheme> {
      return noTransition(updateTheme, preset)
    },
    /**
     * Set the color mode
     * @description Set the color mode - Can be 'auto', 'dark' or 'light'
     * @param colorMode The new color mode
     * @param options.animate When `true`, wrap the change in a View Transition for a smooth full-page animation. Lazy-imports the helper so unused code stays out of the boot bundle.
     * @returns A `Promise<void>` that resolves once the change (and optional transition) is applied. Callers may ignore the return.
     */
    setColorMode,
    /**
     * Toggle the dark mode
     * @description Toggle the dark mode
     * @param options.animate When `true`, wrap the toggle in a View Transition.
     * @returns A `Promise<void>` that resolves once the change (and optional transition) is applied.
     */
    toggleDarkMode,
    /**
     * Mode
     * @description Supported themes - Can be 'both', 'light' or 'dark'
     */
    mode,
    /**
     * Dark mode strategy
     * @description Strategy used to apply the dark mode - Can be 'class' or 'media'
     */
    darkModeStrategy,
    /**
     * @deprecated use `preset` instead
     */
    currentPreset: preset,
  }
}
