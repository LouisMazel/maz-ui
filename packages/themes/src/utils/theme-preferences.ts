import type { ColorMode, ThemeMode } from '../types'
import { deleteCookie, getCookie, setCookie } from '@maz-ui/utils/helpers/cookie'
import { isServer } from '@maz-ui/utils/helpers/isServer'

/** Color mode of the user: `<choice>:<system>`, each part optional (`dark`, `auto:light`, `:dark`) */
export const COLOR_MODE_COOKIE = 'maz-color-mode'
/** Preset of the user: `<configured preset>:<active preset>` */
export const PRESET_COOKIE = 'maz-preset'
/** Replaced by the system part of `maz-color-mode`, deleted when found */
const LEGACY_SYSTEM_COLOR_MODE_COOKIE = 'maz-resolved-color-mode'

export type SystemColorMode = 'light' | 'dark'

/** Reads a cookie by name: `document.cookie` on the client, the request on the server. */
export type CookieReader = (name: string) => string | null | undefined

export interface ColorModePreference {
  /** Color mode chosen by the user (`setColorMode`) */
  colorMode?: ColorMode
  /** Last system preference seen by the browser, so the server renders the right mode */
  system?: SystemColorMode
}

export interface SavedPreset {
  /** Identity of the preset declared in the app config (the "base"). */
  base: string
  /** Currently active preset name (equals `base` unless switched at runtime). */
  active: string
}

const COLOR_MODES = new Set<string>(['light', 'dark', 'auto'])
const SYSTEM_COLOR_MODES = new Set<string>(['light', 'dark'])

export function readDocumentCookie(name: string): string | null {
  return getCookie(name)
}

export function parseColorModeCookie(raw: string | null | undefined): ColorModePreference {
  if (!raw)
    return {}

  const [choice, system] = raw.split(':')
  return {
    colorMode: COLOR_MODES.has(choice)
      ? choice as ColorMode
      : undefined,
    system: system && SYSTEM_COLOR_MODES.has(system)
      ? system as SystemColorMode
      : undefined,
  }
}

export function serializeColorModeCookie({ colorMode, system }: ColorModePreference): string {
  return system
    ? `${colorMode ?? ''}:${system}`
    : colorMode ?? ''
}

/**
 * Parse the `maz-preset` cookie. A cookie written by another app or a previous
 * config on the same host is detectable as foreign thanks to its base. A legacy
 * plain-name value (no `:`) is treated as unscoped and returns `null` so it
 * cannot hijack the configured preset.
 */
export function parsePresetCookie(raw: string | null | undefined): SavedPreset | null {
  if (!raw)
    return null

  const separatorIndex = raw.indexOf(':')
  if (separatorIndex === -1)
    return null

  const base = raw.slice(0, separatorIndex)
  const active = raw.slice(separatorIndex + 1)
  return base && active
    ? { base, active }
    : null
}

export function readColorModePreference(read: CookieReader = readDocumentCookie): ColorModePreference {
  return parseColorModeCookie(read(COLOR_MODE_COOKIE))
}

export function readPresetPreference(read: CookieReader = readDocumentCookie): SavedPreset | null {
  return parsePresetCookie(read(PRESET_COOKIE))
}

function writeColorModePreference(preference: ColorModePreference): void {
  if (isServer())
    return

  const value = serializeColorModeCookie(preference)
  if (getCookie(COLOR_MODE_COOKIE) !== value)
    setCookie(COLOR_MODE_COOKIE, value)

  if (getCookie(LEGACY_SYSTEM_COLOR_MODE_COOKIE) !== null)
    deleteCookie(LEGACY_SYSTEM_COLOR_MODE_COOKIE)
}

/** Save the color mode chosen by the user, keeping the system part. */
export function saveColorModeChoice(colorMode: ColorMode): void {
  writeColorModePreference({
    ...readColorModePreference(),
    colorMode,
  })
}

/** Save the system preference seen by the browser, keeping the choice of the user. */
export function saveSystemColorMode(system: SystemColorMode): void {
  writeColorModePreference({
    ...readColorModePreference(),
    system,
  })
}

/** Serialize `base`/`active` into the `maz-preset` cookie, no-op if unchanged. */
export function savePresetPreference(base: string, active: string): void {
  if (isServer() || !base || !active)
    return

  const value = `${base}:${active}`
  if (getCookie(PRESET_COOKIE) !== value)
    setCookie(PRESET_COOKIE, value)
}

export function clearPresetPreference(): void {
  deleteCookie(PRESET_COOKIE)
}

export function getSystemColorMode(): SystemColorMode {
  if (isServer() || typeof globalThis.matchMedia !== 'function')
    return 'light'

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** Color mode of the config: the one to restore when the user has no choice. */
export function getDefaultColorMode(options: { colorMode?: ColorMode, mode?: ThemeMode }): ColorMode {
  return options.colorMode ?? (options.mode === 'dark'
    ? 'dark'
    : 'auto')
}

/**
 * Whether the dark mode is active. `system` is the system preference when it is
 * known (always on the client, from the cookie or a client hint on the server).
 */
export function resolveIsDark(
  { mode, colorMode }: { mode: ThemeMode, colorMode: ColorMode },
  system: SystemColorMode | undefined = getSystemColorMode(),
): boolean {
  if (mode !== 'both')
    return mode === 'dark'

  return (colorMode === 'auto'
    ? system
    : colorMode) === 'dark'
}

/**
 * Active preset name: a persisted switch is honored only when it belongs to the
 * configured preset of this app, a foreign or stale cookie never wins.
 */
export function resolveActivePresetName(baseName: string, saved: SavedPreset | null): string {
  return saved?.base === baseName
    ? saved.active
    : baseName
}
