import { isClient } from './isClient'

export function isIos(): boolean {
  if (!isClient())
    return false

  const userAgent = navigator.userAgent

  // iPadOS 13+ reports a desktop Mac user agent, it is told apart by its touch support
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1)
}
