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
const RE_SVG_DATA_URI = /^data:image\/svg\+xml[^,]*,/i

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

/**
 * Decode an SVG `data:` URI (e.g. a small asset inlined by a `?url` import),
 * base64 or percent-encoded. Returns `undefined` when the value is not a
 * decodable SVG data URI, so it can still go through `fetch`.
 */
export function decodeSvgDataUri(value: string): string | undefined {
  if (!RE_SVG_DATA_URI.test(value))
    return undefined

  const commaIndex = value.indexOf(',')
  const header = value.slice(0, commaIndex)
  const data = value.slice(commaIndex + 1)

  try {
    const text = /;base64$/i.test(header)
      ? new TextDecoder().decode(Uint8Array.from(atob(data), char => char.charCodeAt(0)))
      : decodeURIComponent(data)

    return isRawSvg(text) ? text : undefined
  }
  catch {
    return undefined
  }
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
export async function fetchSvgText(url: string, init?: RequestInit): Promise<string> {
  const cached = svgTextCache.get(url)
  if (cached)
    return cached

  const inflight = svgFetchInflight.get(url)
  if (inflight)
    return inflight

  const promise = (async () => {
    const response = await (init ? fetch(url, init) : fetch(url))
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

/** Server warm-up requests are aborted after this delay, so a hanging host cannot pile up sockets. */
export const SVG_PREFETCH_TIMEOUT_MS = 5000

/** How long a failed server warm-up is remembered before the URL is requested again. */
export const SVG_PREFETCH_FAILURE_TTL_MS = 5 * 60 * 1000

/** Failed server warm-ups by URL, with their expiry timestamp. */
const svgPrefetchFailures = new Map<string, number>()

/**
 * Server-side, fire-and-forget: fill {@link svgTextCache} for the next renders
 * without making the current one wait for the network. Skips URLs already
 * cached, in flight, or that failed less than {@link SVG_PREFETCH_FAILURE_TTL_MS}
 * ago, so a missing icon is neither refetched nor logged on every render.
 */
export function prefetchSvgText(url: string): void {
  if (svgTextCache.has(url) || svgFetchInflight.has(url))
    return

  const failureExpiresAt = svgPrefetchFailures.get(url)
  if (failureExpiresAt !== undefined && failureExpiresAt > Date.now())
    return

  svgPrefetchFailures.delete(url)
  fetchSvgText(url, { signal: AbortSignal.timeout(SVG_PREFETCH_TIMEOUT_MS) }).catch((error: unknown) => {
    svgPrefetchFailures.set(url, Date.now() + SVG_PREFETCH_FAILURE_TTL_MS)
    console.warn(error)
  })
}
