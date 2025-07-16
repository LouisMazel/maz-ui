import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import MazStepper from '@components/MazStepper.vue'
import { shallowMount } from '@vue/test-utils'

describe('components/MazStepper.vue', () => {
  expect(MazStepper).toBeTruthy()

  let wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }>

  beforeEach(() => {
    wrapper = shallowMount(MazStepper, {
      props: {
        modelValue: 1,
        steps: [{ success: true, disabled: true }],
      },
      slots: {
        'title-1': 'Step 1',
        'content-1': 'Content 1',
        'subtitle-2': 'subtitle 2',
        'content-2': 'Content 2',
        'title-3': 'Step 3',
        'content-3': 'Content 3',
      },
    })
  })

  it('should have the current step according with the model', () => {
    expect(wrapper.vm.stepCount).toBe(3)
    expect(wrapper.vm.localModelValue).toBe(1)
    expect(wrapper.vm.currentStep).toBe(1)

    wrapper.vm.selectStep(2)
    expect(wrapper.vm.localModelValue).toBe(2)
    expect(wrapper.emitted()['update:model-value']).toStrictEqual([[2]])
  })

  it('should returns if title exists', () => {
    const title1 = wrapper.vm.hasDataForStep('title', 1)
    expect(title1).toBeTruthy()
    const title2 = wrapper.vm.hasDataForStep('title', 2)
    expect(title2).toBeFalsy()
  })

  it('should returns if subtitle exists', () => {
    const subtitle1 = wrapper.vm.hasDataForStep('subtitle', 1)
    expect(subtitle1).toBeFalsy()
    const subtitle2 = wrapper.vm.hasDataForStep('subtitle', 2)
    expect(subtitle2).toBeTruthy()
  })

  it('should returns if step is validated', () => {
    const validated1 = wrapper.vm.isStepSuccess(1)
    expect(validated1).toBeTruthy()
    const validated2 = wrapper.vm.isStepSuccess(2)
    expect(validated2).toBeFalsy()
  })

  it('should returns if step is disabled', () => {
    const disabled1 = wrapper.vm.isStepDisabled(1)
    expect(disabled1).toBeTruthy()
    const disabled2 = wrapper.vm.isStepDisabled(2)
    expect(disabled2).toBeFalsy()
  })

  it('should returns if step is the last', () => {
    const isLast1 = wrapper.vm.isLastStep(1)
    expect(isLast1).toBeFalsy()
    const isLast2 = wrapper.vm.isLastStep(3)
    expect(isLast2).toBeTruthy()
  })

  it('should open step if click on it', async () => {
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted()['update:model-value']).toStrictEqual([[3]])
  })
})
