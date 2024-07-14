import {
  addEventToInteractiveElements,
  fieldHasValidation,
  findInteractiveElements,
  getFieldState,
  getFieldsErrors,
  getFieldsStates,
  removeEventFromInteractiveElements,
  scrollToError,
} from '@modules/composables/use-form-validator/utils'
import type { BaseFormPayload, FieldsStates, FormSchema } from '@modules/composables/use-form-validator/types'

describe('given fieldHasValidation function', () => {
  const schema = {
    name: { type: 'string' },
    age: { type: 'number' },
  } as unknown as FormSchema<BaseFormPayload>

  describe('when checking for a field present in the schema', () => {
    it('then it should return true', () => {
      expect(fieldHasValidation('name', schema)).toBe(true)
    })
  })

  describe('when checking for a field not present in the schema', () => {
    it('then it should return false', () => {
      expect(fieldHasValidation('email', schema)).toBe(false)
    })
  })
})

describe('given scrollToError function', () => {
  describe('when called with a selector for an existing element', () => {
    it('then it should scroll to the element', () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      } as unknown as HTMLElement
      globalThis.document.querySelector = vi.fn().mockReturnValue(mockElement)

      scrollToError('.test-selector')

      expect(globalThis.document.querySelector).toHaveBeenCalledWith('.test-selector')
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      })
    })
  })

  describe('when called with a selector for a non-existing element', () => {
    it('then it should not scroll', () => {
      globalThis.document.querySelector = vi.fn().mockReturnValue(null)
      globalThis.window.scrollTo = vi.fn()

      scrollToError('.non-existent')

      expect(globalThis.window.scrollTo).not.toHaveBeenCalled()
    })
  })
})

describe('given getFieldState function', () => {
  describe('when called for a field with validation', () => {
    it('then it should return the correct field state', () => {
      const schema = {
        name: { type: 'string' },
      } as unknown as FormSchema<BaseFormPayload>

      const state = getFieldState({ name: 'name', schema, initialValue: 'John', mode: 'eager' })

      expect(state).toEqual({
        blurred: false,
        dirty: false,
        errors: [],
        error: false,
        valid: false,
        validating: false,
        validated: false,
        mode: 'eager',
        initialValue: 'John',
      })
    })
  })

  describe('when called for a field without validation', () => {
    it('then it should return the correct field state', () => {
      const state = getFieldState({ name: 'name', initialValue: 'John', mode: 'eager' })

      expect(state).toEqual({
        blurred: false,
        dirty: false,
        errors: [],
        error: false,
        valid: true,
        validating: false,
        validated: false,
        mode: 'none',
        initialValue: 'John',
      })
    })
  })
})

describe('given getFieldsStates function', () => {
  describe('when called with a schema', () => {
    it('then it should return the correct fields states', () => {
      const schema = {
        name: { type: 'string' },
        age: { type: 'number' },
      } as unknown as FormSchema<BaseFormPayload>

      const states = getFieldsStates(schema, {}, 'eager')

      expect(states).toEqual({
        name: {
          blurred: false,
          dirty: false,
          errors: [],
          error: false,
          valid: false,
          validating: false,
          validated: false,
          mode: 'eager',
          initialValue: undefined,
        },
        age: {
          blurred: false,
          dirty: false,
          errors: [],
          error: false,
          valid: false,
          validating: false,
          validated: false,
          mode: 'eager',
          initialValue: undefined,
        },
      })
    })
  })
})

describe('given getFieldsErrors function', () => {
  describe('when called with fields states', () => {
    it('then it should return the correct fields errors', () => {
      const fieldsStates = {
        name: {
          errors: [{ message: 'Name is required' }],
        },
        age: {
          errors: [],
        },
      } as unknown as FieldsStates<BaseFormPayload>

      const errors = getFieldsErrors(fieldsStates)

      expect(errors).toEqual({
        name: [{ message: 'Name is required' }],
        age: [],
      })
    })
  })
})

describe('given findInteractiveElements function', () => {
  describe('when called with an element', () => {
    it('then it should find all interactive elements within the given element', () => {
      const mockElement = {
        querySelectorAll: vi.fn().mockReturnValue(['input1', 'select1', 'textarea1']),
      } as unknown as HTMLElement

      const result = findInteractiveElements(mockElement)

      expect(result).toEqual(['input1', 'select1', 'textarea1'])
      expect(mockElement.querySelectorAll).toHaveBeenCalledWith('input, select, textarea')
    })
  })
})

describe('given addEventToInteractiveElements function', () => {
  describe('when called with interactive elements and event handlers', () => {
    it('then it should add correct event listeners based on the mode', () => {
      const mockElements = [
        { addEventListener: vi.fn(), getAttribute: vi.fn().mockReturnValue('text') },
        { addEventListener: vi.fn(), getAttribute: vi.fn().mockReturnValue('radio') },
      ] as unknown as HTMLElement[]
      const onBlur = vi.fn()
      const onInput = vi.fn()

      addEventToInteractiveElements({ interactiveElements: mockElements, onBlur, onInput, mode: 'eager' })

      expect(mockElements[0].addEventListener).toHaveBeenCalledWith('blur', onBlur)
      expect(mockElements[0].addEventListener).toHaveBeenCalledWith('input', onInput)
      expect(mockElements[1].addEventListener).toHaveBeenCalledWith('blur', onBlur)
      expect(mockElements[1].addEventListener).toHaveBeenCalledWith('change', onInput)
    })
  })
})

describe('given removeEventFromInteractiveElements function', () => {
  describe('when called with interactive elements and event handlers', () => {
    it('then it should remove all event listeners from interactive elements', () => {
      const mockElements = [{ removeEventListener: vi.fn() }, { removeEventListener: vi.fn() }] as unknown as HTMLElement[]
      const onBlur = vi.fn()
      const onInput = vi.fn()

      removeEventFromInteractiveElements({ interactiveElements: mockElements, onBlur, onInput })

      mockElements.forEach((element) => {
        expect(element.removeEventListener).toHaveBeenCalledWith('blur', onBlur)
        expect(element.removeEventListener).toHaveBeenCalledWith('input', onInput)
        expect(element.removeEventListener).toHaveBeenCalledWith('change', onInput)
      })
    })
  })
})
