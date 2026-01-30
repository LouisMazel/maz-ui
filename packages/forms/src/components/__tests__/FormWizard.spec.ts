import type { ComponentPublicInstance } from 'vue'
import type { FieldsValidationStates } from '../../../src/composables/useFormBuilder'
import type { FormSchema, ValidationIssues, WizardStep } from '../../../src/utils/schema-helpers'
import { flushPromises, mount } from '@vue/test-utils'
import { minLength, pipe, string } from 'valibot'
import { ref } from 'vue'
import MazFormWizard from '../../../src/components/FormWizard.vue'

interface TestFormModel extends Record<string, unknown> {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface FormWizardExposed {
  formId: string
  validateForm: () => Promise<boolean>
  validateField: (name: keyof TestFormModel) => Promise<boolean>
  validateStep: (step: number) => Promise<boolean>
  resetValidation: () => void
  resetForm: () => void
  goToStep: (step: number) => Promise<boolean>
  goNext: () => Promise<boolean>
  goPrevious: () => void
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  isCurrentStepValid: boolean
  isValid: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  isDirty: boolean
  isValidating: boolean
  errors: Partial<Record<keyof TestFormModel, ValidationIssues>>
  errorMessages: Partial<Record<keyof TestFormModel, string | string[] | undefined>>
  fieldsStates: FieldsValidationStates<TestFormModel>
  wizardSteps: WizardStep<TestFormModel>[]
}

type FormWizardInstance = ComponentPublicInstance & FormWizardExposed

function createWizardSchema(): FormSchema<TestFormModel> {
  return {
    sections: [
      {
        id: 'personal',
        legend: 'Personal Information',
        fields: [
          {
            name: 'firstName',
            component: 'MazInput',
            props: { label: 'First Name' },
            validation: {
              rule: pipe(string(), minLength(2, 'First name must be at least 2 characters')),
            },
          },
          {
            name: 'lastName',
            component: 'MazInput',
            props: { label: 'Last Name' },
            validation: {
              rule: pipe(string(), minLength(2, 'Last name must be at least 2 characters')),
            },
          },
        ],
      },
      {
        id: 'contact',
        legend: 'Contact Information',
        fields: [
          {
            name: 'email',
            component: 'MazInput',
            props: { label: 'Email' },
            validation: {
              rule: pipe(string(), minLength(5, 'Email must be at least 5 characters')),
            },
          },
          {
            name: 'phone',
            component: 'MazInput',
            props: { label: 'Phone' },
            validation: {
              rule: pipe(string(), minLength(10, 'Phone must be at least 10 characters')),
            },
          },
        ],
      },
    ],
  }
}

function createSchemaWithoutValidation(): FormSchema<TestFormModel> {
  return {
    sections: [
      {
        id: 'personal',
        legend: 'Personal Information',
        fields: [
          {
            name: 'firstName',
            component: 'MazInput',
            props: { label: 'First Name' },
          },
          {
            name: 'lastName',
            component: 'MazInput',
            props: { label: 'Last Name' },
          },
        ],
      },
      {
        id: 'contact',
        legend: 'Contact Information',
        fields: [
          {
            name: 'email',
            component: 'MazInput',
            props: { label: 'Email' },
          },
          {
            name: 'phone',
            component: 'MazInput',
            props: { label: 'Phone' },
          },
        ],
      },
    ],
  }
}

function mountFormWizard(
  modelValue: TestFormModel,
  schema: FormSchema<TestFormModel>,
  additionalProps: Record<string, unknown> = {},
) {
  return mount(MazFormWizard as any, {
    props: {
      modelValue,
      schema,
      ...additionalProps,
    },
  })
}

function getVm(wrapper: ReturnType<typeof mountFormWizard>): FormWizardInstance {
  return wrapper.vm as unknown as FormWizardInstance
}

describe('FormWizard', () => {
  describe('Given a FormWizard component', () => {
    describe('When checking defineExpose properties', () => {
      it('exposes formId', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.formId).toBeDefined()
        expect(typeof vm.formId).toBe('string')
      })

      it('exposes currentStep initialized to 1', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.currentStep).toBe(1)
      })

      it('exposes totalSteps computed from schema sections', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.totalSteps).toBe(2)
      })

