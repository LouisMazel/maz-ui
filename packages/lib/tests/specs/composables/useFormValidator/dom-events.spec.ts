import {
  addEventToInteractiveElements,
  findInteractiveElements,
  getValidationEvents,
  removeEventFromInteractiveElements,
  scrollToError,
} from '@composables/useFormValidator/dom-events'

describe('given dom-events module', () => {
  describe('scrollToError', () => {
    it('then it should scroll to the error element', () => {
      const el = document.createElement('div')
      el.classList.add('has-field-error')
      el.scrollIntoView = vi.fn()
      document.body.appendChild(el)

      scrollToError('.has-field-error')

      expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
      document.body.removeChild(el)
    })

    it('then it should handle missing element', () => {
      expect(() => scrollToError('.nonexistent')).not.toThrow()
    })

    it('then it should use default selector', () => {
      expect(() => scrollToError()).not.toThrow()
    })
  })

  describe('findInteractiveElements', () => {
    it('then it should return the element itself if it is interactive', () => {
      const input = document.createElement('input')
      const result = findInteractiveElements(input)
      expect(result).toEqual([input])
    })

    it('then it should find nested input elements', () => {
      const wrapper = document.createElement('div')
      const input = document.createElement('input')
      wrapper.appendChild(input)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(input)
    })

    it('then it should find nested select elements', () => {
      const wrapper = document.createElement('div')
      const select = document.createElement('select')
      wrapper.appendChild(select)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(select)
    })

    it('then it should find nested textarea elements', () => {
      const wrapper = document.createElement('div')
      const textarea = document.createElement('textarea')
      wrapper.appendChild(textarea)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(textarea)
    })

    it('then it should find elements with role attributes', () => {
      const wrapper = document.createElement('div')
      const roleEl = document.createElement('div')
      roleEl.setAttribute('role', 'button')
      wrapper.appendChild(roleEl)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(roleEl)
    })

    it('then it should find contenteditable elements', () => {
      const wrapper = document.createElement('div')
      const editableEl = document.createElement('div')
      editableEl.setAttribute('contenteditable', 'true')
      wrapper.appendChild(editableEl)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(editableEl)
    })

    it('then it should find elements with data-interactive', () => {
      const wrapper = document.createElement('div')
      const el = document.createElement('div')
      el.setAttribute('data-interactive', '')
      wrapper.appendChild(el)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(el)
    })

    it('then it should find elements with data-clickable', () => {
      const wrapper = document.createElement('div')
      const el = document.createElement('div')
      el.setAttribute('data-clickable', '')
      wrapper.appendChild(el)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(el)
    })

    it('then it should find elements with class interactive', () => {
      const wrapper = document.createElement('div')
      const el = document.createElement('div')
      el.classList.add('interactive')
      wrapper.appendChild(el)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(el)
    })

    it('then it should exclude tabindex="-1" elements', () => {
      const wrapper = document.createElement('div')
      const el = document.createElement('div')
      el.setAttribute('tabindex', '-1')
      el.setAttribute('role', 'button')
      wrapper.appendChild(el)

      const result = findInteractiveElements(wrapper)
      expect(result).not.toContain(el)
    })

    it('then it should find elements with positive tabindex', () => {
      const wrapper = document.createElement('div')
      const el = document.createElement('div')
      el.setAttribute('tabindex', '0')
      wrapper.appendChild(el)

      const result = findInteractiveElements(wrapper)
      expect(result).toContain(el)
    })

    it('then it should return button elements', () => {
      const button = document.createElement('button')
      const result = findInteractiveElements(button)
      expect(result).toEqual([button])
    })
  })

  describe('addEventToInteractiveElements', () => {
    it('then it should add blur event listener', () => {
      const el = document.createElement('input')
      const onBlur = vi.fn()

      addEventToInteractiveElements({
        interactiveElements: [el],
        onBlur,
        mode: 'blur',
      })

      el.dispatchEvent(new Event('blur'))
      expect(onBlur).toHaveBeenCalled()
    })

    it('then it should clean up existing listener before adding new one', () => {
      const el = document.createElement('input')
      const onBlur1 = vi.fn()
      const onBlur2 = vi.fn()

      addEventToInteractiveElements({
        interactiveElements: [el],
        onBlur: onBlur1,
        mode: 'eager',
      })

      addEventToInteractiveElements({
        interactiveElements: [el],
        onBlur: onBlur2,
        mode: 'eager',
      })

      el.dispatchEvent(new Event('blur'))
      expect(onBlur2).toHaveBeenCalled()
    })
  })

  describe('removeEventFromInteractiveElements', () => {
    it('then it should remove blur event listener', () => {
      const el = document.createElement('input')
      const onBlur = vi.fn()

      addEventToInteractiveElements({
        interactiveElements: [el],
        onBlur,
        mode: 'blur',
      })

      removeEventFromInteractiveElements({
        interactiveElements: [el],
        onBlur,
      })

      el.dispatchEvent(new Event('blur'))
      expect(onBlur).not.toHaveBeenCalled()
    })

    it('then it should handle elements without active listeners', () => {
      const el = document.createElement('input')
      const onBlur = vi.fn()

      expect(() =>
        removeEventFromInteractiveElements({
          interactiveElements: [el],
          onBlur,
        }),
      ).not.toThrow()
    })
  })

  describe('getValidationEvents', () => {
    it('then it should return undefined when hasRef is true', () => {
      const result = getValidationEvents({
        hasRef: true,
        fieldState: { mode: 'blur' } as any,
        onBlur: vi.fn(),
      })
      expect(result).toBeUndefined()
    })

    it('then it should return undefined for aggressive mode', () => {
      const result = getValidationEvents({
        hasRef: false,
        fieldState: { mode: 'aggressive' } as any,
        onBlur: vi.fn(),
      })
      expect(result).toBeUndefined()
    })

    it('then it should return undefined for lazy mode', () => {
      const result = getValidationEvents({
        hasRef: false,
        fieldState: { mode: 'lazy' } as any,
        onBlur: vi.fn(),
      })
      expect(result).toBeUndefined()
    })

    it('then it should return onBlur for other modes', () => {
      const onBlur = vi.fn()
      const result = getValidationEvents({
        hasRef: false,
        fieldState: { mode: 'blur' } as any,
        onBlur,
      })
      expect(result).toEqual({ onBlur })
    })

    it('then it should return onBlur when mode is undefined', () => {
      const onBlur = vi.fn()
      const result = getValidationEvents({
        hasRef: false,
        fieldState: { mode: undefined } as any,
        onBlur,
      })
      expect(result).toEqual({ onBlur })
    })
  })
})
