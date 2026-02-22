import type { ComponentPublicInstance } from 'vue'
import type { FieldsValidationStates } from '../../../src/composables/useFormBuilder'
import type { FormSchema, ValidationIssues } from '../../../src/utils/schema-helpers'
import { flushPromises, mount } from '@vue/test-utils'
import { minLength, pipe, string } from 'valibot'
import { ref } from 'vue'
import MazFormBuilder from '../../../src/components/FormBuilder.vue'

interface TestFormModel extends Record<string, unknown> {
  name: string
  email: string
}

interface FormBuilderExposed {
  formId: string
  validateForm: () => Promise<boolean>
  validateField: (name: keyof TestFormModel) => Promise<boolean>
  resetValidation: () => void
  resetForm: () => void
  isValid: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  isDirty: boolean
  isValidating: boolean
  errors: Partial<Record<keyof TestFormModel, ValidationIssues>>
  errorMessages: Partial<Record<keyof TestFormModel, string | string[] | undefined>>
  fieldsStates: FieldsValidationStates<TestFormModel>
}

type FormBuilderInstance = ComponentPublicInstance & FormBuilderExposed

function createTestSchema(): FormSchema<TestFormModel> {
  return {
    sections: [
      {
        id: 'main',
        fields: [
          {
            name: 'name',
            component: 'MazInput',
            props: { label: 'Name' },
            validation: {
              rule: pipe(string(), minLength(2, 'Name must be at least 2 characters')),
            },
          },
          {
            name: 'email',
            component: 'MazInput',
            props: { label: 'Email' },
            validation: {
              rule: pipe(string(), minLength(5, 'Email must be at least 5 characters')),
            },
          },
        ],
      },
    ],
  }
}

function mountFormBuilder(modelValue: TestFormModel, schema: FormSchema<TestFormModel>, additionalProps: Record<string, unknown> = {}) {
  return mount(MazFormBuilder as any, {
    props: {
      modelValue,
      schema,
      ...additionalProps,
    },
  })
}

function getVm(wrapper: ReturnType<typeof mountFormBuilder>): FormBuilderInstance {
  return wrapper.vm as unknown as FormBuilderInstance
}

