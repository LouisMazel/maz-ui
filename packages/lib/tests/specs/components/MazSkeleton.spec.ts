import MazSkeleton from '@components/MazSkeleton.vue'
import { mount, shallowMount } from '@vue/test-utils'

describe('given MazSkeleton component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with base classes', () => {
      const wrapper = shallowMount(MazSkeleton)

      expect(wrapper.classes()).toContain('m-skeleton')
      expect(wrapper.classes()).toContain('m-reset-css')
    })

    it('then it has rectangle shape by default', () => {
      const wrapper = shallowMount(MazSkeleton)

      expect(wrapper.classes()).toContain('m-skeleton--rectangle')
    })

    it('then it has animated class by default', () => {
      const wrapper = shallowMount(MazSkeleton)

      expect(wrapper.classes()).toContain('m-skeleton--animated')
    })

    it('then it has md rounded size by default', () => {
      const wrapper = shallowMount(MazSkeleton)

      expect(wrapper.classes()).toContain('m-skeleton--rounded-md')
    })

    it('then it has the correct accessibility attributes', () => {
      const wrapper = shallowMount(MazSkeleton)

      expect(wrapper.attributes('role')).toBe('status')
      expect(wrapper.attributes('aria-live')).toBe('polite')
    })

    it('then it applies default size style', () => {
      const wrapper = mount(MazSkeleton)

      expect(wrapper.attributes('style')).toContain('height: 1rem')
      expect(wrapper.attributes('style')).toContain('width: 100%')
    })
  })

  describe('when rendered with different shapes', () => {
    it('then it applies circle shape class and equal dimensions', () => {
      const wrapper = mount(MazSkeleton, {
        props: { shape: 'circle', size: '3rem' },
      })

      expect(wrapper.classes()).toContain('m-skeleton--circle')
      expect(wrapper.attributes('style')).toContain('width: 3rem')
      expect(wrapper.attributes('style')).toContain('height: 3rem')
    })

    it('then it applies square shape class and equal dimensions', () => {
      const wrapper = mount(MazSkeleton, {
        props: { shape: 'square', size: '4rem' },
      })

      expect(wrapper.classes()).toContain('m-skeleton--square')
      expect(wrapper.attributes('style')).toContain('width: 4rem')
      expect(wrapper.attributes('style')).toContain('height: 4rem')
    })

    it('then it applies rectangle shape with full width and custom height', () => {
      const wrapper = mount(MazSkeleton, {
        props: { shape: 'rectangle', size: '2rem' },
      })

      expect(wrapper.classes()).toContain('m-skeleton--rectangle')
      expect(wrapper.attributes('style')).toContain('height: 2rem')
      expect(wrapper.attributes('style')).toContain('width: 100%')
    })
  })

  describe('when rendered with custom dimensions', () => {
    it('then it applies custom width and height for rectangle', () => {
      const wrapper = mount(MazSkeleton, {
        props: {
          shape: 'rectangle',
          width: '200px',
          height: '50px',
        },
      })

      expect(wrapper.attributes('style')).toContain('width: 200px')
      expect(wrapper.attributes('style')).toContain('height: 50px')
    })

    it('then it applies custom size for circle', () => {
      const wrapper = mount(MazSkeleton, {
        props: {
          shape: 'circle',
          size: '5rem',
        },
      })

      expect(wrapper.attributes('style')).toContain('width: 5rem')
      expect(wrapper.attributes('style')).toContain('height: 5rem')
    })
  })

  describe('when rendered with animated prop set to false', () => {
    it('then it does not have the animated class', () => {
      const wrapper = shallowMount(MazSkeleton, {
        props: { animated: false },
      })

      expect(wrapper.classes()).not.toContain('m-skeleton--animated')
    })
  })

  describe('when rendered with different rounded sizes', () => {
    it.each(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const)('then it applies %s rounded size class', (size) => {
      const wrapper = shallowMount(MazSkeleton, {
        props: { roundedSize: size },
      })

      expect(wrapper.classes()).toContain(`m-skeleton--rounded-${size}`)
    })
  })

  describe('when rendered with custom aria-label', () => {
    it('then it applies the custom aria-label', () => {
      const wrapper = shallowMount(MazSkeleton, {
        props: { ariaLabel: 'Loading user profile' },
      })

      expect(wrapper.attributes('aria-label')).toBe('Loading user profile')
    })
  })

  describe('when rendered with custom loading text', () => {
    it('then it displays the loading text in screen reader only element', () => {
      const wrapper = mount(MazSkeleton, {
        props: { loadingText: 'Please wait...' },
      })

      expect(wrapper.find('.maz-sr-only').text()).toBe('Please wait...')
    })
  })

  describe('when rendered with combined props', () => {
    it('then it applies all specified classes and styles', () => {
      const wrapper = mount(MazSkeleton, {
        props: {
          shape: 'square',
          size: '100px',
          animated: true,
          roundedSize: 'lg',
          ariaLabel: 'Loading avatar',
        },
      })

      expect(wrapper.classes()).toContain('m-skeleton')
      expect(wrapper.classes()).toContain('m-skeleton--square')
      expect(wrapper.classes()).toContain('m-skeleton--animated')
      expect(wrapper.classes()).toContain('m-skeleton--rounded-lg')
      expect(wrapper.attributes('aria-label')).toBe('Loading avatar')
      expect(wrapper.attributes('style')).toContain('width: 100px')
      expect(wrapper.attributes('style')).toContain('height: 100px')
    })
  })

  describe('when using different size units', () => {
    it.each([
      ['2rem', '2rem'],
      ['40px', '40px'],
      ['3em', '3em'],
      ['10vh', '10vh'],
      ['50%', '50%'],
    ])('then it accepts %s as a valid size unit', (size, expected) => {
      const wrapper = mount(MazSkeleton, {
        props: { shape: 'circle', size: size as `${number}rem` },
      })

      expect(wrapper.attributes('style')).toContain(`width: ${expected}`)
      expect(wrapper.attributes('style')).toContain(`height: ${expected}`)
    })
  })

  describe('when screen reader element is present', () => {
    it('then it has maz-sr-only class for accessibility', () => {
      const wrapper = mount(MazSkeleton)

      expect(wrapper.find('.maz-sr-only').exists()).toBe(true)
    })
  })
})
