import MazDrawnIcon from '@components/MazDrawnIcon.vue'
import MazStepper from '@components/MazStepper.vue'
import { mount } from '@vue/test-utils'

const steps = [
  { title: 'One', content: 'Content 1' },
  { title: 'Two', content: 'Content 2' },
  { title: 'Three', content: 'Content 3' },
]

function mountStepper(props: Record<string, unknown> = {}) {
  return mount(MazStepper, { props: { steps, modelValue: 1, ...props } })
}

afterEach(async () => {
  await vi.dynamicImportSettled()
})

describe('given a stepper', () => {
  describe('when a step is validated', () => {
    it('then its check is a drawn icon', () => {
      const wrapper = mountStepper({ steps: [{ ...steps[0], success: true }, steps[1], steps[2]] })

      const icons = wrapper.findAllComponents(MazDrawnIcon)

      expect(icons).toHaveLength(1)
      expect(icons[0].props('name')).toBe('check-circle')
    })
  })

  describe('when a step has an error', () => {
    it('then its icon is a drawn exclamation', () => {
      const wrapper = mountStepper({ steps: [{ ...steps[0], error: true }, steps[1], steps[2]] })

      expect(wrapper.findComponent(MazDrawnIcon).props('name')).toBe('exclamation-circle')
    })
  })

  describe('when a step has a warning', () => {
    it('then it keeps its triangle icon', () => {
      const wrapper = mountStepper({ steps: [{ ...steps[0], warning: true }, steps[1], steps[2]] })

      expect(wrapper.findComponent(MazDrawnIcon).exists()).toBe(false)
      expect(wrapper.find('.m-stepper__header').classes()).toContain('--warning')
    })
  })

  describe('when the stepper is on the second step', () => {
    it('then the line under the first step is filled and the next one is not', () => {
      const wrapper = mountStepper({ modelValue: 2 })
      const contents = wrapper.findAll('.m-stepper__content')

      expect(contents[0].classes()).toContain('--filled')
      expect(contents[1].classes()).not.toContain('--filled')
      expect(contents[2].classes()).not.toContain('--filled')
    })
  })

  describe('when the stepper goes forward', () => {
    it('then the contents wait on the side of their step and the open one is shown', async () => {
      const wrapper = mountStepper({ modelValue: 2 })
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()
      const wrappers = wrapper.findAll('.m-stepper__content__wrapper')

      expect(wrappers[0].classes()).toContain('--before')
      expect(wrappers[1].classes()).toContain('--open')
      expect(wrappers[2].classes()).toContain('--after')
      expect(wrappers[1].classes()).toContain('--forward')

      await wrapper.setProps({ modelValue: 1 })
      await vi.dynamicImportSettled()

      expect(wrapper.findAll('.m-stepper__content__wrapper')[1].classes()).toContain('--backward')
    })
  })

  describe('when animated is false', () => {
    it('then the stepper does not get the animated class and the check draws instantly', () => {
      const wrapper = mountStepper({ animated: false, steps: [{ ...steps[0], success: true }, steps[1], steps[2]] })

      expect(wrapper.classes()).not.toContain('--animated')
      expect(wrapper.findComponent(MazDrawnIcon).props('duration')).toBe('0ms')
    })
  })

  describe('when a header is displayed', () => {
    it('then it has the focus ring of the theme', () => {
      const wrapper = mountStepper()

      expect(wrapper.find('.m-stepper__header').classes()).toContain('maz:focus-ring')
    })
  })
})
