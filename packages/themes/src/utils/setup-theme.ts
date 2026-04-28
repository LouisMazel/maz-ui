import type { Ref } from 'vue'
import type { MazUiThemeOptions } from '../plugin'
import type { ThemePreset, ThemePresetName, ThemeState } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { ref, watch } from 'vue'
import { clearSavedPresetName, getSavedPresetName, saveResolvedPresetName } from './cookie-storage'
import { getColorMode, getSavedColorMode, getSystemColorMode, saveResolvedColorMode } from './get-color-mode'
import { getPreset } from './get-preset'
import { injectThemeCSS } from './inject-theme-css'
import { mergePresets } from './preset-merger'
import { updateDocumentClass } from './update-document-class'
import { useMutationObserver } from './use-mutation-observer'

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
        saveResolvedColorMode(newColorMode)
      }
    }

    mediaQuery.addEventListener('change', updateFromMedia)
    mediaCleanup = () => mediaQuery.removeEventListener('change', updateFromMedia)
  }

  const stopWatch = watch(() => themeState.value.colorMode, (colorMode) => {
    const resolvedIsDark = colorMode === 'auto' ? getSystemColorMode() === 'dark' : colorMode === 'dark'
    updateDocumentClass(resolvedIsDark, themeState.value)
    if (colorMode === 'auto') {
      saveResolvedColorMode(resolvedIsDark ? 'dark' : 'light')
    }
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

export const defaultOptions = {
  strategy: 'runtime',
  overrides: {},
  darkModeStrategy: 'class',
  preset: undefined,
  mode: 'both',
  darkClass: 'dark',
  colorMode: 'auto',
  persistPreset: true,
} satisfies Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>

export interface SetupThemeReturn {
  themeState: Ref<ThemeState>
  cleanup: () => void
}

type ResolvedConfig = Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>

type ThemeStateRef = Ref<Required<Omit<ThemeState, 'preset'>> & Pick<ThemeState, 'preset'>>

function resolveConfig(options: MazUiThemeOptions): ResolvedConfig {
  return {
    ...defaultOptions,
    ...options,
    colorMode: getSavedColorMode() ?? options.colorMode ?? (options.mode === 'dark' ? 'dark' : 'auto'),
  } satisfies ResolvedConfig
}

function createThemeState(options: MazUiThemeOptions, config: ResolvedConfig): ThemeStateRef {
  const isDark = config.colorMode === 'auto' && config.mode === 'both'
    ? getSystemColorMode() === 'dark' || getColorMode(config.colorMode) === 'dark'
    : getColorMode(config.colorMode) === 'dark' || config.mode === 'dark'

  if (!isServer() && config.colorMode === 'auto') {
    saveResolvedColorMode(isDark ? 'dark' : 'light')
  }

  const themeState: ThemeStateRef = ref({
    strategy: config.strategy,
    darkClass: config.darkClass,
    darkModeStrategy: config.darkModeStrategy,
    colorMode: config.colorMode,
    mode: config.mode,
    preset: undefined,
    persistPreset: config.persistPreset,
    // @ts-expect-error _isDark is a private property
    isDark: options._isDark || isDark,
  })

  updateDocumentClass(themeState.value.isDark, themeState.value)

  return themeState
}

function finalizeTheme(
  themeState: ThemeStateRef,
  preset: ThemePreset | undefined,
  config: ResolvedConfig,
): SetupThemeReturn {
  const finalPreset = Object.keys(config.overrides).length > 0 && preset
    ? mergePresets(preset, config.overrides)
    : preset

  if (finalPreset) {
    themeState.value.preset = finalPreset
    if (config.persistPreset) {
      saveResolvedPresetName(finalPreset.name)
    }
  }

  if (config.strategy === 'buildtime' || !finalPreset) {
    return { themeState: themeState as Ref<ThemeState>, cleanup: () => {} }
  }

  injectThemeCSS(finalPreset, config)

  const cleanupColorScheme = watchColorSchemeFromMedia(themeState)
  const cleanupMutation = watchMutationClassOnHtmlElement(themeState)

  return {
    themeState: themeState as Ref<ThemeState>,
    cleanup: () => {
      cleanupColorScheme()
      cleanupMutation()
    },
  }
}

/**
 * Sets up the theme state, CSS injection, and watchers without binding to a Vue app.
 * The caller is responsible for calling `app.provide()` and setting `app.config.globalProperties`.
 *
 * Always returns synchronously with a populated themeState ref.
 * When no preset object is provided, the default preset is resolved asynchronously
 * in the background and the themeState is updated reactively (causes FOUC).
 */
function swapPreset(themeState: ThemeStateRef, preset: ThemePreset, config: ResolvedConfig): void {
  // Caller guarantees `persistPreset` is on and `strategy !== 'buildtime'`.
  const final = Object.keys(config.overrides).length > 0
    ? mergePresets(preset, config.overrides)
    : preset
  themeState.value.preset = final
  saveResolvedPresetName(final.name)
  injectThemeCSS(final, config)
}

export function setupTheme(options: MazUiThemeOptions): SetupThemeReturn {
  const config = resolveConfig(options)
  const themeState = createThemeState(options, config)
  const savedName = config.persistPreset ? getSavedPresetName() : null
  const presetObject = config.preset && typeof config.preset !== 'string' ? config.preset : null

  // Fast path — no FOUC: a preset object renders synchronously. Buildtime
  // also takes this path (CSS is pre-built, no runtime injection anyway).
  if (presetObject || config.strategy === 'buildtime') {
    const setup = finalizeTheme(themeState, presetObject ?? config.preset, config)

    // Cookie asked for a different bundled preset → load it post-mount and
    // swap. No FOUC at first paint, just a quick transition for users that
    // had explicitly switched to another preset.
    if (savedName && config.strategy !== 'buildtime' && (!presetObject || savedName !== presetObject.name)) {
      getPreset(savedName as ThemePresetName)
        .then(preset => swapPreset(themeState, preset, config))
        .catch(() => clearSavedPresetName())
    }
    return setup
  }

  // No object preset → async resolution (cookie wins, fallback to options).
  const resolve = savedName
    ? getPreset(savedName as ThemePresetName).catch(() => {
        clearSavedPresetName()
        return getPreset(config.preset)
      })
    : getPreset(config.preset)

  resolve
    .catch((error) => {
      console.error('[@maz-ui/themes] Failed to resolve preset', error)
      return undefined
    })
    .then(preset => finalizeTheme(themeState, preset, config))

  return { themeState: themeState as Ref<ThemeState>, cleanup: () => {} }
}
