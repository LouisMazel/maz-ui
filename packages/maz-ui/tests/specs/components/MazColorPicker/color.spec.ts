import {
  formatColor,
  getLuminance,
  hslToRgb,
  hsvToRgb,
  parseColor,
  resolveCssColor,
  rgbToHsv,
} from '@components/MazColorPicker/color'

describe('given parseColor', () => {
  describe('when parsing hex colors', () => {
    it.each([
      [
        '#f80',
        { r: 255, g: 136, b: 0, a: 1 },
      ],
      [
        '#f808',
        { r: 255, g: 136, b: 0, a: 0.533 },
      ],
      [
        '#ff8800',
        { r: 255, g: 136, b: 0, a: 1 },
      ],
      [
        '#FF880080',
        { r: 255, g: 136, b: 0, a: 0.502 },
      ],
      [
        '  #FFF  ',
        { r: 255, g: 255, b: 255, a: 1 },
      ],
    ])('then %s is parsed', (input, expected) => {
      expect(parseColor(input)).toEqual(expected)
    })

    it.each([
      '#ff',
      '#fffff',
      '#ggg',
      '#fffffffff',
      'fff',
    ])('then %s is rejected', (input) => {
      expect(parseColor(input)).toBeUndefined()
    })
  })

  describe('when parsing rgb colors', () => {
    it('then the legacy comma syntax is parsed', () => {
      expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 })
      expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 })
    })

    it('then the modern space syntax is parsed', () => {
      expect(parseColor('rgb(10 20 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 })
      expect(parseColor('rgb(10 20 30 / 0.25)')).toEqual({ r: 10, g: 20, b: 30, a: 0.25 })
      expect(parseColor('RGB(10 20 30 / 25%)')).toEqual({ r: 10, g: 20, b: 30, a: 0.25 })
    })

    it('then percentages are converted and values are clamped', () => {
      const color = parseColor('rgb(100% 50% 0%)')

      expect(color?.r).toBeCloseTo(255, 5)
      expect(color?.g).toBeCloseTo(127.5, 5)
      expect(color?.b).toBe(0)
      expect(parseColor('rgb(300 -20 30 / 4)')).toEqual({ r: 255, g: 0, b: 30, a: 1 })
    })

    it('then a fourth value without slash is the alpha', () => {
      expect(parseColor('rgb(1 2 3 0.5)')).toEqual({ r: 1, g: 2, b: 3, a: 0.5 })
    })

    it('then the none keyword is zero', () => {
      expect(parseColor('rgb(none 20 NONE / none)')).toEqual({ r: 0, g: 20, b: 0, a: 0 })
    })

    it('then exponent and decimal numbers are accepted', () => {
      expect(parseColor('rgb(1e1 .5 5. )')).toEqual({ r: 10, g: 0.5, b: 5, a: 1 })
    })
  })

  describe('when parsing hsl colors', () => {
    it('then the legacy syntax is parsed', () => {
      expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
      expect(parseColor('hsla(120, 100%, 25%, 0.5)')).toEqual({ r: 0, g: 127.5, b: 0, a: 0.5 })
    })

    it('then the hue units are converted', () => {
      const expected = { r: 0, g: 255, b: 0, a: 1 }

      expect(parseColor('hsl(120deg 100% 50%)')).toEqual(expected)
      expect(parseColor('hsl(0.3333333333turn 100% 50%)')?.g).toBeCloseTo(255, 0)
      expect(parseColor(`hsl(${2 * Math.PI / 3}rad 100% 50%)`)?.g).toBeCloseTo(255, 0)
    })

    it('then negative and overflowing hues wrap around', () => {
      expect(parseColor('hsl(-240 100% 50%)')).toEqual({ r: 0, g: 255, b: 0, a: 1 })
      expect(parseColor('hsl(480 100% 50%)')).toEqual({ r: 0, g: 255, b: 0, a: 1 })
    })

    it('then saturation and lightness are clamped', () => {
      expect(parseColor('hsl(0 200% 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
      expect(parseColor('hsl(0 100% 150%)')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    })
  })

  describe('when parsing oklch and oklab colors', () => {
    it('then oklch white and black are parsed', () => {
      expect(parseColor('oklch(1 0 0)')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
      expect(parseColor('oklch(0 0 0)')).toEqual({ r: 0, g: 0, b: 0, a: 1 })
    })

    it('then oklch percentages and alpha are parsed', () => {
      expect(parseColor('oklch(100% 0% 0deg / 50%)')).toEqual({ r: 255, g: 255, b: 255, a: 0.5 })
    })

    it('then oklch red is close to pure red', () => {
      const color = parseColor('oklch(0.628 0.2577 29.23)')

      expect(color?.r).toBeCloseTo(255, 0)
      expect(color?.g).toBeLessThan(2)
      expect(color?.b).toBeLessThan(2)
    })

    it('then oklch chroma in percent and hue in turn are converted', () => {
      const withPercent = parseColor('oklch(0.628 64.425% 0.0812turn)')
      const reference = parseColor('oklch(0.628 0.2577 29.23)')

      expect(withPercent?.r).toBeCloseTo(reference!.r, 0)
    })

    it('then oklab is parsed with numbers and percentages', () => {
      expect(parseColor('oklab(1 0 0)')).toEqual({ r: 255, g: 255, b: 255, a: 1 })

      const color = parseColor('oklab(62.8% 0.2249 0.1258 / 0.3)')

      expect(color?.r).toBeCloseTo(255, 0)
      expect(color?.a).toBe(0.3)
      expect(parseColor('oklab(50% 10% -10%)')).toBeDefined()
    })

    it('then out of gamut colors are clamped', () => {
      const color = parseColor('oklch(0.7 0.4 150)')

      expect(color!.r).toBeGreaterThanOrEqual(0)
      expect(color!.g).toBeLessThanOrEqual(255)
    })

    it('then the none keyword is accepted', () => {
      expect(parseColor('oklch(1 none none)')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    })
  })

  describe('when parsing other values', () => {
    it('then transparent is parsed', () => {
      expect(parseColor('Transparent')).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    })

    it.each([
      undefined,
      null,
      '',
      '   ',
      'red',
      'rgb(1 2)',
      'rgb(1 2 3 4 5)',
      'rgb(1, 2, 3, 4, 5)',
      'rgb(a b c)',
      'rgb(1 2 3 / x)',
      'rgb(1 2 3 / 1 / 2)',
      'rgb(1 2 3',
      'hsl(1 2 3 / )',
      'color(srgb 1 0 0)',
    ])('then %s is rejected', (input) => {
      expect(parseColor(input as string | undefined)).toBeUndefined()
    })
  })
})

describe('given resolveCssColor', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  describe('when the value is parsable', () => {
    it('then it returns the parsed color without the computed style', () => {
      const spy = vi.spyOn(globalThis, 'getComputedStyle')

      expect(resolveCssColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('when the value is empty', () => {
    it('then it returns undefined', () => {
      expect(resolveCssColor()).toBeUndefined()
      expect(resolveCssColor(null)).toBeUndefined()
      expect(resolveCssColor('')).toBeUndefined()
    })
  })

  describe('when CSS is not available', () => {
    it('then it returns undefined', () => {
      vi.stubGlobal('CSS', undefined)

      expect(resolveCssColor('rebeccapurple')).toBeUndefined()
    })
  })

  describe('when the browser does not support the value', () => {
    it('then it returns undefined', () => {
      vi.stubGlobal('CSS', {
        supports: () => false,
      })

      expect(resolveCssColor('not-a-color')).toBeUndefined()
    })
  })

  describe('when the browser supports a named color', () => {
    it('then it resolves it through the computed style and cleans the DOM', () => {
      vi.stubGlobal('CSS', {
        supports: vi.fn(() => true),
      })
      vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({ color: 'rgb(102, 51, 153)' } as CSSStyleDeclaration)

      expect(resolveCssColor('rebeccapurple')).toEqual({ r: 102, g: 51, b: 153, a: 1 })
      expect(document.body.children).toHaveLength(0)
    })

    it('then it returns undefined when the computed color is not parsable', () => {
      vi.stubGlobal('CSS', {
        supports: () => true,
      })
      vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({ color: 'color(srgb 1 0 0)' } as CSSStyleDeclaration)

      expect(resolveCssColor('color(srgb 1 0 0)')).toBeUndefined()
    })
  })
})

describe('given rgbToHsv and hsvToRgb', () => {
  describe('when converting primary colors to hsv', () => {
    it.each([
      [
        { r: 255, g: 0, b: 0, a: 1 },
        { h: 0, s: 1, v: 1, a: 1 },
      ],
      [
        { r: 0, g: 255, b: 0, a: 1 },
        { h: 120, s: 1, v: 1, a: 1 },
      ],
      [
        { r: 0, g: 0, b: 255, a: 0.5 },
        { h: 240, s: 1, v: 1, a: 0.5 },
      ],
      [
        { r: 255, g: 0, b: 128, a: 1 },
        {
          h: 329.88235294117646,
          s: 1,
          v: 1,
          a: 1,
        },
      ],
    ])('then %o gives %o', (rgba, expected) => {
      const hsva = rgbToHsv(rgba)

      expect(hsva.h).toBeCloseTo(expected.h, 5)
      expect(hsva.s).toBeCloseTo(expected.s, 5)
      expect(hsva.v).toBeCloseTo(expected.v, 5)
      expect(hsva.a).toBe(expected.a)
    })
  })

  describe('when the color is a gray', () => {
    it('then the fallback hue is kept', () => {
      expect(rgbToHsv({ r: 128, g: 128, b: 128, a: 1 }, 200)).toEqual({ h: 200, s: 0, v: 128 / 255, a: 1 })
    })

    it('then the fallback hue defaults to 0', () => {
      expect(rgbToHsv({ r: 128, g: 128, b: 128, a: 1 }).h).toBe(0)
    })
  })

  describe('when the color is black', () => {
    it('then the saturation is 0', () => {
      expect(rgbToHsv({ r: 0, g: 0, b: 0, a: 1 }, 90)).toEqual({ h: 90, s: 0, v: 0, a: 1 })
    })
  })

  describe('when the red channel is the max with blue over green', () => {
    it('then the hue is wrapped into 0 to 360', () => {
      expect(rgbToHsv({ r: 255, g: 0, b: 51, a: 1 }).h).toBeCloseTo(348, 5)
    })
  })

  describe('when converting hsv to rgb', () => {
    it.each([
      [
        { h: 0, s: 1, v: 1, a: 1 },
        { r: 255, g: 0, b: 0, a: 1 },
      ],
      [
        { h: 120, s: 1, v: 1, a: 1 },
        { r: 0, g: 255, b: 0, a: 1 },
      ],
      [
        { h: 240, s: 1, v: 1, a: 0.4 },
        { r: 0, g: 0, b: 255, a: 0.4 },
      ],
      [
        { h: 60, s: 0.5, v: 0.5, a: 1 },
        { r: 127.5, g: 127.5, b: 63.75, a: 1 },
      ],
      [
        { h: 300, s: 0, v: 1, a: 1 },
        { r: 255, g: 255, b: 255, a: 1 },
      ],
    ])('then %o gives %o', (hsva, expected) => {
      expect(hsvToRgb(hsva)).toEqual(expected)
    })

    it('then a round trip keeps the color', () => {
      const rgba = { r: 12, g: 200, b: 99, a: 0.7 }
      const back = hsvToRgb(rgbToHsv(rgba))

      expect(back.r).toBeCloseTo(rgba.r, 2)
      expect(back.g).toBeCloseTo(rgba.g, 2)
      expect(back.b).toBeCloseTo(rgba.b, 2)
    })
  })
})

describe('given hslToRgb', () => {
  describe('when converting', () => {
    it('then primary colors are exact', () => {
      expect(hslToRgb(0, 1, 0.5)).toEqual({ r: 255, g: 0, b: 0, a: 1 })
      expect(hslToRgb(240, 1, 0.5, 0.3)).toEqual({ r: 0, g: 0, b: 255, a: 0.3 })
    })

    it('then lightness extremes give black and white', () => {
      expect(hslToRgb(200, 0.6, 0)).toEqual({ r: 0, g: 0, b: 0, a: 1 })
      expect(hslToRgb(200, 0.6, 1)).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    })
  })
})

describe('given formatColor', () => {
  const orange = { r: 255, g: 136, b: 0, a: 1 }

  describe('when formatting in hex', () => {
    it('then it is the default format', () => {
      expect(formatColor(orange)).toBe('#ff8800')
    })

    it('then the alpha is appended only under 1', () => {
      expect(formatColor({ ...orange, a: 0.5 }, 'hex')).toBe('#ff880080')
      expect(formatColor({ ...orange, a: 1 }, 'hex')).toBe('#ff8800')
    })

    it('then channels are rounded and clamped', () => {
      expect(formatColor({ r: 300, g: -5, b: 127.6, a: 2 }, 'hex')).toBe('#ff0080')
      expect(formatColor({ r: 0, g: 0, b: 0, a: -1 }, 'hex')).toBe('#00000000')
    })
  })

  describe('when formatting in rgb', () => {
    it('then it uses the modern syntax', () => {
      expect(formatColor({ r: 10.4, g: 20.6, b: 30, a: 1 }, 'rgb')).toBe('rgb(10 21 30)')
    })

    it('then the alpha is added under 1', () => {
      expect(formatColor({ ...orange, a: 0.456 }, 'rgb')).toBe('rgb(255 136 0 / 0.46)')
    })
  })

  describe('when formatting in hsl', () => {
    it('then primary colors are formatted', () => {
      expect(formatColor({ r: 255, g: 0, b: 0, a: 1 }, 'hsl')).toBe('hsl(0 100% 50%)')
      expect(formatColor({ r: 0, g: 0, b: 255, a: 0.5 }, 'hsl')).toBe('hsl(240 100% 50% / 0.5)')
    })

    it('then black and white have no saturation', () => {
      expect(formatColor({ r: 0, g: 0, b: 0, a: 1 }, 'hsl')).toBe('hsl(0 0% 0%)')
      expect(formatColor({ r: 255, g: 255, b: 255, a: 1 }, 'hsl')).toBe('hsl(0 0% 100%)')
    })

    it('then a mid tone is computed', () => {
      expect(formatColor(orange, 'hsl')).toBe('hsl(32 100% 50%)')
    })
  })

  describe('when formatting in oklch', () => {
    it('then white has no chroma and a zero hue', () => {
      expect(formatColor({ r: 255, g: 255, b: 255, a: 1 }, 'oklch')).toBe('oklch(1 0 0)')
    })

    it('then black is formatted', () => {
      expect(formatColor({ r: 0, g: 0, b: 0, a: 1 }, 'oklch')).toBe('oklch(0 0 0)')
    })

    it('then red is formatted with chroma and hue', () => {
      expect(formatColor({ r: 255, g: 0, b: 0, a: 1 }, 'oklch')).toBe('oklch(0.628 0.258 29.2)')
    })

    it('then a color with a negative b axis gets a positive hue', () => {
      const blue = formatColor({ r: 0, g: 0, b: 255, a: 0.5 }, 'oklch')

      expect(blue).toBe('oklch(0.452 0.313 264.1 / 0.5)')
    })

    it('then it round trips with parseColor', () => {
      const parsed = parseColor(formatColor(orange, 'oklch'))

      expect(parsed?.r).toBeCloseTo(255, 0)
      expect(parsed?.g).toBeCloseTo(136, 0)
      expect(parsed?.b).toBeLessThan(3)
    })
  })
})

describe('given getLuminance', () => {
  describe('when computing', () => {
    it('then black is 0 and white is 1', () => {
      expect(getLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBe(0)
      expect(getLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1, 5)
    })

    it('then a dark channel under the linear threshold is handled', () => {
      expect(getLuminance({ r: 5, g: 5, b: 5, a: 1 })).toBeCloseTo(5 / 255 / 12.92, 6)
    })

    it('then green is brighter than blue', () => {
      expect(getLuminance({ r: 0, g: 255, b: 0, a: 1 })).toBeGreaterThan(getLuminance({ r: 0, g: 0, b: 255, a: 1 }))
    })
  })
})
