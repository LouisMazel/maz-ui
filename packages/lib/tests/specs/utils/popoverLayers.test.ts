import { addPopoverLayer, isInUpperPopoverLayer, isTopPopoverLayer, removePopoverLayer } from '@/utils/popoverLayers'

function createLayer(element: HTMLElement) {
  return {
    contains: (target: Node) => element.contains(target),
  }
}

describe('given two open popover layers', () => {
  const lowerElement = document.createElement('div')
  const upperElement = document.createElement('div')
  const lower = createLayer(lowerElement)
  const upper = createLayer(upperElement)

  beforeEach(() => {
    addPopoverLayer(lower)
    addPopoverLayer(upper)
  })

  afterEach(() => {
    removePopoverLayer(lower)
    removePopoverLayer(upper)
  })

  describe('when the top layer is checked', () => {
    it('is the last opened one', () => {
      expect(isTopPopoverLayer(upper)).toBe(true)
      expect(isTopPopoverLayer(lower)).toBe(false)
    })
  })

  describe('when the lower layer is added again', () => {
    it('becomes the top layer', () => {
      addPopoverLayer(lower)

      expect(isTopPopoverLayer(lower)).toBe(true)
    })
  })

  describe('when a target inside the upper layer is checked', () => {
    it('is in an upper layer of the lower one only', () => {
      expect(isInUpperPopoverLayer(lower, upperElement)).toBe(true)
      expect(isInUpperPopoverLayer(upper, upperElement)).toBe(false)
    })
  })

  describe('when a layer that is not open is checked', () => {
    it('has no upper layer', () => {
      expect(isInUpperPopoverLayer(createLayer(document.createElement('div')), upperElement)).toBe(false)
    })
  })

  describe('when a layer that is not open is removed', () => {
    it('keeps the open layers', () => {
      removePopoverLayer(createLayer(document.createElement('div')))

      expect(isTopPopoverLayer(upper)).toBe(true)
    })
  })
})
