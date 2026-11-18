import { decodeSvgDataUri, extractSvgMarkup, isRawSvg, prefetchSvgText, svgFetchInflight, svgTextCache } from '@/utils/svg-utils'

const SVG = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'

describe('decodeSvgDataUri', () => {
  it('decodes a percent-encoded SVG data URI', () => {
    expect(decodeSvgDataUri(`data:image/svg+xml,${encodeURIComponent(SVG)}`)).toBe(SVG)
  })

  it('decodes a percent-encoded SVG data URI with a charset', () => {
    expect(decodeSvgDataUri(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG)}`)).toBe(SVG)
  })

  it('decodes a base64 SVG data URI, including non-ASCII characters', () => {
    const svg = '<svg><title>Étoile</title></svg>'
    const base64 = btoa(String.fromCharCode(...new TextEncoder().encode(svg)))

    expect(decodeSvgDataUri(`data:image/svg+xml;base64,${base64}`)).toBe(svg)
  })

  it.each([
    ['a URL', 'https://cdn.example.com/star.svg'],
    ['a data URI of another type', 'data:image/png;base64,iVBORw0KGgo='],
    ['a data URI that is not an SVG', `data:image/svg+xml,${encodeURIComponent('<div></div>')}`],
    ['a malformed data URI', 'data:image/svg+xml,%E0%A4%A'],
  ])('returns undefined for %s', (_, value) => {
    expect(decodeSvgDataUri(value)).toBeUndefined()
  })
})

describe('given an SVG file with an XML prolog, a doctype and comments', () => {
  const file = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<!-- Generator: Illustrator -->\n${SVG}`

  describe('when extracting its markup', () => {
    it('then the markup starts at the svg tag', () => {
      expect(extractSvgMarkup(file)).toBe(SVG)
    })

    it('then it is a raw SVG', () => {
      expect(isRawSvg(file)).toBe(true)
    })
  })

  describe('when it is in a data URI', () => {
    it('then the decoded markup starts at the svg tag', () => {
      expect(decodeSvgDataUri(`data:image/svg+xml,${encodeURIComponent(file)}`)).toBe(SVG)
    })
  })
})

describe('given a text that is not an SVG', () => {
  describe('when extracting its markup', () => {
    it.each([
      ['an HTML page', '<!doctype html><html><body></body></html>'],
      ['an svg tag after other markup', '<div><svg></svg></div>'],
      ['a tag starting with svg', '<svgx></svgx>'],
    ])('then %s gives undefined', (_, text) => {
      expect(extractSvgMarkup(text)).toBeUndefined()
    })
  })
})

describe('given a data URI that is not strictly encoded', () => {
  describe('when decoding it', () => {
    it.each([
      ['an unencoded payload with a lone %', 'data:image/svg+xml;utf8,<svg width="100%"></svg>', '<svg width="100%"></svg>'],
      ['a percent-encoded base64 payload', `data:image/svg+xml;base64,${encodeURIComponent(btoa(SVG))}`, SVG],
      ['a data URI with a leading whitespace', ` data:image/svg+xml,${encodeURIComponent(SVG)}`, SVG],
    ])('then %s is decoded', (_, value, svg) => {
      expect(decodeSvgDataUri(value)).toBe(svg)
    })
  })
})

describe('prefetchSvgText', () => {
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    originalFetch = globalThis.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(SVG),
    }) as unknown as typeof globalThis.fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('does not request a URL already cached or in flight', () => {
    svgTextCache.set('https://cdn.example.com/cached.svg', SVG)
    svgFetchInflight.set('https://cdn.example.com/inflight.svg', Promise.resolve(SVG))

    prefetchSvgText('https://cdn.example.com/cached.svg')
    prefetchSvgText('https://cdn.example.com/inflight.svg')

    expect(globalThis.fetch).not.toHaveBeenCalled()

    svgFetchInflight.delete('https://cdn.example.com/inflight.svg')
  })
})
