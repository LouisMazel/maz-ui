import type { Component } from 'vue'
import { getCurrentInstance, inject } from 'vue'

const MAZ_LINK_COMPONENT_KEY = 'mazLinkComponent'

/**
 * Resolves the appropriate router link component based on environment
 * Checks for provided component (via MAZ_LINK_COMPONENT_KEY), then RouterLink, then falls back to 'a'
 * Must be called during setup
 *
 * @returns The resolved component or 'a' as fallback
 */
export function resolveLinkComponent(): Component | string {
  // Check if a link component was provided (e.g. NuxtLink via @maz-ui/nuxt module)
  const provided = inject<Component | undefined>(MAZ_LINK_COMPONENT_KEY, undefined)
  if (provided) {
    return provided
  }

  // Check if RouterLink is available (Vue Router)
  const instance = getCurrentInstance()
  const routerLink = instance?.appContext.components?.RouterLink
  if (routerLink) {
    return routerLink
  }

  // Fallback to anchor tag
  console.warn('You are using the "to" property but no router component was found (NuxtLink or RouterLink), falling back to anchor ("<a />" - HTMLAnchorElement) tag')
  return 'a'
}
