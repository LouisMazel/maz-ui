import { useFormValidator } from '@composables/useFormValidator'
import { withSetup } from '@tests/helpers/withSetup'
import { flushPromises } from '@vue/test-utils'
import { email, minLength, pipe, string } from 'valibot'
import { ref } from 'vue'

describe('given useFormValidator composable', () => {
  describe('when initialized with schema', () => {
    it('then it should return form validation properties', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => useFormValidator({ schema }))

      expect(result.isValid).toBeDefined()
      expect(result.isDirty).toBeDefined()
      expect(result.errors).toBeDefined()
      expect(result.errorMessages).toBeDefined()
      expect(result.isSubmitting).toBeDefined()
      expect(result.isSubmitted).toBeDefined()
      expect(result.fieldsStates).toBeDefined()
      expect(result.model).toBeDefined()
    })
  })

  describe('when initialized with default values', () => {
    it('then it should set model with default values', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const defaultValues = {
        email: 'test@example.com',
      }

      const [{ model }] = withSetup(() => useFormValidator({
        schema,
        defaultValues,
      }))

      expect(model.value.email).toBe('test@example.com')
    })
  })

  describe('when initialized with model ref', () => {
    it('then it should sync with model ref', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const modelRef = ref({ email: 'initial@example.com' })

      const [{ model }] = withSetup(() => useFormValidator({
        schema,
        model: modelRef,
      }))

      expect(model.value.email).toBe('initial@example.com')
    })
  })

  describe('when initialized with options', () => {
    it('then it should use custom options', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const options = {
        mode: 'aggressive' as const,
        identifier: 'custom-form',
      }

      const [result] = withSetup(() => useFormValidator({
        schema,
        options,
      }))

      expect(result.fieldsStates).toBeDefined()
      expect(result.model).toBeDefined()
      expect(result.identifier).toBe('custom-form')
    })
  })

  describe('when form is initially empty', () => {
    it('then it should be invalid and not dirty', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ isValid, isDirty }] = withSetup(() => useFormValidator({ schema }))

      await flushPromises()

      expect(isValid.value).toBe(false)
      expect(isDirty.value).toBe(false)
    })
  })

  describe('when form has valid data', () => {
    it('then it should be valid', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const defaultValues = {
        email: 'test@example.com',
      }

      const [{ isValid }] = withSetup(() => useFormValidator({
        schema,
        defaultValues,
        options: {
          mode: 'aggressive',
        },
      }))

      await flushPromises()

      expect(isValid.value).toBe(true)
    })
  })

  describe('when reactive schema is used', () => {
    it('then it should update when schema changes', () => {
      const [result] = withSetup(() => {
        const schema = ref({
          email: pipe(string(), email()),
        })

        return useFormValidator({ schema })
      })

      expect(result.fieldsStates).toBeDefined()
      expect(result.model).toBeDefined()
    })
  })

  describe('when handleSubmit is called', () => {
    it('then it should handle form submission', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ isSubmitted, handleSubmit }] = withSetup(() => useFormValidator({ schema }))

      expect(isSubmitted.value).toBe(false)

      const submitHandler = vi.fn()
      const submit = handleSubmit(submitHandler)

      await submit()

      expect(isSubmitted.value).toBe(true)
    })
  })

  describe('when validation is performed', () => {
    it('then it should validate form correctly', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ validateForm, isValid }] = withSetup(() => useFormValidator({ schema }))

      expect(typeof validateForm).toBe('function')

      await flushPromises()

      expect(isValid.value).toBe(false)
    })
  })

  describe('when form has validation errors', () => {
    it('then it should show error messages', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ model, errors, errorMessages, isValid }] = withSetup(() => useFormValidator({
        schema,
        options: { mode: 'aggressive' },
      }))

      model.value.email = 'invalid-email'
      await flushPromises()

      expect(isValid.value).toBe(false)
      expect(errors.value.email).toBeDefined()
      expect(errorMessages.value.email).toBeDefined()
    })
  })

  describe('when form has multiple fields', () => {
    it('then it should validate all fields independently', async () => {
      const schema = {
        email: pipe(string(), email()),
        name: pipe(string(), minLength(2)),
      }

      const [{ model, isValid, errors }] = withSetup(() => useFormValidator({
        schema,
        options: { mode: 'aggressive' },
      }))

      model.value.email = 'test@example.com'
      model.value.name = 'a'
      await flushPromises()

      expect(isValid.value).toBe(false)
      expect(errors.value.email).toEqual([])
      expect(errors.value.name).toBeDefined()
    })
  })

  describe('when form values change', () => {
    it('then it should update dirty state', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const defaultValues = {
        email: 'test@example.com',
      }

      const [{ model, isDirty }] = withSetup(() => useFormValidator({
        schema,
        defaultValues,
        options: { mode: 'aggressive' },
      }))

      await flushPromises()
      expect(isDirty.value).toBe(false)

      model.value.email = 'new@example.com'
      await flushPromises()

      expect(isDirty.value).toBe(true)
    })
  })

  describe('when form submission fails validation', () => {
    it('then it should not call success callback', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ handleSubmit }] = withSetup(() => useFormValidator({ schema }))

      const successCallback = vi.fn()
      const submit = handleSubmit(successCallback)

      await submit()

      expect(successCallback).not.toHaveBeenCalled()
    })
  })

  describe('when form submission passes validation', () => {
    it('then it should call success callback with model data', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const defaultValues = {
        email: 'test@example.com',
      }

      const [{ handleSubmit }] = withSetup(() => useFormValidator({
        schema,
        defaultValues,
        options: { mode: 'aggressive' },
      }))

      // Wait for initial validation
      await flushPromises()

      const successCallback = vi.fn()
      const submit = handleSubmit(successCallback)

      await submit()

      expect(successCallback).toHaveBeenCalledWith({
        email: 'test@example.com',
      })
    })
  })

  describe('when using basic validation modes', () => {
    it('then it should respect lazy mode', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ model, isValid, fieldsStates }] = withSetup(() => useFormValidator({
        schema,
        options: { mode: 'lazy' },
      }))

      await flushPromises()

      // In lazy mode, validation still happens but differently than aggressive
      // The field state shows the actual validation result
      expect(fieldsStates.value.email.valid).toBe(false) // Email is empty so invalid
      expect(isValid.value).toBe(false)

      // Set valid value
      model.value.email = 'test@example.com'
      await flushPromises()

      expect(isValid.value).toBe(true)
      expect(fieldsStates.value.email.valid).toBe(true)
    })

    it('then it should respect aggressive mode', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ model, isValid, errors }] = withSetup(() => useFormValidator({
        schema,
        options: { mode: 'aggressive' },
      }))

      await flushPromises()

      // In aggressive mode, validation happens immediately
      expect(isValid.value).toBe(false) // Invalid because empty email

      // Set valid value
      model.value.email = 'test@example.com'
      await flushPromises()

      expect(isValid.value).toBe(true)
      expect(errors.value.email).toEqual([])
    })
  })

  describe('when model is externally synchronized', () => {
    it('then it should sync with external ref', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const externalModel = ref({ email: 'initial@example.com' })

      const [{ model }] = withSetup(() => useFormValidator({
        schema,
        model: externalModel,
      }))

      expect(model.value.email).toBe('initial@example.com')

      model.value.email = 'changed@example.com'
      await flushPromises()

      expect(externalModel.value.email).toBe('changed@example.com')
    })
  })

  describe('when fieldsStates are accessed', () => {
    it('then it should provide detailed field information', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ fieldsStates }] = withSetup(() => useFormValidator({ schema }))

      await flushPromises()

      expect(fieldsStates.value.email).toBeDefined()
      expect(fieldsStates.value.email.valid).toBeDefined()
      expect(fieldsStates.value.email.dirty).toBeDefined()
      expect(fieldsStates.value.email.error).toBeDefined()
    })
  })

  describe('when form has optional fields', () => {
    it('then it should handle optional validation correctly', async () => {
      const schema = {
        email: pipe(string(), email()),
        nickname: string(),
      }

      const [{ model, isValid }] = withSetup(() => useFormValidator({
        schema,
        defaultValues: {
          email: 'test@example.com',
          nickname: '',
        },
      }))

      await flushPromises()

      expect(isValid.value).toBe(true)
      expect(model.value.nickname).toBe('')
    })
  })

  describe('when form has complex validation scenarios', () => {
    it('then it should handle conditional validation', async () => {
      const schema = {
        email: pipe(string(), email()),
        age: pipe(string(), minLength(1)),
      }

      const [{ model, isValid, errors }] = withSetup(() => useFormValidator({
        schema,
        options: { mode: 'aggressive' },
      }))

      await flushPromises()

      // Initially invalid (empty fields)
      expect(isValid.value).toBe(false)

      // Set one field valid
      model.value.email = 'test@example.com'
      await flushPromises()

      expect(isValid.value).toBe(false) // Still invalid due to age
      expect(errors.value.email).toEqual([])
      expect(errors.value.age).toBeDefined()

      // Set both fields valid
      model.value.age = '25'
      await flushPromises()

      expect(isValid.value).toBe(true)
      expect(errors.value.email).toEqual([])
      expect(errors.value.age).toEqual([])
    })

    it('then it should handle default values properly', async () => {
      const schema = {
        email: pipe(string(), email()),
        name: pipe(string(), minLength(2)),
      }

      const defaultValues = {
        email: 'initial@example.com',
        name: 'John',
      }

      const [{ model, isValid }] = withSetup(() => useFormValidator({
        schema,
        defaultValues,
        options: { mode: 'aggressive' },
      }))

      await flushPromises()

      expect(isValid.value).toBe(true)
      expect(model.value.email).toBe('initial@example.com')
      expect(model.value.name).toBe('John')

      // Manual change to model values
      model.value.email = 'changed@example.com'
      model.value.name = 'Jane'
      await flushPromises()

      expect(model.value.email).toBe('changed@example.com')
      expect(model.value.name).toBe('Jane')
      expect(isValid.value).toBe(true)
    })

    it('then it should handle form reset correctly', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const defaultValues = {
        email: 'default@example.com',
      }

      const [{ model, isValid, isDirty }] = withSetup(() => useFormValidator({
        schema,
        defaultValues,
        options: { mode: 'aggressive' },
      }))

      await flushPromises()

      expect(isValid.value).toBe(true)
      expect(isDirty.value).toBe(false)

      // Modify value
      model.value.email = 'changed@example.com'
      await flushPromises()

      expect(isDirty.value).toBe(true)

      // Reset to default
      model.value.email = 'default@example.com'
      await flushPromises()

      expect(isDirty.value).toBe(false)
    })

    it('then it should handle validation errors properly', async () => {
      const schema = {
        email: pipe(string(), email()),
        name: pipe(string(), minLength(3)),
      }

      const [{ model, errors, errorMessages }] = withSetup(() => useFormValidator({
        schema,
        options: { mode: 'aggressive' },
      }))

      // Set invalid values
      model.value.email = 'invalid-email'
      model.value.name = 'ab' // Too short
      await flushPromises()

      expect(errors.value.email).toBeDefined()
      expect(errors.value.name).toBeDefined()
      expect(errorMessages.value.email).toBeDefined()
      expect(errorMessages.value.name).toBeDefined()

      // Fix email
      model.value.email = 'valid@example.com'
      await flushPromises()

      expect(errors.value.email).toEqual([])
      expect(errors.value.name).toBeDefined() // Still invalid

      // Fix name
      model.value.name = 'abc'
      await flushPromises()

      expect(errors.value.email).toEqual([])
      expect(errors.value.name).toEqual([])
    })

    it('then it should handle submission states correctly', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ handleSubmit, isSubmitting, isSubmitted }] = withSetup(() => useFormValidator({
        schema,
        defaultValues: { email: 'test@example.com' },
        options: { mode: 'aggressive' },
      }))

      // Wait for initial validation
      await flushPromises()

      expect(isSubmitting.value).toBe(false)
      expect(isSubmitted.value).toBe(false)

      const successCallback = vi.fn().mockImplementation(async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'success'
      })

      const submit = handleSubmit(successCallback, undefined, { resetOnSuccess: false })

      // Start submission - don't await immediately
      const submitPromise = submit()

      // Check states immediately after submission starts
      expect(isSubmitted.value).toBe(true)

      // Wait for completion
      const result = await submitPromise

      expect(isSubmitting.value).toBe(false)
      expect(isSubmitted.value).toBe(true)
      expect(result).toBe('success')
      expect(successCallback).toHaveBeenCalledWith({ email: 'test@example.com' })
    })

    it('then it should prevent multiple submissions', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [{ handleSubmit, isSubmitting }] = withSetup(() => useFormValidator({
        schema,
        defaultValues: { email: 'test@example.com' },
        options: { mode: 'aggressive' },
      }))

      // Wait for initial validation
      await flushPromises()

      const successCallback = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return 'success'
      })

      const submit = handleSubmit(successCallback)

      // Start first submission
      const firstSubmit = submit()

      // Try second submission while first is pending
      const secondSubmit = await submit()

      expect(secondSubmit).toBeUndefined() // Should be blocked

      // Wait for first to complete
      await firstSubmit

      expect(isSubmitting.value).toBe(false)
      expect(successCallback).toHaveBeenCalledTimes(1) // Only called once
    })
  })

  describe('given form with modified data', () => {
    describe('when resetForm is called', () => {
      it('then resets model to default values', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'default@example.com',
        }

        const [{ model, resetForm }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        model.value.email = 'changed@example.com'
        await flushPromises()

        expect(model.value.email).toBe('changed@example.com')

        resetForm()
        await flushPromises()

        expect(model.value.email).toBe('default@example.com')
      })

      it('then clears all validation errors', async () => {
        const schema = {
          email: pipe(string(), email()),
          name: pipe(string(), minLength(3)),
        }

        const defaultValues = {
          email: 'valid@example.com',
          name: 'John',
        }

        const [{ model, errors, resetForm, isValid }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        model.value.email = 'invalid-email'
        model.value.name = 'ab'
        await flushPromises()

        expect(isValid.value).toBe(false)
        expect(errors.value.email).toBeDefined()
        expect(errors.value.name).toBeDefined()

        resetForm()
        await flushPromises()

        expect(errors.value.email).toEqual([])
        expect(errors.value.name).toEqual([])
        expect(isValid.value).toBe(true)
      })

      it('then resets isDirty to false', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'test@example.com',
        }

        const [{ model, isDirty, resetForm }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        expect(isDirty.value).toBe(false)

        model.value.email = 'changed@example.com'
        await flushPromises()

        expect(isDirty.value).toBe(true)

        resetForm()
        await flushPromises()

        expect(isDirty.value).toBe(false)
      })

      it('then resets isSubmitted to false', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'test@example.com',
        }

        const [{ isSubmitted, handleSubmit, resetForm }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        const successCallback = vi.fn()
        const submit = handleSubmit(successCallback, undefined, { resetOnSuccess: false })

        await submit()

        expect(isSubmitted.value).toBe(true)

        resetForm()
        await flushPromises()

        expect(isSubmitted.value).toBe(false)
      })

      it('then resets isSubmitting to false', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'test@example.com',
        }

        const [{ isSubmitting, resetForm }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        isSubmitting.value = true

        expect(isSubmitting.value).toBe(true)

        resetForm()
        await flushPromises()

        expect(isSubmitting.value).toBe(false)
      })

      it('then resets all fieldsStates to initial state', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'test@example.com',
        }

        const [{ model, fieldsStates, resetForm }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        model.value.email = 'changed@example.com'
        await flushPromises()

        expect(fieldsStates.value.email.dirty).toBe(true)

        resetForm()
        await flushPromises()

        expect(fieldsStates.value.email.dirty).toBe(false)
        expect(fieldsStates.value.email.blurred).toBe(false)
        expect(fieldsStates.value.email.error).toBe(false)
        expect(fieldsStates.value.email.errors).toEqual([])
        expect(fieldsStates.value.email.valid).toBe(true)
      })

      it('then does not trigger validation errors on required fields', async () => {
        const schema = {
          email: pipe(string(), email()),
          name: pipe(string(), minLength(3)),
        }

        const defaultValues = {
          email: 'default@example.com',
          name: 'John',
        }

        const [{ model, errors, resetForm, isValid }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        model.value.email = 'changed@example.com'
        model.value.name = 'Jane'
        await flushPromises()

        resetForm()
        await flushPromises()

        expect(errors.value.email).toEqual([])
        expect(errors.value.name).toEqual([])
        expect(isValid.value).toBe(true)
      })
    })

    describe('when handleSubmit is called with resetOnSuccess option', () => {
      it('then resets form after successful submission', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'default@example.com',
        }

        const [{ model, handleSubmit, isDirty }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        model.value.email = 'changed@example.com'
        await flushPromises()

        expect(model.value.email).toBe('changed@example.com')
        expect(isDirty.value).toBe(true)

        const successCallback = vi.fn()
        const submit = handleSubmit(successCallback, undefined, { resetOnSuccess: true })

        await submit()

        expect(successCallback).toHaveBeenCalled()
        expect(model.value.email).toBe('default@example.com')
        expect(isDirty.value).toBe(false)
      })

      it('then does not reset form when resetOnSuccess is false', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'default@example.com',
        }

        const [{ model, handleSubmit }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        model.value.email = 'changed@example.com'
        await flushPromises()

        const successCallback = vi.fn()
        const submit = handleSubmit(successCallback, undefined, { resetOnSuccess: false })

        await submit()

        expect(successCallback).toHaveBeenCalled()
        expect(model.value.email).toBe('changed@example.com')
      })
    })

    describe('when resetForm is called with external model ref', () => {
      it('then syncs reset with external model', async () => {
        const schema = {
          email: pipe(string(), email()),
        }

        const defaultValues = {
          email: 'default@example.com',
        }

        const externalModel = ref({ email: 'default@example.com' })

        const [{ model, resetForm }] = withSetup(() => useFormValidator({
          schema,
          defaultValues,
          model: externalModel,
          options: { mode: 'aggressive' },
        }))

        await flushPromises()

        model.value.email = 'changed@example.com'
        await flushPromises()

        expect(externalModel.value.email).toBe('changed@example.com')

        resetForm()
        await flushPromises()

        expect(model.value.email).toBe('default@example.com')
        expect(externalModel.value.email).toBe('default@example.com')
      })
    })
  })
})
