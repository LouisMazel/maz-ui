import MazAccordion from '@components/MazAccordion.vue'
import MazCardSpotlight from '@components/MazCardSpotlight.vue'
import { mount } from '@vue/test-utils'

vi.mock('@maz-ui/icons', () => ({
  MazPlus: {
    template: '<div>+</div>',
  },
}))

describe('mazAccordion', () => {
  it('renders with default props', async () => {
    const wrapper = mount(MazAccordion)

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-accordion')
    expect(wrapper.findAllComponents(MazCardSpotlight)).toHaveLength(0)
  })

  it('renders the correct number of steps based on provided slots', async () => {
    const wrapper = mount(MazAccordion, {
      slots: {
        'title-1': 'Step 1 Title',
        'title-2': 'Step 2 Title',
      },
    })

    await wrapper.vm.$nextTick()

    const steps = wrapper.findAllComponents(MazCardSpotlight)
    expect(steps).toHaveLength(2)
    expect(steps[0].text()).toContain('Step 1 Title')
    expect(steps[1].text()).toContain('Step 2 Title')
  })

  it('emits the correct step when a step is selected', async () => {
    const wrapper = mount(MazAccordion, {
      slots: {
        'title-1': 'Step 1 Title',
        'title-2': 'Step 2 Title',
      },
    })

    await wrapper.vm.$nextTick()

    const steps = wrapper.findAllComponents(MazCardSpotlight)

    await steps[0].find('button').trigger('click')
    expect(wrapper.emitted('update:model-value')).toEqual([[1]])

    await steps[1].find('button').trigger('click')
    expect(wrapper.emitted('update:model-value')).toEqual([[1], [2]])
  })

  it('closes the step when the same step is selected again', async () => {
    const wrapper = mount(MazAccordion, {
      slots: {
        'title-1': 'Step 1 Title',
      },
    })

    await wrapper.vm.$nextTick()

    const step = wrapper.findComponent(MazCardSpotlight)

    await step.find('button').trigger('click')
    expect(wrapper.emitted('update:model-value')).toEqual([[1]])

    await step.find('button').trigger('click')
    expect(wrapper.emitted('update:model-value')).toEqual([[1], [0]])
  })

  it('updates the icon rotation class when a step is selected', async () => {
    const wrapper = mount(MazAccordion, {
      slots: {
        'title-1': 'Step 1 Title',
      },
    })

    await vi.dynamicImportSettled()

    await wrapper.vm.$nextTick()
    const step = wrapper.findComponent(MazCardSpotlight)

    await step.find('button').trigger('click')
    expect(step.find('.header-icon').classes()).toContain('--rotate')

    await step.find('button').trigger('click')
    expect(step.find('.header-icon').classes()).not.toContain('--rotate')
  })
})
