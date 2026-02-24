import { getOffset, getOpacityCoeff, getPos, isBetween } from '@components/MazSlider/utils'

describe('utils', () => {
  it('should return the correct offset for an element', () => {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.top = '10px'
    div.style.left = '20px'
    document.body.append(div)
    const offset = getOffset(div)
    expect(offset).toEqual({ x: 0, y: 0 })
  })

  it('should return true if the value is between the prev and next values', () => {
    expect(isBetween(5, 0, 10, 'minus')).toBe(true)
    expect(isBetween(5, 3, 10, 'minus')).toBe(true)
    expect(isBetween(5, 6, 10, 'minus')).toBe(false)
    expect(isBetween(5, 0, 10, 'plus')).toBe(true)
    expect(isBetween(5, 0, 3, 'plus')).toBe(false)
    expect(isBetween(5, 6, 10, 'plus')).toBe(true)
  })

  it('should return the correct opacity coefficient for an element index', () => {
    expect(getOpacityCoeff(0, 5, 10)).toBe(0.4)
    expect(getOpacityCoeff(4, 5, 10)).toBe(0)
    expect(getOpacityCoeff(5, 5, 10)).toBe(0.1)
    expect(getOpacityCoeff(6, 5, 10)).toBe(0.2)
    expect(getOpacityCoeff(9, 5, 10)).toBe(0.5)
  })

  describe('getPos', () => {
    it('should return position for mouse event', () => {
      const elem = document.createElement('div') as HTMLDivElement
      document.body.appendChild(elem)

      const event = new MouseEvent('click', { clientX: 100, clientY: 50 })
      const pos = getPos(event, elem)

      expect(pos).toHaveProperty('x')
      expect(pos).toHaveProperty('y')

      document.body.removeChild(elem)
    })

    it('should return reversed position when isReverse is true', () => {
      const elem = document.createElement('div') as HTMLDivElement
      Object.defineProperty(elem, 'offsetWidth', { value: 200 })
      Object.defineProperty(elem, 'offsetHeight', { value: 100 })
      document.body.appendChild(elem)

      const event = new MouseEvent('click', { clientX: 50, clientY: 25 })
      const pos = getPos(event, elem, true)

      expect(typeof pos.x).toBe('number')
      expect(typeof pos.y).toBe('number')

      document.body.removeChild(elem)
    })

    it('should handle touch events', () => {
      const elem = document.createElement('div') as HTMLDivElement
      document.body.appendChild(elem)

      const touchEvent = {
        targetTouches: [{ pageX: 100, pageY: 50 }],
      } as unknown as TouchEvent

      const pos = getPos(touchEvent, elem)
      expect(pos).toHaveProperty('x')
      expect(pos).toHaveProperty('y')

      document.body.removeChild(elem)
    })
  })
})
