import { provide } from 'vue'

import {
  formDataInjectKey,
  useFormGenerator,
} from '@/domains/views/summary/components/FormGenerator/composables/useFormGenerator'

describe('useFormGenerator Composable', () => {
  let composable: ReturnType<typeof useFormGenerator>
  beforeEach(() => {
    composable = useFormGenerator()

    vi.mock('vue', async () => {
      const provideData: { [k in string]: unknown } = {}
      const vue = await vi.importActual('vue')
      return {
        ...vue,
        provide: vi.fn((key: string, value: unknown) => {
          provideData[key] = value
        }),
        inject: vi.fn((key: string) => {
          return provideData[key] ?? null
        }),
      }
    })
  })

  describe('when called', () => {
    it('then it returns a function', () => {
      expect(typeof composable.injectFormData).toBe('function')
    })
  })

  describe('given InjectFormData', () => {
    describe('when form data was provided', () => {
      it('then it returns data', () => {
        provide(formDataInjectKey, { name: 'second' })
        const result = composable.injectFormData()

        expect(result).toEqual({
          name: 'second',
        })
      })
    })
  })
})
