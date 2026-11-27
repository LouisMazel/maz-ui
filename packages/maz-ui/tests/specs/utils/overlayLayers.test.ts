import { addOverlayLayer, isInUpperOverlayLayer, isTopOverlayLayer, removeOverlayLayer } from '@/utils/overlayLayers.ts'

function createLayer(element: HTMLElement) {
  return {
    contains: (target: Node) => element.contains(target),
  }
}

describe('given two open overlay layers', () => {
  const lowerElement = document.createElement('div')
  const upperElement = document.createElement('div')
  const lower = createLayer(lowerElement)
  const upper = createLayer(upperElement)

  beforeEach(() => {
    addOverlayLayer(lower)
    addOverlayLayer(upper)
  })

  afterEach(() => {
    removeOverlayLayer(lower)
    removeOverlayLayer(upper)
  })

  describe('when the top layer is checked', () => {
    it('is the last opened one', () => {
      expect(isTopOverlayLayer(upper)).toBe(true)
      expect(isTopOverlayLayer(lower)).toBe(false)
    })
  })

  describe('when the lower layer is added again', () => {
    it('becomes the top layer', () => {
      addOverlayLayer(lower)

      expect(isTopOverlayLayer(lower)).toBe(true)
    })
  })

  describe('when a target inside the upper layer is checked', () => {
    it('is in an upper layer of the lower one only', () => {
      expect(isInUpperOverlayLayer(lower, upperElement)).toBe(true)
      expect(isInUpperOverlayLayer(upper, upperElement)).toBe(false)
    })
  })

  describe('when a layer that is not open is checked', () => {
    it('has no upper layer', () => {
      expect(isInUpperOverlayLayer(createLayer(document.createElement('div')), upperElement)).toBe(false)
    })
  })

  describe('when a layer that is not open is removed', () => {
    it('keeps the open layers', () => {
      removeOverlayLayer(createLayer(document.createElement('div')))

      expect(isTopOverlayLayer(upper)).toBe(true)
    })
  })
})
