import { isClient } from './is-client'

export function isInStandaloneMode() {
  if (!isClient()) return false

  const nav = navigator as unknown as { standalone?: boolean }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  return nav.standalone || isStandalone
}
