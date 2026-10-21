import type { VueWrapper } from '@vue/test-utils'
import MazStepper from '@components/MazStepper.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const steps = [{ title: 'Account' }, { title: 'Profile' }, { title: 'Done' }]

const mountedWrappers: VueWrapper[] = []

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
})

async function mountStepper(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazStepper, {
    props: { steps, modelValue: 2, ...props },
    slots: { 'content-1': 'First', 'content-2': 'Second', 'content-3': 'Third' },
  })
  mountedWrappers.push(wrapper)
  await vi.dynamicImportSettled()
  await nextTick()
  return wrapper
}

describe('given a MazStepper', () => {
  describe('when it is rendered', () => {
    it('then only the current step header is the current step and is expanded', async () => {
      const wrapper = await mountStepper()
      const headers = wrapper.findAll('.m-stepper__header')

      expect(headers.map(header => header.attributes('aria-current'))).toEqual([undefined, 'step', undefined])
      expect(headers.map(header => header.attributes('aria-expanded'))).toEqual(['false', 'true', 'false'])
    })

    it('then each header controls its content, which is labelled by the header', async () => {
      const wrapper = await mountStepper()
      const header = wrapper.findAll('.m-stepper__header')[1]
      const content = wrapper.find(`#${header.attributes('aria-controls')}`)

      expect(content.classes()).toContain('m-stepper__content')
      expect(content.find(`[aria-labelledby="${header.attributes('id')}"]`).exists()).toBe(true)
    })
  })

  describe('when all the steps are opened', () => {
    it('then every header is expanded', async () => {
      const wrapper = await mountStepper({ allStepsOpened: true })

      expect(wrapper.findAll('.m-stepper__header').map(header => header.attributes('aria-expanded'))).toEqual(['true', 'true', 'true'])
    })
  })

  describe('when another step is selected', () => {
    it('then the current step moves to it', async () => {
      const wrapper = await mountStepper({ modelValue: undefined })

      await wrapper.findAll('.m-stepper__header')[2].trigger('click')

      expect(wrapper.findAll('.m-stepper__header').map(header => header.attributes('aria-current'))).toEqual([undefined, undefined, 'step'])
    })
  })

  describe('when two steppers are in the same app', () => {
    it('then their ids are unique', () => {
      const wrapper = mount({
        components: { MazStepper },
        setup: () => ({ steps }),
        template: '<div><MazStepper :steps="steps"><template #content-1>A</template></MazStepper><MazStepper :steps="steps"><template #content-1>B</template></MazStepper></div>',
      })
      mountedWrappers.push(wrapper)

      const [first, second] = wrapper.findAllComponents(MazStepper)

      expect(first.find('.m-stepper__header').attributes('id')).not.toBe(second.find('.m-stepper__header').attributes('id'))
    })
  })

  describe('when a step has no title', () => {
    it('then its content is not labelled by a missing header', async () => {
      const wrapper = await mountStepper({ steps: [{ title: 'Account' }, {}] })
      const labelledContents = wrapper.findAll('.m-stepper__content [aria-labelledby]')

      expect(labelledContents).toHaveLength(1)
    })
  })

  describe('when a step icon is a string', () => {
    it('then it is passed to the icon prop of MazIcon', async () => {
      const icon = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>'
      const wrapper = await mountStepper({ steps: [{ title: 'Account', icon }] })

      expect(wrapper.findComponent({ name: 'MazIcon' }).props('icon')).toBe(icon)
    })
  })
})
