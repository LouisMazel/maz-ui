import MazBtnGroup from '@components/MazBtnGroup.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const items = [
  { text: 'Day', value: 'day' },
  { text: 'Week', value: 'week' },
  { text: 'Month', value: 'month' },
]

async function mountGroup(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazBtnGroup, { props: { items, ...props }, attachTo: document.body })

  await vi.dynamicImportSettled()
  await nextTick()

  return wrapper
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given a MazBtnGroup', () => {
  describe('when it has no v-model', () => {
    it('then it is a plain group without state nor indicator', async () => {
      const wrapper = await mountGroup()

      expect(wrapper.attributes('role')).toBe('group')
      expect(wrapper.find('.m-button-group__indicator').exists()).toBe(false)
      expect(wrapper.findAll('button').some(button => button.attributes('aria-pressed') !== undefined)).toBe(false)
    })

    it('then it does not emit when a button is clicked', async () => {
      const wrapper = await mountGroup()

      await wrapper.findAll('button')[0].trigger('click')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when it has a v-model', () => {
    it('then the active button is pressed and highlighted', async () => {
      const wrapper = await mountGroup({ modelValue: 'week' })
      const buttons = wrapper.findAll('button')

      expect(buttons.map(button => button.attributes('aria-pressed'))).toEqual(['false', 'true', 'false'])
      expect(buttons[1].classes()).toContain('--active')
    })

    it('then a click emits the value of the item', async () => {
      const wrapper = await mountGroup({ modelValue: 'week' })

      await wrapper.findAll('button')[2].trigger('click')

      expect(wrapper.emitted('update:model-value')).toEqual([['month']])
    })

    it('then the index is the value of an item without value', async () => {
      const wrapper = await mountGroup({ items: [{ text: 'A' }, { text: 'B' }], modelValue: 1 })

      await wrapper.findAll('button')[0].trigger('click')

      expect(wrapper.findAll('button')[1].attributes('aria-pressed')).toBe('true')
      expect(wrapper.emitted('update:model-value')).toEqual([[0]])
    })

    it('then the onClick of the item is still called once', async () => {
      const onClick = vi.fn()
      const wrapper = await mountGroup({ items: [{ text: 'A', onClick }], modelValue: 0 })

      await wrapper.find('button').trigger('click')

      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the indicator is enabled', () => {
    it('then a pill follows the active button', async () => {
      const wrapper = await mountGroup({ modelValue: 'day', indicator: true })

      expect(wrapper.find('.m-button-group__indicator').exists()).toBe(true)
      expect(wrapper.find('.m-button-group__indicator').attributes('aria-hidden')).toBe('true')
    })

    it('then there is no pill without a value', async () => {
      const wrapper = await mountGroup({ indicator: true })

      expect(wrapper.find('.m-button-group__indicator').exists()).toBe(false)
    })
  })

  describe('when it is a toolbar', () => {
    it('then it has the toolbar role and one button in the tab sequence', async () => {
      const wrapper = await mountGroup({ toolbar: true })

      expect(wrapper.attributes('role')).toBe('toolbar')
      expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
      expect(wrapper.findAll('button').map(button => button.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
    })

    it('then the arrows, Home and End move the focus', async () => {
      const wrapper = await mountGroup({ toolbar: true })
      const buttons = () => wrapper.findAll('button')

      await buttons()[0].trigger('keydown', { key: 'ArrowRight' })
      expect(document.activeElement).toBe(buttons()[1].element)

      await buttons()[1].trigger('keydown', { key: 'End' })
      expect(document.activeElement).toBe(buttons()[2].element)

      await buttons()[2].trigger('keydown', { key: 'Home' })
      expect(document.activeElement).toBe(buttons()[0].element)
      expect(buttons().map(button => button.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
    })

    it('then the vertical arrows are used in a column', async () => {
      const wrapper = await mountGroup({ toolbar: true, orientation: 'col' })

      await wrapper.findAll('button')[0].trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.attributes('aria-orientation')).toBe('vertical')
      expect(document.activeElement).toBe(wrapper.findAll('button')[1].element)
    })
  })

  describe('when it is not a toolbar', () => {
    it('then the arrows do nothing', async () => {
      const wrapper = await mountGroup()
      const first = wrapper.findAll('button')[0]

      first.element.focus()
      await first.trigger('keydown', { key: 'ArrowRight' })

      expect(document.activeElement).toBe(first.element)
    })
  })
})
