import type { Ref } from 'vue'
import type { MazUiThemeOptions } from '../plugin'
import type { ColorMode, ThemePreset, ThemePresetName, ThemeState } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { ref, watch } from 'vue'
import { injectColorSchemeMeta, resolveColorSchemeContent } from './color-scheme-meta'
import { getPreset } from './get-preset'
import { injectThemeCSS } from './inject-theme-css'
import { mergePresets } from './preset-merger'
import { DEFAULT_PRESET_NAME, resolveThemePresets } from './theme-head'
import {
  COLOR_MODE_COOKIE,
  getDefaultColorMode,
  getSystemColorMode,
  PRESET_COOKIE,
  readColorModePreference,
  readPresetPreference,
  resolveActivePresetName,
  resolveIsDark,
  savePresetPreference,
  saveSystemColorMode,
} from './theme-preferences'
import { updateDocumentClass } from './update-document-class'
import { useMutationObserver } from './use-mutation-observer'

function noop() {}

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

type ResolvedConfig = Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'> & {
  /** Color mode of the config, used when the user has no choice (no or deleted cookie) */
  defaultColorMode: ColorMode
}
type ThemeStateRef = Ref<Required<Omit<ThemeState, 'preset' | 'presetBase'>> & Pick<ThemeState, 'preset' | 'presetBase'>>

function resolveConfig(options: MazUiThemeOptions): ResolvedConfig {
  const defaultColorMode = getDefaultColorMode(options)

  return {
    ...defaultOptions,
    ...options,
    // @ts-expect-error _colorMode is a private property: the choice of the user read by the host from the request (SSR)
    colorMode: options._colorMode ?? readColorModePreference().colorMode ?? defaultColorMode,
    defaultColorMode,
  } satisfies ResolvedConfig
}

function usesThemeClasses(state: Pick<ThemeState, 'darkModeStrategy' | 'mode'>): boolean {
  return state.darkModeStrategy === 'class' && state.mode === 'both'
}

/**
 * A theme class that differs from the resolved color mode is a choice of the host:
 * it becomes the color mode, so a later change of the system preference does not override it.
 */
function syncColorModeWithClass(state: ThemeState, active: 'light' | 'dark'): void {
  state.isDark = active === 'dark'
  const resolved = state.colorMode === 'auto'
    ? getSystemColorMode()
    : state.colorMode
  if (resolved !== active)
    state.colorMode = active
}

function watchColorMode(themeState: ThemeStateRef): () => void {
  if (isServer())
    return noop

  const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)')
  const onSystemChange = () => {
    const system = mediaQuery.matches
      ? 'dark'
      : 'light'
    saveSystemColorMode(system)
    if (themeState.value.colorMode !== 'auto')
      return
    updateDocumentClass('auto', themeState.value)
    themeState.value.isDark = resolveIsDark(themeState.value, system)
  }
  mediaQuery.addEventListener('change', onSystemChange)

  const stopWatch = watch(() => themeState.value.colorMode, (colorMode) => {
    updateDocumentClass(colorMode, themeState.value)
    injectColorSchemeMeta(resolveColorSchemeContent(themeState.value.mode, colorMode))
  })

  return () => {
    mediaQuery.removeEventListener('change', onSystemChange)
    stopWatch()
  }
}

function watchMutationClassOnHtmlElement(themeState: ThemeStateRef): () => void {
  // Without the class strategy, the classes of <html> say nothing about the color mode
  if (isServer() || !usesThemeClasses(themeState.value))
    return noop

  return useMutationObserver(
    document.documentElement,
    () => {
      if (isServer() || !themeState.value)
        return
      const { classList } = document.documentElement
      const { darkClass, lightClass } = themeState.value
      const active = classList.contains(darkClass)
        ? 'dark'
        : 'light'
      // A host (VitePress...) toggling only the dark class must not leave the light class behind
      if (active === 'dark' && classList.contains(lightClass))
        classList.remove(lightClass)
      else if (active === 'light' && !classList.contains(lightClass))
        classList.add(lightClass)
      syncColorModeWithClass(themeState.value, active)
    },
    {
      attributes: true,
      attributeFilter: ['class'],
    },
  ).stop
}

function createThemeState(options: MazUiThemeOptions, config: ResolvedConfig): ThemeStateRef {
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
    isDark: options._isDark || resolveIsDark(config, getSystemColorMode()),
  })

  if (isServer())
    return themeState

  if (config.mode === 'both')
    saveSystemColorMode(getSystemColorMode())

  // Hybrid: only impose the class at init when no host (VitePress, SSR, blocking
  // script, Tailwind toggle…) has already set one. If a theme class is present,
  // respect it — host stays in charge, and the state starts from it. The mutation
  // observer keeps it in sync afterwards.
  if (usesThemeClasses(config)) {
    const { classList } = document.documentElement
    if (classList.contains(config.darkClass) || classList.contains(config.lightClass)) {
      syncColorModeWithClass(themeState.value, classList.contains(config.darkClass)
        ? 'dark'
        : 'light')
      return themeState
    }
  }

  updateDocumentClass(themeState.value.colorMode, themeState.value)
  return themeState
}

function withOverrides(preset: ThemePreset, config: ResolvedConfig): ThemePreset {
  return Object.keys(config.overrides).length > 0
    ? mergePresets(preset, config.overrides)
    : preset
}

