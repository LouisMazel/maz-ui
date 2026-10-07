import type { StandardSchemaV1 } from '@composables/useFormValidator/types'
import { useFormField } from '@composables/useFormField'
import { useFormValidator } from '@composables/useFormValidator'
import { getFieldValidationResult, setFieldValidationState } from '@composables/useFormValidator/validation'
import { withSetup } from '@tests/helpers/withSetup'
import { flushPromises } from '@vue/test-utils'
import { minLength, pipe, string } from 'valibot'
import { nextTick, ref } from 'vue'
import { z } from 'zod'

function createCustomSchema(isAsync = false) {
  const validate = vi.fn((value: unknown): StandardSchemaV1.Result<string> => typeof value === 'string' && value.length >= 3
    ? { value }
    : { issues: [{ message: 'Custom: min 3 characters' }] })

  const schema: StandardSchemaV1<string, string> = {
    '~standard': {
      version: 1,
      vendor: 'custom',
      validate: isAsync ? value => Promise.resolve(validate(value)) : validate,
    },
  }

  return { schema, validate }
}

describe('given getFieldValidationResult function with a Standard Schema', () => {
  describe('when the schema is a Zod schema and the value is valid', () => {
    it('then it returns a successful result', async () => {
      const result = await getFieldValidationResult('name', { name: z.string().min(3) }, 'John')

      expect(result.isValid).toBe(true)
      expect(result.result.success).toBe(true)
      expect(result.result.issues).toBeUndefined()
    })
  })

  describe('when the schema is a Zod schema and the value is invalid', () => {
    it('then it returns the Zod issues', async () => {
      const result = await getFieldValidationResult('name', { name: z.string().min(3, 'Too short') }, 'Jo')

      expect(result.isValid).toBe(false)
      expect(result.result.success).toBe(false)
      expect(result.result.issues?.[0].message).toBe('Too short')
    })
  })

  describe('when the schema is a Zod schema with an async refinement', () => {
    it('then it resolves the async validation', async () => {
      const schema = { name: z.string().refine(value => Promise.resolve(value !== 'taken'), 'Already taken') }

      const invalid = await getFieldValidationResult('name', schema, 'taken')
      const valid = await getFieldValidationResult('name', schema, 'free')

      expect(invalid.isValid).toBe(false)
      expect(invalid.result.issues?.[0].message).toBe('Already taken')
      expect(valid.isValid).toBe(true)
    })
  })

  describe('when the schema is a custom synchronous Standard Schema', () => {
    it('then it uses the schema validate function', async () => {
      const { schema, validate } = createCustomSchema()

      const result = await getFieldValidationResult('name', { name: schema }, 'Jo')

      expect(validate).toHaveBeenCalledWith('Jo')
      expect(result.isValid).toBe(false)
      expect(result.result.issues?.[0].message).toBe('Custom: min 3 characters')
    })
  })

  describe('when the schema is a custom asynchronous Standard Schema', () => {
    it('then it awaits the schema validate function', async () => {
      const { schema } = createCustomSchema(true)

      const result = await getFieldValidationResult('name', { name: schema }, 'John')

      expect(result.isValid).toBe(true)
      expect(result.result.success).toBe(true)
    })
  })

  describe('when the value is undefined or null', () => {
    it('then it validates an empty string instead', async () => {
      const { schema, validate } = createCustomSchema()

      await getFieldValidationResult('name', { name: schema }, undefined)
      await getFieldValidationResult('name', { name: schema }, null)

      expect(validate).toHaveBeenNthCalledWith(1, '')
      expect(validate).toHaveBeenNthCalledWith(2, '')
    })
  })

  describe('when the schema is a Valibot schema and the value is invalid', () => {
    it('then it keeps the native Valibot issues', async () => {
      const result = await getFieldValidationResult('name', { name: pipe(string(), minLength(3, 'Too short')) }, 'Jo')

      expect(result.isValid).toBe(false)
      expect(result.result.issues?.[0]).toMatchObject({
        kind: 'validation',
        type: 'min_length',
        input: 'Jo',
        expected: '>=3',
        received: '2',
        message: 'Too short',
      })
    })
  })
})

describe('given setFieldValidationState function with a Zod schema', () => {
  describe('when the field value is invalid', () => {
    it('then it stores the Zod issues on the field state', async () => {
      const fieldState = { validating: false, valid: false, error: false, errors: [], validated: false, blurred: false } as never as Parameters<typeof setFieldValidationState>[0]['fieldState']

      await setFieldValidationState({
        name: 'name',
        fieldState,
        schema: { name: z.string().min(3, 'Too short') },
        payload: { name: 'Jo' },
      })

      expect(fieldState.valid).toBe(false)
      expect(fieldState.error).toBe(true)
      expect(fieldState.validated).toBe(true)
      expect(fieldState.errors).toHaveLength(1)
      expect(fieldState.errors[0].message).toBe('Too short')
    })
  })
})

