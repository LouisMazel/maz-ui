import type { FormBuilderState } from '../../../src/composables/useFormBuilder'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, provide, ref } from 'vue'
import { useFormBuilder } from '../../../src/composables/useFormBuilder'
import { FORM_BUILDER_STATE_KEY } from '../../../src/utils/constants'

interface TestFormModel extends Record<string, unknown> {
  name: string
  email: string
}

function createMockFormBuilderState(): FormBuilderState<TestFormModel> {
  return {
    isValid: computed(() => true),
    isSubmitting: ref(false),
    isSubmitted: ref(false),
    isDirty: computed(() => false),
    errors: computed(() => ({})),
    errorMessages: computed(() => ({})),
    fieldsStates: ref({}),
    handleFieldBlur: () => {},
    emitFieldChange: () => {},
    emitFieldFocus: () => {},
    emitFieldBlur: () => {},
    emitFieldValidate: () => {},
  }
}

describe('useFormBuilder', () => {
  describe('Given a component using useFormBuilder composable', () => {
    describe('When the composable is used outside FormBuilder context', () => {
      it('returns undefined form state', () => {
        const TestComponent = defineComponent({
          setup() {
            const formState = useFormBuilder()
            return { formState }
          },
          render() {
            return h('div')
          },
        })

        const wrapper = mount(TestComponent)
        expect(wrapper.vm.formState).toBeUndefined()
      })
    })

    describe('When the composable is used inside FormBuilder context', () => {
      it('returns the form state with all expected properties', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div', { class: 'child' })
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState).toBeDefined()
        expect(capturedFormState?.isValid).toBeDefined()
        expect(capturedFormState?.isSubmitting).toBeDefined()
        expect(capturedFormState?.isSubmitted).toBeDefined()
        expect(capturedFormState?.isDirty).toBeDefined()
        expect(capturedFormState?.errors).toBeDefined()
        expect(capturedFormState?.errorMessages).toBeDefined()
        expect(capturedFormState?.fieldsStates).toBeDefined()
      })

      it('provides reactive isValid state', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.isValid?.value).toBe(true)
      })

      it('provides reactive isSubmitting state', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.isSubmitting?.value).toBe(false)
      })

      it('provides reactive isSubmitted state', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.isSubmitted?.value).toBe(false)
      })

      it('provides reactive isDirty state', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.isDirty?.value).toBe(false)
      })

      it('provides reactive errors state', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.errors?.value).toBeDefined()
        expect(typeof capturedFormState?.errors?.value).toBe('object')
      })

      it('provides reactive errorMessages state', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.errorMessages?.value).toBeDefined()
        expect(typeof capturedFormState?.errorMessages?.value).toBe('object')
      })

      it('provides reactive fieldsStates', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.fieldsStates?.value).toBeDefined()
        expect(typeof capturedFormState?.fieldsStates?.value).toBe('object')
      })

      it('provides handleFieldBlur function', () => {
        let capturedFormState: FormBuilderState<TestFormModel> | undefined

        const ChildComponent = defineComponent({
          setup() {
            capturedFormState = useFormBuilder<TestFormModel>()
            return {}
          },
          render() {
            return h('div')
          },
        })

        const ParentComponent = defineComponent({
          setup() {
            const mockState = createMockFormBuilderState()
            provide(FORM_BUILDER_STATE_KEY, computed(() => mockState))
            return {}
          },
          render() {
            return h('div', {}, [h(ChildComponent)])
          },
        })

        mount(ParentComponent)

        expect(capturedFormState?.handleFieldBlur).toBeDefined()
        expect(typeof capturedFormState?.handleFieldBlur).toBe('function')
      })
    })
  })
})
