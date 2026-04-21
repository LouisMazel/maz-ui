import { onAutofillSync } from '@/utils/autofillSync'

const ANIMATION_NAME = 'maz-autofill-start'
const STYLE_ELEMENT_ID = 'maz-autofill-sync'

describe('Given autofillSync util', () => {
  beforeEach(() => {
    document.getElementById(STYLE_ELEMENT_ID)?.remove()
  })

  describe('When called on an input element', () => {
    it('Then it injects the autofill stylesheet into the document head', () => {
      const input = document.createElement('input')

      onAutofillSync(input, vi.fn())

      const style = document.getElementById(STYLE_ELEMENT_ID)
      expect(style).not.toBeNull()
      expect(style?.textContent).toContain(ANIMATION_NAME)
    })

    it('Then it marks the field with the sync attribute', () => {
      const input = document.createElement('input')

      onAutofillSync(input, vi.fn())

      expect(input.hasAttribute('data-maz-autofill-sync')).toBe(true)
    })
  })

  describe('When called multiple times across different fields', () => {
    it('Then the stylesheet is injected only once', () => {
      const inputA = document.createElement('input')
      const inputB = document.createElement('input')

      onAutofillSync(inputA, vi.fn())
      onAutofillSync(inputB, vi.fn())

      expect(document.querySelectorAll(`#${STYLE_ELEMENT_ID}`)).toHaveLength(1)
    })
  })

  describe('When animationstart fires with the autofill animation name', () => {
    it('Then onSync is called with the field value', () => {
      const input = document.createElement('input')
      input.value = 'autofilled@example.com'
      const onSync = vi.fn()

      onAutofillSync(input, onSync)
      input.dispatchEvent(
        Object.assign(new Event('animationstart'), { animationName: ANIMATION_NAME }),
      )

      expect(onSync).toHaveBeenCalledWith('autofilled@example.com')
    })
  })

  describe('When animationstart fires with a different animation name', () => {
    it('Then onSync is not called', () => {
      const input = document.createElement('input')
      const onSync = vi.fn()

      onAutofillSync(input, onSync)
      input.dispatchEvent(
        Object.assign(new Event('animationstart'), { animationName: 'other-animation' }),
      )

      expect(onSync).not.toHaveBeenCalled()
    })
  })

  describe('When the cleanup function is invoked', () => {
    it('Then the sync attribute is removed from the field', () => {
      const input = document.createElement('input')

      const cleanup = onAutofillSync(input, vi.fn())
      cleanup()

      expect(input.hasAttribute('data-maz-autofill-sync')).toBe(false)
    })

    it('Then subsequent animationstart events do not trigger onSync', () => {
      const input = document.createElement('input')
      const onSync = vi.fn()

      const cleanup = onAutofillSync(input, onSync)
      cleanup()
      input.dispatchEvent(
        Object.assign(new Event('animationstart'), { animationName: ANIMATION_NAME }),
      )

      expect(onSync).not.toHaveBeenCalled()
    })
  })

  describe('When used on a textarea element', () => {
    it('Then onSync receives the textarea value on autofill', () => {
      const textarea = document.createElement('textarea')
      textarea.value = '10 Downing Street'
      const onSync = vi.fn()

      onAutofillSync(textarea, onSync)
      textarea.dispatchEvent(
        Object.assign(new Event('animationstart'), { animationName: ANIMATION_NAME }),
      )

      expect(onSync).toHaveBeenCalledWith('10 Downing Street')
    })
  })

  describe('When the document global is not defined', () => {
    it('Then it skips stylesheet injection and still registers the listener', () => {
      const field = {
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        value: '',
      }

      const originalDocument = globalThis.document
      Object.defineProperty(globalThis, 'document', {
        value: undefined,
        configurable: true,
        writable: true,
      })

      try {
        const cleanup = onAutofillSync(field as unknown as HTMLInputElement, vi.fn())
        expect(field.setAttribute).toHaveBeenCalledWith('data-maz-autofill-sync', '')
        expect(field.addEventListener).toHaveBeenCalledWith('animationstart', expect.any(Function))
        cleanup()
        expect(field.removeEventListener).toHaveBeenCalled()
        expect(field.removeAttribute).toHaveBeenCalledWith('data-maz-autofill-sync')
      }
      finally {
        Object.defineProperty(globalThis, 'document', {
          value: originalDocument,
          configurable: true,
          writable: true,
        })
      }
    })
  })
})
