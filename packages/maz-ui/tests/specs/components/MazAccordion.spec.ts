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

  it('links each header to its own panel via aria-controls', async () => {
    const wrapper = mount(MazAccordion, {
      slots: {
        'title-1': 'Step 1 Title',
        'content-1': 'Step 1 Content',
      },
    })

    await wrapper.vm.$nextTick()

    const button = wrapper.find('button')
    const controls = button.attributes('aria-controls')

    expect(controls).toBeTruthy()
    expect(controls).not.toBe(button.attributes('id'))
    expect(wrapper.find(`#${controls}`).exists()).toBe(true)
    expect(button.attributes('aria-expanded')).toBe('false')
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
    expect(wrapper.emitted('update:model-value')).toEqual([
      [1],
    ])

    await steps[1].find('button').trigger('click')
    expect(wrapper.emitted('update:model-value')).toEqual([
      [1],
      [2],
    ])
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
    expect(wrapper.emitted('update:model-value')).toEqual([
      [1],
    ])

    await step.find('button').trigger('click')
    expect(wrapper.emitted('update:model-value')).toEqual([
      [1],
      [0],
    ])
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

describe('given MazAccordion with the lazy prop', () => {
  describe('when a panel is opened then closed', () => {
    it('then its content is rendered at the first opening only and kept', async () => {
      const wrapper = mount(MazAccordion, {
        props: { lazy: true },
        slots: {
          'title-1': 'Title 1',
          'content-1': '<p class="lazy-content">Content 1</p>',
        },
      })

      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()
      const button = wrapper.find('button')

      expect(wrapper.find('.lazy-content').exists()).toBe(false)
      expect(wrapper.find(`#${button.attributes('aria-controls')}`).exists()).toBe(true)

      await button.trigger('click')

      expect(wrapper.find('.lazy-content').exists()).toBe(true)

      await button.trigger('click')

      expect(wrapper.find('.lazy-content').exists()).toBe(true)
    })
  })

  describe('when lazy is not set', () => {
    it('then the content of a closed panel is rendered', async () => {
      const wrapper = mount(MazAccordion, {
        slots: {
          'title-1': 'Title 1',
          'content-1': '<p class="lazy-content">Content 1</p>',
        },
      })

      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.lazy-content').exists()).toBe(true)
    })
  })
})
