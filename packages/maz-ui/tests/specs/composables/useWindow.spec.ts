import { useWindow } from '@composables/useWindow.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'

describe('given the useWindow composable', () => {
  describe('when it runs in the browser', () => {
    it('then it exposes the window and listens to its events until unmount', () => {
      const listener = vi.fn()
      const [{ window: win, isSupported, on }, app] = withSetup(() => {
        const result = useWindow()
        result.on('resize', listener)

        return result
      })

      expect(win).toBe(globalThis)
      expect(isSupported).toBe(true)
      expect(on).toBeTypeOf('function')

      globalThis.dispatchEvent(new Event('resize'))
      expect(listener).toHaveBeenCalledTimes(1)

      app.unmount()
      globalThis.dispatchEvent(new Event('resize'))
      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('when a custom window is given', () => {
    it('then the listeners are added to it', () => {
      const fake = { addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as Window
      const listener = vi.fn()
      const [, app] = withSetup(() => useWindow({ internalWindow: fake }).on('blur', listener))

      expect(fake.addEventListener).toHaveBeenCalledWith('blur', listener, undefined)

      app.unmount()
      expect(fake.removeEventListener).toHaveBeenCalledWith('blur', listener, undefined)
    })
  })
})
