import MazAvatar from '@components/MazAvatar.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('MazAvatar extended branch coverage', () => {
  describe('componentType computed', () => {
    it('renders as a div by default when no href or to is provided', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('renders as an anchor element when href is provided', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          href: 'https://example.com',
        },
      })
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('https://example.com')
    })

    it('sets target attribute when href is provided', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          href: 'https://example.com',
          target: '_blank',
        },
      })
      expect(wrapper.attributes('target')).toBe('_blank')
    })

    it('does not set target when there is no link', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.attributes('target')).toBeUndefined()
    })

    it('uses default target _self when href is provided but no target specified', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          href: 'https://example.com',
        },
      })
      expect(wrapper.attributes('target')).toBe('_self')
    })
  })

  describe('isLink computed', () => {
    it('adds --has-link class when href is provided', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          href: 'https://example.com',
        },
      })
      expect(wrapper.classes()).toContain('--has-link')
    })

    it('does not add --has-link class when no link props', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.classes()).not.toContain('--has-link')
    })
  })

  describe('shouldDisplayImg computed', () => {
    it('displays image when src is provided', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: 'https://example.com/photo.jpg',
          loading: 'lazy',
        },
      })
      await vi.dynamicImportSettled()
      expect(wrapper.find('img').exists()).toBe(true)
    })

    it('displays image placeholder when no src and no caption', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          loading: 'lazy',
        },
      })
      await vi.dynamicImportSettled()
      // shouldDisplayImg is true when no src and no caption
      expect(wrapper.find('img').exists()).toBe(true)
    })

    it('does not display image when no src but caption is provided', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          caption: 'John Doe',
        },
      })
      expect(wrapper.find('img').exists()).toBe(false)
    })
  })

  describe('loading prop branches', () => {
    it('uses MazLazyImg when loading is intersecting (default)', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: 'https://example.com/photo.jpg',
        },
      })
      await vi.dynamicImportSettled()
      // default loading is 'intersecting', uses MazLazyImg async component
      expect(wrapper.find('.m-avatar__picture').exists()).toBe(true)
    })

    it('uses native img when loading is lazy', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: 'https://example.com/photo.jpg',
          loading: 'lazy',
        },
      })
      await vi.dynamicImportSettled()
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('loading')).toBe('lazy')
    })

    it('uses native img when loading is eager', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: 'https://example.com/photo.jpg',
          loading: 'eager',
        },
      })
      await vi.dynamicImportSettled()
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('loading')).toBe('eager')
    })
  })

  describe('getInitials function', () => {
    it('displays initials from caption', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          caption: 'John Doe',
          letterCount: 2,
        },
      })
      const initial = wrapper.find('.m-avatar__initial')
      expect(initial.exists()).toBe(true)
      expect(initial.text()).toBe('JD')
    })

    it('displays all initials when letterCount is not set', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          caption: 'John Michael Doe',
        },
      })
      const initial = wrapper.find('.m-avatar__initial')
      expect(initial.text()).toBe('JMD')
    })

    it('displays single initial for single-word caption', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          caption: 'John',
          letterCount: 1,
        },
      })
      const initial = wrapper.find('.m-avatar__initial')
      expect(initial.text()).toBe('J')
    })

    it('limits initials to letterCount', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          caption: 'Alice Bob Charlie',
          letterCount: 2,
        },
      })
      const initial = wrapper.find('.m-avatar__initial')
      expect(initial.text()).toBe('AB')
    })
  })

  describe('wrapper classes and styling', () => {
    it('adds --has-shadow class by default', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--has-shadow')
    })

    it('removes --has-shadow when noElevation is true', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          noElevation: true,
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).not.toContain('--has-shadow')
    })

    it('adds --bordered class when bordered is true', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          bordered: true,
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--bordered')
    })

    it('does not add --bordered class by default', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.find('.m-avatar__wrapper').classes()).not.toContain('--bordered')
    })

    it('adds --clickable class when clickable is true', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--clickable')
    })

    it('does not add --clickable class by default', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.find('.m-avatar__wrapper').classes()).not.toContain('--clickable')
    })

    it('adds --has-initial class when caption provided and no src', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          caption: 'AB',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--has-initial')
    })

    it('does not add --has-initial when src is provided', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: 'https://example.com/photo.jpg',
          caption: 'AB',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).not.toContain('--has-initial')
    })
  })

  describe('roundedSize prop', () => {
    it('applies --rounded-full by default', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-full')
    })

    it('applies --rounded-none when square is true', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          square: true,
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-none')
    })

    it('applies --rounded-sm', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          roundedSize: 'sm',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-sm')
    })

    it('applies --rounded-md', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          roundedSize: 'md',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-md')
    })

    it('applies --rounded-lg', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          roundedSize: 'lg',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-lg')
    })

    it('applies --rounded-xl', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          roundedSize: 'xl',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-xl')
    })

    it('applies --rounded-none with roundedSize none', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          roundedSize: 'none',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-none')
    })

    it('square prop overrides roundedSize', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          square: true,
          roundedSize: 'lg',
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('--rounded-none')
    })
  })

  describe('clickable button', () => {
    it('renders a button when clickable is true', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
        },
      })
      expect(wrapper.find('.m-avatar__button').exists()).toBe(true)
    })

    it('does not render a button by default', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.find('.m-avatar__button').exists()).toBe(false)
    })

    it('emits click event when button is clicked', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
        },
      })
      await wrapper.find('.m-avatar__button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('applies buttonColor style on the button when src is provided', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
          src: 'https://example.com/photo.jpg',
          buttonColor: 'success',
          loading: 'lazy',
        },
      })
      await vi.dynamicImportSettled()
      const button = wrapper.find('.m-avatar__button')
      expect(button.attributes('style')).toContain('hsl(var(--maz-success) / 60%)')
    })

    it('applies buttonColor style on the button when no src (full opacity)', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
          caption: 'AB',
          buttonColor: 'warning',
        },
      })
      const button = wrapper.find('.m-avatar__button')
      expect(button.attributes('style')).toContain('hsl(var(--maz-warning))')
    })

    it('hides clickable icon when hideClickableIcon is true', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
          hideClickableIcon: true,
        },
      })
      expect(wrapper.find('.m-avatar__button__icon').exists()).toBe(false)
    })

    it('shows clickable icon by default', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
        },
      })
      expect(wrapper.find('.m-avatar__button__icon').exists()).toBe(true)
    })
  })

  describe('caption display', () => {
    it('renders caption when showCaption is true', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          showCaption: true,
          caption: 'Jane Doe',
        },
      })
      expect(wrapper.find('.m-avatar__caption').exists()).toBe(true)
      expect(wrapper.find('.m-avatar__caption').text()).toBe('Jane Doe')
    })

    it('does not render caption when showCaption is false', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          showCaption: false,
          caption: 'Jane Doe',
        },
      })
      expect(wrapper.find('.m-avatar__caption').exists()).toBe(false)
    })

    it('does not render caption when caption is not provided', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          showCaption: true,
        },
      })
      expect(wrapper.find('.m-avatar__caption').exists()).toBe(false)
    })
  })

  describe('tabindex on wrapper', () => {
    it('sets tabindex to 0 when clickable', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          clickable: true,
        },
      })
      expect(wrapper.find('.m-avatar__wrapper').attributes('tabindex')).toBe('0')
    })

    it('sets tabindex to -1 when not clickable', () => {
      const wrapper = mount(MazAvatar)
      expect(wrapper.find('.m-avatar__wrapper').attributes('tabindex')).toBe('-1')
    })
  })

  describe('native img fallbackSrc', () => {
    it('uses fallbackSrc when src is null and loading is lazy', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: null,
          fallbackSrc: 'https://example.com/fallback.jpg',
          loading: 'lazy',
        },
      })
      await vi.dynamicImportSettled()
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('https://example.com/fallback.jpg')
    })
  })

  describe('custom class and style props', () => {
    it('applies custom class to the root element', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          class: 'my-custom-class',
        },
      })
      expect(wrapper.classes()).toContain('my-custom-class')
    })

    it('applies custom style to the root element', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          style: { border: '1px solid red' },
        },
      })
      expect(wrapper.attributes('style')).toContain('border: 1px solid red')
    })
  })

  describe('slots', () => {
    it('renders round-text slot when caption is set and no src', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          caption: 'Test User',
        },
        slots: {
          'round-text': '<span class="custom-text">Custom</span>',
        },
      })
      expect(wrapper.find('.custom-text').exists()).toBe(true)
    })

    it('renders caption slot', () => {
      const wrapper = mount(MazAvatar, {
        slots: {
          caption: '<span class="custom-caption">Custom Caption</span>',
        },
      })
      expect(wrapper.find('.custom-caption').exists()).toBe(true)
    })
  })

  describe('alt prop', () => {
    it('uses default alt text', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: 'https://example.com/photo.jpg',
          loading: 'eager',
        },
      })
      await vi.dynamicImportSettled()
      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('avatar image')
    })

    it('uses custom alt text', async () => {
      const wrapper = mount(MazAvatar, {
        props: {
          src: 'https://example.com/photo.jpg',
          alt: 'User photo',
          loading: 'eager',
        },
      })
      await vi.dynamicImportSettled()
      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('User photo')
    })
  })

  describe('size prop', () => {
    it('applies fontSize style from size prop', () => {
      const wrapper = mount(MazAvatar, {
        props: {
          size: '2em',
        },
      })
      expect(wrapper.attributes('style')).toContain('font-size: 2em')
    })

    it('does not apply fontSize when size is not provided', () => {
      const wrapper = mount(MazAvatar)
      // size is undefined, so fontSize should not be set
      const style = wrapper.attributes('style') || ''
      expect(style).not.toContain('font-size')
    })
  })
})
