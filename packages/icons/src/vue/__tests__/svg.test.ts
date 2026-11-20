import { parseSvg, prepareSvgString, stripSvgRootDimensions } from '../svg.ts'

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0"/></svg>'

describe('given a SVG with dimensions', () => {
  describe('when its root dimensions are stripped', () => {
    it('then only the width and the height of the root are removed', () => {
      expect(stripSvgRootDimensions(SVG)).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0"/></svg>')
    })
  })

  describe('when it is prepared without options', () => {
    it('then its dimensions are 1em', () => {
      expect(prepareSvgString(SVG)).toBe('<svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0"/></svg>')
    })
  })

  describe('when it is prepared without dimensions', () => {
    it('then it keeps its own', () => {
      expect(prepareSvgString(SVG, { dimensions: false })).toBe(SVG)
    })
  })

  describe('when it is prepared with a width only', () => {
    it('then the height is removed', () => {
      expect(prepareSvgString(SVG, {
        dimensions: { width: 200, height: '' },
      })).toBe('<svg width="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0"/></svg>')
    })
  })

  describe('when it is prepared with empty dimensions', () => {
    it('then it has none', () => {
      expect(prepareSvgString(SVG, { dimensions: {} })).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0"/></svg>')
    })
  })

  describe('when it is prepared with attributes and a title', () => {
    it('then the attributes are escaped, the invalid ones ignored, and the title replaces the existing one', () => {
      const svg = '<svg viewBox="0 0 24 24"><title>Old</title><path d="M0 0"/></svg>'

      expect(prepareSvgString(svg, {
        dimensions: false,
        svgAttributes: { 'data-label': 'a "b"', 'stroke-width': 2, 'hidden': true as unknown as string },
        title: 'Tom & <Jerry>',
      })).toBe('<svg viewBox="0 0 24 24" data-label="a &quot;b&quot;" stroke-width="2"><title>Tom &amp; &lt;Jerry&gt;</title><path d="M0 0"/></svg>')
    })
  })

  describe('when it is prepared with attributes that are all invalid', () => {
    it('then it is unchanged', () => {
      expect(prepareSvgString(SVG, {
        dimensions: false,
        svgAttributes: { hidden: true as unknown as string },
      })).toBe(SVG)
    })
  })
})

describe('given a SVG string', () => {
  describe('when it is parsed', () => {
    it('then its root attributes keep their order and are decoded, and its content is kept', () => {
      expect(parseSvg('<svg viewBox="0 0 24 24" data-a=\'x &amp; y\' data-c="&quot;&lt;&gt;&#39;" focusable><g><path d="M0 0"/></g></svg>\n')).toEqual({
        attributes: {
          'viewBox': '0 0 24 24',
          'data-a': 'x & y',
          'data-c': '"<>\'',
          'focusable': '',
        },
        content: '<g><path d="M0 0"/></g>',
      })
    })
  })

  describe('when it is self-closing', () => {
    it('then it has no content', () => {
      expect(parseSvg('<svg viewBox="0 0 24 24"/>')).toEqual({
        attributes: { viewBox: '0 0 24 24' },
        content: '',
      })
    })
  })

  describe('when it has no svg element', () => {
    it('then it is not parsed', () => {
      expect(parseSvg('<div></div>')).toBeUndefined()
    })
  })
})
