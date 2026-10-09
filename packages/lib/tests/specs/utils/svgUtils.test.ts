import { decodeSvgDataUri, prefetchSvgText, svgFetchInflight, svgTextCache } from '@/utils/svg-utils'

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

describe('prefetchSvgText', () => {
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    originalFetch = globalThis.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(SVG) }) as unknown as typeof globalThis.fetch
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
