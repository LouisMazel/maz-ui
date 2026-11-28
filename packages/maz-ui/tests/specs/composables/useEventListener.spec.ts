import { useEventListener } from '@composables/useEventListener.ts'

describe('given the useEventListener composable', () => {
  describe('when the target is globalThis', () => {
    it('then the event is typed from WindowEventMap and the listener is called', () => {
      const listener = vi.fn((event: KeyboardEvent) => event.key)
      const stop = useEventListener(globalThis, 'keydown', listener)

      globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))

      expect(listener).toHaveBeenCalledTimes(1)

      stop()
      globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))

      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the target is an element and several events are given', () => {
    it('then the listener receives each event', () => {
      const element = document.createElement('div')
      const listener = vi.fn()
      const stop = useEventListener(element, ['focus', 'blur'], listener)

      element.dispatchEvent(new FocusEvent('focus'))
      element.dispatchEvent(new FocusEvent('blur'))

      expect(listener).toHaveBeenCalledTimes(2)

      stop()
    })
  })
})
