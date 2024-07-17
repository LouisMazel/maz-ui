import {
  addEventToInteractiveElements,
  canExecuteValidation,
  fieldHasValidation,
  findInteractiveElements,
  getErrorMessages,
  getFieldState,
  getFieldValidationResult,
  getFieldsErrors,
  getFieldsStates,
  getValidateFunction,
  getValidationEvents,
  handleFieldBlur,
  handleFieldInput,
  isEmptyValue,
  removeEventFromInteractiveElements,
  scrollToError,
  setFieldValidationState,
  updateFieldState,
  validateField,
} from '@modules/composables/use-form-validator/utils'
import type { FieldState, FieldsStates, FormSchema, Validation, ValidationIssues } from '@modules/composables/use-form-validator/types'

import { minLength, pipe, string } from 'valibot'
import type { ComponentPublicInstance } from 'vue'

describe('given fieldHasValidation function', () => {
  const schema = {
    name: { type: 'string' },
    age: { type: 'number' },
  } as unknown as Record<string, Validation>

  describe('when checking for a field present in the schema', () => {
    it('then it returns true', () => {
      expect(fieldHasValidation('name', schema)).toBe(true)
    })
  })

  describe('when checking for a field not present in the schema', () => {
    it('then it returns false', () => {
      expect(fieldHasValidation('email', schema)).toBe(false)
    })
  })
})

