import { nonEmpty, objectAsync, pipe, regex, safeParseAsync, string } from 'valibot'

import type { FormFieldPredefined, FormSection } from '@/domains/views/summary/components/FormGenerator/types'
import { getFormValidationSchema } from '@/domains/views/summary/components/FormGenerator/utils'

const nameInputField: FormFieldPredefined = {
  componentName: 'AdsInput',
  id: 'name',
  name: 'name',
  props: {
    label: 'name',
  },
}

describe('formGenerator utils', () => {
  describe('given getFormValidationSchema method', () => {
    describe('when passing validations required rules', () => {
      const errorMessage = 'Should exist'
      const sections: FormSection[] = [
        {
          id: 'section1',
          legend: 'Section 1',
          fields: [
            {
              ...nameInputField,
              validation: {
                rule: pipe(string(), nonEmpty(errorMessage)),
              },
            },
          ],
        },
      ]

      it('then it returns validation function that return error message if value does not exist', () => {
        const schema = getFormValidationSchema(sections)
        expect(typeof schema).toBe('object')
      })

      it('then it returns validation function that return true if values exists', () => {
        const schema = getFormValidationSchema(sections)
        expect(typeof schema).toBe('object')
        expect(typeof schema).toBeTruthy()
      })
    })

    describe('when passing validations regex rules', () => {
      const errorMessage = 'Should be number only'
      const sections: FormSection[] = [
        {
          id: 'section1',
          legend: 'Section 1',
          fields: [
            {
              ...nameInputField,
              validation: {
                rule: pipe(string(), regex(new RegExp(/^\d+$/), errorMessage)),
              },
            },
          ],
        },
      ]

      it('then it returns a function that returns message when regex not validate', async () => {
        const schema = getFormValidationSchema(sections)
        expect(typeof schema).toBe('object')
        const result = await safeParseAsync(objectAsync(schema), { name: 'notANumber' })
        expect(result.issues?.[0].message).toBe(errorMessage)
      })

      it('then it returns a function that return true when regex is matched', async () => {
        const schema = getFormValidationSchema(sections)
        expect(typeof schema).toBe('object')
        const result = await safeParseAsync(objectAsync(schema), { name: '0' })
        expect(result.success).toBeTruthy()
      })
    })
  })
})
