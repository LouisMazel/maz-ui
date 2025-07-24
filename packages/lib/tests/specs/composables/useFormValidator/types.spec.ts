import type { FormValidatorField, FormValidatorSchema, FormValidatorState } from '@composables/useFormValidator/types'

describe('given FormValidatorField type', () => {
  describe('when used with string value', () => {
    it('then it should allow string value and rules', () => {
      const field: FormValidatorField<string> = {
        value: 'test',
        rules: ['required', 'email'],
      }

      expect(field.value).toBe('test')
      expect(field.rules).toEqual(['required', 'email'])
    })
  })

  describe('when used with number value', () => {
    it('then it should allow number value and rules', () => {
      const field: FormValidatorField<number> = {
        value: 42,
        rules: ['required', 'min:0'],
      }

      expect(field.value).toBe(42)
      expect(field.rules).toEqual(['required', 'min:0'])
    })
  })

  describe('when used with boolean value', () => {
    it('then it should allow boolean value and rules', () => {
      const field: FormValidatorField<boolean> = {
        value: true,
        rules: ['required'],
      }

      expect(field.value).toBe(true)
      expect(field.rules).toEqual(['required'])
    })
  })

  describe('when used with optional fields', () => {
    it('then it should allow optional rules and messages', () => {
      const field: FormValidatorField<string> = {
        value: 'test',
      }

      expect(field.value).toBe('test')
      expect(field.rules).toBeUndefined()
      expect(field.messages).toBeUndefined()
    })
  })

  describe('when used with custom messages', () => {
    it('then it should allow custom messages object', () => {
      const field: FormValidatorField<string> = {
        value: 'test',
        rules: ['required', 'email'],
        messages: {
          required: 'This field is required',
          email: 'Please enter a valid email',
        },
      }

      expect(field.messages?.required).toBe('This field is required')
      expect(field.messages?.email).toBe('Please enter a valid email')
    })
  })
})

describe('given FormValidatorSchema type', () => {
  describe('when used with string fields', () => {
    it('then it should allow string field definitions', () => {
      const schema: FormValidatorSchema = {
        email: {
          value: 'test@example.com',
          rules: ['required', 'email'],
        },
        name: {
          value: 'John Doe',
          rules: ['required'],
        },
      }

      expect(schema.email.value).toBe('test@example.com')
      expect(schema.name.value).toBe('John Doe')
    })
  })

  describe('when used with mixed field types', () => {
    it('then it should allow mixed field type definitions', () => {
      const schema: FormValidatorSchema = {
        name: {
          value: 'John Doe',
          rules: ['required'],
        },
        age: {
          value: 25,
          rules: ['required', 'min:18'],
        },
        agreed: {
          value: true,
          rules: ['required'],
        },
      }

      expect(schema.name.value).toBe('John Doe')
      expect(schema.age.value).toBe(25)
      expect(schema.agreed.value).toBe(true)
    })
  })

  describe('when used with nested object values', () => {
    it('then it should allow object field values', () => {
      const schema: FormValidatorSchema = {
        user: {
          value: { name: 'John', email: 'john@example.com' },
          rules: ['required'],
        },
      }

      expect(schema.user.value).toEqual({ name: 'John', email: 'john@example.com' })
    })
  })

  describe('when used with array values', () => {
    it('then it should allow array field values', () => {
      const schema: FormValidatorSchema = {
        tags: {
          value: ['tag1', 'tag2'],
          rules: ['required'],
        },
      }

      expect(schema.tags.value).toEqual(['tag1', 'tag2'])
    })
  })
})

describe('given FormValidatorState type', () => {
  describe('when used with validation results', () => {
    it('then it should allow validation state properties', () => {
      const state: FormValidatorState = {
        email: {
          valid: false,
          errors: ['Email is required'],
          validating: false,
        },
        password: {
          valid: true,
          errors: [],
          validating: false,
        },
      }

      expect(state.email.valid).toBe(false)
      expect(state.email.errors).toEqual(['Email is required'])
      expect(state.password.valid).toBe(true)
      expect(state.password.errors).toEqual([])
    })
  })

  describe('when used with validating states', () => {
    it('then it should allow validating flag', () => {
      const state: FormValidatorState = {
        email: {
          valid: false,
          errors: [],
          validating: true,
        },
      }

      expect(state.email.validating).toBe(true)
    })
  })

  describe('when used with multiple field states', () => {
    it('then it should allow multiple field validation states', () => {
      const state: FormValidatorState = {
        name: {
          valid: true,
          errors: [],
          validating: false,
        },
        email: {
          valid: false,
          errors: ['Invalid email format'],
          validating: false,
        },
        age: {
          valid: true,
          errors: [],
          validating: false,
        },
      }

      expect(Object.keys(state)).toEqual(['name', 'email', 'age'])
      expect(state.name.valid).toBe(true)
      expect(state.email.valid).toBe(false)
      expect(state.age.valid).toBe(true)
    })
  })
})
