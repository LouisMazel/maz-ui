import { useShortcut } from '@composables/useShortcut.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { nextTick, ref } from 'vue'

function press(init: KeyboardEventInit, target: EventTarget = globalThis) {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)

  return event
}

describe('given the useShortcut composable', () => {
  describe('when the shortcut uses mod on a non apple platform', () => {
    it('then ctrl triggers the handler, prevents the default and the label is Ctrl+K', () => {
      const handler = vi.fn()
      const [{ label }, app] = withSetup(() => useShortcut('mod+k', handler, { apple: false }))

      expect(label.value).toBe('Ctrl+K')

      const event = press({ key: 'k', ctrlKey: true })
      expect(handler).toHaveBeenCalledTimes(1)
      expect(event.defaultPrevented).toBe(true)

      press({ key: 'k', metaKey: true })
      expect(handler).toHaveBeenCalledTimes(1)
      app.unmount()
    })
  })

  describe('when the shortcut uses mod on an apple platform', () => {
    it('then cmd triggers the handler and the label is ⌘K', () => {
      const handler = vi.fn()
      const [{ label }, app] = withSetup(() => useShortcut('mod+k', handler, { apple: true }))

      expect(label.value).toBe('⌘K')

      press({ key: 'k', metaKey: true })
      expect(handler).toHaveBeenCalledTimes(1)
      app.unmount()
    })
  })

  describe('when the component is unmounted', () => {
    it('then the handler is not called anymore', () => {
      const handler = vi.fn()
      const [, app] = withSetup(() => useShortcut('ctrl+k', handler))

      app.unmount()
      press({ key: 'k', ctrlKey: true })

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('when stop is called', () => {
    it('then the handler is not called anymore', () => {
      const handler = vi.fn()
      const [{ stop }, app] = withSetup(() => useShortcut('ctrl+k', handler))

      stop()
      press({ key: 'k', ctrlKey: true })

      expect(handler).not.toHaveBeenCalled()
      app.unmount()
    })
  })

  describe('when preventDefault is false', () => {
    it('then the default is kept', () => {
      const [, app] = withSetup(() => useShortcut('ctrl+k', vi.fn(), { preventDefault: false }))

      expect(press({ key: 'k', ctrlKey: true }).defaultPrevented).toBe(false)
      app.unmount()
    })
  })

  describe('when the focus is in an input', () => {
    it('then a plain key shortcut is ignored and a ctrl shortcut triggers', () => {
      const plain = vi.fn()
      const withCtrl = vi.fn()
      const input = document.createElement('input')
      document.body.append(input)
      const [, app] = withSetup(() => {
        useShortcut('k', plain)
        useShortcut('ctrl+j', withCtrl)
      })

      press({ key: 'k' }, input)
      press({ key: 'j', ctrlKey: true }, input)

      expect(plain).not.toHaveBeenCalled()
      expect(withCtrl).toHaveBeenCalledTimes(1)
      input.remove()
      app.unmount()
    })

    it('then an alt shortcut is ignored by default', () => {
      const withAlt = vi.fn()
      const input = document.createElement('input')
      document.body.append(input)
      const [, app] = withSetup(() => useShortcut('alt+j', withAlt))

      press({ key: 'j', altKey: true }, input)

      expect(withAlt).not.toHaveBeenCalled()
      input.remove()
      app.unmount()
    })

    it('then allowInInputs overrides the default', () => {
      const plain = vi.fn()
      const input = document.createElement('input')
      document.body.append(input)
      const [, app] = withSetup(() => useShortcut('k', plain, { allowInInputs: true }))

      press({ key: 'k' }, input)

      expect(plain).toHaveBeenCalledTimes(1)
      input.remove()
      app.unmount()
    })
  })

  describe('when the key is held', () => {
    it('then repeats are ignored unless allowRepeat is set', () => {
      const ignored = vi.fn()
      const allowed = vi.fn()
      const [, app] = withSetup(() => {
        useShortcut('ctrl+k', ignored)
        useShortcut('ctrl+k', allowed, { allowRepeat: true })
      })

      press({ key: 'k', ctrlKey: true, repeat: true })

      expect(ignored).not.toHaveBeenCalled()
      expect(allowed).toHaveBeenCalledTimes(1)
      app.unmount()
    })
  })

  describe('when enabled is false', () => {
    it('then the handler is not called until it is enabled', () => {
      const handler = vi.fn()
      const enabled = ref(false)
      const [, app] = withSetup(() => useShortcut('ctrl+k', handler, { enabled }))

      press({ key: 'k', ctrlKey: true })
      expect(handler).not.toHaveBeenCalled()

      enabled.value = true
      press({ key: 'k', ctrlKey: true })
      expect(handler).toHaveBeenCalledTimes(1)
      app.unmount()
    })
  })

  describe('when the shortcut is a ref', () => {
    it('then the label and the matching follow it', async () => {
      const handler = vi.fn()
      const shortcut = ref('ctrl+1')
      const [{ label }, app] = withSetup(() => useShortcut(shortcut, handler, { apple: false }))

      shortcut.value = 'ctrl+2'
      await nextTick()
      press({ key: '1', ctrlKey: true })
      press({ key: '2', ctrlKey: true })

      expect(label.value).toBe('Ctrl+2')
      expect(handler).toHaveBeenCalledTimes(1)
      app.unmount()
    })
  })

  describe('when a target and an event are given', () => {
    it('then only that target and event are used', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      const [, app] = withSetup(() => useShortcut('enter', handler, { target: element, event: 'keyup' }))

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      expect(handler).not.toHaveBeenCalled()

      element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }))
      expect(handler).toHaveBeenCalledTimes(1)
      app.unmount()
    })
  })
})
