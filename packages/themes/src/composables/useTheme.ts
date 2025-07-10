import type { ColorMode, Strategy, ThemePreset, ThemePresetName, ThemePresetOverrides, ThemeState } from '../types'
import { isServer } from '@maz-ui/utils/src/helpers/isServer.js'
import { computed, getCurrentInstance, ref, watchEffect } from 'vue'
import { inject } from 'vue'
import { setCookie } from '../utils/cookie-storage'
import { generateCriticalCSS, generateFullCSS, injectCSS } from '../utils/css-generator'
import { getColorMode, getSystemPrefersDark } from '../utils/get-color-mode'
import { getPreset } from '../utils/get-preset'
import { mergePresets } from '../utils/preset-merger'

const state = ref<ThemeState>()

function updateDocumentClass() {
  if (typeof document === 'undefined' || !state.value || state.value.darkModeStrategy === 'media')
    return

  if (state.value.isDark) {
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
      isDark: themeData.isDark,
      strategy: themeData.strategy,
      darkModeStrategy: themeData.darkModeStrategy,
    })

    return
  }

  const colorMode = getColorMode(themeData.colorMode)
  const isDark = colorMode === 'auto'
    ? getSystemPrefersDark() === 'dark'
    : colorMode === 'dark'

  initThemeState({
    currentPreset: themeData.currentPreset,
    colorMode,
    isDark,
    strategy: themeData.strategy,
    darkModeStrategy: themeData.darkModeStrategy,
  })
}

export function initThemeState(initialState: ThemeState) {
  state.value = initialState

  if (typeof window !== 'undefined' && state.value.colorMode === 'auto') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

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
      updateDocumentClass()
      updateGlobalProperties()
    }
  })
}

const currentPreset = computed(() => state.value?.currentPreset as ThemePreset)

const colorMode = computed<ColorMode>({
  get: () => state.value?.colorMode as ColorMode,
  set: mode => setColorMode(mode),
})

const isDark = computed(() => state.value?.isDark ?? false)
const strategy = computed(() => state.value?.strategy as Strategy)

async function updateTheme(preset: ThemePreset | ThemePresetOverrides | ThemePresetName) {
  if (!state.value)
    return

  const _preset = typeof preset === 'string' ? await getPreset(preset) : preset

  const newPreset = 'name' in _preset && _preset.name !== state.value.currentPreset.name
    ? _preset as ThemePreset
    : mergePresets(state.value.currentPreset, _preset)

  state.value.currentPreset = newPreset

  if (state.value.strategy === 'runtime' || state.value.strategy === 'hybrid') {
    const cssOptions = {
      mode: state.value.colorMode === 'auto' ? 'both' as const : state.value.colorMode,
      darkSelector: state.value.darkModeStrategy,
      prefix: 'maz',
    }

    const criticalCSS = generateCriticalCSS(newPreset, cssOptions)
    const fullCSS = generateFullCSS(newPreset, cssOptions)

    injectCSS(criticalCSS, 'maz-theme-critical')
    injectCSS(fullCSS, 'maz-theme-full')
  }
}

function setColorMode(mode: ColorMode) {
  if (!state.value)
    return

  state.value.colorMode = mode

  if (mode === 'auto') {
    state.value.isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  else {
    state.value.isDark = mode === 'dark'
  }

  updateDocumentClass()

  setCookie('maz-color-mode', mode)
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
      state.value.colorMode = mazThemeState.colorMode
      state.value.isDark = mazThemeState.isDark
      state.value.currentPreset = mazThemeState.currentPreset
    }
  }

  if (!state.value) {
    throw new Error('You must install the MazUi or MazUiTheme plugin before using useTheme composable')
  }

  return {
    currentPreset,
    colorMode,
    isDark,
    strategy,
    updateTheme,
    setColorMode,
    toggleDarkMode,
  }
}
