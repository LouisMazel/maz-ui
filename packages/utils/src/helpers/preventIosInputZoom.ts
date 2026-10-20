import { isIos } from './isIos'

const MAXIMUM_SCALE_REGEX = /maximum-scale\s*=\s*[\d.]+/i

/**
 * Returns the viewport content with `maximum-scale=1`, replacing an existing `maximum-scale`.
 */
export function addViewportMaximumScale(content: string): string {
  if (MAXIMUM_SCALE_REGEX.test(content))
    return content.replace(MAXIMUM_SCALE_REGEX, 'maximum-scale=1')

  return content.trim() ? `${content}, maximum-scale=1` : 'maximum-scale=1'
}

/**
 * Stops iOS from zooming the page when a form field with a font size below 16px gets the focus.
 * Only applied on iOS, which still lets the user pinch to zoom: Android, which does not zoom
 * on focus but would lose the pinch zoom, is left untouched.
 * Does nothing when the page has no `<meta name="viewport">`.
 * @returns A function restoring the original viewport
 */
export function preventIosInputZoom(): () => void {
  if (!isIos())
    return () => {}

  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')

  if (!meta)
    return () => {}

  const originalContent = meta.getAttribute('content') ?? ''

  meta.setAttribute('content', addViewportMaximumScale(originalContent))

  return () => meta.setAttribute('content', originalContent)
}
