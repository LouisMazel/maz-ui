import type { ComponentPublicInstance } from 'vue'
import type { FieldsValidationStates } from '../../../src/components/FormBuilder.vue'
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

    describe('When submit-error event is emitted', () => {
      it('emits submit-error event with FormSubmitErrorEventPayload containing data and errors', async () => {
        const model = ref<TestFormModel>({ name: '', email: '' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitErrorEvents = wrapper.emitted('submit-error')
        expect(submitErrorEvents).toBeDefined()
        expect(submitErrorEvents?.length).toBe(1)

        const payload = submitErrorEvents?.[0][0] as { data: TestFormModel, errors: Record<string, unknown[]> }
        expect(payload.data).toEqual({ name: '', email: '' })
        expect(payload.errors).toBeDefined()
        expect(typeof payload.errors).toBe('object')
      })

      it('does not emit submit-error event when form is valid', async () => {
        const model = ref<TestFormModel>({ name: 'John', email: 'john@test.com' })
        const schema = createTestSchema()
        const wrapper = mountFormBuilder(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitErrorEvents = wrapper.emitted('submit-error')
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
  })
})
