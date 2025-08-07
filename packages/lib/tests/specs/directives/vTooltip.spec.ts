import { vTooltip } from '@directives/vTooltip'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

describe('given vTooltip directive', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
    document.querySelectorAll('.m-tooltip-wrapper').forEach(el => el.remove())
  })

  describe('when mounting component with tooltip text', () => {
    it('then it should render the component', () => {
      wrapper = mount({
        template: `<div v-tooltip="'Tooltip text'">Test</div>`,
        directives: {
          tooltip: vTooltip,
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toBe('Test')
    })
  })

  describe('when updating tooltip text', () => {
    it('then it should update the tooltip', async () => {
      const text = ref('Tooltip text')
      wrapper = mount({
        template: `<div v-tooltip="text">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },
        setup() {
          return { text }
        },
      })

      expect(wrapper.exists()).toBe(true)

      text.value = 'New tooltip text'
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when using tooltip with options', () => {
    it('then it should render with object options', () => {
      wrapper = mount({
        template: `<div v-tooltip="{ text: 'Tooltip text', open: true }">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Content')
      expect(wrapper.find('.m-tooltip-panel').exists()).toBe(true)
      expect(wrapper.find('.m-tooltip-panel').text()).toContain('Tooltip text')
    })
  })

  describe('when using tooltip with color', () => {
    it('then it should render with color options', () => {
      wrapper = mount({
        template: `<div v-tooltip="{ text: 'Tooltip text', color: 'destructive', open: true }">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },

      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Content')
      expect(wrapper.find('.m-tooltip-panel').exists()).toBe(true)
      expect(wrapper.find('.m-tooltip-panel').classes()).toContain('--destructive')
    })
  })

  describe('when using tooltip with position modifiers', () => {
    it('then it should render with different positions', async () => {
      wrapper = mount({
        template: `<div v-tooltip.bottom="{ text: 'Tooltip text' }">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },
      })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()

      wrapper = mount({
        template: `<div v-tooltip.top="{ text: 'Tooltip text' }">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },
      })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()

      wrapper = mount({
        template: `<div v-tooltip.left="{ text: 'Tooltip text' }">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },
      })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()

      wrapper = mount({
        template: `<div v-tooltip.right="{ text: 'Tooltip text' }">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },
      })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()

      const position = ref('bottom')
      wrapper = mount({
        template: `<div v-tooltip="{ text: 'Tooltip text', position: position }">Content</div>`,
        directives: {
          tooltip: vTooltip,
        },
        setup() {
          return {
            position,
          }
        },
      })
      expect(wrapper.exists()).toBe(true)
      position.value = 'top'
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })
})
