import type { FormField, FormSchema, FormSection } from '../../../src/utils/schema-helpers'
import { minLength, pipe, string } from 'valibot'
import {
  defineFormField,
  defineFormSchema,
  defineFormSection,
  extractValidationFromSchema,
} from '../../../src/utils/schema-helpers'

interface TestFormModel extends Record<string, unknown> {
  name: string
  email: string
  phone: string
}

describe('schema-helpers', () => {
  describe('Given the defineFormField function', () => {
    describe('When defining a field with minimal options', () => {
      it('returns the field as-is', () => {
        const field: FormField<TestFormModel, 'name', 'MazInput'> = {
          name: 'name',
          id: 'name',
          component: 'MazInput',
        }

        const result = defineFormField(field)

        expect(result).toEqual(field)
        expect(result.name).toBe('name')
        expect(result.component).toBe('MazInput')
      })
    })

    describe('When defining a field with all options', () => {
      it('returns the field with all properties', () => {
        const field: FormField<TestFormModel, 'email', 'MazInput'> = {
          name: 'email',
          id: 'email',
          component: 'MazInput',
          props: { label: 'Email', placeholder: 'Enter email' },
          attrs: { 'data-testid': 'email-field' },
          defaultValue: '',
          validation: {
            rule: pipe(string(), minLength(5)),
            mode: 'lazy',
            debounced: 300,
            useMultipleErrorMessages: true,
          },
          condition: model => !!model && model.length > 0,
        }

        const result = defineFormField(field)

        expect(result).toEqual(field)
        expect(result.props?.label).toBe('Email')
        expect(result.validation?.mode).toBe('lazy')
        expect(result.validation?.debounced).toBe(300)
      })
    })
  })

  describe('Given the defineFormSection function', () => {
    describe('When defining a section with minimal options', () => {
      it('returns the section as-is', () => {
        const section: FormSection<TestFormModel> = {
          id: 'main',
          fields: [
            { name: 'name', component: 'MazInput' },
          ],
        }

        const result = defineFormSection(section)

        expect(result).toEqual(section)
        expect(result.id).toBe('main')
        expect(result.fields).toHaveLength(1)
      })
    })

    describe('When defining a section with all options', () => {
      it('returns the section with all properties', () => {
        const section: FormSection<TestFormModel> = {
          id: 'contact',
          legend: 'Contact Information',
          card: { radius: true },
          fields: [
            { name: 'email', component: 'MazInput' },
            { name: 'phone', component: 'MazInput' },
          ],
        }

        const result = defineFormSection(section)

        expect(result).toEqual(section)
        expect(result.legend).toBe('Contact Information')
        expect(result.card).toEqual({ radius: true })
        expect(result.fields).toHaveLength(2)
      })
    })
  })

  describe('Given the defineFormSchema function', () => {
    describe('When defining a schema with multiple sections', () => {
      it('returns the schema as-is', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'personal',
              fields: [{ name: 'name', component: 'MazInput' }],
            },
            {
              id: 'contact',
              fields: [
                { name: 'email', component: 'MazInput' },
                { name: 'phone', component: 'MazInput' },
              ],
            },
          ],
        }

        const result = defineFormSchema(schema)

        expect(result).toEqual(schema)
        expect(result.sections).toHaveLength(2)
      })
    })
  })

  // describe('Given the hasValidationRules function', () => {
  //   describe('When schema has validation rules', () => {
  //     it('returns true', () => {
  //       const schema: FormSchema<TestFormModel> = {
  //         sections: [
  //           {
  //             id: 'main',
  //             fields: [
  //               {
  //                 name: 'name',
  //                 component: 'MazInput',
  //                 validation: {
  //                   rule: pipe(string(), minLength(2)),
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       }

  //       const result = hasValidationRules(schema)

  //       expect(result).toBe(true)
  //     })
  //   })

  //   describe('When schema has no validation rules', () => {
  //     it('returns false', () => {
  //       const schema: FormSchema<TestFormModel> = {
  //         sections: [
  //           {
  //             id: 'main',
  //             fields: [
  //               { name: 'name', component: 'MazInput' },
  //               { name: 'email', component: 'MazInput' },
  //             ],
  //           },
  //         ],
  //       }

  //       const result = hasValidationRules(schema)

  //       expect(result).toBe(false)
  //     })
  //   })

  //   describe('When schema has empty validation object', () => {
  //     it('returns false', () => {
  //       const schema: FormSchema<TestFormModel> = {
  //         sections: [
  //           {
  //             id: 'main',
  //             fields: [
  //               {
  //                 name: 'name',
  //                 component: 'MazInput',
  //                 validation: {},
  //               },
  //             ],
  //           },
  //         ],
  //       }

  //       const result = hasValidationRules(schema)

  //       expect(result).toBe(false)
  //     })
  //   })

  //   describe('When schema has validation rule in nested section', () => {
  //     it('returns true', () => {
  //       const schema: FormSchema<TestFormModel> = {
  //         sections: [
  //           {
  //             id: 'first',
  //             fields: [{ name: 'name', component: 'MazInput' }],
  //           },
  //           {
  //             id: 'second',
  //             fields: [
  //               {
  //                 name: 'email',
  //                 component: 'MazInput',
  //                 validation: {
  //                   rule: pipe(string(), minLength(5)),
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       }

  //       const result = hasValidationRules(schema)

  //       expect(result).toBe(true)
  //     })
  //   })
  // })

  describe('Given the extractValidationFromSchema function', () => {
    describe('When schema has simple validation rules', () => {
      it('extracts validation schema', () => {
        const nameRule = pipe(string(), minLength(2))
        const emailRule = pipe(string(), minLength(5))

        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: { rule: nameRule },
                },
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: { rule: emailRule },
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.schema?.name).toBe(nameRule)
        expect(result.schema?.email).toBe(emailRule)
        expect(result.debouncedFields).toBeNull()
        expect(result.throttledFields).toBeNull()
      })
    })

    describe('When schema has debounced fields', () => {
      it('extracts debounced fields configuration', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(2)),
                    debounced: 300,
                  },
                },
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(5)),
                    debounced: true,
                  },
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.debouncedFields).not.toBeNull()
        expect(result.debouncedFields?.name).toBe(300)
        expect(result.debouncedFields?.email).toBe(true)
      })
    })

    describe('When schema has throttled fields', () => {
      it('extracts throttled fields configuration', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(2)),
                    throttled: 500,
                  },
                },
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(5)),
                    throttled: true,
                  },
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.throttledFields).not.toBeNull()
        expect(result.throttledFields?.name).toBe(500)
        expect(result.throttledFields?.email).toBe(true)
      })
    })

    describe('When schema has custom validation messages', () => {
      it('extracts custom messages', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(2)),
                  },
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.customMessages.name).toEqual({
          min_length: 'Name is too short',
          string: 'Name must be text',
        })
      })
    })

    describe('When schema has useMultipleErrorMessages flag', () => {
      it('extracts useMultipleErrorMessages configuration', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(2)),
                    useMultipleErrorMessages: true,
                  },
                },
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(5)),
                    useMultipleErrorMessages: false,
                  },
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.useMultipleErrorMessages.name).toBe(true)
        expect(result.useMultipleErrorMessages.email).toBe(false)
      })
    })

    describe('When schema has field modes', () => {
      it('extracts field modes', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(2)),
                    mode: 'eager',
                  },
                },
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(5)),
                    mode: 'lazy',
                  },
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.fieldModes.name).toBe('eager')
        expect(result.fieldModes.email).toBe('lazy')
      })
    })

    describe('When schema has mixed configuration', () => {
      it('extracts all configurations correctly', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(2)),
                    mode: 'eager',
                    debounced: 300,
                    messages: { min_length: 'Too short' },
                    useMultipleErrorMessages: true,
                  },
                },
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: {
                    rule: pipe(string(), minLength(5)),
                    mode: 'lazy',
                    throttled: 500,
                  },
                },
                {
                  name: 'phone',
                  component: 'MazInput',
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.schema?.name).toBeDefined()
        expect(result.schema?.email).toBeDefined()
        expect(result.schema?.phone).toBeUndefined()
        expect(result.fieldModes.name).toBe('eager')
        expect(result.fieldModes.email).toBe('lazy')
        expect(result.debouncedFields?.name).toBe(300)
        expect(result.throttledFields?.email).toBe(500)
        expect(result.customMessages.name).toEqual({ min_length: 'Too short' })
        expect(result.useMultipleErrorMessages.name).toBe(true)
      })
    })

    describe('When schema has fields without validation', () => {
      it('skips fields without validation', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                { name: 'name', component: 'MazInput' },
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: { rule: pipe(string(), minLength(5)) },
                },
                { name: 'phone', component: 'MazInput', validation: {} },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.schema?.name).toBeUndefined()
        expect(result.schema?.email).toBeDefined()
        expect(result.schema?.phone).toBeUndefined()
      })
    })

    describe('When schema has multiple sections', () => {
      it('extracts validation from all sections', () => {
        const nameRule = pipe(string(), minLength(2))
        const emailRule = pipe(string(), minLength(5))
        const phoneRule = pipe(string(), minLength(10))

        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'personal',
              fields: [
                {
                  name: 'name',
                  component: 'MazInput',
                  validation: { rule: nameRule },
                },
              ],
            },
            {
              id: 'contact',
              fields: [
                {
                  name: 'email',
                  component: 'MazInput',
                  validation: { rule: emailRule },
                },
                {
                  name: 'phone',
                  component: 'MazInput',
                  validation: { rule: phoneRule },
                },
              ],
            },
          ],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.schema?.name).toBe(nameRule)
        expect(result.schema?.email).toBe(emailRule)
        expect(result.schema?.phone).toBe(phoneRule)
      })
    })

    describe('When schema is empty', () => {
      it('returns empty extracted options', () => {
        const schema: FormSchema<TestFormModel> = {
          sections: [],
        }

        const result = extractValidationFromSchema(schema)

        expect(result.schema).toEqual({})
        expect(result.debouncedFields).toBeNull()
        expect(result.throttledFields).toBeNull()
        expect(result.fieldModes).toEqual({})
        expect(result.customMessages).toEqual({})
        expect(result.useMultipleErrorMessages).toEqual({})
      })
    })
  })
})
