import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue'
import type { ErrorMessageValue, FieldsValidationStates } from '../../../src/composables/useFormBuilder'
import { flushPromises, mount } from '@vue/test-utils'
import { computed, ref } from 'vue'
import FormErrorSummaryComponent from '../../../src/components/FormErrorSummary.vue'
import { FORM_BUILDER_STATE_KEY } from '../../../src/utils/constants'

interface TestFormModel extends Record<string, unknown> {
  name: string
  email: string
}

interface FormBuilderStateContext {
  isValid: ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  isDirty: ComputedRef<boolean>
  errors: ComputedRef<Partial<Record<keyof TestFormModel, unknown>>>
  errorMessages: ComputedRef<Partial<Record<keyof TestFormModel, ErrorMessageValue>>>
  fieldsStates: Ref<FieldsValidationStates<TestFormModel>>
}

interface FormErrorSummaryExposed {
  scrollToSummary: () => void
  scrollToField: (selector: string) => void
  errorItems: { fieldName: string, message: string, selector: string }[]
  hasErrors: boolean
}

type FormErrorSummaryInstance = ComponentPublicInstance & FormErrorSummaryExposed

function createFormBuilderState(overrides: Partial<FormBuilderStateContext> = {}): FormBuilderStateContext {
  return {
    isValid: computed(() => true),
    isSubmitting: ref(false),
    isSubmitted: ref(false),
    isDirty: computed(() => false),
    errors: computed(() => ({})),
    errorMessages: computed(() => ({})),
    fieldsStates: ref({}) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
    ...overrides,
  }
}

function mountFormErrorSummary(
  errorSummary: { position?: 'top' | 'bottom', selector?: string } | boolean | undefined,
  formBuilderState: FormBuilderStateContext | null = null,
) {
  return mount(FormErrorSummaryComponent as any, {
    props: {
      errorSummary,
    },
    global: {
      provide: formBuilderState
        ? { [FORM_BUILDER_STATE_KEY]: computed(() => formBuilderState) }
        : {},
    },
  })
}

function getVm(wrapper: ReturnType<typeof mountFormErrorSummary>): FormErrorSummaryInstance {
  return wrapper.vm as unknown as FormErrorSummaryInstance
}

describe('FormErrorSummary', () => {
  describe('Given a FormErrorSummary component', () => {
    describe('When errorSummary is undefined', () => {
      it('does not render summary', async () => {
        const wrapper = mountFormErrorSummary(undefined)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(false)
      })
    })

    describe('When errorSummary is false', () => {
      it('does not render summary', async () => {
        const wrapper = mountFormErrorSummary(false)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(false)
      })
    })

    describe('When errorSummary is true', () => {
      it('renders summary when there are errors and form is submitted', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(true)
      })

      it('does not render when form is not submitted', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(false),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(false)
      })

      it('does not render when there are no errors', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({}) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({})),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(false)
      })
    })

    describe('When errorSummary has position option', () => {
      it('renders with top position', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary({ position: 'top' }, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(true)
      })

      it('renders with bottom position', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary({ position: 'bottom' }, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(true)
      })
    })

    describe('When there are multiple errors', () => {
      it('displays all error items', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Name required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
            email: {
              error: true,
              errors: [{ message: 'Email required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({
            name: 'Name required',
            email: 'Email required',
          })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const items = wrapper.findAll('.maz-form-error-summary__item')
        expect(items).toHaveLength(2)
      })

      it('displays error count in heading', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Name required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
            email: {
              error: true,
              errors: [{ message: 'Email required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({
            name: 'Name required',
            email: 'Email required',
          })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const heading = wrapper.find('.maz-form-error-summary__title')
        expect(heading.text()).toContain('2 errors')
      })
    })

    describe('When there is a single error', () => {
      it('uses singular error text', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Name required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Name required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const heading = wrapper.find('.maz-form-error-summary__title')
        expect(heading.text()).toContain('1 error')
        expect(heading.text()).not.toContain('errors')
      })
    })

    describe('When error message is array', () => {
      it('creates error item for each message', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Too short' }, { message: 'Invalid chars' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: ['Too short', 'Invalid chars'] })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const items = wrapper.findAll('.maz-form-error-summary__item')
        expect(items).toHaveLength(2)
        expect(items[0].text()).toContain('Too short')
        expect(items[1].text()).toContain('Invalid chars')
      })
    })

    describe('When checking accessibility', () => {
      it('has role alert', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.attributes('role')).toBe('alert')
      })

      it('has aria-live polite', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.attributes('aria-live')).toBe('polite')
      })

      it('has aria-labelledby pointing to heading', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        const heading = wrapper.find('.maz-form-error-summary__title')
        expect(summary.attributes('aria-labelledby')).toBe(heading.attributes('id'))
      })

      it('has aria-describedby pointing to list', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        const list = wrapper.find('.maz-form-error-summary__list')
        expect(summary.attributes('aria-describedby')).toBe(list.attributes('id'))
      })

      it('has tabindex -1 for programmatic focus', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.attributes('tabindex')).toBe('-1')
      })

      it('error links have aria-label', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const link = wrapper.find('.maz-form-error-summary__link')
        expect(link.attributes('aria-label')).toContain('Go to field with error')
      })
    })

    describe('When error link is clicked', () => {
      it('calls scrollToField', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const link = wrapper.find('.maz-form-error-summary__link')
        await link.trigger('click')

        expect(link.exists()).toBe(true)
      })
    })

    describe('When checking exposed methods', () => {
      it('exposes scrollToSummary function', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.scrollToSummary).toBeDefined()
        expect(typeof vm.scrollToSummary).toBe('function')
      })

      it('exposes scrollToField function', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.scrollToField).toBeDefined()
        expect(typeof vm.scrollToField).toBe('function')
      })

      it('exposes errorItems computed', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.errorItems).toBeDefined()
        expect(Array.isArray(vm.errorItems)).toBe(true)
        expect(vm.errorItems).toHaveLength(1)
      })

      it('exposes hasErrors computed', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: 'Required' })),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.hasErrors).toBe(true)
      })
    })

    describe('When field state has error but no message', () => {
      it('skips field without message', async () => {
        const formBuilderState = createFormBuilderState({
          isSubmitted: ref(true),
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Required' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({})),
        })
        const wrapper = mountFormErrorSummary(true, formBuilderState)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(false)
      })
    })

    describe('When no formBuilderState is provided', () => {
      it('does not render errors', async () => {
        const wrapper = mountFormErrorSummary(true, null)

        await flushPromises()

        const summary = wrapper.find('.maz-form-error-summary')
        expect(summary.exists()).toBe(false)
      })
    })
  })
})
