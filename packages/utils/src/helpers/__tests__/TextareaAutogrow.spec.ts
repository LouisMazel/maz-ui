import { TextareaAutogrow } from '../TextareaAutogrow'

describe('given TextareaAutogrow class', () => {
  let textarea: HTMLTextAreaElement

  beforeEach(() => {
    textarea = document.createElement('textarea')
    document.body.append(textarea)
    vi.spyOn(textarea, 'addEventListener')
    vi.spyOn(textarea, 'removeEventListener')
  })

  afterEach(() => {
    textarea.remove()
  })

  describe('when creating a new instance', () => {
    it('then it should add focus event listener and set styles', () => {
      const instance = new TextareaAutogrow(textarea)
      expect(instance).toBeDefined()
      expect(textarea.addEventListener).toHaveBeenCalledWith('focus', expect.any(Function))
      expect(textarea.style.resize).toBe('none')
      expect(textarea.style.boxSizing).toBe('border-box')
    })
  })

  describe('when textarea is focused', () => {
    it('then it should add input listener and set height', () => {
      const instance = new TextareaAutogrow(textarea)
      expect(instance).toBeDefined()

      textarea.dispatchEvent(new Event('focus'))

      expect(textarea.style.height).toBe('0px')
      expect(textarea.style.overflow).toBe('hidden')
    })
  })

  describe('when disconnect is called', () => {
    it('then it should remove event listeners', () => {
      const instance = new TextareaAutogrow(textarea)
      const windowRemoveSpy = vi.spyOn(globalThis, 'removeEventListener')

      instance.disconnect()

      expect(windowRemoveSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      expect(textarea.removeEventListener).toHaveBeenCalledWith('input', expect.any(Function))
    })
  })

  describe('when window is resized after focus', () => {
    it('then it should trigger autogrow via debounced resize handler', () => {
      vi.useFakeTimers()
      const instance = new TextareaAutogrow(textarea)
      expect(instance).toBeDefined()

      textarea.dispatchEvent(new Event('focus'))

      globalThis.dispatchEvent(new Event('resize'))
      vi.advanceTimersByTime(200)

      expect(textarea.style.overflow).toBe('hidden')
      vi.useRealTimers()
    })
  })
})
