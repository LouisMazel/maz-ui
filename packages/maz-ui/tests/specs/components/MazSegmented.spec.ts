import MazSegmented from '@components/MazSegmented.vue'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

function mountSegmented(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazSegmented, {
    props: {
      'options': options,
      'modelValue': 'week',
      'ariaLabel': 'Period',
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

describe('given MazSegmented component', () => {
  describe('when rendered with options and a value', () => {
    it('then it renders an accessible radio group with the selected segment', () => {
      const wrapper = mountSegmented()
      const segments = wrapper.findAll('[role="radio"]')

      expect(wrapper.attributes('role')).toBe('radiogroup')
      expect(wrapper.attributes('aria-label')).toBe('Period')
      expect(segments.map(segment => segment.text())).toEqual(['Day', 'Week', 'Month'])
      expect(segments.map(segment => segment.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
      expect(segments.map(segment => segment.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
      expect(segments[1].classes()).toContain('--selected')
    })
  })

  describe('when a segment is clicked', () => {
    it('then it emits the new value once', async () => {
      const wrapper = mountSegmented()

      await wrapper.findAll('[role="radio"]')[2].trigger('click')
      await wrapper.findAll('[role="radio"]')[2].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toEqual([
        ['month'],
      ])
      expect(wrapper.emitted('change')).toEqual([
        ['month'],
      ])
    })
  })

  describe('when the arrow keys are pressed', () => {
    it('then the selection moves to the next enabled segment and wraps around', async () => {
      const wrapper = mountSegmented({
        options: [
          options[0],
          { ...options[1], disabled: true },
          options[2],
        ],
        modelValue: 'day',
      })

      await wrapper.findAll('[role="radio"]')[0].trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])
      expect(document.activeElement).toBe(wrapper.findAll('[role="radio"]')[2].element)

      await wrapper.findAll('[role="radio"]')[2].trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['day'])
    })
  })

  describe('when Home, End and ArrowLeft are pressed', () => {
    it('then the selection goes to the first, the last and the previous segment', async () => {
      const wrapper = mountSegmented()
      const segments = () => wrapper.findAll('[role="radio"]')

      await segments()[1].trigger('keydown', { key: 'End' })
      await segments()[2].trigger('keydown', { key: 'ArrowLeft' })
      await segments()[1].trigger('keydown', { key: 'Home' })

      expect(wrapper.emitted('update:modelValue')).toEqual([
        ['month'],
        ['week'],
        ['day'],
      ])
    })
  })

  describe('when another key is pressed', () => {
    it('then nothing changes', async () => {
      const wrapper = mountSegmented()

      await wrapper.findAll('[role="radio"]')[1].trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when the control is disabled', () => {
    it('then every segment is disabled and clicks are ignored', async () => {
      const wrapper = mountSegmented({ disabled: true })

      await wrapper.findAll('[role="radio"]')[0].trigger('click')

      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.findAll('[role="radio"]').every(segment => segment.attributes('disabled') !== undefined)).toBe(true)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when no value is selected', () => {
    it('then the first enabled segment is in the tab sequence and the indicator is hidden', async () => {
      const wrapper = mountSegmented({
        modelValue: undefined,
        options: [
          { ...options[0], disabled: true },
          options[1],
        ],
      })
      await nextTick()

      expect(wrapper.findAll('[role="radio"]').map(segment => segment.attributes('tabindex'))).toEqual(['-1', '0'])
      expect(wrapper.find('.m-segmented__indicator').attributes('style')).toContain('opacity: 0')
    })
  })

  describe('when rendered with a color, block and rounded-size', () => {
    it('then it colors the indicator and takes the full width', async () => {
      const wrapper = mountSegmented({ color: 'primary', block: true, roundedSize: 'full' })
      await nextTick()

      expect(wrapper.classes()).toContain('maz:w-full')
      expect(wrapper.classes()).toContain('maz:rounded-full')
      expect(wrapper.find('.m-segmented__indicator').attributes('style')).toContain('background-color: var(--maz-primary)')
      expect(wrapper.findAll('[role="radio"]')[1].attributes('style')).toContain('color: var(--maz-primary-foreground)')
    })
  })

  describe('when rendered with a size', () => {
    it('then its segments leave room for the padding of the control to match the MazBtn height', () => {
      const wrapper = mountSegmented({ size: 'sm' })

      expect(wrapper.classes()).toContain('maz:p-0.5')
      expect(wrapper.find('[role="radio"]').classes()).toContain('maz:h-9')
    })
  })

  describe('when an option only has an icon', () => {
    it('then it renders the icon with the accessible name of the option', async () => {
      const Icon = defineComponent({
        render: () => h('svg', { class: 'test-icon' }),
      })
      const wrapper = mountSegmented({
        options: [
          { value: 'grid', icon: Icon, ariaLabel: 'Grid' },
        ],
        modelValue: 'grid',
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('[role="radio"]').attributes('aria-label')).toBe('Grid')
      expect(wrapper.find('.test-icon').exists()).toBe(true)
    })

    it('then it sizes the icon like the icon of a MazBtn of the same size', async () => {
      const Icon = defineComponent({
        render: () => h('svg', { class: 'test-icon' }),
      })
      const wrapper = mountSegmented({
        options: [
          { value: 'grid', icon: Icon, ariaLabel: 'Grid' },
        ],
        modelValue: 'grid',
        size: 'sm',
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-icon').classes()).toContain('m-icon--sm')
    })

    it('then it shows the title of the option as a native tooltip', () => {
      const wrapper = mountSegmented({
        options: [
          { value: 'grid', ariaLabel: 'Grid', title: 'Grid view (⌘2)' },
          { value: 'list', label: 'List' },
        ],
        modelValue: 'grid',
      })

      const segments = wrapper.findAll('[role="radio"]')
      expect(segments[0].attributes('title')).toBe('Grid view (⌘2)')
      expect(segments[1].attributes('title')).toBeUndefined()
    })
  })

  describe('when the item slot is used', () => {
    it('then it receives the option and its selected state', () => {
      const wrapper = mount(MazSegmented, {
        props: { options, modelValue: 'day' },
        slots: {
          item: ({ option, selected }: { option: { label: string }, selected: boolean }) => `${option.label}:${selected}`,
        },
      })

      expect(wrapper.findAll('[role="radio"]').map(segment => segment.text())).toEqual(['Day:true', 'Week:false', 'Month:false'])
    })
  })

  describe('when it is audited with axe', () => {
    it('then it has no accessibility violations', async () => {
      const wrapper = mountSegmented()
      await vi.dynamicImportSettled()

      expect(await runAxe(wrapper)).toHaveNoViolations()
    })
  })
})
