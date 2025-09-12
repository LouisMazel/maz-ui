import type { Ref } from 'vue'
import type { ColorMode, ThemePreset, ThemePresetName, ThemePresetOverrides, ThemeState } from '../types'
import type { CriticalCSSOptions, FullCSSOptions } from '../utils/css-generator'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { computed, getCurrentInstance, inject, ref } from 'vue'

import { setCookie } from '../utils/cookie-storage'
import { CSS_IDS, generateCriticalCSS, generateFullCSS, injectCSS } from '../utils/css-generator'
import { getPreset } from '../utils/get-preset'
import { mergePresets } from '../utils/preset-merger'

const themeState = ref<ThemeState>()

const colorMode = computed<ColorMode>({
  get: () => themeState.value?.colorMode as ColorMode,
  set: mode => setColorMode(mode),
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
    console.error('[@maz-ui/themes] No preset found - If you are using the buildtime strategy, you must provide a complete preset')
    return
  }

  const newPreset = 'name' in _preset && _preset.name !== themeState.value.preset.name
    ? _preset as ThemePreset
    : mergePresets(themeState.value.preset, _preset)

  themeState.value.preset = newPreset

  if (themeState.value.strategy === 'runtime' || themeState.value.strategy === 'hybrid') {
    const cssOptions: CriticalCSSOptions | FullCSSOptions = {
      mode: themeState.value.mode,
      darkSelectorStrategy: themeState.value.darkModeStrategy,
      prefix: 'maz',
      darkClass: themeState.value.darkClass,
    }

    const criticalCSS = generateCriticalCSS(newPreset, cssOptions)
    const fullCSS = generateFullCSS(newPreset, cssOptions)

    injectCSS(CSS_IDS.CRITICAL, criticalCSS)
    injectCSS(CSS_IDS.FULL, fullCSS)
  }
}

function setColorMode(colorMode: ColorMode) {
  if (!themeState.value)
    return

  themeState.value.colorMode = colorMode

  setCookie('maz-color-mode', colorMode)
}

function toggleDarkMode() {
  setColorMode(isDark.value ? 'light' : 'dark')
}

function setThemeStateFromGlobalProperties() {
  themeState.value = undefined

  try {
    const injectedState = inject<Ref<ThemeState> | undefined>('mazThemeState', undefined)
    themeState.value = injectedState?.value

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

  if (!themeState.value) {
    setThemeStateFromGlobalProperties()
  }

  if (!themeState.value) {
    throw new Error('[@maz-ui/themes] You must install the MazUi or MazUiTheme plugin before using useTheme composable')
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
    updateTheme,
    /**
     * Set the color mode
     * @description Set the color mode - Can be 'auto', 'dark' or 'light'
     * @param colorMode The new color mode
     */
    setColorMode,
    /**
     * Toggle the dark mode
     * @description Toggle the dark mode
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
