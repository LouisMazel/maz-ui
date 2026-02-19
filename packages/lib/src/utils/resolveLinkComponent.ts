import { getCurrentInstance } from 'vue'

/**
 * Resolves the appropriate router link component based on environment
 * Automatically detects Nuxt vs Vue Router
 */
export function resolveLinkComponent() {
  const instance = getCurrentInstance()
  const app = instance?.appContext.app

  // Check if NuxtLink is available (Nuxt environment)
  if (app?.component('NuxtLink')) {
    return 'NuxtLink'
  }

  // Check if RouterLink is available (Vue Router)
  if (app?.component('RouterLink')) {
    return 'RouterLink'
  }

  // Fallback to anchor tag
  console.warn('Your are using "to" property but no router component found (NuxtLink or RouterLink), falling back to anchor ("<a />" - HTMLAnchorElement) tag')
  return 'a'
}