function swapPreset(themeState: ThemeStateRef, preset: ThemePreset, config: ResolvedConfig, baseName: string): void {
  // Caller guarantees `persistPreset` is on and `strategy !== 'buildtime'`.
  const final = withOverrides(preset, config)
  themeState.value.preset = final
  savePresetPreference(baseName, final.name)
  injectThemeCSS(final, config)
}

function applySavedColorMode(themeState: ThemeStateRef, config: ResolvedConfig): void {
  const colorMode = readColorModePreference().colorMode ?? config.defaultColorMode
  if (colorMode === themeState.value.colorMode)
    return

  themeState.value.colorMode = colorMode
  themeState.value.isDark = resolveIsDark({ mode: themeState.value.mode, colorMode }, getSystemColorMode())
}

function applySavedPreset(themeState: ThemeStateRef, config: ResolvedConfig, baseName: string, basePreset: ThemePreset): void {
  const name = resolveActivePresetName(baseName, readPresetPreference())
  if (name === themeState.value.preset?.name)
    return

  if (name === basePreset.name) {
    swapPreset(themeState, basePreset, config, baseName)
    return
  }

  getPreset(name as ThemePresetName)
    .then(preset => swapPreset(themeState, preset, config, baseName))
    .catch(() => savePresetPreference(baseName, themeState.value.preset?.name as string))
}

/**
 * Follows the `maz-color-mode` and `maz-preset` cookies written outside the app
 * (another tab, the server, the devtools...). A deleted cookie restores the config.
 * Browsers without the Cookie Store API keep the values read at setup.
 */
function watchThemeCookies(themeState: ThemeStateRef, config: ResolvedConfig, baseName: string, basePreset: ThemePreset | undefined): () => void {
  if (isServer() || !globalThis.cookieStore)
    return noop

  const onChange = (event: CookieChangeEvent) => {
    const names = new Set([
      ...event.changed,
      ...event.deleted,
    ].map(cookie => cookie.name))
    if (names.has(COLOR_MODE_COOKIE))
      applySavedColorMode(themeState, config)
    if (names.has(PRESET_COOKIE) && config.persistPreset && basePreset)
      applySavedPreset(themeState, config, baseName, basePreset)
  }

  globalThis.cookieStore.addEventListener('change', onChange)
  return () => globalThis.cookieStore.removeEventListener('change', onChange)
}

/** `basePreset` is the configured preset without the overrides (restored when the `maz-preset` cookie is deleted), `activePreset` the one to apply. */
function finalizeTheme(
  themeState: ThemeStateRef,
  config: ResolvedConfig,
  baseName: string,
  basePreset: ThemePreset | undefined,
  activePreset: ThemePreset | undefined,
): () => void {
  themeState.value.presetBase = baseName
  if (activePreset) {
    themeState.value.preset = activePreset
    if (config.persistPreset)
      savePresetPreference(baseName, activePreset.name)
  }

  // The color mode works with every strategy: only the CSS of the preset depends on it
  const runtime = config.strategy !== 'buildtime' && !!activePreset
  if (runtime)
    injectThemeCSS(activePreset, config)

  const stops = [
    watchColorMode(themeState),
    watchMutationClassOnHtmlElement(themeState),
    watchThemeCookies(themeState, config, baseName, runtime
      ? basePreset
      : undefined),
  ]

  return () => stops.forEach(stop => stop())
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
  const presetObject = config.preset && typeof config.preset !== 'string'
    ? config.preset
    : undefined

  // Fast path — no FOUC. Buildtime also flows here (CSS is pre-built).
  if (presetObject || config.strategy === 'buildtime') {
    // @ts-expect-error _presetBase is a private property: the configured preset when the host (Nuxt) already resolved the active one
    const baseName: string = options._presetBase ?? presetObject?.name ?? (typeof config.preset === 'string'
      ? config.preset
      : DEFAULT_PRESET_NAME)
    const cleanup = finalizeTheme(themeState, config, baseName, presetObject, presetObject && withOverrides(presetObject, config))

    // Honor a persisted runtime switch only when it belongs to THIS app's configured preset
    const activeName = config.persistPreset && config.strategy !== 'buildtime'
      ? resolveActivePresetName(baseName, readPresetPreference())
      : baseName
    if (activeName !== baseName && activeName !== presetObject?.name) {
      getPreset(activeName as ThemePresetName)
        .then(preset => swapPreset(themeState, preset, config, baseName))
        .catch(() => savePresetPreference(baseName, baseName))
    }
    return { themeState: themeState as Ref<ThemeState>, cleanup }
  }

  // No object preset → resolve the configured preset first (it defines the app
  // identity), then restore a persisted switch scoped to it.
  let cleanup = noop
  resolveThemePresets(config)
    .catch((error) => {
      console.error('[@maz-ui/themes] Failed to resolve preset', error)
      return {
        presetBase: typeof config.preset === 'string'
          ? config.preset
          : DEFAULT_PRESET_NAME,
        basePreset: undefined,
        preset: undefined,
      }
    })
    .then(({ presetBase, basePreset, preset }) => {
      cleanup = finalizeTheme(themeState, config, presetBase, basePreset, preset)
    })

  return {
    themeState: themeState as Ref<ThemeState>,
    cleanup: () => cleanup(),
  }
}
