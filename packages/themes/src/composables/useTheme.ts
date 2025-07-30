import type { ColorMode, DarkModeStrategy, Strategy, ThemeMode, ThemePreset, ThemePresetName, ThemePresetOverrides, ThemeState } from '../types'
import type { CriticalCSSOptions, FullCSSOptions } from '../utils/css-generator'
import { isServer } from '@maz-ui/utils/src/helpers/isServer.js'
import { computed, getCurrentInstance, inject, ref, watch, watchEffect } from 'vue'
import { setCookie } from '../utils/cookie-storage'
import { CSS_IDS, generateCriticalCSS, generateFullCSS, injectCSS } from '../utils/css-generator'
import { getColorMode, isSystemPrefersDark } from '../utils/get-color-mode'
import { getPreset } from '../utils/get-preset'
import { mergePresets } from '../utils/preset-merger'

const state = ref<ThemeState>()

function updateDocumentClass(themeState: ThemeState) {
  if (typeof document === 'undefined' || !themeState || themeState.darkModeStrategy === 'media' || themeState.mode === 'light')
    return

  if (themeState.isDark) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}

function updateGlobalProperties() {
  const app = getCurrentInstance()?.appContext.app
  if (app && state.value) {
    app.config.globalProperties.$mazThemeState = state.value
  }
}

function initializeThemeFromData(themeData: ThemeState) {
  if (themeData.currentPreset && themeData.colorMode !== undefined) {
    initThemeState({
      currentPreset: themeData.currentPreset,
      colorMode: themeData.colorMode,
      mode: themeData.mode,
      isDark: themeData.isDark,
      strategy: themeData.strategy,
      darkModeStrategy: themeData.darkModeStrategy,
    })

    return
  }

  const colorMode = getColorMode(themeData.colorMode)
  const isDark = colorMode === 'auto'
    ? isSystemPrefersDark()
    : colorMode === 'dark'

  initThemeState({
    currentPreset: themeData.currentPreset,
    colorMode,
    mode: themeData.mode,
    isDark,
    strategy: themeData.strategy,
    darkModeStrategy: themeData.darkModeStrategy,
  })
}

export function initThemeState(initialState: ThemeState) {
  state.value = initialState

  if (typeof globalThis.window !== 'undefined' && state.value.colorMode === 'auto') {
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)')

    const updateFromMedia = () => {
      if (state.value && state.value.colorMode === 'auto') {
        state.value.isDark = mediaQuery.matches
      }
    }

    mediaQuery.addEventListener('change', updateFromMedia)
    updateFromMedia()
  }

  watchEffect(() => {
    if (state.value) {
      updateDocumentClass(state.value)
      updateGlobalProperties()
    }
  })
}

const colorMode = computed<ColorMode>({
  get: () => state.value?.colorMode as ColorMode,
  set: mode => setColorMode(mode),
})

const isDark = computed(() => state.value?.isDark ?? false)
const strategy = computed(() => state.value?.strategy as Strategy)
const mode = computed(() => state.value?.mode as ThemeMode)
const darkModeStrategy = computed(() => state.value?.darkModeStrategy as DarkModeStrategy)
const presetName = computed(() => state.value?.currentPreset.name as string)

async function updateTheme(preset: ThemePreset | ThemePresetOverrides | ThemePresetName) {
  if (!state.value)
    return

  const _preset = typeof preset === 'string' ? await getPreset(preset) : preset

  const newPreset = 'name' in _preset && _preset.name !== state.value.currentPreset.name
    ? _preset as ThemePreset
    : mergePresets(state.value.currentPreset, _preset)

  state.value.currentPreset = newPreset

  if (state.value.strategy === 'runtime' || state.value.strategy === 'hybrid') {
    const cssOptions: CriticalCSSOptions | FullCSSOptions = {
      mode: state.value.mode,
      darkSelectorStrategy: state.value.darkModeStrategy,
      prefix: 'maz',
    }

    const criticalCSS = generateCriticalCSS(newPreset, cssOptions)
    const fullCSS = generateFullCSS(newPreset, cssOptions)

    injectCSS(criticalCSS, CSS_IDS.CRITICAL)
    injectCSS(fullCSS, CSS_IDS.FULL)
  }
}

function setColorMode(colorMode: ColorMode) {
  if (!state.value)
    return

  state.value.colorMode = colorMode

  if (colorMode === 'auto') {
    state.value.isDark = typeof globalThis.window !== 'undefined' && globalThis.matchMedia('(prefers-color-scheme: dark)').matches
  }
  else {
    state.value.isDark = colorMode === 'dark'
  }

  updateDocumentClass(state.value)

  setCookie('maz-color-mode', colorMode)
}

function toggleDarkMode() {
  if (!state.value)
    return

  setColorMode(state.value.isDark ? 'light' : 'dark')
}

export function useTheme() {
  let mazThemeState: ThemeState | undefined

  try {
    mazThemeState = inject<ThemeState | undefined>('mazThemeState', undefined)

    if (!mazThemeState) {
      throw new Error('mazThemeState not found')
    }
  }
  catch {
    const instance = getCurrentInstance()
    if (instance?.appContext?.app?.config?.globalProperties) {
      mazThemeState = instance.appContext.app.config.globalProperties.$mazThemeState
    }
  }

  if (mazThemeState) {
    if (!state.value) {
      initializeThemeFromData(mazThemeState)
    }
    else if (isServer()) {
      state.value = {
        ...state.value,
        ...mazThemeState,
      }
    }
  }

  watch(() => mazThemeState?.currentPreset, (preset) => {
    if (state.value && preset) {
      state.value.currentPreset = preset
    }
  }, {
    once: true,
  })

  if (!state.value) {
    console.error('[@maz-ui/themes] You must install the MazUi or MazUiTheme plugin before using useTheme composable')

    return {
      presetName,
      colorMode,
      isDark,
      strategy,
      mode,
      darkModeStrategy,
      updateTheme: (() => Promise.resolve()) as typeof updateTheme,
      setColorMode: (() => {}) as typeof setColorMode,
      toggleDarkMode: (() => {}) as typeof toggleDarkMode,
    }
  }

  return {
    presetName,
    colorMode,
    isDark,
    strategy,
    updateTheme,
    setColorMode,
    toggleDarkMode,
    mode,
    darkModeStrategy,
  }
}
