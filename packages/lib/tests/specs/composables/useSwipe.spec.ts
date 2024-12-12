import { useSwipe } from '@composables/useSwipe'

const swipeHandlerMock = {
  options: {},
  start: vi.fn(),
  stop: vi.fn(),
  onValuesChanged: vi.fn(),
}
vi.mock('@helpers/swipeHandler', () => ({
  Swipe: vi.fn().mockImplementation(() => swipeHandlerMock),
}))

describe('given the useSwipe composable', () => {
  describe('when initializing the swipe handler', () => {
    it('then it should initialize swipe values to undefined', () => {
      const options = { element: document.createElement('div') }
      const { xDiff, yDiff, xStart, xEnd, yStart, yEnd } = useSwipe(options)

      expect(xDiff.value).toBeUndefined()
      expect(yDiff.value).toBeUndefined()
      expect(xStart.value).toBeUndefined()
      expect(xEnd.value).toBeUndefined()
      expect(yStart.value).toBeUndefined()
      expect(yEnd.value).toBeUndefined()
    })
  })

  describe('when starting and stopping the swipe handler', () => {
    it('then it should call start and stop methods of the swipe handler', () => {
      const options = { element: document.createElement('div') }
      const { start, stop } = useSwipe(options)

      start()
      expect(swipeHandlerMock.start).toHaveBeenCalled()

      stop()
      expect(swipeHandlerMock.stop).toHaveBeenCalled()
    })
  })
})
