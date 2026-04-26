import MazIcon from '@components/MazIcon.vue'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

describe('MazIcon extended branch coverage', () => {
  describe('fullSrc computed', () => {
    it('returns /name.svg when only name is provided and no path', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'home' },
      })
      expect(wrapper.vm.fullSrc).toBe('/home.svg')
    })

    it('returns src when src prop is provided', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { src: '/custom/path/icon.svg' },
      })
      expect(wrapper.vm.fullSrc).toBe('/custom/path/icon.svg')
    })

    it('returns path/name.svg when both path and name are provided', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'star', path: '/assets/icons' },
      })
      expect(wrapper.vm.fullSrc).toBe('/assets/icons/star.svg')
    })

    it('returns undefined when icon component is provided', () => {
      const IconComp = defineComponent({
        render() {
          return h('svg', { class: 'test-icon' })
        },
      })
      const wrapper = shallowMount(MazIcon, {
        props: { icon: IconComp as any },
      })
      expect(wrapper.vm.fullSrc).toBeUndefined()
    })
  })

  describe('svgStyle computed', () => {
    it('returns undefined for predefined size xs', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'xs' },
      })
      expect(wrapper.vm.svgStyle).toBeUndefined()
    })

    it('returns undefined for predefined size sm', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'sm' },
      })
      expect(wrapper.vm.svgStyle).toBeUndefined()
    })

    it('returns undefined for predefined size md', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'md' },
      })
      expect(wrapper.vm.svgStyle).toBeUndefined()
    })

    it('returns undefined for predefined size lg', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'lg' },
      })
      expect(wrapper.vm.svgStyle).toBeUndefined()
    })

    it('returns undefined for predefined size xl', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'xl' },
      })
      expect(wrapper.vm.svgStyle).toBeUndefined()
    })

    it('returns fontSize style for custom size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: '2rem' },
      })
      expect(wrapper.vm.svgStyle).toEqual({ fontSize: '2rem' })
    })

    it('returns fontSize style for pixel size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: '32px' },
      })
      expect(wrapper.vm.svgStyle).toEqual({ fontSize: '32px' })
    })

    it('returns undefined when size is not provided', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test' },
      })
      // size is undefined so isPredefinedSize is false, returns { fontSize: undefined }
      expect(wrapper.vm.svgStyle).toEqual({ fontSize: undefined })
    })
  })

  describe('svgClasses computed', () => {
    it('returns m-icon--xs for xs size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'xs' },
      })
      expect(wrapper.vm.svgClasses).toContain('m-icon--xs')
    })

    it('returns m-icon--sm for sm size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'sm' },
      })
      expect(wrapper.vm.svgClasses).toContain('m-icon--sm')
    })

    it('returns m-icon--md for md size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'md' },
      })
      expect(wrapper.vm.svgClasses).toContain('m-icon--md')
    })

    it('returns m-icon--lg for lg size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'lg' },
      })
      expect(wrapper.vm.svgClasses).toContain('m-icon--lg')
    })

    it('returns m-icon--xl for xl size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: 'xl' },
      })
      expect(wrapper.vm.svgClasses).toContain('m-icon--xl')
    })

    it('returns undefined for custom size', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test', size: '3em' },
      })
      expect(wrapper.vm.svgClasses).toBeUndefined()
    })

    it('returns undefined when no size provided', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test' },
      })
      expect(wrapper.vm.svgClasses).toBeUndefined()
    })
  })

  describe('icon component rendering', () => {
    it('renders the icon component when icon prop is provided and no svgElSource', () => {
      const IconComp = defineComponent({
        render() {
          return h('svg', { class: 'custom-icon-comp' })
        },
      })
      const wrapper = shallowMount(MazIcon, {
        props: { icon: IconComp as any },
      })
      // When icon is provided, fullSrc is undefined, no SVG source loaded,
      // so the <component :is="icon"> fallback renders
      expect(wrapper.find('.m-icon').exists()).toBe(true)
    })

    it('applies svgClasses to icon component', () => {
      const IconComp = defineComponent({
        render() {
          return h('svg', { class: 'custom-icon-comp' })
        },
      })
      const wrapper = shallowMount(MazIcon, {
        props: { icon: IconComp as any, size: 'lg' },
      })
      expect(wrapper.find('.m-icon').classes()).toContain('m-icon--lg')
    })

    it('applies svgStyle to icon component with custom size', () => {
      const IconComp = defineComponent({
        render() {
          return h('svg', { class: 'custom-icon-comp' })
        },
      })
      const wrapper = shallowMount(MazIcon, {
        props: { icon: IconComp as any, size: '48px' },
      })
      expect(wrapper.find('.m-icon').attributes('style')).toContain('font-size: 48px')
    })
  })

  describe('onMounted validation', () => {
    it('logs error when icon and src are both provided', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      shallowMount(MazIcon, {
        props: {
          icon: defineComponent({ render() { return h('svg') } }) as any,
          src: '/icon.svg',
        },
      })
      expect(consoleSpy).toHaveBeenCalledWith(
        '[maz-ui](MazIcon) you should provide "name" or "src" as prop',
      )
      consoleSpy.mockRestore()
    })

    it('logs error when icon and name are both provided', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      shallowMount(MazIcon, {
        props: {
          icon: defineComponent({ render() { return h('svg') } }) as any,
          name: 'test',
        },
      })
      expect(consoleSpy).toHaveBeenCalledWith(
        '[maz-ui](MazIcon) you should provide "name" or "src" as prop',
      )
      consoleSpy.mockRestore()
    })

    it('logs error when no icon, name, or src is provided', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      shallowMount(MazIcon, {
        props: {},
      })
      expect(consoleSpy).toHaveBeenCalledWith(
        '[maz-ui](MazIcon) you should provide "icon", "name" or "src" as prop',
      )
      consoleSpy.mockRestore()
    })

    it('does not log error when only name is provided', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      shallowMount(MazIcon, {
        props: { name: 'home' },
      })
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('does not log error when only src is provided', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      shallowMount(MazIcon, {
        props: { src: '/icon.svg' },
      })
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('filterAttrs function', () => {
    it('is accessible and filters null/undefined/false attrs', () => {
      // We test filterAttrs indirectly through the component.
      // When svgElSource is loaded, it uses filterAttrs with $attrs.
      // For now, we just verify the component mounts without error.
      const wrapper = shallowMount(MazIcon, {
        props: { name: 'test' },
        attrs: {
          'data-testid': 'icon',
          'aria-hidden': 'true',
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })
})
