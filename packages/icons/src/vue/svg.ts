const RE_SVG_OPEN = /<svg\b/i
const RE_SVG_TAG_FULL = /(<svg\b[^>]*>)/i
const RE_SVG_TAG_WITH_CLOSE = /<svg\b([^>]*)>/i
const RE_SVG_DIMENSIONS = /\s(?:width|height)\s*=\s*(?:"[^"]*"|'[^']*')/gi
const RE_TITLE_TAG = /<title\b[^>]*>[\s\S]*?<\/title>/i
const RE_SVG_ELEMENT = /<svg\b([^>]*?)(\/?)>([\s\S]*)$/i
const RE_SVG_END = /<\/svg\s*>\s*$/i
const RE_ATTRIBUTE = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g
const RE_ENTITY = /&(?:quot|amp|lt|gt|#39);/g
const ENTITIES: Record<string, string> = {
  '&quot;': '"',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#39;': '\'',
}

export function stripSvgRootDimensions(svg: string): string {
  return svg.replace(RE_SVG_TAG_WITH_CLOSE, (_, attrs: string) => {
    const cleaned = attrs.replace(RE_SVG_DIMENSIONS, '')
    return `<svg${cleaned}>`
  })
}

function escapeAttribute(value: string | number): string {
  return String(value).replace(/"/g, '&quot;')
}

export interface SvgDimensions {
  width?: string | number
  height?: string | number
}

export interface PrepareSvgOptions {
  /** A `<title>` in the SVG, its accessible name */
  title?: string
  /** Attributes added to the root `<svg>` */
  svgAttributes?: Record<string, string | number>
  /**
   * Dimensions of the root `<svg>`, `false` keeps its own
   * @default { width: '1em', height: '1em' } (scaled by the font size)
   */
  dimensions?: SvgDimensions | false
}

/** The SVG with its dimensions, its attributes and its title */
export function prepareSvgString(svg: string, options: PrepareSvgOptions = {}): string {
  const { dimensions = { width: '1em', height: '1em' } } = options
  let result = svg

  if (dimensions) {
    result = stripSvgRootDimensions(result)
    const attributes = Object.entries(dimensions)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([name, value]) => `${name}="${escapeAttribute(value as string | number)}"`)
      .join(' ')

    if (attributes)
      result = result.replace(RE_SVG_OPEN, `<svg ${attributes}`)
  }

  if (options.svgAttributes) {
    const attrStr = Object.entries(options.svgAttributes)
      .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
      .map(([k, v]) => `${k}="${escapeAttribute(v)}"`)
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

export interface ParsedSvg {
  /** The attributes of the root `<svg>`, in their order */
  attributes: Record<string, string>
  /** Its content */
  content: string
}

function decodeEntities(value: string): string {
  return value.replace(RE_ENTITY, entity => ENTITIES[entity]!)
}

/**
 * The root `<svg>` of a SVG string, split in attributes and content: a regex, no `DOMParser`, it runs on the server.
 * The values are quoted, as in XML
 */
export function parseSvg(svg: string): ParsedSvg | undefined {
  const match = RE_SVG_ELEMENT.exec(svg)
  if (!match)
    return undefined

  const [, attributes = '', selfClosing, rest = ''] = match
  const parsed: Record<string, string> = {}
  for (const [, name, double, single] of attributes.matchAll(RE_ATTRIBUTE))
    parsed[name!] = decodeEntities(double ?? single ?? '')

  return {
    attributes: parsed,
    content: selfClosing
      ? ''
      : rest.replace(RE_SVG_END, ''),
  }
}
