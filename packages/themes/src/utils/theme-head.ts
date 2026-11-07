import type { MazUiThemeOptions } from '../plugin'
import type { ColorMode, DarkModeStrategy, Strategy, ThemeMode, ThemePreset, ThemePresetName } from '../types'
import type { CookieReader, SystemColorMode } from './theme-preferences'
import { getCookie } from '@maz-ui/utils/helpers/cookie'
import { resolveColorSchemeContent } from './color-scheme-meta'
import { CSS_ID, generateCSS } from './css-generator'
import { getPreset } from './get-preset'
import { mergePresets } from './preset-merger'
import {
  COLOR_MODE_COOKIE,
  getDefaultColorMode,
  readColorModePreference,
  readDocumentCookie,
  readPresetPreference,
  resolveActivePresetName,
  resolveIsDark,
} from './theme-preferences'

/** Default preset identity used when the app declares no preset. */
export const DEFAULT_PRESET_NAME = 'maz-ui'

/** Options of the theme, with the preset as an object or the name of a built-in preset (loaded on demand) */
export type ThemeResolveOptions = Omit<MazUiThemeOptions, 'preset'> & {
  preset?: ThemePreset | ThemePresetName
}

export interface ThemeContextOptions {
  /**
   * Reads the cookies of the user: `document.cookie` by default. On the server, pass a reader of the
   * `Cookie` header of the request, or nothing to render the defaults of the config.
   */
  readCookie?: CookieReader
  /**
   * System preference of the user when the server knows it (the `Sec-CH-Prefers-Color-Scheme` client hint).
   * The browser already knows it: leave it empty on the client.
   */
  systemColorMode?: SystemColorMode
}

/** Headers of the request used to resolve the theme of the user (names in lower case) */
export interface ThemeRequestHeaders {
  'cookie'?: string
  'sec-ch-prefers-color-scheme'?: string
}

/**
 * Context options of a server request: the cookies of the `Cookie` header and the
 * `Sec-CH-Prefers-Color-Scheme` client hint. Read the headers before any `await` in frameworks that need it.
 */
export function getRequestThemeContext(headers: ThemeRequestHeaders): ThemeContextOptions {
  const hint = headers['sec-ch-prefers-color-scheme']

  return {
    readCookie: name => getCookie(name, headers.cookie),
    systemColorMode: hint === 'dark' || hint === 'light'
      ? hint
      : undefined,
  }
}

export interface ThemeContext {
  /** Configured preset, the identity of the `maz-preset` cookie */
  presetBase: string
  /** Active preset, overrides included (undefined with the buildtime strategy and no preset) */
  preset?: ThemePreset
  colorMode: ColorMode
  isDark: boolean
  /** System preference used to resolve the `auto` color mode, when it is known */
  systemColorMode?: SystemColorMode
  mode: ThemeMode
  strategy: Strategy
  darkModeStrategy: DarkModeStrategy
  darkClass: string
  lightClass: string
}

export interface ResolvedThemePresets {
  /** Configured preset name, the identity of the `maz-preset` cookie */
  presetBase: string
  /** Configured preset, without the overrides */
  basePreset?: ThemePreset
  /** Active preset, overrides included */
  preset?: ThemePreset
}

/** Configured and active presets, from the config and the `maz-preset` cookie. */
export async function resolveThemePresets(options: ThemeResolveOptions, readCookie: CookieReader = readDocumentCookie): Promise<ResolvedThemePresets> {
  const presetObject = options.preset && typeof options.preset !== 'string'
    ? options.preset
    : undefined

  if (!presetObject && options.strategy === 'buildtime') {
    return {
      presetBase: typeof options.preset === 'string'
        ? options.preset
        : DEFAULT_PRESET_NAME,
    }
  }

  const basePreset = presetObject ?? await getPreset(options.preset)
  const presetBase = basePreset.name
  const activeName = options.persistPreset === false || options.strategy === 'buildtime'
    ? presetBase
    : resolveActivePresetName(presetBase, readPresetPreference(readCookie))

  let preset = basePreset
  if (activeName !== presetBase) {
    // A stale active name falls back to the configured preset (the cookie is healed on the next write)
    preset = await getPreset(activeName as ThemePresetName).catch(() => basePreset)
  }

  return {
    presetBase,
    basePreset,
    preset: options.overrides && Object.keys(options.overrides).length > 0
      ? mergePresets(preset, options.overrides)
      : preset,
  }
}

/**
 * Resolves the theme of the user from the config and the cookies, the same way on the server
 * and in the browser: active preset, color mode and dark mode.
 */
export async function resolveThemeContext(options: ThemeResolveOptions, { readCookie = readDocumentCookie, systemColorMode }: ThemeContextOptions = {}): Promise<ThemeContext> {
  const colorModePreference = readColorModePreference(readCookie)
  const { presetBase, preset } = await resolveThemePresets(options, readCookie)
  const mode = options.mode ?? 'both'
  const colorMode = colorModePreference.colorMode ?? getDefaultColorMode(options)
  const system = systemColorMode ?? colorModePreference.system

  return {
    presetBase,
    preset,
    colorMode,
    isDark: resolveIsDark({ mode, colorMode }, system ?? 'light'),
    systemColorMode: system,
    mode,
    strategy: options.strategy ?? 'runtime',
    darkModeStrategy: options.darkModeStrategy ?? 'class',
    darkClass: options.darkClass ?? 'dark',
    lightClass: options.lightClass ?? 'light',
  }
}

