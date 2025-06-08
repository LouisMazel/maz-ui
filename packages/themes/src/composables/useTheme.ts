import type { BaseThemePreset, ColorMode, ThemePreset, ThemeState } from '../types'
import { computed, ref, watchEffect } from 'vue'
import { generateCriticalCSS, generateFullCSS, injectCSS } from '../utils/css-generator'
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

  // Rendre colorMode vraiment réactif avec getter/setter
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

      // Régénérer le CSS critique et complet
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

    // Sauvegarder la préférence utilisateur
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

  // Restaurer la préférence utilisateur sauvegardée
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
