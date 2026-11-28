import type { InjectionKey } from 'vue'
import { inject, onMounted, ref } from 'vue'

export interface MazUiExternalLinksOptions {
  /**
   * Opens a link outside of the app (system browser of a Tauri or Electron app).
   * Called instead of the navigation, which is prevented.
   */
  openExternal?: (href: string, event: MouseEvent) => void
  /**
   * Whether a link leaves the app. Also drives the external icon of `MazLink`.
   * @default absolute `http(s)` URL of another origin, or `target="_blank"`
   */
  isExternalLink?: (href: string, target?: string) => boolean
}

export const EXTERNAL_LINKS_INJECTION_KEY: InjectionKey<MazUiExternalLinksOptions> = Symbol('mazExternalLinks')

/**
 * Without `origin` (server, or before the hydration), every absolute `http(s)` URL is external
 */
export function isExternalByDefault(href: string, target?: string, origin?: string): boolean {
  if (target === '_blank')
    return true

  if (!/^https?:\/\//i.test(href))
    return false

  try {
    return new URL(href).origin !== origin
  }
  catch {
    return false
  }
}

/**
 * Shared by the components that render an `href`. Must be called during setup.
 * Without the `openExternal` or `isExternalLink` options, only `target="_blank"` is external and no click is handled.
 */
export function useExternalLinks() {
  const options = inject(EXTERNAL_LINKS_INJECTION_KEY, undefined)
  const isMounted = ref(false)

  if (options) {
    onMounted(() => {
      isMounted.value = true
    })
  }

  function isExternal(href: string | undefined, target?: string): boolean {
    if (!href || !options)
      return target === '_blank'

    if (options.isExternalLink)
      return options.isExternalLink(href, target)

    return isExternalByDefault(href, target, isMounted.value ? globalThis.location?.origin : undefined)
  }

  function onLinkClick(event: MouseEvent, href: string | undefined, target?: string) {
    if (!options?.openExternal || !href || event.defaultPrevented || !isExternal(href, target))
      return

    event.preventDefault()
    options.openExternal(href, event)
  }

  return { isExternal, onLinkClick }
}
