import { useSwipe } from '@composables/useSwipe'
import { vi } from 'vitest'

let capturedOnValuesChanged: ((values: any) => void) | undefined
const swipeHandlerMock = {
  options: {} as any,
  start: vi.fn(),
  stop: vi.fn(),
  onValuesChanged: vi.fn(),
}

vi.mock('@maz-ui/utils/helpers/swipeHandler', () => ({
  // eslint-disable-next-line prefer-arrow-callback
  Swipe: vi.fn(function (opts: any) {
    capturedOnValuesChanged = opts.onValuesChanged
    swipeHandlerMock.options = opts
    return swipeHandlerMock
  }),
}))

describe('given useSwipe composable - extended', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedOnValuesChanged = undefined
  })

  describe('when onValuesChanged callback is invoked', () => {
    it('then it should update all reactive values', () => {
      const el = document.createElement('div')
      const { xDiff, yDiff, xStart, xEnd, yStart, yEnd } = useSwipe({ element: el })

      // The Swipe constructor should have captured the onValuesChanged callback
      expect(capturedOnValuesChanged).toBeDefined()

      capturedOnValuesChanged!({
        xDiff: 10,
        yDiff: 20,
        xStart: 100,
        xEnd: 110,
        yStart: 200,
        yEnd: 220,
      })

      expect(xDiff.value).toBe(10)
      expect(yDiff.value).toBe(20)
      expect(xStart.value).toBe(100)
      expect(xEnd.value).toBe(110)
      expect(yStart.value).toBe(200)
      expect(yEnd.value).toBe(220)
    })
  })

  describe('when start is called with an element', () => {
    it('then it should set options.element and call swiper.start', () => {
      const el = document.createElement('div')
      const { start } = useSwipe({ element: el })

      start()
      expect(swipeHandlerMock.options.element).toBe(el)
      expect(swipeHandlerMock.start).toHaveBeenCalled()
    })
  })

  describe('when start is called with a string selector', () => {
    it('then it should call swiper.start without element resolution', () => {
      const { start } = useSwipe({ element: null })

      start()
      expect(swipeHandlerMock.start).toHaveBeenCalled()
    })
  })
})
