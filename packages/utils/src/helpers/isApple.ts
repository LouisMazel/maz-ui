import { isClient } from './isClient.ts'

/**
 * Check whether the platform is macOS or iOS/iPadOS, where the shortcut key is Cmd instead of Ctrl
 */
export function isApple(): boolean {
  if (!isClient())
    return false

  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform
    ?? navigator.platform
    ?? navigator.userAgent

  return /Mac|iPhone|iPad|iPod/i.test(platform)
}