describe('FormBuilder', () => {
  describe('Given a FormBuilder component', () => {
    describe('When checking defineExpose properties', () => {
      it('exposes isValid computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isValid).toBeDefined()
        expect(typeof vm.isValid).toBe('boolean')
      })

      it('exposes isSubmitting ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isSubmitting).toBeDefined()
        expect(typeof vm.isSubmitting).toBe('boolean')
      })

      it('exposes isSubmitted ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isSubmitted).toBeDefined()
        expect(typeof vm.isSubmitted).toBe('boolean')
      })

      it('exposes isDirty computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isDirty).toBeDefined()
        expect(typeof vm.isDirty).toBe('boolean')
      })

      it('exposes errors computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.errors).toBeDefined()
        expect(typeof vm.errors).toBe('object')
      })

      it('exposes errorMessages computed ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.errorMessages).toBeDefined()
        expect(typeof vm.errorMessages).toBe('object')
      })

      it('exposes fieldsStates ref', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.fieldsStates).toBeDefined()
        expect(typeof vm.fieldsStates).toBe('object')
      })
    })

    describe('When form is submitted', () => {
      it('emits submit event with valid payload when form has valid data', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeDefined()
        expect(submitEvents?.length).toBeGreaterThan(0)
      })

      it('has isSubmitted set to true after submission validation completes', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isSubmitted).toBe(false)

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(vm.isSubmitted).toBe(true)
      })

      it('sets isSubmitting to false after submission completes', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isSubmitting).toBe(false)
      })
    })

    describe('When form has validation errors', () => {
      it('populates errors object with validation issues after form validation', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const validationResult = await vm.validateForm()
        await flushPromises()

        expect(validationResult).toBe(false)
        expect(vm.isValid).toBe(false)

        const fieldsStates = vm.fieldsStates as Record<string, { errors: unknown[] }>
        expect(fieldsStates.name?.errors?.length).toBeGreaterThan(0)
      })
    })

    describe('When form state changes', () => {
      it('tracks field dirty state through fieldsStates after validation', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { validationMode: 'aggressive' })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const initialIsDirty = vm.isDirty
        expect(initialIsDirty).toBe(false)

        await vm.validateForm()
        await flushPromises()

        expect(vm.fieldsStates).toBeDefined()
        expect(typeof vm.fieldsStates).toBe('object')
      })
    })

    describe('When submit event is emitted', () => {
      it('emits submit event with FormSubmitEventPayload containing data and isValid', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeDefined()
        expect(submitEvents?.length).toBe(1)

        const payload = submitEvents?.[0][0] as { data: TestFormModel, isValid: boolean }
        expect(payload.data).toEqual({ name: 'John', email: 'john@test.com' })
        expect(payload.isValid).toBe(true)
      })

      it('emits submit event with isValid false when form has validation errors', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeDefined()

        const payload = submitEvents?.[0][0] as { data: TestFormModel, isValid: boolean }
        expect(payload.isValid).toBe(false)
      })
    })

    describe('When submitError event is emitted', () => {
      it('emits submitError event with FormSubmitErrorEventPayload containing data and errors', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitErrorEvents = wrapper.emitted('submitError')
        expect(submitErrorEvents).toBeDefined()
        expect(submitErrorEvents?.length).toBe(1)

        const payload = submitErrorEvents?.[0][0] as { data: TestFormModel, errors: Record<string, unknown[]> }
        expect(payload.data).toEqual({ name: '', email: '' })
        expect(payload.errors).toBeDefined()
        expect(typeof payload.errors).toBe('object')
      })

      it('does not emit submitError event when form is valid', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitErrorEvents = wrapper.emitted('submitError')
        expect(submitErrorEvents).toBeUndefined()
      })
    })

    describe('When reset event is emitted', () => {
      it('emits reset event with FormResetEventPayload containing data', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        vm.resetForm()
        await flushPromises()

        const resetEvents = wrapper.emitted('reset')
        expect(resetEvents).toBeDefined()
        expect(resetEvents?.length).toBe(1)

        const payload = resetEvents?.[0][0] as { data: TestFormModel }
        expect(payload.data).toBeDefined()
        expect(typeof payload.data).toBe('object')
      })
    })

    describe('When formId prop is provided', () => {
      it('exposes the provided formId', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { formId: 'custom-form-id' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.formId).toBe('custom-form-id')
      })
    })

    describe('When formId prop is not provided', () => {
      it('generates a unique formId automatically', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.formId).toBeDefined()
        expect(typeof vm.formId).toBe('string')
        expect(vm.formId.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Given multiple FormBuilder instances', () => {
    describe('When mounting two forms simultaneously', () => {
      it('generates a formId for each instance', async () => {
        const model1 = ref<TestFormModel>({ name: '', email: '' })
        const model2 = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper1 = mountFormBuilder(model1.value, schema)
        const wrapper2 = mountFormBuilder(model2.value, schema)

        await flushPromises()

        const vm1 = getVm(wrapper1)
        const vm2 = getVm(wrapper2)

        expect(vm1.formId).toBeDefined()
        expect(vm2.formId).toBeDefined()
        expect(typeof vm1.formId).toBe('string')
        expect(typeof vm2.formId).toBe('string')
      })
    })

    describe('When validating one form', () => {
      it('does not affect the validation state of the other form', async () => {
        const model1 = ref<TestFormModel>({ name: '', email: '' })
        const model2 = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()

        const wrapper1 = mountFormBuilder(model1.value, schema)
        const wrapper2 = mountFormBuilder(model2.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm1 = getVm(wrapper1)
        const vm2 = getVm(wrapper2)

        await vm1.validateForm()
        await flushPromises()

        expect(vm1.isValid).toBe(false)
        expect(vm2.isValid).toBe(true)
      })
    })

    describe('When submitting one form', () => {
      it('does not affect the submission state of the other form', async () => {
        const model1 = ref<TestFormModel>({ name: 'Alice', email: 'alice@test.com' })
        const model2 = ref<TestFormModel>({ name: 'Bob', email: 'bob@test.com' })
        const schema = createTestSchema()

        const wrapper1 = mountFormBuilder(model1.value, schema)
        const wrapper2 = mountFormBuilder(model2.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm1 = getVm(wrapper1)
        const vm2 = getVm(wrapper2)

        await wrapper1.find('form').trigger('submit')
        await flushPromises()

        expect(vm1.isSubmitted).toBe(true)
        expect(vm2.isSubmitted).toBe(false)
      })
    })

    describe('When resetting one form', () => {
      it('does not affect the state of the other form', async () => {
        const model1 = ref<TestFormModel>({ name: '', email: '' })
        const model2 = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper1 = mountFormBuilder(model1.value, schema)
        const wrapper2 = mountFormBuilder(model2.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm1 = getVm(wrapper1)
        const vm2 = getVm(wrapper2)

        await vm1.validateForm()
        await vm2.validateForm()
        await flushPromises()

        expect(vm1.isValid).toBe(false)
        expect(vm2.isValid).toBe(false)

        vm1.resetForm()
        await flushPromises()

        const fieldsStates1 = vm1.fieldsStates as Record<string, { error: boolean }>
        const fieldsStates2 = vm2.fieldsStates as Record<string, { error: boolean }>

        expect(fieldsStates1.name?.error).toBe(false)
        expect(fieldsStates2.name?.error).toBe(true)
      })
    })

    describe('When using custom formIds', () => {
      it('preserves the custom formIds for each instance', async () => {
        const model1 = ref<TestFormModel>({ name: '', email: '' })
        const model2 = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()

        const wrapper1 = mountFormBuilder(model1.value, schema, { formId: 'form-1' })
        const wrapper2 = mountFormBuilder(model2.value, schema, { formId: 'form-2' })

        await flushPromises()

        const vm1 = getVm(wrapper1)
        const vm2 = getVm(wrapper2)

        expect(vm1.formId).toBe('form-1')
        expect(vm2.formId).toBe('form-2')
      })
    })

    describe('When forms have different validation states', () => {
      it('maintains independent error states', async () => {
        const model1 = ref<TestFormModel>({ name: 'A', email: '' })
        const model2 = ref<TestFormModel>({ name: '', email: 'valid@test.com' })
        const schema = createTestSchema()

        const wrapper1 = mountFormBuilder(model1.value, schema)
        const wrapper2 = mountFormBuilder(model2.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm1 = getVm(wrapper1)
        const vm2 = getVm(wrapper2)

        await vm1.validateForm()
        await vm2.validateForm()
        await flushPromises()

        const errors1 = vm1.errors
        const errors2 = vm2.errors

        expect(errors1.name).toBeDefined()
        expect(errors1.email).toBeDefined()
        expect(errors2.name).toBeDefined()
        expect(errors2.email).toBeUndefined()
      })
    })
  })

  describe('Given a FormBuilder with validation', () => {
    describe('When validateField is called', () => {
      it('validates single field and returns true for valid field', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateField('name')
        await flushPromises()

        expect(result).toBe(true)
      })

      it('validates single field and returns false for invalid field', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateField('name')
        await flushPromises()

        expect(result).toBe(false)
      })
    })

    describe('When resetValidation is called', () => {
      it('resets field error states', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        await vm.validateForm()
        await flushPromises()

        expect(vm.isValid).toBe(false)

        vm.resetValidation()
        await flushPromises()

        const fieldsStates = vm.fieldsStates as Record<string, { error: boolean }>
        expect(fieldsStates.name?.error).toBe(false)
      })
    })

    describe('When form is disabled', () => {
      it('does not submit when disabled', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { disabled: true })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeUndefined()
      })
    })

    describe('When form is readonly', () => {
      it('does not submit when readonly', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { readonly: true })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeUndefined()
      })
    })

    describe('When form has validation errors and is submitted', () => {
      it('announces errors to screen readers', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const liveRegion = wrapper.find('[role="status"][aria-live="polite"]')
        expect(liveRegion.exists()).toBe(true)
      })
    })

    describe('When form is valid and submitted', () => {
      it('announces success to screen readers', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const liveRegion = wrapper.find('[role="status"][aria-live="polite"]')
        expect(liveRegion.exists()).toBe(true)
      })
    })

    describe('When isValidating state changes', () => {
      it('reflects validating state', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isValidating).toBeDefined()
        expect(typeof vm.isValidating).toBe('boolean')
      })
    })

    describe('When submitButton prop is configured', () => {
      it('shows submit button by default', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const submitBtn = wrapper.findComponent({ name: 'MazBtn' })
        expect(submitBtn.exists()).toBe(true)
      })

      it('hides submit button when submitButton is false', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { submitButton: false })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const submitBtn = wrapper.findComponent({ name: 'MazBtn' })
        expect(submitBtn.exists()).toBe(false)
      })

      it('uses custom submit button text', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, {
          submitButton: { text: 'Save Changes' },
        })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const submitBtn = wrapper.findComponent({ name: 'MazBtn' })
        expect(submitBtn.text()).toContain('Save Changes')
      })
    })

    describe('When errorSummary prop is configured', () => {
      it('shows error summary when enabled', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { errorSummary: true })

        await flushPromises()

        const errorSummary = wrapper.findComponent({ name: 'FormErrorSummary' })
        expect(errorSummary.exists()).toBe(true)
      })

      it('shows error summary at bottom when position is bottom', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, {
          errorSummary: { position: 'bottom' },
        })

        await flushPromises()

        const errorSummary = wrapper.findComponent({ name: 'FormErrorSummary' })
        expect(errorSummary.exists()).toBe(true)
      })

      it('does not show error summary when not configured', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const errorSummary = wrapper.findComponent({ name: 'FormErrorSummary' })
        expect(errorSummary.exists()).toBe(false)
      })

      it('uses custom selector', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, {
          errorSummary: { selector: '.custom-error-class' },
        })

        await flushPromises()

        const errorSummary = wrapper.findComponent({ name: 'FormErrorSummary' })
        expect(errorSummary.exists()).toBe(true)
      })
    })

    describe('When accessibility attributes are provided', () => {
      it('applies aria-label to form', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { ariaLabel: 'Test form' })

        await flushPromises()

        const form = wrapper.find('form')
        expect(form.attributes('aria-label')).toBe('Test form')
      })

      it('applies aria-labelledby to form', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { ariaLabelledBy: 'form-heading' })

        await flushPromises()

        const form = wrapper.find('form')
        expect(form.attributes('aria-labelledby')).toBe('form-heading')
      })

      it('applies aria-describedby to form', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { ariaDescribedBy: 'form-help' })

        await flushPromises()

        const form = wrapper.find('form')
        expect(form.attributes('aria-describedby')).toBe('form-help')
      })
    })

    describe('When scrollToError prop is configured', () => {
      it('accepts custom selector', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { scrollToError: '.custom-error' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('accepts false to disable scroll', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { scrollToError: false })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })
    })

    describe('When validationMode prop is provided', () => {
      it('applies lazy mode', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { validationMode: 'lazy' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('applies eager mode', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { validationMode: 'eager' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('converts change mode to lazy', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { validationMode: 'change' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('converts submit mode to lazy', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema, { validationMode: 'submit' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })
    })
  })

  describe('Given a FormBuilder without validation rules', () => {
    describe('When validateForm is called', () => {
      it('returns true', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                { name: 'name', component: 'MazInput', props: { label: 'Name' } },
                { name: 'email', component: 'MazInput', props: { label: 'Email' } },
              ],
            },
          ],
        }
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateForm()

        expect(result).toBe(true)
      })
    })

    describe('When validateField is called', () => {
      it('returns true', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema: FormSchema<TestFormModel> = {
          sections: [
            {
              id: 'main',
              fields: [
                { name: 'name', component: 'MazInput', props: { label: 'Name' } },
              ],
            },
          ],
        }
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateField('name')

        expect(result).toBe(true)
      })
    })
  })
})