/**
 * Inline script for the `<head>`, run before the first paint: it applies the color mode of the
 * user with the live system preference (the server may not know it) and saves it in the cookie.
 */
export function getColorModeScript({ mode = 'both', darkClass = 'dark', lightClass = 'light' }: Pick<MazUiThemeOptions, 'mode' | 'darkClass' | 'lightClass'> = {}): string {
  const maxAge = 60 * 60 * 24 * 365

  return `(function(){try{var d=document.documentElement,m=${JSON.stringify(mode)},dc=${JSON.stringify(darkClass)},lc=${JSON.stringify(lightClass)};`
    + `var r=(document.cookie.match(/(?:^|;\\s*)${COLOR_MODE_COOKIE}=([^;]*)/)||[])[1]||'';try{r=decodeURIComponent(r)}catch(e){}`
    + `var p=r.split(':'),c=p[0],s=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';`
    + `var k=m==='dark'||(m==='both'&&(c==='dark'||(c!=='light'&&s==='dark')));`
    + `if(m==='both'){d.classList.toggle(dc,k);d.classList.toggle(lc,!k)}`
    + `if(p[1]!==s)document.cookie='${COLOR_MODE_COOKIE}='+encodeURIComponent((c||'')+':'+s)+';path=/;max-age=${maxAge};SameSite=Lax'`
    + `}catch(e){}})()`
}

export interface ThemeHead extends ThemeContext {
  /** Class to set on `<html>` (undefined when the server cannot know it: the script applies it) */
  htmlClass?: string
  /** `id` of the `<style>` tag of `css`: the app reuses this tag at runtime */
  cssId: typeof CSS_ID
  /** CSS of the active preset (runtime strategy) */
  css?: string
  /** Content of `<meta name="color-scheme">` */
  colorScheme: string
  /** Inline script to run in the `<head>` before the first paint (class strategy with both modes) */
  script?: string
}

/**
 * Everything the server (SSR) or the build (SSG) renders in the `<head>` so the first paint has the
 * theme of the user: CSS of the preset, class of `<html>`, color-scheme meta and color mode script.
 * @example
 * ```ts
 * const head = await getThemeHead(themeOptions, { readCookie: name => cookies[name] })
 * ```
 */
export async function getThemeHead(options: ThemeResolveOptions, contextOptions: ThemeContextOptions = {}): Promise<ThemeHead> {
  const context = await resolveThemeContext(options, contextOptions)
  const classStrategy = context.darkModeStrategy === 'class' && context.mode === 'both'
  const known = context.colorMode !== 'auto' || context.systemColorMode !== undefined

  return {
    ...context,
    htmlClass: classStrategy && known
      ? context.isDark
        ? context.darkClass
        : context.lightClass
      : undefined,
    cssId: CSS_ID,
    css: context.strategy === 'runtime' && context.preset
      ? generateCSS(context.preset, {
          mode: context.mode,
          darkSelectorStrategy: context.darkModeStrategy,
          darkClass: context.darkClass,
          lightClass: context.lightClass,
        })
      : undefined,
    colorScheme: resolveColorSchemeContent(context.mode, context.colorMode),
    script: classStrategy
      ? getColorModeScript(context)
      : undefined,
  }
}

export interface ThemeHeadTags {
  htmlAttrs: { class?: string }
  style: { id: string, innerHTML: string }[]
  meta: ({ name: string, content: string, id: string } | { 'http-equiv': string, 'content': string, 'id': string })[]
  script: { id: string, innerHTML: string, tagPosition: 'head' }[]
}

/**
 * The tags of `getThemeHead` in the format of unhead (`useHead` of Nuxt, `@unhead/vue`...).
 * In `auto`, the `Accept-CH` meta asks the browser for the client hint of the next requests.
 */
export function getThemeHeadTags(head: ThemeHead): ThemeHeadTags {
  return {
    htmlAttrs: head.htmlClass
      ? { class: head.htmlClass }
      : {},
    style: head.css
      ? [
          { id: head.cssId, innerHTML: head.css },
        ]
      : [],
    meta: [
      { name: 'color-scheme', content: head.colorScheme, id: 'maz-color-scheme' },
      ...(head.script && head.colorMode === 'auto'
        ? [
            { 'http-equiv': 'Accept-CH', 'content': 'Sec-CH-Prefers-Color-Scheme', 'id': 'maz-color-http-accept-ch' },
          ]
        : []),
    ],
    script: head.script
      ? [
          { id: 'maz-color-mode-blocking', innerHTML: head.script, tagPosition: 'head' },
        ]
      : [],
  }
}

function renderAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`)
    .join(' ')
}

/** The tags of `getThemeHead` as an HTML string (without the class of `<html>`), for a server that renders the `<head>` by hand. */
export function renderThemeHead(head: ThemeHead): string {
  const { meta, style, script } = getThemeHeadTags(head)

  return [
    ...meta.map(attributes => `<meta ${renderAttributes(attributes)}>`),
    ...style.map(tag => `<style id="${tag.id}">${tag.innerHTML.replaceAll('</style', '<\\/style')}</style>`),
    ...script.map(tag => `<script id="${tag.id}">${tag.innerHTML}</script>`),
  ].join('\n')
}
