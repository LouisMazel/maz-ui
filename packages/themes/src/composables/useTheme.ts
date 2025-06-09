import type { BaseThemePreset, ColorMode, ThemePreset, ThemeState } from '../types'
import { computed, getCurrentInstance, ref, watchEffect } from 'vue'
import { generateCriticalCSS, generateFullCSS, injectCSS } from '../utils/css-generator'
import { mergePresets } from '../utils/preset-merger'
import { inject } from 'vue'

const state = ref<ThemeState | null>(null)

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

function getInitialColorMode(mazTheme: any, savedMode: ColorMode | null, systemPrefersDark: boolean): ColorMode {
  if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
    return savedMode
  }

  if (mazTheme.darkModeStrategy === 'auto') {
    return 'auto'
  }

  return systemPrefersDark ? 'dark' : 'light'
}

function initializeThemeFromData(themeData: any) {
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
    currentPreset: themeData.preset || themeData.currentPreset,
    colorMode: initialColorMode,
    isDark: initialIsDark,
    strategy: themeData.strategy,
    darkModeStrategy: themeData.darkModeStrategy,
  })
}

export function useTheme() {
  let mazThemeState: ThemeState | undefined

  try {
    mazThemeState = inject('mazThemeState', undefined)
  } catch (error) {
    const instance = getCurrentInstance()
    if (instance?.appContext?.app?.config?.globalProperties) {
      const props = instance.appContext.app.config.globalProperties
      mazThemeState = props.$mazThemeState || props._mazThemeState
    }
  }

  if (!state.value && mazThemeState) {
    initializeThemeFromData(mazThemeState)
  }


  if (!state.value) {
    const defaultState = {
      currentPreset: null,
      colorMode: 'light' as ColorMode,
      isDark: false,
      strategy: 'hybrid' as const,
    }

    return {
      currentPreset: computed(() => defaultState.currentPreset),
      colorMode: computed(() => defaultState.colorMode),
      isDark: computed(() => defaultState.isDark),
      strategy: computed(() => defaultState.strategy),
      updateTheme: () => {},
      setColorMode: () => {},
      toggleDarkMode: () => {},
    }
  }

  const currentPreset = computed(() => state.value!.currentPreset)

  const colorMode = computed<ColorMode>({
    get: () => state.value!.colorMode,
    set: (mode: ColorMode) => setColorMode(mode),
  })

  const isDark = computed(() => state.value!.isDark)
  const strategy = computed(() => state.value!.strategy)

  function updateTheme(preset: ThemePreset | Partial<ThemePreset>) {
    if (!state.value)
      return

    const newPreset = 'name' in preset
      ? preset as BaseThemePreset
      : mergePresets(state.value.currentPreset, preset)

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
    }
  })
}
