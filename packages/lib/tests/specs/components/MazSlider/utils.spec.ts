import { getOffset, getOpacityCoeff, isBetween } from '@components/MazSlider/utils'

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
})
