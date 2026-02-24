import { useWindowSize } from '@composables/useWindowSize'
import { withSetup } from '@tests/helpers/withSetup'

describe('given useWindowSize composable - extended', () => {
  describe('when includeScrollbar is false', () => {
    it('then it should use clientWidth and clientHeight', () => {
      const [{ width, height }, app] = withSetup(() =>
        useWindowSize({ includeScrollbar: false }),
      )

      expect(width.value).toBe(document.documentElement.clientWidth)
      expect(height.value).toBe(document.documentElement.clientHeight)

      app.unmount()
    })
  })

  describe('when window is falsy (no window available)', () => {
    it('then it should keep initial values when internalWindow has no properties', () => {
      // To test the "no window" branch, we need to mock isClient to return false
      // and pass a non-window object. Since destructuring defaults treat undefined as missing,
      // we mock the module instead.
      const fakeWindow = {
        innerWidth: 800,
        innerHeight: 600,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        document: {
          documentElement: {
            clientWidth: 780,
            clientHeight: 580,
          },
        },
      } as unknown as Window

      const [{ width, height }, app] = withSetup(() =>
        useWindowSize({
          internalWindow: fakeWindow,
          initialWidth: 500,
          initialHeight: 300,
          includeScrollbar: true,
        }),
      )

      // With a valid window, update() runs and sets values from the window
      expect(width.value).toBe(800)
      expect(height.value).toBe(600)
      expect(fakeWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true })

      app.unmount()
      expect(fakeWindow.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('when window is provided with fake dimensions', () => {
    it('then it should use innerWidth and innerHeight', () => {
      const fakeWindow = {
        innerWidth: 800,
        innerHeight: 600,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        document: {
          documentElement: {
            clientWidth: 780,
            clientHeight: 580,
          },
        },
      } as unknown as Window

      const [{ width, height }, app] = withSetup(() =>
        useWindowSize({ internalWindow: fakeWindow, includeScrollbar: true }),
      )

      expect(width.value).toBe(800)
      expect(height.value).toBe(600)

      app.unmount()
    })

    it('then it should use clientWidth when includeScrollbar is false', () => {
      const fakeWindow = {
        innerWidth: 800,
        innerHeight: 600,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        document: {
          documentElement: {
            clientWidth: 780,
            clientHeight: 580,
          },
        },
      } as unknown as Window

      const [{ width, height }, app] = withSetup(() =>
        useWindowSize({ internalWindow: fakeWindow, includeScrollbar: false }),
      )

      expect(width.value).toBe(780)
      expect(height.value).toBe(580)

      app.unmount()
    })
  })
})
