import MazSegmented from '@components/MazSegmented.vue'
import { mount } from '@vue/test-utils'

const options = [
  { label: 'Bold', value: 'bold' },
  { label: 'Italic', value: 'italic' },
  { label: 'Underline', value: 'underline', disabled: true },
  { label: 'Strike', value: 'strike' },
]

function mountToggleGroup(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazSegmented, {
    props: {
      'options': options,
      'modelValue': ['italic'],
      'multiple': true,
      'ariaLabel': 'Text style',
      'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
    attachTo: document.body,
  })
  return wrapper
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given a MazSegmented with multiple', () => {
  describe('when it is rendered', () => {
    it('then it is a group of toggle buttons with aria-pressed', () => {
      const wrapper = mountToggleGroup()
      const buttons = wrapper.findAll('button')

      expect(wrapper.attributes('role')).toBe('group')
      expect(wrapper.find('[role="radio"]').exists()).toBe(false)
      expect(buttons.map(button => button.attributes('aria-pressed'))).toEqual(['false', 'true', 'false', 'false'])
      expect(buttons[1].classes()).toContain('--selected')
      expect(buttons[1].classes()).toContain('maz:bg-container')
    })

    it('then there is no sliding pill', () => {
      const wrapper = mountToggleGroup()

      expect(wrapper.find('.m-segmented__indicator').exists()).toBe(false)
    })

    it('then a single segment is in the tab sequence', () => {
      const wrapper = mountToggleGroup()

      expect(wrapper.findAll('button').map(button => button.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1'])
    })
  })

  describe('when segments are clicked', () => {
    it('then each one is toggled and the values keep the order of the options', async () => {
      const wrapper = mountToggleGroup()

      await wrapper.findAll('button')[3].trigger('click')
      await wrapper.findAll('button')[0].trigger('click')
      await wrapper.findAll('button')[1].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toEqual([
        [['italic', 'strike']],
        [['bold', 'italic', 'strike']],
        [['bold', 'strike']],
      ])
      expect(wrapper.emitted('change')?.at(-1)).toEqual([['bold', 'strike']])
    })

    it('then a disabled segment is ignored', async () => {
      const wrapper = mountToggleGroup()

      await wrapper.findAll('button')[2].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when the arrow keys are pressed', () => {
    it('then the focus moves without toggling and skips the disabled segment', async () => {
      const wrapper = mountToggleGroup()

      await wrapper.findAll('button')[1].trigger('keydown', { key: 'ArrowRight' })

      expect(document.activeElement).toBe(wrapper.findAll('button')[3].element)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.findAll('button').map(button => button.attributes('tabindex'))).toEqual(['-1', '-1', '-1', '0'])
    })
  })

  describe('when there is no value', () => {
    it('then nothing is pressed', () => {
      const wrapper = mountToggleGroup({ modelValue: undefined })

      expect(wrapper.findAll('button').every(button => button.attributes('aria-pressed') === 'false')).toBe(true)
    })
  })

  describe('when a color is given', () => {
    it('then the selected segment is filled with it', () => {
      const wrapper = mountToggleGroup({ color: 'primary' })

      expect(wrapper.findAll('button')[1].attributes('style')).toContain('background-color: var(--maz-primary)')
    })
  })
})

describe('given a MazSegmented with the stretch option', () => {
  describe('when it is rendered', () => {
    it('then it renders the indicator', () => {
      const wrapper = mount(MazSegmented, { props: { options, modelValue: 'bold', stretch: true, ariaLabel: 'Style' } })

      expect(wrapper.find('.m-segmented__indicator').exists()).toBe(true)
    })
  })
})
