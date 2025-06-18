import type { ColorMode, ThemePreset, ThemePresetName, ThemePresetOverrides, ThemeState } from '../types'
import { computed, getCurrentInstance, ref, watchEffect } from 'vue'
import { inject } from 'vue'
import { generateCriticalCSS, generateFullCSS, injectCSS } from '../utils/css-generator'
import { getPreset } from '../utils/get-preset'
import { mergePresets } from '../utils/preset-merger'

const state = ref<ThemeState>()

function updateDocumentClass() {
  if (typeof document === 'undefined' || !state.value)
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

function getInitialColorMode(mazTheme: ThemeState, savedMode: ColorMode | null, systemPrefersDark: boolean): ColorMode {
  if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
    return savedMode
  }

  if (mazTheme.darkModeStrategy === 'auto') {
    return 'auto'
  }

  return systemPrefersDark ? 'dark' : 'light'
}

function initializeThemeFromData(themeData: ThemeState) {
  const systemPrefersDark = typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: dark)').matches

  const savedMode = typeof localStorage !== 'undefined'
    ? localStorage.getItem('maz-color-mode') as ColorMode | null
    : null

  if (themeData.currentPreset && themeData.colorMode !== undefined) {
    _initThemeState({
      currentPreset: themeData.currentPreset,
      colorMode: themeData.colorMode,
      isDark: themeData.isDark,
      strategy: themeData.strategy,
      darkModeStrategy: themeData.darkModeStrategy,
    })
    return
  }

  const initialColorMode = getInitialColorMode(themeData, savedMode, systemPrefersDark)
  const initialIsDark = initialColorMode === 'auto'
    ? systemPrefersDark
    : initialColorMode === 'dark'

  _initThemeState({
    currentPreset: themeData.currentPreset,
    colorMode: initialColorMode,
    isDark: initialIsDark,
    strategy: themeData.strategy,
    darkModeStrategy: themeData.darkModeStrategy,
  })
}

export function _initThemeState(initialState: ThemeState) {
  state.value = initialState

  if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('maz-color-mode') as ColorMode | null

    if (savedMode) {
      state.value.colorMode = savedMode

      if (savedMode === 'auto') {
        state.value.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      else {
        state.value.isDark = savedMode === 'dark'
      }
    }
  }

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

const currentPreset = computed(() => state.value!.currentPreset)

const colorMode = computed<ColorMode>({
  get: () => state.value!.colorMode,
  set: (mode: ColorMode) => setColorMode(mode),
})

const isDark = computed(() => state.value!.isDark)
const strategy = computed(() => state.value!.strategy)

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
      mode: 'both' as const,
      darkSelector: state.value.colorMode === 'auto' ? 'media' as const : 'class' as const,
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

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('maz-color-mode', mode)
  }
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

  if (!state.value && mazThemeState) {
    initializeThemeFromData(mazThemeState)
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
