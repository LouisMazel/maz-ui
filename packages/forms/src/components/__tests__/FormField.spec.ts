import type { Component, ComputedRef, Ref } from 'vue'
import type { ErrorMessageValue, FieldsValidationStates } from '../../../src/composables/useFormBuilder'
import type { FormField } from '../../../src/utils/schema-helpers'
import { flushPromises, mount } from '@vue/test-utils'
import { computed, defineComponent, h, ref } from 'vue'
import FormFieldComponent from '../../../src/components/FormField.vue'
import { FORM_BUILDER_STATE_KEY, FORM_BUILDER_VALIDATION_KEY } from '../../../src/utils/constants'

interface TestFormModel extends Record<string, unknown> {
  name: string
  email: string
}

interface ValidationContext {
  fieldsStates: Ref<FieldsValidationStates<TestFormModel>>
  errorMessages: ComputedRef<Partial<Record<keyof TestFormModel, ErrorMessageValue>>>
  handleFieldBlur: (name: keyof TestFormModel) => void
  isValid: ComputedRef<boolean>
}

interface FormBuilderState {
  formId: ComputedRef<string>
  isValid: ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  isDirty: ComputedRef<boolean>
  errors: ComputedRef<Partial<Record<keyof TestFormModel, unknown>>>
  errorMessages: ComputedRef<Partial<Record<keyof TestFormModel, ErrorMessageValue>>>
  fieldsStates: Ref<FieldsValidationStates<TestFormModel>>
  handleFieldBlur: (name: keyof TestFormModel) => void
  emitFieldChange: (payload: unknown) => void
  emitFieldFocus: (payload: unknown) => void
  emitFieldBlur: (payload: unknown) => void
  emitFieldValidate: (payload: unknown) => void
}

