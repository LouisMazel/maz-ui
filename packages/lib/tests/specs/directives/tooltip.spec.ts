import { vTooltip } from '@directives/vTooltip'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

describe('vTooltip directive', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    // Retirer le wrapper du DOM après chaque test
    wrapper.unmount()
  })

  it('renders tooltip with default values', () => {
    wrapper = mount({
      template: `<div v-tooltip="'Tooltip text'"></div>`,
      directives: {
        tooltip: vTooltip,
      },
    })

    expect(wrapper.attributes('data-tooltip')).toContain('Tooltip text')
    expect(wrapper.classes('m-tooltip')).toBe(true)
    expect(wrapper.classes('m-tooltip--top')).toBe(true)
    expect(wrapper.classes('m-tooltip--default')).toBe(true)
  })

  it('when the text is updated, the tooltip is updated', async () => {
    const text = ref('Tooltip text')
    wrapper = mount({
      template: `<div v-tooltip="text"></div>`,
      directives: {
        tooltip: vTooltip,
      },
      setup() {
        return { text }
      },
    })

    expect(wrapper.attributes('data-tooltip')).toContain('Tooltip text')

    text.value = 'New tooltip text'
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('data-tooltip')).toContain('New tooltip text')
  })

  it('when open is true, renders tooltip with open class', () => {
    wrapper = mount({
      template: `<div v-tooltip="{ text: 'Tooltip text', open: true }"></div>`,
      directives: {
        tooltip: vTooltip,
      },
    })

    expect(wrapper.classes('m-tooltip--open')).toBe(true)
  })

  it('when a color is provided, renders tooltip with color class', () => {
    wrapper = mount({
      template: `<div v-tooltip="{ text: 'Tooltip text', color: 'primary' }"></div>`,
      directives: {
        tooltip: vTooltip,
      },
    })

    expect(wrapper.classes('m-tooltip--primary')).toBe(true)
  })

  it('when a position is provided, renders tooltip with position class', async () => {
    wrapper = mount({
      template: `<div v-tooltip.bottom="{ text: 'Tooltip text' }"></div>`,
      directives: {
        tooltip: vTooltip,
      },
    })
    expect(wrapper.classes('m-tooltip--bottom')).toBe(true)
    wrapper.unmount()

    wrapper = mount({
      template: `<div v-tooltip.top="{ text: 'Tooltip text' }"></div>`,
      directives: {
        tooltip: vTooltip,
      },
    })
    expect(wrapper.classes('m-tooltip--top')).toBe(true)
    wrapper.unmount()

    wrapper = mount({
      template: `<div v-tooltip.left="{ text: 'Tooltip text' }"></div>`,
      directives: {
        tooltip: vTooltip,
      },
    })
    expect(wrapper.classes('m-tooltip--left')).toBe(true)
    wrapper.unmount()

    wrapper = mount({
      template: `<div v-tooltip.right="{ text: 'Tooltip text' }"></div>`,
      directives: {
        tooltip: vTooltip,
      },
    })
    expect(wrapper.classes('m-tooltip--right')).toBe(true)
    wrapper.unmount()

    const position = ref('bottom')
    wrapper = mount({
      template: `<div v-tooltip="{ text: 'Tooltip text', position: position }"></div>`,
      directives: {
        tooltip: vTooltip,
      },
      setup() {
        return {
          position,
        }
      },
    })
    expect(wrapper.classes('m-tooltip--bottom')).toBe(true)
    position.value = 'top'
    await wrapper.vm.$nextTick()
    expect(wrapper.classes('m-tooltip--top')).toBe(true)
  })
})
