import type { ColorMode, ThemeMode } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'

/**
 * Resolve the value for `<meta name="color-scheme" content="...">`.
 *
 * Emitted in HTML before CSS loads, so the browser applies the right background
 * canvas immediately and prevents the Flash of inAccurate coloR Theme (FART).
 *
 * - mode='light' → 'light'
 * - mode='dark' → 'dark'
 * - mode='both', colorMode='dark' → 'dark'
 * - mode='both', colorMode='light' → 'light'
 * - mode='both', colorMode='auto' → 'light dark' (let the browser pick)
 */
export function resolveColorSchemeContent(mode: ThemeMode, colorMode: ColorMode): string {
  if (mode === 'light')
    return 'light'
  if (mode === 'dark')
    return 'dark'
  if (colorMode === 'dark')
    return 'dark'
  if (colorMode === 'light')
    return 'light'
  return 'light dark'
}

/**
 * Inject (or update) `<meta name="color-scheme" content="...">` in the document head.
 * Safe to call multiple times — updates the existing tag when one is already present.
 */
export function injectColorSchemeMeta(content: string): void {
  if (isServer())
    return

  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'color-scheme')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}
