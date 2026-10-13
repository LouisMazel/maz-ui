import type { ColorMode, ThemeMode } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'

/**
 * Resolve `<meta name="color-scheme" content>` so the browser applies the
 * correct canvas before CSS loads (FART prevention).
 *
 * - mode='light' | 'dark' → that mode
 * - mode='both' → matches colorMode ('auto' falls back to 'light dark')
 */
export function resolveColorSchemeContent(mode: ThemeMode, colorMode: ColorMode): string {
  if (mode !== 'both')
    return mode
  return colorMode === 'auto' ? 'light dark' : colorMode
}

/**
 * Inject (or update) `<meta name="color-scheme" content="...">` in the head.
 * Safe to call multiple times — updates the existing tag when present.
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