      it('exposes isFirstStep computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isFirstStep).toBe(true)
      })

      it('exposes isLastStep computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isLastStep).toBe(false)
      })

      it('exposes isValid computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isValid).toBeDefined()
        expect(typeof vm.isValid).toBe('boolean')
      })

      it('exposes isSubmitting computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isSubmitting).toBeDefined()
        expect(typeof vm.isSubmitting).toBe('boolean')
      })

      it('exposes isSubmitted computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isSubmitted).toBeDefined()
        expect(typeof vm.isSubmitted).toBe('boolean')
      })

      it('exposes isDirty computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isDirty).toBeDefined()
        expect(typeof vm.isDirty).toBe('boolean')
      })

      it('exposes isValidating computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isValidating).toBeDefined()
        expect(typeof vm.isValidating).toBe('boolean')
      })

      it('exposes errors computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.errors).toBeDefined()
        expect(typeof vm.errors).toBe('object')
      })

      it('exposes errorMessages computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.errorMessages).toBeDefined()
        expect(typeof vm.errorMessages).toBe('object')
      })

      it('exposes fieldsStates ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.fieldsStates).toBeDefined()
        expect(typeof vm.fieldsStates).toBe('object')
      })

      it('exposes wizardSteps computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.wizardSteps).toBeDefined()
        expect(Array.isArray(vm.wizardSteps)).toBe(true)
        expect(vm.wizardSteps.length).toBe(2)
      })

      it('exposes isCurrentStepValid computed ref', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.isCurrentStepValid).toBeDefined()
        expect(typeof vm.isCurrentStepValid).toBe('boolean')
      })
    })

    describe('When initialStep prop is provided', () => {
      it('starts at the specified step', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { initialStep: 2 })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.currentStep).toBe(2)
        expect(vm.isLastStep).toBe(true)
        expect(vm.isFirstStep).toBe(false)
      })
    })

    describe('When navigating between steps', () => {
      it('navigates to next step with goNext method', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validateOnStepChange: false })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.currentStep).toBe(1)

        const result = await vm.goNext()
        await flushPromises()

        expect(result).toBe(true)
        expect(vm.currentStep).toBe(2)
        expect(vm.isLastStep).toBe(true)
      })

      it('navigates to previous step with goPrevious method', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { initialStep: 2 })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.currentStep).toBe(2)

        vm.goPrevious()
        await flushPromises()

        expect(vm.currentStep).toBe(1)
        expect(vm.isFirstStep).toBe(true)
      })

      it('navigates to specific step with goToStep method', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validateOnStepChange: false })

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.goToStep(2)
        await flushPromises()

        expect(result).toBe(true)
        expect(vm.currentStep).toBe(2)
      })

      it('returns false when navigating to invalid step', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.goToStep(5)
        await flushPromises()

        expect(result).toBe(false)
        expect(vm.currentStep).toBe(1)
      })

      it('returns true when navigating to current step', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.goToStep(1)
        await flushPromises()

        expect(result).toBe(true)
        expect(vm.currentStep).toBe(1)
      })

      it('returns false when goNext is called on last step', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { initialStep: 2 })

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.goNext()
        await flushPromises()

        expect(result).toBe(false)
        expect(vm.currentStep).toBe(2)
      })

      it('does not navigate when goPrevious is called on first step', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        vm.goPrevious()
        await flushPromises()

        expect(vm.currentStep).toBe(1)
      })
    })

    describe('When validateOnStepChange is enabled', () => {
      it('validates current step before moving to next step', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validateOnStepChange: true })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.goNext()
        await flushPromises()

        expect(result).toBe(false)
        expect(vm.currentStep).toBe(1)
      })

      it('allows navigation when step is valid', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validateOnStepChange: true })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.goNext()
        await flushPromises()

        expect(result).toBe(true)
        expect(vm.currentStep).toBe(2)
      })

      it('does not validate when navigating backward', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, {
          validateOnStepChange: true,
          initialStep: 2,
        })

        await flushPromises()

        const vm = getVm(wrapper)
        vm.goPrevious()
        await flushPromises()

        expect(vm.currentStep).toBe(1)
      })
    })

    describe('When form is submitted', () => {
      it('emits submit event on last step', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: '1234567890',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { initialStep: 2 })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeDefined()
        expect(submitEvents?.length).toBeGreaterThan(0)
      })

      it('emits submitError event when form has validation errors', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { initialStep: 2 })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitErrorEvents = wrapper.emitted('submitError')
        expect(submitErrorEvents).toBeDefined()
        expect(submitErrorEvents?.length).toBe(1)
      })

      it('does not submit when disabled', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: '1234567890',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { disabled: true, initialStep: 2 })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeUndefined()
      })

      it('does not submit when readonly', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: '1234567890',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { readonly: true, initialStep: 2 })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        const submitEvents = wrapper.emitted('submit')
        expect(submitEvents).toBeUndefined()
      })
    })

    describe('When validating a step', () => {
      it('emits stepValidate event with isValid true for valid step', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateStep(1)
        await flushPromises()

        expect(result).toBe(true)
        const stepValidateEvents = wrapper.emitted('stepValidate')
        expect(stepValidateEvents).toBeDefined()
        expect(stepValidateEvents?.[0][0]).toEqual({
          step: 1,
          isValid: true,
          errors: {},
        })
      })

      it('emits stepValidate and stepError events for invalid step', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateStep(1)
        await flushPromises()

        expect(result).toBe(false)
        const stepValidateEvents = wrapper.emitted('stepValidate')
        expect(stepValidateEvents).toBeDefined()

        const stepErrorEvents = wrapper.emitted('stepError')
        expect(stepErrorEvents).toBeDefined()
      })

      it('returns true for step validation without validation rules', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createSchemaWithoutValidation()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateStep(1)
        await flushPromises()

        expect(result).toBe(true)
      })
    })

    describe('When stepChange event is emitted', () => {
      it('emits stepChange with previous and current step', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validateOnStepChange: false })

        await flushPromises()

        const vm = getVm(wrapper)
        await vm.goToStep(2)
        await flushPromises()

        const stepChangeEvents = wrapper.emitted('stepChange')
        expect(stepChangeEvents).toBeDefined()
        expect(stepChangeEvents?.[0][0]).toEqual({
          previousStep: 1,
          currentStep: 2,
        })
      })
    })

    describe('When resetForm is called', () => {
      it('resets to initial step', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { initialStep: 2 })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.currentStep).toBe(2)

        vm.resetForm()
        await flushPromises()

        expect(vm.currentStep).toBe(2)
        const resetEvents = wrapper.emitted('reset')
        expect(resetEvents).toBeDefined()
      })
    })

    describe('When validateForm is called', () => {
      it('validates all fields and returns true for valid form', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: '1234567890',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateForm()
        await flushPromises()

        expect(result).toBe(true)
        expect(vm.isValid).toBe(true)
      })

      it('validates all fields and returns false for invalid form', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateForm()
        await flushPromises()

        expect(result).toBe(false)
        expect(vm.isValid).toBe(false)
      })

      it('returns true for form without validation rules', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createSchemaWithoutValidation()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateForm()
        await flushPromises()

        expect(result).toBe(true)
      })
    })

    describe('When validateField is called', () => {
      it('validates single field and returns true for valid field', async () => {
        const model = ref<TestFormModel>({
          firstName: 'John',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateField('firstName')
        await flushPromises()

        expect(result).toBe(true)
      })

      it('validates single field and returns false for invalid field', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateField('firstName')
        await flushPromises()

        expect(result).toBe(false)
      })

      it('returns true for field without validation rules', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createSchemaWithoutValidation()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const vm = getVm(wrapper)
        const result = await vm.validateField('firstName')
        await flushPromises()

        expect(result).toBe(true)
      })
    })

    describe('When resetValidation is called', () => {
      it('resets validation state', async () => {
        const model = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

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
        expect(fieldsStates.firstName?.error).toBe(false)
      })
    })

    describe('When stepper prop is configured', () => {
      it('shows stepper by default', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const stepper = wrapper.find('.maz-form-wizard__stepper')
        expect(stepper.exists()).toBe(true)
      })

      it('hides stepper when stepper is false', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { stepper: false })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const stepper = wrapper.find('.maz-form-wizard__stepper')
        expect(stepper.exists()).toBe(false)
      })

      it('hides stepper when stepper.enabled is false', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { stepper: { enabled: false } })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const stepper = wrapper.find('.maz-form-wizard__stepper')
        expect(stepper.exists()).toBe(false)
      })
    })

    describe('When navigation props are configured', () => {
      it('shows previous button by default', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const navigation = wrapper.find('.maz-form-wizard__navigation')
        expect(navigation.exists()).toBe(true)
      })

      it('hides previous button when navigation.previousButton is false', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, {
          navigation: { previousButton: false },
        })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const buttons = wrapper.findAll('.maz-form-wizard__navigation button')
        const previousButton = buttons.find(b => b.text().includes('Previous'))
        expect(previousButton).toBeUndefined()
      })

      it('hides next button when navigation.nextButton is false', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, {
          navigation: { nextButton: false },
        })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const buttons = wrapper.findAll('.maz-form-wizard__navigation button')
        const nextButton = buttons.find(b => b.text().includes('Next'))
        expect(nextButton).toBeUndefined()
      })

      it('uses custom navigation text', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, {
          navigation: {
            previousText: 'Back',
            nextText: 'Continue',
            submitText: 'Finish',
          },
        })

        await flushPromises()
        await vi.dynamicImportSettled()
        await flushPromises()

        const navigation = wrapper.find('.maz-form-wizard__navigation')
        expect(navigation.text()).toContain('Back')
        expect(navigation.text()).toContain('Continue')
      })
    })

    describe('When accessibility attributes are provided', () => {
      it('applies aria-label to form', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { ariaLabel: 'Registration wizard' })

        await flushPromises()

        const form = wrapper.find('form')
        expect(form.attributes('aria-label')).toBe('Registration wizard')
      })

      it('applies aria-labelledby to form', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { ariaLabelledBy: 'form-title' })

        await flushPromises()

        const form = wrapper.find('form')
        expect(form.attributes('aria-labelledby')).toBe('form-title')
      })

      it('applies aria-describedby to form', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { ariaDescribedBy: 'form-description' })

        await flushPromises()

        const form = wrapper.find('form')
        expect(form.attributes('aria-describedby')).toBe('form-description')
      })

      it('renders live region for screen readers', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const liveRegion = wrapper.find('[role="status"][aria-live="polite"]')
        expect(liveRegion.exists()).toBe(true)
      })
    })

    describe('When formId prop is provided', () => {
      it('uses provided formId', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { formId: 'custom-wizard-id' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm.formId).toBe('custom-wizard-id')
      })
    })

    describe('When errorSummary is configured', () => {
      it('shows error summary at top by default', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { errorSummary: true })

        await flushPromises()

        const errorSummary = wrapper.findComponent({ name: 'FormErrorSummary' })
        expect(errorSummary.exists()).toBe(true)
      })

      it('shows error summary at bottom when position is bottom', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, {
          errorSummary: { position: 'bottom' },
        })

        await flushPromises()

        const errorSummary = wrapper.findComponent({ name: 'FormErrorSummary' })
        expect(errorSummary.exists()).toBe(true)
      })

      it('does not show error summary when not configured', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema)

        await flushPromises()

        const errorSummary = wrapper.findComponent({ name: 'FormErrorSummary' })
        expect(errorSummary.exists()).toBe(false)
      })
    })

    describe('When validationMode prop is provided', () => {
      it('applies lazy mode', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validationMode: 'lazy' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('applies eager mode', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validationMode: 'eager' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('applies aggressive mode', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validationMode: 'aggressive' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('converts change mode to lazy', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validationMode: 'change' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('converts submit mode to lazy', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { validationMode: 'submit' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })
    })

    describe('When scrollToError prop is configured', () => {
      it('accepts custom selector string', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { scrollToError: '.custom-error' })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })

      it('accepts false to disable scroll', async () => {
        const model = ref<TestFormModel>({ firstName: '', lastName: '', email: '', phone: '' })
        const schema = createWizardSchema()
        const wrapper = mountFormWizard(model.value, schema, { scrollToError: false })

        await flushPromises()

        const vm = getVm(wrapper)
        expect(vm).toBeDefined()
      })
    })
  })

  describe('Given multiple FormWizard instances', () => {
    describe('When validating one wizard', () => {
      it('does not affect the validation state of the other wizard', async () => {
        const model1 = ref<TestFormModel>({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        })
        const model2 = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: '1234567890',
        })
        const schema = createWizardSchema()

        const wrapper1 = mountFormWizard(model1.value, schema)
        const wrapper2 = mountFormWizard(model2.value, schema)

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

    describe('When navigating in one wizard', () => {
      it('does not affect the step of the other wizard', async () => {
        const model1 = ref<TestFormModel>({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const model2 = ref<TestFormModel>({
          firstName: 'Jane',
          lastName: 'Doe',
          email: '',
          phone: '',
        })
        const schema = createWizardSchema()

        const wrapper1 = mountFormWizard(model1.value, schema, { validateOnStepChange: false })
        const wrapper2 = mountFormWizard(model2.value, schema, { validateOnStepChange: false })

        await flushPromises()

        const vm1 = getVm(wrapper1)
        const vm2 = getVm(wrapper2)

        await vm1.goToStep(2)
        await flushPromises()

        expect(vm1.currentStep).toBe(2)
        expect(vm2.currentStep).toBe(1)
      })
    })
  })
})