const MockComponent = defineComponent({
  name: 'MockComponent',
  props: {
    modelValue: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup(props, { emit }) {
    return () => h('input', {
      value: props.modelValue,
      readonly: props.readonly,
      disabled: props.disabled,
      class: { 'has-error': props.error },
      onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
      onFocus: () => emit('focus'),
      onBlur: () => emit('blur'),
    })
  },
})

function createField(options: Partial<FormField<TestFormModel, 'name', 'MazInput'>> = {}): FormField<TestFormModel, 'name', 'MazInput'> {
  return {
    name: 'name',
    component: 'MazInput',
    props: { label: 'Name' },
    ...options,
  }
}

function createValidationContext(overrides: Partial<ValidationContext> = {}): ValidationContext {
  return {
    fieldsStates: ref({}) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
    errorMessages: computed(() => ({})),
    handleFieldBlur: () => {},
    isValid: computed(() => true),
    ...overrides,
  }
}

function createFormBuilderState(overrides: Partial<FormBuilderState> = {}): FormBuilderState {
  return {
    formId: computed(() => 'test-form'),
    isValid: computed(() => true),
    isSubmitting: ref(false),
    isSubmitted: ref(false),
    isDirty: computed(() => false),
    errors: computed(() => ({})),
    errorMessages: computed(() => ({})),
    fieldsStates: ref({}) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
    handleFieldBlur: () => {},
    emitFieldChange: () => {},
    emitFieldFocus: () => {},
    emitFieldBlur: () => {},
    emitFieldValidate: () => {},
    ...overrides,
  }
}

function mountFormField(
  field: FormField<TestFormModel, keyof TestFormModel, 'MazInput'>,
  model: TestFormModel,
  options: {
    components?: Partial<Record<string, Component>>
    validationContext?: ValidationContext | null
    formBuilderState?: FormBuilderState | null
    readonly?: boolean
    disabled?: boolean
  } = {},
) {
  const {
    components = { MazInput: MockComponent },
    validationContext = null,
    formBuilderState = null,
    readonly = false,
    disabled = false,
  } = options

  return mount(FormFieldComponent as any, {
    props: {
      field,
      modelValue: model[field.name as keyof TestFormModel],
      model,
      components,
      readonly,
      disabled,
    },
    global: {
      provide: {
        ...(validationContext ? { [FORM_BUILDER_VALIDATION_KEY]: computed(() => validationContext) } : {}),
        ...(formBuilderState ? { [FORM_BUILDER_STATE_KEY]: computed(() => formBuilderState) } : {}),
      },
    },
  })
}

describe('FormField', () => {
  describe('Given a FormField component', () => {
    describe('When rendering a basic field', () => {
      it('renders the field wrapper', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.exists()).toBe(true)
      })

      it('renders the component from components map', async () => {
        const field = createField()
        const model: TestFormModel = { name: 'John', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const input = wrapper.find('input')
        expect(input.exists()).toBe(true)
      })

      it('passes modelValue to component', async () => {
        const field = createField()
        const model: TestFormModel = { name: 'John', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const input = wrapper.find('input')
        expect(input.element.value).toBe('John')
      })

      it('sets data-field-name attribute', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.attributes('data-field-name')).toBe('name')
      })

      it('sets data-field-id attribute', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.attributes('data-field-id')).toBeDefined()
      })
    })

    describe('When field has condition', () => {
      it('renders field when condition is true', async () => {
        const field = createField({
          condition: (m: TestFormModel) => m.email.length > 0,
        })
        const model: TestFormModel = { name: '', email: 'test@test.com' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.exists()).toBe(true)
      })

      it('does not render field when condition is false', async () => {
        const field = createField({
          condition: (m: TestFormModel) => m.email.length > 0,
        })
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.exists()).toBe(false)
      })
    })

    describe('When field has no component in map', () => {
      it('does not render field', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { components: {} })

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.exists()).toBe(false)
      })
    })

    describe('When readonly prop is passed', () => {
      it('passes readonly to component', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { readonly: true })

        await flushPromises()

        const input = wrapper.find('input')
        expect(input.attributes('readonly')).toBeDefined()
      })
    })

    describe('When disabled prop is passed', () => {
      it('passes disabled to component', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { disabled: true })

        await flushPromises()

        const input = wrapper.find('input')
        expect(input.attributes('disabled')).toBeDefined()
      })
    })

    describe('When value changes', () => {
      it('emits update:modelValue event', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const input = wrapper.find('input')
        await input.setValue('John')

        const events = wrapper.emitted('update:modelValue')
        expect(events).toBeDefined()
        expect(events?.[0][0]).toBe('John')
      })

      it('emits fieldChange event', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const input = wrapper.find('input')
        await input.setValue('John')

        const events = wrapper.emitted('fieldChange')
        expect(events).toBeDefined()
        expect(events?.[0][0]).toEqual({
          name: 'name',
          value: 'John',
          previousValue: '',
        })
      })

      it('calls emitFieldChange on formBuilderState', async () => {
        const emitFieldChange = vi.fn()
        const formBuilderState = createFormBuilderState({ emitFieldChange })
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { formBuilderState })

        await flushPromises()

        const input = wrapper.find('input')
        await input.setValue('John')

        expect(emitFieldChange).toHaveBeenCalled()
      })
    })

    describe('When field receives focus', () => {
      it('emits fieldFocus event', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const input = wrapper.find('input')
        await input.trigger('focus')

        const events = wrapper.emitted('fieldFocus')
        expect(events).toBeDefined()
        expect(events?.[0][0]).toEqual({
          name: 'name',
          value: '',
        })
      })

      it('calls emitFieldFocus on formBuilderState', async () => {
        const emitFieldFocus = vi.fn()
        const formBuilderState = createFormBuilderState({ emitFieldFocus })
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { formBuilderState })

        await flushPromises()

        const input = wrapper.find('input')
        await input.trigger('focus')

        expect(emitFieldFocus).toHaveBeenCalled()
      })
    })

    describe('When field loses focus', () => {
      it('emits fieldBlur event', async () => {
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const input = wrapper.find('input')
        await input.trigger('blur')

        const events = wrapper.emitted('fieldBlur')
        expect(events).toBeDefined()
        expect(events?.[0][0]).toEqual({
          name: 'name',
          value: '',
        })
      })

      it('calls emitFieldBlur on formBuilderState', async () => {
        const emitFieldBlur = vi.fn()
        const formBuilderState = createFormBuilderState({ emitFieldBlur })
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { formBuilderState })

        await flushPromises()

        const input = wrapper.find('input')
        await input.trigger('blur')

        expect(emitFieldBlur).toHaveBeenCalled()
      })

      it('calls handleFieldBlur on validation context when field has validation', async () => {
        const handleFieldBlur = vi.fn()
        const validationContext = createValidationContext({ handleFieldBlur })
        const field = createField({
          validation: { rule: {} as any },
        })
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const input = wrapper.find('input')
        await input.trigger('blur')

        expect(handleFieldBlur).toHaveBeenCalledWith('name')
      })
    })

    describe('When field has validation errors', () => {
      it('displays error class when hasError is true', async () => {
        const validationContext = createValidationContext({
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
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.classes()).toContain('has-field-error')
        expect(fieldWrapper.classes()).toContain('maz-form-field--error')
      })

      it('displays error message', async () => {
        const validationContext = createValidationContext({
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
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const errorDiv = wrapper.find('.maz-form-field__error')
        expect(errorDiv.exists()).toBe(true)
        expect(errorDiv.text()).toContain('Required')
      })

      it('displays multiple error messages as array', async () => {
        const validationContext = createValidationContext({
          fieldsStates: ref({
            name: {
              error: true,
              errors: [{ message: 'Too short' }, { message: 'Invalid format' }],
              valid: false,
              blurred: true,
              dirty: true,
              validating: false,
              validated: true,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
          errorMessages: computed(() => ({ name: ['Too short', 'Invalid format'] })),
        })
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const errorMessages = wrapper.findAll('.maz-form-field__error-message')
        expect(errorMessages).toHaveLength(2)
        expect(errorMessages[0].text()).toBe('Too short')
        expect(errorMessages[1].text()).toBe('Invalid format')
      })

      it('sets aria-invalid when field has error', async () => {
        const validationContext = createValidationContext({
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
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const input = wrapper.find('input')
        expect(input.attributes('aria-invalid')).toBe('true')
      })

      it('sets aria-describedby pointing to error message', async () => {
        const validationContext = createValidationContext({
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
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const input = wrapper.find('input')
        const errorDiv = wrapper.find('.maz-form-field__error')
        expect(input.attributes('aria-describedby')).toBe(errorDiv.attributes('id'))
      })

      it('displays error with role alert', async () => {
        const validationContext = createValidationContext({
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
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const errorDiv = wrapper.find('.maz-form-field__error')
        expect(errorDiv.attributes('role')).toBe('alert')
        expect(errorDiv.attributes('aria-live')).toBe('polite')
      })
    })

    describe('When field has no validation errors', () => {
      it('does not display error class', async () => {
        const validationContext = createValidationContext({
          fieldsStates: ref({
            name: {
              error: false,
              errors: [],
              valid: true,
              blurred: false,
              dirty: false,
              validating: false,
              validated: false,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
        })
        const field = createField()
        const model: TestFormModel = { name: 'John', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const fieldWrapper = wrapper.find('.maz-form-field')
        expect(fieldWrapper.classes()).not.toContain('has-field-error')
      })

      it('does not display error message', async () => {
        const validationContext = createValidationContext({
          fieldsStates: ref({
            name: {
              error: false,
              errors: [],
              valid: true,
              blurred: false,
              dirty: false,
              validating: false,
              validated: false,
            },
          }) as unknown as Ref<FieldsValidationStates<TestFormModel>>,
        })
        const field = createField()
        const model: TestFormModel = { name: 'John', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const errorDiv = wrapper.find('.maz-form-field__error')
        expect(errorDiv.exists()).toBe(false)
      })
    })

    describe('When field has required prop', () => {
      it('sets aria-required attribute', async () => {
        const field = createField({
          props: { label: 'Name', required: true },
        })
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        const input = wrapper.find('input')
        expect(input.attributes('aria-required')).toBe('true')
      })
    })

    describe('When field has autofocus attr', () => {
      it('passes autofocus attribute', async () => {
        const field = createField({
          attrs: { autofocus: true },
        })
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model)

        await flushPromises()

        expect(wrapper.find('.maz-form-field').exists()).toBe(true)
      })
    })

    describe('When field validation state changes', () => {
      it('emits fieldValidate when state becomes validated', async () => {
        const fieldsStates = ref({
          name: {
            error: false,
            errors: [],
            valid: true,
            blurred: false,
            dirty: false,
            validating: false,
            validated: false,
          },
        }) as unknown as Ref<FieldsValidationStates<TestFormModel>>

        const validationContext = createValidationContext({
          fieldsStates,
          errorMessages: computed(() => ({})),
        })

        const field = createField({
          validation: { rule: {} as any },
        })
        const model: TestFormModel = { name: 'John', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        fieldsStates.value = {
          name: {
            error: false,
            errors: [],
            valid: true,
            blurred: true,
            dirty: true,
            validating: false,
            validated: true,
          },
        } as any

        await flushPromises()

        const events = wrapper.emitted('fieldValidate')
        expect(events).toBeDefined()
      })

      it('emits fieldValidate when valid status changes', async () => {
        const fieldsStates = ref({
          name: {
            error: false,
            errors: [],
            valid: true,
            blurred: true,
            dirty: true,
            validating: false,
            validated: true,
          },
        }) as unknown as Ref<FieldsValidationStates<TestFormModel>>

        const validationContext = createValidationContext({
          fieldsStates,
          errorMessages: computed(() => ({})),
        })

        const field = createField({
          validation: { rule: {} as any },
        })
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        fieldsStates.value = {
          name: {
            error: true,
            errors: [{ message: 'Required' }],
            valid: false,
            blurred: true,
            dirty: true,
            validating: false,
            validated: true,
          },
        } as any

        await flushPromises()

        const events = wrapper.emitted('fieldValidate')
        expect(events).toBeDefined()
      })

      it('calls emitFieldValidate on formBuilderState', async () => {
        const emitFieldValidate = vi.fn()
        const fieldsStates = ref({
          name: {
            error: false,
            errors: [],
            valid: true,
            blurred: false,
            dirty: false,
            validating: false,
            validated: false,
          },
        }) as unknown as Ref<FieldsValidationStates<TestFormModel>>

        const formBuilderState = createFormBuilderState({
          emitFieldValidate,
          fieldsStates,
        })

        const validationContext = createValidationContext({
          fieldsStates,
        })

        const field = createField({
          validation: { rule: {} as any },
        })
        const model: TestFormModel = { name: 'John', email: '' }
        mountFormField(field, model, {
          validationContext,
          formBuilderState,
        })

        await flushPromises()

        fieldsStates.value = {
          name: {
            error: false,
            errors: [],
            valid: true,
            blurred: true,
            dirty: true,
            validating: false,
            validated: true,
          },
        }

        await flushPromises()

        expect(emitFieldValidate).toHaveBeenCalled()
      })

      it('does not emit when field has no validation', async () => {
        const fieldsStates = ref({
          name: {
            error: false,
            errors: [],
            valid: true,
            blurred: false,
            dirty: false,
            validating: false,
            validated: false,
          },
        }) as unknown as Ref<FieldsValidationStates<TestFormModel>>

        const validationContext = createValidationContext({
          fieldsStates,
        })

        const field = createField()
        const model: TestFormModel = { name: 'John', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        fieldsStates.value = {
          name: {
            error: false,
            errors: [],
            valid: true,
            blurred: true,
            dirty: true,
            validating: false,
            validated: true,
          },
        }

        await flushPromises()

        const events = wrapper.emitted('fieldValidate')
        expect(events).toBeUndefined()
      })
    })

    describe('When errorMessage without validation state', () => {
      it('does not show error when no errorMessage', async () => {
        const validationContext = createValidationContext({
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
          errorMessages: computed(() => ({ name: undefined })),
        })
        const field = createField()
        const model: TestFormModel = { name: '', email: '' }
        const wrapper = mountFormField(field, model, { validationContext })

        await flushPromises()

        const errorDiv = wrapper.find('.maz-form-field__error')
        expect(errorDiv.exists()).toBe(false)
      })
    })
  })
})
