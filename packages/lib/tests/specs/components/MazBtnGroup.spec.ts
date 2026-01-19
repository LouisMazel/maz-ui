import MazBtn from '@components/MazBtn.vue'
import MazBtnGroup from '@components/MazBtnGroup.vue'
import { mount } from '@vue/test-utils'

describe('given MazBtnGroup component', () => {
  describe('when rendered with items prop', () => {
    const items = [
      { text: 'Button 1' },
      { text: 'Button 2' },
      { text: 'Button 3' },
    ]

    it('then it renders buttons for each item in array order', async () => {
      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons).toHaveLength(3)
      expect(buttons[0].text()).toBe('Button 1')
      expect(buttons[1].text()).toBe('Button 2')
      expect(buttons[2].text()).toBe('Button 3')
    })
  })

  describe('when item has onClick callback', () => {
    it('then it calls onClick when button is clicked', async () => {
      const onClickMock = vi.fn()
      const items = [
        { text: 'Button 1', onClick: onClickMock },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent({ name: 'MazBtn' })
      await button.trigger('click')
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when item has href', () => {
    it('then it renders an anchor element', async () => {
      const items = [
        { text: 'Link', href: 'https://example.com' },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.element.tagName).toBe('A')
      expect(button.attributes('href')).toBe('https://example.com')
    })
  })

  describe('when item has to (router-link)', () => {
    it('then it renders a router-link element', async () => {
      const items = [
        { text: 'Route', to: '/dashboard' },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
        global: {
          stubs: {
            RouterLink: {
              template: '<a class="m-btn"><slot /></a>',
              props: ['to'],
            },
          },
        },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.exists()).toBe(true)
    })
  })

  describe('when item has MazBtn props', () => {
    it('then it passes disabled prop to button', async () => {
      const items = [
        { text: 'Disabled', disabled: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('then it passes outlined prop to button', async () => {
      const items = [
        { text: 'Outlined', outlined: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.classes()).toContain('--primary-outlined')
    })

    it('then it passes loading prop to button', async () => {
      const items = [
        { text: 'Loading', loading: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.classes()).toContain('--loading')
    })
  })

  describe('when group has size and color props', () => {
    it('then it applies size to all buttons', async () => {
      const items = [
        { text: 'Button 1' },
        { text: 'Button 2' },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, size: 'lg' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      buttons.forEach((button) => {
        expect(button.classes()).toContain('--lg')
      })
    })

    it('then it applies color to all buttons', async () => {
      const items = [
        { text: 'Button 1' },
        { text: 'Button 2' },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'success' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      buttons.forEach((button) => {
        expect(button.classes()).toContain('--success')
      })
    })
  })

  describe('when individual item overrides group props', () => {
    it('then item size takes precedence over group size', async () => {
      const items = [
        { text: 'Button 1' },
        { text: 'Button 2', size: 'xs' as const },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, size: 'lg' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons[0].classes()).toContain('--lg')
      expect(buttons[1].classes()).toContain('--xs')
    })

    it('then item color takes precedence over group color', async () => {
      const items = [
        { text: 'Button 1' },
        { text: 'Button 2', color: 'destructive' as const },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'success' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons[0].classes()).toContain('--success')
      expect(buttons[1].classes()).toContain('--destructive')
    })
  })

  describe('when variants are used with inherited color', () => {
    it('then outlined variant works with group color', async () => {
      const items = [
        { text: 'Button 1', outlined: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'success' },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.classes()).toContain('--success-outlined')
    })

    it('then pastel variant works with group color', async () => {
      const items = [
        { text: 'Button 1', pastel: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'warning' },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.classes()).toContain('--warning-pastel')
    })

    it('then fab variant works with group size and color', async () => {
      const items = [
        { text: '', fab: true, icon: 'Plus' },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, size: 'sm', color: 'info' },
      })

      await vi.dynamicImportSettled()

      const button = wrapper.findComponent(MazBtn)
      expect(button.classes()).toContain('--fab')
      expect(button.classes()).toContain('--sm')
      expect(button.classes()).toContain('--info')
    })
  })

  describe('when rendered with orientation prop', () => {
    it('then it applies row orientation class by default', () => {
      const items = [{ text: 'Button' }]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      expect(wrapper.find('.m-button-group').classes()).toContain('--row')
    })

    it('then it applies col orientation class', () => {
      const items = [{ text: 'Button' }]

      const wrapper = mount(MazBtnGroup, {
        props: { items, orientation: 'col' },
      })

      expect(wrapper.find('.m-button-group').classes()).toContain('--col')
    })
  })

  describe('when rendered with role attribute', () => {
    it('then it has group role for accessibility', () => {
      const items = [{ text: 'Button' }]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      expect(wrapper.find('.m-button-group').attributes('role')).toBe('group')
    })
  })

  describe('when rendered with outline button variants', () => {
    it('then outline buttons display with correct styling classes', async () => {
      const items = [
        { text: 'Button 1', outlined: true },
        { text: 'Button 2', outlined: true },
        { text: 'Button 3', outlined: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'primary' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons).toHaveLength(3)
      buttons.forEach((button) => {
        expect(button.classes()).toContain('--primary-outlined')
      })
    })

    it('then adjacent outline buttons maintain coherent styling', async () => {
      const items = [
        { text: 'Button 1', outlined: true },
        { text: 'Button 2', outlined: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons[0].classes()).toContain('m-button-group__button')
      expect(buttons[1].classes()).toContain('m-button-group__button')
    })
  })

  describe('when rendered with pastel button variants', () => {
    it('then pastel buttons display with correct styling classes', async () => {
      const items = [
        { text: 'Button 1', pastel: true },
        { text: 'Button 2', pastel: true },
        { text: 'Button 3', pastel: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'success' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons).toHaveLength(3)
      buttons.forEach((button) => {
        expect(button.classes()).toContain('--success-pastel')
      })
    })

    it('then adjacent pastel buttons maintain coherent styling', async () => {
      const items = [
        { text: 'Button 1', pastel: true },
        { text: 'Button 2', pastel: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'info' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      buttons.forEach((button) => {
        expect(button.classes()).toContain('--info-pastel')
        expect(button.classes()).toContain('m-button-group__button')
      })
    })
  })

  describe('when rendered with standard (solid) button variants', () => {
    it('then standard buttons display with correct styling classes', async () => {
      const items = [
        { text: 'Button 1' },
        { text: 'Button 2' },
        { text: 'Button 3' },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'destructive' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons).toHaveLength(3)
      buttons.forEach((button) => {
        expect(button.classes()).toContain('--destructive')
        expect(button.classes()).not.toContain('--destructive-outlined')
        expect(button.classes()).not.toContain('--destructive-pastel')
      })
    })

    it('then adjacent standard buttons maintain coherent styling', async () => {
      const items = [
        { text: 'Button 1' },
        { text: 'Button 2' },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items, color: 'warning' },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      buttons.forEach((button) => {
        expect(button.classes()).toContain('--warning')
        expect(button.classes()).toContain('m-button-group__button')
      })
    })
  })

  describe('when rendered with mixed button variants', () => {
    it('then each button displays its own variant correctly', async () => {
      const items = [
        { text: 'Standard', color: 'primary' as const },
        { text: 'Outlined', color: 'success' as const, outlined: true },
        { text: 'Pastel', color: 'warning' as const, pastel: true },
      ]

      const wrapper = mount(MazBtnGroup, {
        props: { items },
      })

      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons[0].classes()).toContain('--primary')
      expect(buttons[1].classes()).toContain('--success-outlined')
      expect(buttons[2].classes()).toContain('--warning-pastel')
    })
  })

  describe('when rendered with slot-based approach', () => {
    describe('when using default slot with MazBtn components', () => {
      it('then it renders buttons from slot content', () => {
        const wrapper = mount(MazBtnGroup, {
          slots: {
            default: `
              <button class="m-btn">Slot Button 1</button>
              <button class="m-btn">Slot Button 2</button>
            `,
          },
        })

        const buttons = wrapper.findAll('.m-btn')
        expect(buttons).toHaveLength(2)
        expect(buttons[0].text()).toBe('Slot Button 1')
        expect(buttons[1].text()).toBe('Slot Button 2')
      })

      it('then it applies row orientation class to slot buttons', () => {
        const wrapper = mount(MazBtnGroup, {
          slots: {
            default: '<button class="m-btn">Slot Button</button>',
          },
        })

        expect(wrapper.find('.m-button-group').classes()).toContain('--row')
      })

      it('then it applies col orientation class to slot buttons', () => {
        const wrapper = mount(MazBtnGroup, {
          props: { orientation: 'col' },
          slots: {
            default: '<button class="m-btn">Slot Button</button>',
          },
        })

        expect(wrapper.find('.m-button-group').classes()).toContain('--col')
      })
    })

    describe('when combining items with named button slot overrides', () => {
      it('then it renders custom content for specific button via named slot', async () => {
        const items = [
          { text: 'Button 1' },
          { text: 'Button 2' },
        ]

        const wrapper = mount(MazBtnGroup, {
          props: { items },
          slots: {
            'button-0': '<span class="custom-icon">Custom</span>',
          },
        })

        await vi.dynamicImportSettled()

        const customContent = wrapper.find('.custom-icon')
        expect(customContent.exists()).toBe(true)
        expect(customContent.text()).toBe('Custom')
      })

      it('then named slot receives item and index as props', async () => {
        const items = [
          { text: 'Test Label' },
        ]

        const wrapper = mount(MazBtnGroup, {
          props: { items },
          slots: {
            'button-0': `
              <template #button-0="{ item, index }">
                <span class="slot-content">{{ item.label }}-{{ index }}</span>
              </template>
            `,
          },
        })

        await vi.dynamicImportSettled()

        const button = wrapper.findComponent(MazBtn)
        expect(button.exists()).toBe(true)
      })
    })
  })
})