describe('given useFormValidator composable with a Zod schema', () => {
  describe('when the form is initialized in aggressive mode with invalid values', () => {
    it('then it exposes Zod error messages', async () => {
      const [{ errorMessages, isValid, errors }] = withSetup(() => useFormValidator({
        schema: {
          name: z.string().min(3, 'Name is too short'),
          age: z.number({ error: 'Age is required' }).min(18, 'Must be adult'),
        },
        defaultValues: { name: 'Jo', age: 12 },
        options: { mode: 'aggressive' },
      }))

      await flushPromises()

      expect(isValid.value).toBe(false)
      expect(errorMessages.value.name).toBe('Name is too short')
      expect(errorMessages.value.age).toBe('Must be adult')
      expect(errors.value.name[0].message).toBe('Name is too short')
    })
  })

  describe('when the model is updated with valid values', () => {
    it('then the form becomes valid', async () => {
      const [{ model, isValid, errorMessages }] = withSetup(() => useFormValidator({
        schema: {
          name: z.string().min(3, 'Name is too short'),
          nickname: z.string().optional(),
        },
        defaultValues: { name: 'Jo' },
        options: { mode: 'aggressive' },
      }))

      await flushPromises()
      expect(isValid.value).toBe(false)

      model.value.name = 'John'
      await nextTick()
      await flushPromises()

      expect(isValid.value).toBe(true)
      expect(errorMessages.value.name).toBeUndefined()
    })
  })

  describe('when the form is submitted with valid values', () => {
    it('then it calls the success callback with the model', async () => {
      const onSuccess = vi.fn()
      const [{ handleSubmit }] = withSetup(() => useFormValidator({
        schema: {
          name: z.string().min(3),
          age: z.number().min(18),
        },
        defaultValues: { name: 'John', age: 30 },
      }))

      await handleSubmit(onSuccess)()

      expect(onSuccess).toHaveBeenCalledWith({ name: 'John', age: 30 })
    })
  })

  describe('when the form is submitted with invalid values', () => {
    it('then it calls onError with the Zod error messages', async () => {
      const onSuccess = vi.fn()
      const onError = vi.fn()
      const [{ handleSubmit }] = withSetup(() => useFormValidator({
        schema: {
          name: z.string().min(3, 'Name is too short'),
        },
        defaultValues: { name: 'Jo' },
      }))

      await handleSubmit(onSuccess, '.has-field-error', { onError })()

      expect(onSuccess).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({
        errorMessages: { name: 'Name is too short' },
      }))
    })
  })
})

describe('given useFormValidator composable with a mixed schema', () => {
  describe('when Zod, Valibot and custom Standard Schemas are combined', () => {
    it('then each field is validated by its own library', async () => {
      const { schema: customSchema } = createCustomSchema()
      const schema = ref({
        zodField: z.string().min(3, 'Zod: min 3 characters'),
        valibotField: pipe(string(), minLength(3, 'Valibot: min 3 characters')),
        customField: customSchema,
      })

      const [{ errorMessages, model, isValid }] = withSetup(() => useFormValidator({
        schema,
        defaultValues: { zodField: 'a', valibotField: 'b', customField: 'c' },
        options: { mode: 'aggressive' },
      }))

      await flushPromises()

      expect(errorMessages.value).toEqual({
        zodField: 'Zod: min 3 characters',
        valibotField: 'Valibot: min 3 characters',
        customField: 'Custom: min 3 characters',
      })

      model.value = { zodField: 'abc', valibotField: 'abc', customField: 'abc' }
      await nextTick()
      await flushPromises()

      expect(isValid.value).toBe(true)
    })
  })
})

describe('given useFormValidator composable with a reactive Zod schema', () => {
  describe('when a field schema is replaced', () => {
    it('then the new Zod schema is used for validation', async () => {
      const schema = ref<Record<string, z.ZodType>>({
        name: z.string().min(3, 'Min 3 characters'),
      })

      const [{ errorMessages }] = withSetup(() => useFormValidator({
        schema,
        defaultValues: { name: 'John' },
        options: { mode: 'aggressive' },
      }))

      await flushPromises()
      expect(errorMessages.value.name).toBeUndefined()

      schema.value.name = z.string().min(10, 'Min 10 characters')
      await nextTick()
      await flushPromises()

      expect(errorMessages.value.name).toBe('Min 10 characters')
    })
  })
})

describe('given useFormField composable with a Zod schema', () => {
  describe('when the field value changes from invalid to valid', () => {
    it('then the field state follows the Zod validation', async () => {
      const [{ field }] = withSetup(() => {
        const form = useFormValidator({
          schema: { email: z.email('Invalid email') },
          defaultValues: { email: 'invalid' },
          options: { mode: 'aggressive' },
        })
        const field = useFormField<string>('email')

        return { form, field }
      })

      await flushPromises()

      expect(field.isValid.value).toBe(false)
      expect(field.errorMessage.value).toBe('Invalid email')

      field.value.value = 'john@example.com'
      await nextTick()
      await flushPromises()

      expect(field.isValid.value).toBe(true)
      expect(field.errorMessage.value).toBeUndefined()
    })
  })
})
