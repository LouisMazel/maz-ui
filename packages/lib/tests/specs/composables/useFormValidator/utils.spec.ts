import type { FieldsStates, FieldState, FormSchema, StrictOptions, Validation, ValidationIssues } from '@modules/composables/useFormValidator/types'
import {
  addEventToInteractiveElements,
  canExecuteValidation,
  fieldHasValidation,
  findInteractiveElements,
  getErrorMessages,
  getFieldsErrors,
  getFieldsStates,
  getFieldState,
  getFieldValidationResult,
  getValidateFunction,
  getValidationEvents,
  handleFieldBlur,
  handleFieldInput,
  hasModeIncludes,
  isEmptyValue,
  removeEventFromInteractiveElements,
  scrollToError,
  setFieldValidationState,
  updateFieldsStates,
  updateFieldState,
  validateField,
} from '@modules/composables/useFormValidator/utils'
import { minLength, pipe, string } from 'valibot'

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
        mode: undefined,
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
        options: { mode: 'lazy' } as StrictOptions,
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

      addEventToInteractiveElements({ interactiveElements: mockElements, onBlur, mode: 'eager' })

      expect(mockElements[0].addEventListener).toHaveBeenCalledWith('blur', onBlur)
      expect(mockElements[1].addEventListener).toHaveBeenCalledWith('blur', onBlur)
    })
  })
})

describe('given removeEventFromInteractiveElements function', () => {
  describe('when called with interactive elements and event handlers', () => {
    it('then it removes all event listeners from interactive elements', () => {
      const mockElements = [{ removeEventListener: vi.fn() }, { removeEventListener: vi.fn() }] as unknown as HTMLElement[]
      const onBlur = vi.fn()

      removeEventFromInteractiveElements({ interactiveElements: mockElements, onBlur })

      mockElements.forEach((element) => {
        expect(element.removeEventListener).toHaveBeenCalledWith('blur', onBlur)
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

describe('given updateFieldsStates function', () => {
  const schema = {
    name: undefined,
    age: undefined,
  } as unknown as FormSchema<{ name: string, age: number }>

  const fieldsStates = {
    age: {
      blurred: true,
      dirty: true,
      errors: [],
      error: false,
      valid: true,
      validating: false,
      validated: false,
      initialValue: 20,
      validateFunction: vi.fn(),
      mode: 'eager',
    },
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
  } as FieldsStates<{ name: string, age: number }>
  const freezeStates = { ...fieldsStates }

  it('merges existing field state with new field state', () => {
    updateFieldsStates({
      fieldsStates,
      payload: { name: 'Jane', age: 30 },
      schema,
      // @ts-expect-error - testing options
      options: { mode: 'lazy' },
      updateMode: false,
    })

    expect(fieldsStates).toEqual({
      name: {
        ...freezeStates.name,
        initialValue: 'Jane',
      },
      age: {
        ...freezeStates.age,
        initialValue: 30,
      },
    })
  })
})

describe('given updateFieldState function', () => {
  const schema = {
    name: undefined,
  } as unknown as FormSchema<{ name: string }>

  const fieldState = {
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
  } as unknown as FieldState<{ name: string }>

  it('merges existing field state with new field state', () => {
    const result = updateFieldState({
      name: 'name',
      fieldState,
      schema,
      // @ts-expect-error - testing default value
      options: { defaultValue: 'Jane' },
    })

    expect(result).toEqual({
      ...fieldState,
      mode: 'eager',
      initialValue: 'Jane',
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

  const fieldState = {
    validateFunction: vi.fn(),
  } as unknown as FieldState<{ name: string }>

  it('calls validateFunction with correct parameters', () => {
    const payload = { name: 'John' }
    validateField({ name: 'name', fieldState, payload, schema })
    expect(fieldState.validateFunction).toHaveBeenCalledWith({
      name: 'name',
      fieldState,
      payload,
      schema,
      setError: true,
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

  const fieldState = {
    dirty: false,
    blurred: false,
    mode: 'eager',
    valid: false,
    initialValue: '',
  } as unknown as FieldState<{ name: string }>

  it('updates field state and validates on blur', () => {
    const payload = { name: 'John' }
    handleFieldBlur({ name: 'name', payload, fieldState, schema, isSubmitted: false })
    expect(fieldState.dirty).toBe(true)
    expect(fieldState.blurred).toBe(true)
  })
})

describe('given handleFieldInput function', () => {
  const schema = {
    name: { type: 'string', minLength: 3 },
  } as unknown as FormSchema<{ name: string }>

  const fieldState = {
    dirty: false,
    blurred: false,
    mode: 'eager',
    valid: true,
    initialValue: '',
    validateFunction: vi.fn(),
  } as unknown as FieldState<{ name: string }>

  it('updates field state and validates on input', () => {
    const payload = { name: 'John' }
    handleFieldInput({ name: 'name', payload, fieldState, schema, isSubmitted: true })
    expect(fieldState.dirty).toBe(true)
    expect(fieldState.validateFunction).toHaveBeenCalledTimes(1)
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
  const onBlur = vi.fn()

  it('returns undefined when ref is provided', () => {
    const result = getValidationEvents({
      ref: 'test',
      fieldState: { mode: 'eager' } as FieldState<{ name: string }>,
      onBlur,
    })
    expect(result).toBeUndefined()
  })

  it('returns undefined for aggressive or lazy mode', () => {
    const result = getValidationEvents({
      fieldState: { mode: 'aggressive' } as FieldState<{ name: string }>,
      onBlur,
    })
    expect(result).toBeUndefined()

    const result2 = getValidationEvents({
      fieldState: { mode: 'lazy' } as FieldState<{ name: string }>,
      onBlur,
    })
    expect(result2).toBeUndefined()
  })

  it('returns all events for other modes', () => {
    const result = getValidationEvents({
      fieldState: { mode: 'blur' } as FieldState<{ name: string }>,
      onBlur,
    })
    expect(result).toEqual({ onBlur })

    const result3 = getValidationEvents({
      fieldState: { mode: 'eager' } as FieldState<{ name: string }>,
      onBlur,
    })
    expect(result3).toEqual({ onBlur })
  })
})

describe('given hasModeIncludes function', () => {
  it('returns error messages for fields with errors', () => {
    const result = hasModeIncludes(['blur'], 'blur')
    expect(result).toBe(true)

    const result2 = hasModeIncludes(['blur'], 'eager')
    expect(result2).toBe(false)
  })
})
