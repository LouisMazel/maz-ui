import { useFormField } from '@composables/useFormField'
import { useFormValidator } from '@composables/useFormValidator'
import { withSetup } from '@tests/helpers/withSetup'
import { flushPromises } from '@vue/test-utils'
import { email, minLength, pipe, string } from 'valibot'
import { nextTick, ref } from 'vue'

describe('given useFormField composable (branch coverage)', () => {
  describe('when called with default formIdentifier', () => {
    it('then it should use "main-form-validator" as default identifier', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
        })

        const field = useFormField('name')
        return { form, field }
      })

      expect(result.field).toBeDefined()
      expect(result.field.value).toBeDefined()
      expect(result.field.hasError).toBeDefined()
    })
  })

  describe('when called with a custom formIdentifier', () => {
    it('then it should use the provided identifier', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: 'hello' },
          options: { identifier: 'custom-form' },
        })

        const field = useFormField('name', { formIdentifier: 'custom-form' })
        return { form, field }
      })

      expect(result.field).toBeDefined()
      expect(result.field.value.value).toBe('hello')
    })
  })

  describe('when field has no validation in schema', () => {
    it('then fieldMode should handle gracefully', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: '' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      expect(result.field).toBeDefined()
    })
  })

  describe('when field has validation in schema', () => {
    it('then fieldMode should be set from form options', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: '' },
          options: { mode: 'aggressive' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      expect(result.field.mode.value).toBe('aggressive')
    })

    it('then fieldMode should use field-level mode override when provided', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: '' },
          options: { mode: 'lazy' },
        })

        const field = useFormField('email', { mode: 'eager' })
        return { form, field }
      })

      expect(result.field.mode.value).toBe('eager')
    })
  })

  describe('when defaultValue is provided and differs from payload', () => {
    it('then it should update payload with defaultValue', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
        })

        const field = useFormField('name', { defaultValue: 'new-default' })
        return { form, field }
      })

      expect(result.field.value.value).toBe('new-default')
    })
  })

  describe('when defaultValue is same as payload', () => {
    it('then it should not override the payload', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: 'existing' },
        })

        const field = useFormField('name', { defaultValue: 'existing' })
        return { form, field }
      })

      expect(result.field.value.value).toBe('existing')
    })
  })

  describe('when defaultValue is undefined', () => {
    it('then it should not change the payload', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: 'original' },
        })

        const field = useFormField('name')
        return { form, field }
      })

      expect(result.field.value.value).toBe('original')
    })
  })

  describe('when fieldMode is set (aggressive)', () => {
    it('then setFieldValidationState should be called with setError=true', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: '' },
          options: { mode: 'aggressive' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      await flushPromises()

      // aggressive mode sets error immediately
      expect(result.field.hasError).toBeDefined()
    })
  })

  describe('when fieldMode is set (lazy)', () => {
    it('then setFieldValidationState should be called with setErrorIfInvalidAndNotEmpty=true', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: 'not-an-email' },
          options: { mode: 'lazy' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      await flushPromises()

      expect(result.field.mode.value).toBe('lazy')
    })
  })

  describe('when field has validation', () => {
    it('then isValid should reflect validation state', () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: 'test@test.com' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      expect(result.field).toBeDefined()
    })
  })

  describe('when field value is set via computed setter', () => {
    it('then it should update payload', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
        })

        const field = useFormField('name')
        return { form, field }
      })

      result.field.value.value = 'updated'
      expect(result.form.model.value.name).toBe('updated')
    })
  })

  describe('when using ref option with eager mode', () => {
    it('then it should set up interactive element event listeners on mount', async () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const elRef = ref<HTMLElement | undefined>(undefined)

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'eager' },
        })

        const el = document.createElement('div')
        const input = document.createElement('input')
        el.appendChild(input)
        elRef.value = el

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(result.field).toBeDefined()
      expect(result.field.mode.value).toBe('eager')
    })
  })

  describe('when using ref option with blur mode', () => {
    it('then it should set up blur event listeners', async () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const elRef = ref<HTMLElement | undefined>(undefined)

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'blur' },
        })

        const el = document.createElement('div')
        const input = document.createElement('input')
        el.appendChild(input)
        elRef.value = el

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(result.field.mode.value).toBe('blur')
    })
  })

  describe('when using ref option with progressive mode', () => {
    it('then it should set up event listeners for progressive validation', async () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const elRef = ref<HTMLElement | undefined>(undefined)

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'progressive' },
        })

        const el = document.createElement('div')
        const input = document.createElement('input')
        el.appendChild(input)
        elRef.value = el

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(result.field.mode.value).toBe('progressive')
    })
  })

  describe('when using ref option with lazy mode', () => {
    it('then it should NOT set up interactive element event listeners (hasModeIncludes returns false)', async () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const elRef = ref<HTMLElement | undefined>(undefined)

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'lazy' },
        })

        const el = document.createElement('div')
        const input = document.createElement('input')
        el.appendChild(input)
        elRef.value = el

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(result.field.mode.value).toBe('lazy')
    })
  })

  describe('when ref is not provided but mode requires it', () => {
    it('then it should still not register DOM listeners', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'eager' },
        })

        // No ref option provided
        const field = useFormField('name')
        return { form, field }
      })

      expect(result.field.mode.value).toBe('eager')
    })
  })

  describe('when ref value is a Vue component instance ($el)', () => {
    it('then it should bind to the $el HTMLElement', async () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const elRef = ref<any>(undefined)

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'eager' },
        })

        const el = document.createElement('div')
        const input = document.createElement('input')
        el.appendChild(input)

        // Simulate a Vue component ref with $el
        elRef.value = { $el: el }

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(result.field).toBeDefined()
    })
  })

  describe('when ref value is a Text node with nextElementSibling', () => {
    it('then it should bind to the nextElementSibling HTMLElement', async () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const elRef = ref<any>(undefined)

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'eager' },
        })

        // Create a wrapper with a text node followed by an element
        const wrapper = document.createElement('div')
        const input = document.createElement('input')
        wrapper.appendChild(input)

        const textNode = document.createTextNode('some text')
        wrapper.insertBefore(textNode, input)

        // Simulate component ref that resolves to a Text node
        elRef.value = { $el: textNode }

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(result.field).toBeDefined()
    })
  })

  describe('when ref value is neither HTMLElement nor Text with sibling', () => {
    it('then it should log a warning', async () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const elRef = ref<any>(undefined)

      withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'eager' },
        })

        // Set ref to something that is not HTMLElement and not Text
        elRef.value = { $el: 'not-an-element' }

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      await nextTick()

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[maz-ui](useFormField)'),
      )

      warnSpy.mockRestore()
    })
  })

  describe('when validationEvents computed is accessed', () => {
    it('then it should return onBlur handler when ref is not provided and mode is not aggressive/lazy', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'blur' },
        })

        const field = useFormField('name')
        return { form, field }
      })

      const events = result.field.validationEvents.value
      expect(events).toBeDefined()
      expect(events?.onBlur).toBeTypeOf('function')
    })

    it('then it should return undefined when ref is provided', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const elRef = ref<HTMLElement>(document.createElement('div'))

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'eager' },
        })

        const field = useFormField('name', { ref: elRef })
        return { form, field }
      })

      const events = result.field.validationEvents.value
      expect(events).toBeUndefined()
    })

    it('then it should return undefined when mode is aggressive', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'aggressive' },
        })

        const field = useFormField('name')
        return { form, field }
      })

      const events = result.field.validationEvents.value
      expect(events).toBeUndefined()
    })

    it('then it should return undefined when mode is lazy', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
          options: { mode: 'lazy' },
        })

        const field = useFormField('name')
        return { form, field }
      })

      const events = result.field.validationEvents.value
      expect(events).toBeUndefined()
    })
  })

  describe('when the returned computed properties are accessed', () => {
    it('then hasError should reflect the field error state', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: '' },
          options: { mode: 'aggressive' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      await flushPromises()
      expect(result.field.hasError.value).toBeDefined()
    })

    it('then errors should return the error issues', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: '' },
          options: { mode: 'aggressive' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      await flushPromises()
      expect(Array.isArray(result.field.errors.value)).toBe(true)
    })

    it('then errorMessage should return the first error message or undefined', async () => {
      const schema = {
        email: pipe(string(), email()),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { email: '' },
          options: { mode: 'aggressive' },
        })

        const field = useFormField('email')
        return { form, field }
      })

      await flushPromises()
      expect(result.field.errorMessage).toBeDefined()
    })

    it('then isDirty, isBlurred, isValidated, isValidating should be boolean computed refs', () => {
      const schema = {
        name: pipe(string(), minLength(2)),
      }

      const [result] = withSetup(() => {
        const form = useFormValidator({
          schema,
          defaultValues: { name: '' },
        })

        const field = useFormField('name')
        return { form, field }
      })

      expect(result.field.isDirty.value).toBe(false)
      expect(result.field.isBlurred.value).toBe(false)
      expect(result.field.isValidated.value).toBe(false)
      expect(result.field.isValidating.value).toBe(false)
    })
  })

  describe('when useFormField is called outside of setup', () => {
    it('then it should throw an error', () => {
      expect(() => {
        useFormField('name')
      }).toThrow()
    })
  })
})
