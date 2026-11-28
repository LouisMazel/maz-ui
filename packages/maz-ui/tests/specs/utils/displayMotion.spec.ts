import { setBorderDrawFrom } from '@/utils/borderDraw.ts'
import { getElevationClass } from '@/utils/elevation.ts'
import { readMotionDuration, readMotionEasing } from '@/utils/motionTokens.ts'

describe('given getElevationClass', () => {
  describe('when the elevation is a boolean', () => {
    it('then true keeps the historical shadow', () => {
      expect(getElevationClass(true)).toBe('maz:shadow-elevation maz:drop-shadow-md')
    })

    it.each([false, 0, undefined] as const)('then %s gives no class', (value) => {
      expect(getElevationClass(value)).toBeUndefined()
    })
  })

  describe('when the elevation is a level', () => {
    it.each([
      [1, 'maz:shadow-sm'],
      [2, 'maz:shadow-elevation'],
      [3, 'maz:shadow-lg'],
    ] as const)('then the level %s gives its shadow', (level, expected) => {
      expect(getElevationClass(level)).toBe(expected)
    })
  })
})

describe('given setBorderDrawFrom', () => {
  const pointerOn = (element: HTMLElement, clientX: number, clientY: number) => ({
    currentTarget: element,
    clientX,
    clientY,
  }) as unknown as PointerEvent

  const createElement = () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect

    return element
  }

  describe('when the pointer enters', () => {
    it.each([
      [100, 0, '0deg'],
      [200, 50, '90deg'],
      [100, 100, '180deg'],
      [0, 50, '-90deg'],
    ])('then the angle of (%s, %s) is %s', (x, y, expected) => {
      const element = createElement()

      setBorderDrawFrom(pointerOn(element, x, y))

      expect(element.style.getPropertyValue('--maz-border-draw-from')).toBe(expected)
    })

    it('then nothing happens without a current target', () => {
      expect(() => setBorderDrawFrom({ clientX: 0, clientY: 0, currentTarget: null } as unknown as PointerEvent)).not.toThrow()
    })
  })
})

describe('given the motion tokens', () => {
  afterEach(() => {
    document.documentElement.style.cssText = ''
  })

  describe('when a duration is read', () => {
    it('then it reads milliseconds and seconds, multiplied by the scale', () => {
      document.documentElement.style.setProperty('--maz-motion-slow', '0.3s')
      document.documentElement.style.setProperty('--maz-motion-scale', '2')

      expect(readMotionDuration('--maz-motion-slow', 100)).toBe(600)
    })

    it('then it uses the fallback when the token is missing', () => {
      expect(readMotionDuration('--maz-motion-missing', 123)).toBe(123)
    })

    it('then it reads a token in milliseconds', () => {
      document.documentElement.style.setProperty('--maz-motion-fast', '150ms')

      expect(readMotionDuration('--maz-motion-fast', 1)).toBe(150)
    })
  })

  describe('when an easing is read', () => {
    it('then it returns the token', () => {
      document.documentElement.style.setProperty('--maz-easing-out', 'ease-out')

      expect(readMotionEasing('--maz-easing-out', 'linear')).toBe('ease-out')
    })

    it('then it uses the fallback when the token is missing or refers to a variable', () => {
      document.documentElement.style.setProperty('--maz-easing-in', 'var(--other)')

      expect(readMotionEasing('--maz-easing-missing', 'linear')).toBe('linear')
      expect(readMotionEasing('--maz-easing-in', 'linear')).toBe('linear')
    })
  })
})
