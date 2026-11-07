import type { Ref } from 'vue'
import type { ColorMode, ThemePreset, ThemePresetName, ThemePresetOverrides, ThemeState } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { computed, getCurrentInstance, hasInjectionContext, inject } from 'vue'

import { CSS_ID, generateCSS, injectCSS } from '../utils/css-generator'
import { getPreset } from '../utils/get-preset'
import { noTransition } from '../utils/no-transition'
import { mergePresets } from '../utils/preset-merger'
import { readPresetPreference, saveColorModeChoice, savePresetPreference } from '../utils/theme-preferences'
import { getActiveThemeState, setActiveThemeState } from '../utils/theme-state-registry'

type ThemeStateRef = Ref<ThemeState | undefined>

/**
 * Theme state of the current component tree (plugin or `MazUiProvider`), resolved on every call:
 * a module cache would mix the apps (nested providers) and, on the server, the requests.
 */
function resolveThemeState(): ThemeStateRef | undefined {
  if (hasInjectionContext()) {
    const state = inject<ThemeStateRef | undefined>('mazThemeState', undefined)
      ?? getCurrentInstance()?.appContext.config.globalProperties.$mazThemeState
    if (state?.value) {
      if (!isServer())
        setActiveThemeState(state)
      return state
    }
  }

  return isServer()
    ? undefined
    : getActiveThemeState()
}

async function updateTheme(themeState: ThemeStateRef, preset: ThemePreset | ThemePresetOverrides | ThemePresetName) {
  const state = themeState.value
  if (!state)
    return

  const _preset = typeof preset === 'string'
    ? await getPreset(preset)
    : preset

  if (!_preset || !state.preset) {
    console.error('[@maz-ui/themes] No preset found — with buildtime strategy you must pass a full preset')
    return
  }

  const newPreset = 'name' in _preset && _preset.name !== state.preset.name
    ? _preset as ThemePreset
    : mergePresets(state.preset, _preset)

  state.preset = newPreset
  if (state.persistPreset) {
    // The configured preset scopes the cookie to this app, even when the cookie was deleted
    savePresetPreference(state.presetBase ?? readPresetPreference()?.base ?? newPreset.name, newPreset.name)
  }

  if (state.strategy === 'runtime') {
    injectCSS(CSS_ID, generateCSS(newPreset, {
      mode: state.mode,
      darkSelectorStrategy: state.darkModeStrategy,
      prefix: 'maz',
      darkClass: state.darkClass,
      lightClass: state.lightClass,
    }))
  }
}

async function setColorMode(themeState: ThemeStateRef, colorMode: ColorMode, options: { animate?: boolean } = {}): Promise<void> {
  if (!themeState.value)
    return

  const apply = () => {
    themeState.value!.colorMode = colorMode
    saveColorModeChoice(colorMode)
  }

  if (options.animate) {
    const { runViewTransition } = await import('../utils/view-transition')
    await runViewTransition(apply)
  }
  else {
    apply()
  }
}

export function useTheme() {
  const themeState = resolveThemeState()
  if (!themeState?.value) {
    throw new Error('[@maz-ui/themes] useTheme requires the MazUi/MazUiTheme plugin or a MazUiProvider wrapper')
  }

  const isDark = computed(() => themeState.value?.isDark || false)
  const preset = computed(() => themeState.value?.preset as Required<ThemeState>['preset'])

  const _setColorMode = (colorMode: ColorMode, options?: { animate?: boolean }) => setColorMode(themeState, colorMode, options)

  return {
    /**
     * Current theme preset
     */
    preset,
    /**
     * Current theme name
     */
    presetName: computed(() => preset.value?.name as string),
    /**
     * Current color mode
     * @description The color mode - Can be 'auto', 'dark' or 'light'
     */
    colorMode: computed<ColorMode>({
      get: () => themeState.value?.colorMode as ColorMode,
      /**
       * Setter fires `setColorMode(mode)` synchronously (Promise<void> is discarded).
       * If you need to await the change (e.g., when `animate: true` is used), call
       * `setColorMode(mode)` directly to receive the Promise.
       */
      set: mode => void _setColorMode(mode),
    }),
    /**
     * Whether the current color mode is dark
     */
    isDark,
    /**
     * Strategy used to apply the theme
     */
    strategy: computed(() => themeState.value?.strategy as Required<ThemeState>['strategy']),
    /**
     * Update the theme
     * @param preset The new theme preset
     * @description Update the theme with a new preset or override some tokens
     */
    updateTheme(preset: ThemePreset | ThemePresetOverrides | ThemePresetName): ReturnType<typeof updateTheme> {
      return noTransition(updateTheme, themeState, preset)
    },
    /**
     * Set the color mode
     * @description Set the color mode - Can be 'auto', 'dark' or 'light'
     * @param colorMode The new color mode
     * @param options.animate When `true`, wrap the change in a View Transition for a smooth full-page animation. Lazy-imports the helper so unused code stays out of the boot bundle.
     * @returns A `Promise<void>` that resolves once the change (and optional transition) is applied. Callers may ignore the return.
     */
    setColorMode: _setColorMode,
    /**
     * Toggle the dark mode
     * @description Toggle the dark mode
     * @param options Options of the toggle
     * @param options.animate When `true`, wrap the toggle in a View Transition.
     * @returns A `Promise<void>` that resolves once the change (and optional transition) is applied.
     */
    toggleDarkMode: (options: { animate?: boolean } = {}): Promise<void> => _setColorMode(isDark.value
      ? 'light'
      : 'dark', options),
    /**
     * Mode
     * @description Supported themes - Can be 'both', 'light' or 'dark'
     */
    mode: computed(() => themeState.value?.mode as Required<ThemeState>['mode']),
    /**
     * Dark mode strategy
     * @description Strategy used to apply the dark mode - Can be 'class' or 'media'
     */
    darkModeStrategy: computed(() => themeState.value?.darkModeStrategy as Required<ThemeState>['darkModeStrategy']),
    /**
     * @deprecated use `preset` instead
     */
    currentPreset: preset,
  }
}
