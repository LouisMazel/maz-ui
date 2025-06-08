import type { BaseThemePreset, ColorMode, ThemePreset, ThemeState } from '../types'
import { computed, ref, type Ref, watchEffect } from 'vue'
import { generateThemeCSS, injectCSS } from '../utils/css-generator'
import { mergePresets } from '../utils/preset-merger'

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

export function useTheme() {
  if (!state.value) {
    throw new Error('useTheme must be used after installing MazUi')
  }

  const currentPreset = computed(() => state.value!.currentPreset)
  const colorMode = computed(() => state.value!.colorMode)
  const isDark = computed(() => state.value!.isDark)
  const strategy = computed(() => state.value!.strategy)

  const updateTheme = (preset: ThemePreset | Partial<ThemePreset>) => {
    if (!state.value)
      return

    const newPreset = 'name' in preset
      ? preset as BaseThemePreset
      : mergePresets(state.value.currentPreset, preset)

    state.value.currentPreset = newPreset

    if (state.value.strategy === 'runtime' || state.value.strategy === 'hybrid') {
      const css = generateThemeCSS(newPreset, {
        darkMode: state.value.colorMode === 'auto' ? 'media' : 'class',
      })
      injectCSS(css)
    }
  }

  const setColorMode = (mode: ColorMode) => {
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
  }

  const toggleDarkMode = () => {
    if (!state.value)
      return

    setColorMode(state.value.isDark ? 'light' : 'dark')
  }

  return {
    currentPreset: currentPreset as Ref<ThemePreset>,
    colorMode: colorMode as Ref<ColorMode>,
    isDark: isDark as Ref<boolean>,
    strategy: strategy as Ref<'runtime' | 'build' | 'hybrid'>,
    updateTheme,
    setColorMode,
    toggleDarkMode,
  }
}

export function _initThemeState(initialState: ThemeState) {
  state.value = initialState

  if (typeof window !== 'undefined' && initialState.colorMode === 'auto') {
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
