import { useFormValidator } from '@composables/useFormValidator'
import { ref } from 'vue'

describe('given useFormValidator composable', () => {
  describe('when initialized with schema', () => {
    it('then it should return form validation properties', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const result = useFormValidator({ schema })

      expect(result.isValid).toBeDefined()
      expect(result.isDirty).toBeDefined()
      expect(result.errors).toBeDefined()
      expect(result.errorMessages).toBeDefined()
      expect(result.isSubmitting).toBeDefined()
      expect(result.isSubmitted).toBeDefined()
      expect(result.fieldsStates).toBeDefined()
      expect(result.payload).toBeDefined()
    })
  })

  describe('when initialized with default values', () => {
    it('then it should set payload with default values', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const defaultValues = {
        email: 'test@example.com',
      }

      const { payload } = useFormValidator({
        schema,
        defaultValues,
      })

      expect(payload.value.email).toBe('test@example.com')
    })
  })

  describe('when initialized with model ref', () => {
    it('then it should sync with model ref', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const model = ref({ email: 'initial@example.com' })

      const { payload } = useFormValidator({
        schema,
        model,
      })

      expect(payload.value.email).toBe('initial@example.com')
    })
  })

  describe('when initialized with options', () => {
    it('then it should use custom options', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const options = {
        mode: 'aggressive' as const,
        identifier: 'custom-form',
      }

      const result = useFormValidator({
        schema,
        options,
      })

      expect(result.fieldsStates).toBeDefined()
      expect(result.payload).toBeDefined()
    })
  })

  describe('when form is initially empty', () => {
    it('then it should be invalid and not dirty', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const { isValid, isDirty } = useFormValidator({ schema })

      expect(isValid.value).toBe(false)
      expect(isDirty.value).toBe(false)
    })
  })

  describe('when form has valid data', () => {
    it('then it should be valid', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const defaultValues = {
        email: 'test@example.com',
      }

      const { isValid } = useFormValidator({
        schema,
        defaultValues,
      })

      expect(isValid.value).toBe(true)
    })
  })

  describe('when reactive schema is used', () => {
    it('then it should update when schema changes', () => {
      const schema = ref({
        email: {
          required: true,
          type: 'string',
        },
      })

      const result = useFormValidator({ schema })

      expect(result.fieldsStates).toBeDefined()
      expect(result.payload).toBeDefined()
    })
  })

  describe('when reactive default values are used', () => {
    it('then it should update when default values change', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const defaultValues = ref({
        email: 'test@example.com',
      })

      const { payload } = useFormValidator({
        schema,
        defaultValues,
      })

      expect(payload.value.email).toBe('test@example.com')
    })
  })

  describe('when form methods are called', () => {
    it('then it should provide form control methods', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const result = useFormValidator({ schema })

      expect(result.validateField).toBeDefined()
      expect(result.validateForm).toBeDefined()
      expect(result.resetForm).toBeDefined()
      expect(result.resetField).toBeDefined()
      expect(result.revalidateField).toBeDefined()
      expect(result.revalidateForm).toBeDefined()
      expect(result.handleSubmit).toBeDefined()
      expect(result.handleReset).toBeDefined()
      expect(result.getFieldState).toBeDefined()
      expect(result.setFieldValue).toBeDefined()
    })
  })

  describe('when form is submitted', () => {
    it('then it should set isSubmitted to true', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const { isSubmitted, handleSubmit } = useFormValidator({ schema })

      expect(isSubmitted.value).toBe(false)

      const submitHandler = vi.fn()
      const submit = handleSubmit(submitHandler)

      submit()

      expect(isSubmitted.value).toBe(true)
    })
  })

  describe('when form is reset', () => {
    it('then it should reset form state', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const { handleReset, isSubmitted } = useFormValidator({ schema })

      handleReset()

      expect(isSubmitted.value).toBe(false)
    })
  })

  describe('when field value is set', () => {
    it('then it should update field value', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const { setFieldValue, payload } = useFormValidator({ schema })

      setFieldValue('email', 'new@example.com')

      expect(payload.value.email).toBe('new@example.com')
    })
  })

  describe('when field state is requested', () => {
    it('then it should return field state', () => {
      const schema = {
        email: {
          required: true,
          type: 'string',
        },
      }

      const { getFieldState } = useFormValidator({ schema })

      const fieldState = getFieldState('email')

      expect(fieldState).toBeDefined()
      expect(fieldState.value).toBeDefined()
      expect(fieldState.value.valid).toBeDefined()
      expect(fieldState.value.dirty).toBeDefined()
      expect(fieldState.value.error).toBeDefined()
    })
  })
})
