import type { Ref } from 'vue'
import type { MazUiThemeOptions } from '../plugin'
import type { ThemePreset, ThemePresetName, ThemeState } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { ref, watch } from 'vue'
import { injectColorSchemeMeta, resolveColorSchemeContent } from './color-scheme-meta'
import { getSavedPreset, savePreset } from './cookie-storage'
import { getColorMode, getSavedColorMode, getSystemColorMode, saveResolvedColorMode } from './get-color-mode'
import { getPreset } from './get-preset'
import { injectThemeCSS } from './inject-theme-css'
import { mergePresets } from './preset-merger'
import { updateDocumentClass } from './update-document-class'
import { useMutationObserver } from './use-mutation-observer'

function noop() {}

function watchColorSchemeFromMedia(themeState: Ref<ThemeState>): () => void {
  if (isServer())
    return noop

  const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (themeState.value.colorMode !== 'auto')
      return
    const next = mediaQuery.matches ? 'dark' : 'light'
    updateDocumentClass('auto', themeState.value)
    themeState.value.isDark = next === 'dark'
    saveResolvedColorMode(next)
  }
  mediaQuery.addEventListener('change', onChange)

  const stopWatch = watch(() => themeState.value.colorMode, (colorMode) => {
    const isDark = colorMode === 'auto' ? getSystemColorMode() === 'dark' : colorMode === 'dark'
    updateDocumentClass(colorMode, themeState.value)
    injectColorSchemeMeta(resolveColorSchemeContent(themeState.value.mode, colorMode))
    if (colorMode === 'auto')
      saveResolvedColorMode(isDark ? 'dark' : 'light')
  })

  return () => {
    mediaQuery.removeEventListener('change', onChange)
    stopWatch()
  }
}

function watchMutationClassOnHtmlElement(themeState: Ref<ThemeState>): () => void {
  if (isServer())
    return noop

  return useMutationObserver(
    document.documentElement,
    () => {
      if (isServer() || !themeState.value)
        return
      const active = document.documentElement.classList.contains(themeState.value.darkClass) ? 'dark' : 'light'
      themeState.value.isDark = active === 'dark'
      if (themeState.value.colorMode !== active && themeState.value.colorMode !== 'auto') {
        themeState.value.colorMode = active
      }
    },
    { attributes: true },
  ).stop
}

export const defaultOptions = {
  strategy: 'runtime',
  overrides: {},
  darkModeStrategy: 'class',
  preset: undefined,
  mode: 'both',
  darkClass: 'dark',
  lightClass: 'light',
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
    lightClass: config.lightClass,
    darkModeStrategy: config.darkModeStrategy,
    colorMode: config.colorMode,
    mode: config.mode,
    preset: undefined,
    persistPreset: config.persistPreset,
    // @ts-expect-error _isDark is a private property
    isDark: options._isDark || isDark,
  })

  // Hybrid: only impose the class at init when no host (VitePress, Nuxt blocking
  // script, Tailwind toggle…) has already set one. If a theme class is present,
  // respect it — host stays in charge. The mutation observer keeps isDark in sync.
  if (!isServer() && config.darkModeStrategy === 'class' && config.mode === 'both') {
    const html = document.documentElement
    const hasExistingThemeClass = html.classList.contains(config.darkClass) || html.classList.contains(config.lightClass)
    if (!hasExistingThemeClass) {
      updateDocumentClass(themeState.value.colorMode, themeState.value)
    }
  }
  else {
    updateDocumentClass(themeState.value.colorMode, themeState.value)
  }
  return themeState
}

