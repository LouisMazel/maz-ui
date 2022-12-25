import { getOffset, getPos, isBetween, getOpacityCoeff } from '@package/components/MazSlider/utils'

describe('utils', () => {
  it('should return the correct offset for an element', () => {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.top = '10px'
    div.style.left = '20px'
    document.body.append(div)
    const offset = getOffset(div)
    expect(offset).toEqual({ x: 20, y: 10 })
  })

  it('should return the correct position of the mouse/finger in the element', () => {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.top = '10px'
    div.style.left = '20px'
    div.style.width = '200px'
    div.style.height = '100px'
    document.body.append(div)
    const e = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 60,
    })
    const pos = getPos(e, div)
    expect(pos).toEqual({ x: 50, y: 60 })
  })

  it('should return the correct position of the mouse/finger in the element when isReverse is true', () => {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.top = '10px'
    div.style.left = '20px'
    div.style.width = '200px'
    div.style.height = '100px'
    document.body.append(div)
    const e = new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 60,
    })
    const pos = getPos(e, div, true)
    expect(pos).toEqual({ x: 150, y: 40 })
  })

  it('should return true if the value is between the prev and next values', () => {
    expect(isBetween(5, 0, 10, 'minus')).toBe(true)
    expect(isBetween(5, 3, 10, 'minus')).toBe(true)
    expect(isBetween(5, 6, 10, 'minus')).toBe(false)
    expect(isBetween(5, 0, 10, 'plus')).toBe(true)
    expect(isBetween(5, 0, 3, 'plus')).toBe(true)
    expect(isBetween(5, 6, 10, 'plus')).toBe(false)
  })

  it('should return the correct opacity coefficient for an element index', () => {
    expect(getOpacityCoeff(0, 5, 10)).toBe(0.5)
    expect(getOpacityCoeff(4, 5, 10)).toBe(0)
    expect(getOpacityCoeff(5, 5, 10)).toBe(0)
    expect(getOpacityCoeff(6, 5, 10)).toBe(0.1)
    expect(getOpacityCoeff(9, 5, 10)).toBe(0.5)
  })
})