describe('given scrollToError function', () => {
  describe('when called with a selector for an existing element', () => {
    it('then it scrolls to the element', () => {
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
    it('then it not scrolls', () => {
      globalThis.document.querySelector = vi.fn().mockReturnValue(null)
      globalThis.window.scrollTo = vi.fn()

      scrollToError('.non-existent')

      expect(globalThis.window.scrollTo).not.toHaveBeenCalled()
    })
  })
})

describe('given getFieldState function', () => {
  describe('when called for a field with validation', () => {
    it('then it returns the correct field state', () => {
      const schema = {
        name: pipe(string(), minLength(3)),
      }

      const state = getFieldState({ name: 'name', schema, initialValue: 'John', fieldState: {} as FieldState<{ name: string }> })

      expect(state).toEqual({
        blurred: false,
        dirty: false,
        errors: [],
        error: false,
        valid: false,
        validating: false,
        validated: false,
        validateFunction: expect.any(Function),
        mode: 'lazy',
        initialValue: 'John',
      })
    })
  })

  describe('when called for a field without validation', () => {
    it('then it returns the correct field state', () => {
      const state = getFieldState({ name: 'name', initialValue: 'John', fieldState: {} as FieldState<{ name: string }> })

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
    it('then it returns the correct fields states', () => {
      const schema = {
        name: { type: 'string' },
        age: { type: 'number' },
      } as unknown as Record<string, Validation>

      const states = getFieldsStates({
        schema,
        payload: {},
      })

      expect(states).toEqual({
        name: {
          blurred: false,
          dirty: false,
          errors: [],
          error: false,
          valid: false,
          validating: false,
          validated: false,
          validateFunction: expect.any(Function),
          mode: 'lazy',
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
          validateFunction: expect.any(Function),
          mode: 'lazy',
          initialValue: undefined,
        },
      })
    })
  })
})

describe('given getFieldsErrors function', () => {
  describe('when called with fields states', () => {
    it('then it returns the correct fields errors', () => {
      const fieldsStates = {
        name: {
          errors: [{ message: 'Name is required' }],
        },
        age: {
          errors: [],
        },
      } as unknown as FieldsStates

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
    it('then it find all interactive elements within the given element', () => {
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
    it('then it add correct event listeners based on the mode', () => {
      const mockElements = [
        { addEventListener: vi.fn(), getAttribute: vi.fn().mockReturnValue('text') },
        { addEventListener: vi.fn(), getAttribute: vi.fn().mockReturnValue('radio') },
      ] as unknown as HTMLElement[]
      const onBlur = vi.fn()
      const onInput = vi.fn()

      addEventToInteractiveElements({ interactiveElements: mockElements, events: {
        onBlur,
        onInput,
      }, mode: 'eager' })

      expect(mockElements[0].addEventListener).toHaveBeenCalledWith('blur', onBlur)
      expect(mockElements[0].addEventListener).toHaveBeenCalledWith('input', onInput)
      expect(mockElements[1].addEventListener).toHaveBeenCalledWith('blur', onBlur)
      expect(mockElements[1].addEventListener).toHaveBeenCalledWith('change', onInput)
    })
  })
})

describe('given removeEventFromInteractiveElements function', () => {
  describe('when called with interactive elements and event handlers', () => {
    it('then it removes all event listeners from interactive elements', () => {
      const mockElements = [{ removeEventListener: vi.fn() }, { removeEventListener: vi.fn() }] as unknown as HTMLElement[]
      const onBlur = vi.fn()
      const onInput = vi.fn()

      removeEventFromInteractiveElements({ interactiveElements: mockElements, events: {
        onBlur,
        onInput,
      } })

      mockElements.forEach((element) => {
        expect(element.removeEventListener).toHaveBeenCalledWith('blur', onBlur)
        expect(element.removeEventListener).toHaveBeenCalledWith('input', onInput)
        expect(element.removeEventListener).toHaveBeenCalledWith('change', onInput)
      })
    })
  })
})

describe('given isEmptyValue function', () => {
  it('returns true for undefined', () => {
    // @ts-expect-error - testing undefined value
    expect(isEmptyValue()).toBe(true)
  })

  it('returns true for null', () => {
    expect(isEmptyValue(null)).toBe(true)
  })

  it('returns true for empty string', () => {
    expect(isEmptyValue('')).toBe(true)
  })

  it('returns false for non-empty values', () => {
    expect(isEmptyValue('test')).toBe(false)
    expect(isEmptyValue(0)).toBe(false)
    expect(isEmptyValue(false)).toBe(false)
    expect(isEmptyValue([])).toBe(false)
    expect(isEmptyValue({})).toBe(false)
  })
})

describe('given getValidateFunction', () => {
  it('returns undefined when hasValidation is false', () => {
    expect(getValidateFunction({ name: 'test', hasValidation: false })).toBeUndefined()
  })

  it('throws error when field is both debounced and throttled', () => {
    expect(() =>
      getValidateFunction({
        name: 'test',
        hasValidation: true,
        debouncedFields: { test: 300 },
        throttledFields: { test: 300 },
      }),
    ).toThrow('The field "test" cannot be both debounced and throttled')
  })

  it('returns debounced function when debouncedFields is set', () => {
    const result = getValidateFunction({
      name: 'test',
      hasValidation: true,
      debouncedFields: { test: 300 },
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('function')
  })

  it('returns throttled function when throttledFields is set', () => {
    const result = getValidateFunction({
      name: 'test',
      hasValidation: true,
      throttledFields: { test: 300 },
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('function')
  })

  it('returns setFieldValidationState when no debounce or throttle is set', () => {
    const result = getValidateFunction({
      name: 'test',
      hasValidation: true,
    })
    expect(result).toBe(setFieldValidationState)
  })
})

describe('given mergeFieldState function', () => {
  const schema = {
    name: { type: 'string' },
  } as unknown as FormSchema<{ name: string }>

  const fieldsStates = {
    name: {
      blurred: false,
      dirty: false,
      errors: [],
      error: false,
      valid: true,
      validating: false,
      validated: false,
      initialValue: 'John',
      validateFunction: vi.fn(),
      mode: 'eager',
    },
  } as unknown as FieldsStates<{ name: string }>

  it('merges existing field state with new field state', () => {
    const result = updateFieldState({
      name: 'name',
      fieldsStates,
      payload: { name: 'Jane' },
      schema,
      // @ts-expect-error - testing default value
      options: { defaultValue: 'Jane' },
    })

    expect(result).toEqual({
      ...fieldsStates.name,
      mode: 'eager',
      initialValue: 'Jane',
      errors: [],
      validateFunction: expect.any(Function),
    })
  })
})

describe('given getFieldValidationResult function', () => {
  const schema = {
    name: pipe(string(), minLength(3)),
  } as unknown as FormSchema<{ name: string }>

  it('returns valid result for valid input', async () => {
    const result = await getFieldValidationResult('name', schema, 'John')
    expect(result.isValid).toBe(true)
    expect(result.result.success).toBe(true)
  })

  it('returns invalid result for invalid input', async () => {
    const result = await getFieldValidationResult('name', schema, 'Jo')
    expect(result.isValid).toBe(false)
    expect(result.result.success).toBe(false)
  })
})

describe('given validateField function', () => {
  const schema = {
    name: { type: 'string', minLength: 3 },
  } as unknown as FormSchema<{ name: string }>

  const fieldsStates = {
    name: {
      validateFunction: vi.fn(),
    },
  } as unknown as FieldsStates<{ name: string }>

  it('calls validateFunction with correct parameters', () => {
    const payload = { name: 'John' }
    validateField({ name: 'name', fieldsStates, payload, schema })
    expect(fieldsStates.name.validateFunction).toHaveBeenCalledWith({
      name: 'name',
      fieldsStates,
      payload,
      schema,
    })
  })
})

describe('given canExecuteValidation function', () => {
  const fieldState = { dirty: false, blurred: false, mode: 'eager', valid: false } as FieldState<{ name: string }>

  it('returns true when form is submitted', () => {
    expect(canExecuteValidation({ eventName: 'input', fieldState, isSubmitted: true })).toBe(true)
  })

  it('returns false when field is already valid', () => {
    const validFieldState = { ...fieldState, valid: true }
    expect(canExecuteValidation({ eventName: 'input', fieldState: validFieldState, isSubmitted: false })).toBe(false)
  })

  it('returns true for eager mode when blurred', () => {
    const blurredFieldState = { ...fieldState, blurred: true }
    expect(canExecuteValidation({ eventName: 'input', fieldState: blurredFieldState, isSubmitted: false })).toBe(true)
  })
})

describe('given handleFieldBlur function', () => {
  const schema = {
    name: { type: 'string', minLength: 3 },
  } as unknown as FormSchema<{ name: string }>

  const fieldsStates = {
    name: { dirty: false, blurred: false, mode: 'eager', valid: false, initialValue: '' },
  } as unknown as FieldsStates<{ name: string }>

  it('updates field state and validates on blur', () => {
    const payload = { name: 'John' }
    handleFieldBlur({ name: 'name', payload, fieldsStates, schema, isSubmitted: false })
    expect(fieldsStates.name.dirty).toBe(true)
    expect(fieldsStates.name.blurred).toBe(true)
  })
})

describe('given handleFieldInput function', () => {
  const schema = {
    name: { type: 'string', minLength: 3 },
  } as unknown as FormSchema<{ name: string }>

  const fieldsStates = {
    name: { dirty: false, blurred: false, mode: 'eager', valid: true, initialValue: '' },
  } as unknown as FieldsStates<{ name: string }>

  it('updates field state and validates on input', () => {
    const payload = { name: 'John' }
    handleFieldInput({ name: 'name', payload, fieldsStates, schema, isSubmitted: false })
    expect(fieldsStates.name.dirty).toBe(true)
    expect(fieldsStates.name.valid).toBe(false)
  })
})

describe('given getErrorMessages function', () => {
  const fieldsStates = {
    name: { error: true },
    age: { error: false },
  } as unknown as FieldsStates<{ name: string, age: number }>

  const errors = {
    name: [{ message: 'Name is required' }],
    age: [{ message: 'Age must be a number' }],
  } as unknown as Record<string, ValidationIssues>

  it('returns error messages for fields with errors', () => {
    const result = getErrorMessages(errors, fieldsStates)
    expect(result).toEqual({
      name: 'Name is required',
      age: undefined,
    })
  })
})

describe('given getValidationEvents function', () => {
  const mockEvents = {
    onBlur: vi.fn(),
    onInput: vi.fn(),
  }

  it('returns undefined when componentRef is provided', () => {
    const result = getValidationEvents({
      componentRef: {} as ComponentPublicInstance,
      fieldState: { mode: 'eager' } as FieldState<{ name: string }>,
      events: mockEvents,
    })
    expect(result).toBeUndefined()
  })

  it('returns undefined for aggressive or lazy mode', () => {
    const result = getValidationEvents({
      componentRef: undefined,
      fieldState: { mode: 'aggressive' } as FieldState<{ name: string }>,
      events: mockEvents,
    })
    expect(result).toBeUndefined()

    const result2 = getValidationEvents({
      componentRef: undefined,
      fieldState: { mode: 'lazy' } as FieldState<{ name: string }>,
      events: mockEvents,
    })
    expect(result2).toBeUndefined()
  })

  it('returns all events for other modes', () => {
    const result = getValidationEvents({
      componentRef: undefined,
      fieldState: { mode: 'blur' } as unknown as FieldState<{ name: string }>,
      events: mockEvents,
    })
    expect(result).toEqual({ 'onBlur': mockEvents.onBlur, 'onUpdate:modelValue': mockEvents.onInput })

    const result2 = getValidationEvents({
      componentRef: undefined,
      fieldState: { mode: 'input' } as FieldState<{ name: string }>,
      events: mockEvents,
    })
    expect(result2).toEqual({ 'onBlur': mockEvents.onBlur, 'onUpdate:modelValue': mockEvents.onInput })

    const result3 = getValidationEvents({
      componentRef: undefined,
      fieldState: { mode: 'eager' } as FieldState<{ name: string }>,
      events: mockEvents,
    })
    expect(result3).toEqual({ 'onBlur': mockEvents.onBlur, 'onUpdate:modelValue': mockEvents.onInput })
  })
})