function finalizeTheme(
  themeState: ThemeStateRef,
  preset: ThemePreset | undefined,
  config: ResolvedConfig,
  baseName: string,
): SetupThemeReturn {
  const finalPreset = preset && Object.keys(config.overrides).length > 0
    ? mergePresets(preset, config.overrides)
    : preset

  if (finalPreset) {
    themeState.value.preset = finalPreset
    if (config.persistPreset)
      savePreset(baseName, finalPreset.name)
  }

  if (config.strategy === 'buildtime' || !finalPreset) {
    return { themeState: themeState as Ref<ThemeState>, cleanup: noop }
  }

  injectThemeCSS(finalPreset, config)

  const stopMedia = watchColorSchemeFromMedia(themeState)
  const stopMutation = watchMutationClassOnHtmlElement(themeState)

  return {
    themeState: themeState as Ref<ThemeState>,
    cleanup: () => {
      stopMedia()
      stopMutation()
    },
  }
}

function swapPreset(themeState: ThemeStateRef, preset: ThemePreset, config: ResolvedConfig, baseName: string): void {
  // Caller guarantees `persistPreset` is on and `strategy !== 'buildtime'`.
  const final = Object.keys(config.overrides).length > 0
    ? mergePresets(preset, config.overrides)
    : preset
  themeState.value.preset = final
  savePreset(baseName, final.name)
  injectThemeCSS(final, config)
}

/** Default preset identity used when the app declares no preset. */
const DEFAULT_PRESET_NAME = 'maz-ui'

/** Configured preset identity (the "base") - its name, string, or the default. */
function getConfiguredPresetName(preset: MazUiThemeOptions['preset']): string {
  if (!preset)
    return DEFAULT_PRESET_NAME
  return typeof preset === 'string' ? preset : preset.name
}

/**
 * Sets up the theme state, CSS injection, and watchers without binding to a Vue app.
 * Caller is responsible for `app.provide()` and `app.config.globalProperties`.
 *
 * Always returns synchronously with a populated themeState ref.
 * Without a preset object, the default preset resolves asynchronously and
 * themeState updates reactively (causes FOUC).
 */
export function setupTheme(options: MazUiThemeOptions): SetupThemeReturn {
  const config = resolveConfig(options)
  const themeState = createThemeState(options, config)
  injectColorSchemeMeta(resolveColorSchemeContent(themeState.value.mode, themeState.value.colorMode))
  const saved = config.persistPreset ? getSavedPreset() : null
  const presetObject = config.preset && typeof config.preset !== 'string' ? config.preset : null

  // Fast path — no FOUC. Buildtime also flows here (CSS is pre-built).
  if (presetObject || config.strategy === 'buildtime') {
    const baseName = presetObject ? presetObject.name : getConfiguredPresetName(config.preset)
    const setup = finalizeTheme(themeState, presetObject ?? config.preset, config, baseName)

    // Honor a persisted runtime switch only when it belongs to THIS app's
    // configured preset. A foreign/stale cookie never overrides the config.
    const activeOverride = saved && saved.base === baseName && saved.active !== baseName
      ? saved.active
      : null
    if (activeOverride && config.strategy !== 'buildtime') {
      getPreset(activeOverride as ThemePresetName)
        .then(preset => swapPreset(themeState, preset, config, baseName))
        .catch(() => savePreset(baseName, baseName))
    }
    return setup
  }

  // No object preset → resolve the configured base first (it defines the app
  // identity), then restore a persisted switch scoped to that base.
  const resolve = (async (): Promise<{ preset?: ThemePreset, baseName: string }> => {
    const basePreset = await getPreset(config.preset)
    const baseName = basePreset.name

    if (saved && saved.base === baseName && saved.active !== baseName) {
      try {
        return { preset: await getPreset(saved.active as ThemePresetName), baseName }
      }
      catch {
        // Stale active name → fall back to the configured base (cookie healed on write).
      }
    }

    return { preset: basePreset, baseName }
  })()

  resolve
    .catch((error): { preset?: ThemePreset, baseName: string } => {
      console.error('[@maz-ui/themes] Failed to resolve preset', error)
      return { preset: undefined, baseName: getConfiguredPresetName(config.preset) }
    })
    .then(({ preset, baseName }) => finalizeTheme(themeState, preset, config, baseName))

  return { themeState: themeState as Ref<ThemeState>, cleanup: noop }
}
