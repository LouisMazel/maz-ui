/**
 * Utilities for the inline-SVG path of {@link MazIcon}: detection, fetching
 * with deduplication, and lightweight string normalization (`width`/`height`
 * pinned to `1em`, optional `<title>` injection, custom attribute merging).
 */

const RAW_SVG_PATTERN = /^\s*<svg[\s>]/i
const URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:|\/)/i

const RE_SVG_OPEN = /<svg\b/i
const RE_SVG_TAG_FULL = /(<svg\b[^>]*>)/i
const RE_SVG_TAG_WITH_CLOSE = /<svg\b([^>]*)>/i
const RE_SVG_DIMENSIONS = /\s(?:width|height)\s*=\s*(?:"[^"]*"|'[^']*')/gi
const RE_TITLE_TAG = /<title\b[^>]*>[\s\S]*?<\/title>/i

/**
 * Module-level cache shared across every {@link MazIcon} instance. Keyed by
 * the URL (or the same string we received as the `icon` prop). Stores the
 * raw SVG text so that subsequent renders of the same path are synchronous.
 */
export const svgTextCache = new Map<string, string>()

/**
 * In-flight fetches for a given URL — prevents duplicate network calls when
 * multiple icons mount simultaneously with the same URL.
 */
export const svgFetchInflight = new Map<string, Promise<string>>()

export function isRawSvg(value: unknown): value is string {
  return typeof value === 'string' && RAW_SVG_PATTERN.test(value)
}

export function isUrlLike(value: unknown): value is string {
  return typeof value === 'string' && URL_PATTERN.test(value) && !isRawSvg(value)
}

export function isStringIcon(value: unknown): value is string {
  return typeof value === 'string'
}

export function stripSvgRootDimensions(svg: string): string {
  return svg.replace(RE_SVG_TAG_WITH_CLOSE, (_, attrs: string) => {
    const cleaned = attrs.replace(RE_SVG_DIMENSIONS, '')
    return `<svg${cleaned}>`
  })
}

interface PrepareOptions {
  title?: string
  svgAttributes?: Record<string, string | number>
}

export function prepareSvgString(svg: string, options: PrepareOptions = {}): string {
  let result = stripSvgRootDimensions(svg)

  // Force 1em / 1em — the consumer scales via font-size.
  result = result.replace(RE_SVG_OPEN, '<svg width="1em" height="1em"')

  if (options.svgAttributes) {
    const attrStr = Object.entries(options.svgAttributes)
      .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
      .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
      .join(' ')

    if (attrStr)
      result = result.replace(RE_SVG_TAG_WITH_CLOSE, `<svg$1 ${attrStr}>`)
  }

  if (options.title) {
    const escaped = options.title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    result = result.replace(RE_TITLE_TAG, '')
    result = result.replace(RE_SVG_TAG_FULL, `$1<title>${escaped}</title>`)
  }

  return result
}

/**
 * Fetch the SVG text at `url`. Caches successful responses, deduplicates
 * concurrent requests, and rejects on any non-2xx response or invalid SVG
 * payload.
 */
export async function fetchSvgText(url: string): Promise<string> {
  const cached = svgTextCache.get(url)
  if (cached)
    return cached

  const inflight = svgFetchInflight.get(url)
  if (inflight)
    return inflight

  const promise = (async () => {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error(`[MazIcon] Could not fetch icon at ${url} (${response.status})`)

    const text = await response.text()
    if (!isRawSvg(text) || text.includes('<parsererror'))
      throw new Error(`[MazIcon] Response at ${url} is not a valid SVG`)

    svgTextCache.set(url, text)
    return text
  })()

  svgFetchInflight.set(url, promise)
  try {
    return await promise
  }
  finally {
    svgFetchInflight.delete(url)
  }
}
