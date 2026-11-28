import MazDrawer from '@components/MazDrawer.vue'
import MazInput from '@components/MazInput.vue'
import MazInputAutocomplete from '@components/MazInputAutocomplete.vue'
import MazTextarea from '@components/MazTextarea.vue'
import { mount } from '@vue/test-utils'

describe.each([
  ['MazInput', MazInput, '.m-input-wrapper'],
  ['MazTextarea', MazTextarea, '.m-textarea'],
] as const)('given %s with the bordered prop', (_name, Component, selector) => {
  function hasBorder(props: Record<string, unknown>) {
    const wrapper = mount(Component as any, { props })

    return wrapper.find(selector).classes().includes('maz:border-solid')
  }

  describe('when no border prop is set', () => {
    it('then the border is drawn', () => {
      expect(hasBorder({})).toBe(true)
    })
  })

  describe('when bordered is false', () => {
    it('then the border is removed', () => {
      expect(hasBorder({ bordered: false })).toBe(false)
    })
  })

  describe('when bordered is true', () => {
    it('then the border is drawn', () => {
      expect(hasBorder({ bordered: true })).toBe(true)
    })
  })

  describe('when only the deprecated border prop is false', () => {
    it('then the border is removed', () => {
      expect(hasBorder({ border: false })).toBe(false)
    })
  })

  describe('when bordered and border are both set', () => {
    it('then bordered wins', () => {
      expect(hasBorder({ bordered: true, border: false })).toBe(true)
      expect(hasBorder({ bordered: false, border: true })).toBe(false)
    })
  })
})

describe('given MazInputAutocomplete with the bordered prop', () => {
  function inputBordered(props: Record<string, unknown>) {
    const wrapper = mount(MazInputAutocomplete, { props: { options: [], ...props } })

    return wrapper.findComponent(MazInput).props('bordered')
  }

  describe('when no border prop is set', () => {
    it('then the input is bordered', () => {
      expect(inputBordered({})).toBe(true)
    })
  })

  describe('when bordered is false', () => {
    it('then the input is not bordered', () => {
      expect(inputBordered({ bordered: false })).toBe(false)
    })
  })

  describe('when only the deprecated border prop is false', () => {
    it('then the input is not bordered', () => {
      expect(inputBordered({ border: false })).toBe(false)
    })
  })
})

describe('given MazDrawer with the side prop', () => {
  describe.each(['start', 'end', 'top', 'bottom'] as const)('when side is %s', (side) => {
    it('then it renders the matching side', () => {
      const wrapper = mount(MazDrawer, { props: { side, modelValue: true } })

      expect(wrapper.find('.m-drawer-content-wrap').classes()).toContain(`--${side}`)
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).props('transitionName')).toBe(`drawer-anim-${side}`)
    })

    it('then it renders exactly like the deprecated variant', () => {
      const withSide = mount(MazDrawer, { props: { side, modelValue: true } })
      const withVariant = mount(MazDrawer, { props: { variant: side, modelValue: true } })

      expect(withSide.find('.m-drawer-content-wrap').classes()).toEqual(withVariant.find('.m-drawer-content-wrap').classes())
    })
  })

  describe('when side and variant are both set', () => {
    it('then side wins', () => {
      const wrapper = mount(MazDrawer, { props: { side: 'top', variant: 'bottom', modelValue: true } })

      expect(wrapper.find('.m-drawer-content-wrap').classes()).toContain('--top')
    })
  })

  describe('when neither side nor variant is set', () => {
    it('then it slides from the end', () => {
      const wrapper = mount(MazDrawer, { props: { modelValue: true } })

      expect(wrapper.find('.m-drawer-content-wrap').classes()).toContain('--end')
    })
  })
})
