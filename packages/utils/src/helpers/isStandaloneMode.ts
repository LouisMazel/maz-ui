import { isClient } from './isClient'

export function isStandaloneMode() {
  if (!isClient())
    return false

  const nav = navigator as unknown as { standalone?: boolean }

  const isStandalone = globalThis.matchMedia('(display-mode: standalone)').matches

  return nav.standalone || isStandalone
}
