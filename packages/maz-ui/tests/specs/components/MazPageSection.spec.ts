import MazPageSection from '@components/MazPageSection.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { runAxe } from '@tests/helpers/axe.ts'
import { mount } from '@vue/test-utils'

describe('given MazPageSection component', () => {
  describe('when it is rendered without props', () => {
    it('then it is a div with the page gutter and its content', () => {
      const wrapper = mount(MazPageSection, {
        slots: { default: '<p>Content</p>' },
      })

      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.classes()).toEqual(expect.arrayContaining([
        'm-page-section',
        'maz:box-border',
        'maz:padded-container',
      ]))
      expect(wrapper.classes()).not.toContain('maz:padded-container-no-p')
      expect(wrapper.classes()).not.toContain('maz:@container')
      expect(wrapper.attributes('style')).toBeUndefined()
      expect(wrapper.find('p').text()).toBe('Content')
    })
  })

  describe('when as is set', () => {
    it('then it renders that tag', () => {
      const wrapper = mount(MazPageSection, {
        props: { as: 'header' },
      })

      expect(wrapper.element.tagName).toBe('HEADER')
    })
  })

  describe('when fullBleed is set', () => {
    it('then it centers the content without the minimum side padding', () => {
      const wrapper = mount(MazPageSection, {
        props: { fullBleed: true },
      })

      expect(wrapper.classes()).toContain('maz:padded-container-no-p')
      expect(wrapper.classes()).not.toContain('maz:padded-container')
    })
  })

  describe('when container is set', () => {
    it('then the section is a container', () => {
      const wrapper = mount(MazPageSection, {
        props: { container: true },
      })

      expect(wrapper.classes()).toContain('maz:@container')
    })
  })

  describe('when maxWidth is a number', () => {
    it('then it sets the maximum width in pixels', () => {
      const wrapper = mount(MazPageSection, {
        props: { maxWidth: 960 },
      })

      expect(wrapper.attributes('style')).toContain('--maz-container-max-width: 960px')
    })
  })

  describe('when maxWidth is a string', () => {
    it('then it sets the maximum width as is', () => {
      const wrapper = mount(MazPageSection, {
        props: { maxWidth: '60rem' },
      })

      expect(wrapper.attributes('style')).toContain('--maz-container-max-width: 60rem')
    })
  })

  describe('when it is rendered as a main landmark', () => {
    it('then it has no accessibility violation', async () => {
      const wrapper = mount(MazPageSection, {
        props: { as: 'main' },
        slots: { default: '<h1>Title</h1>' },
        attachTo: document.body,
      })

      expect(await runAxe(wrapper)).toHaveNoViolations()

      wrapper.unmount()
    })
  })
})

describe('given MazUi defaults for MazPageSection', () => {
  const config = {
    MazPageSection: {
      as: 'section',
      fullBleed: true,
      maxWidth: 960,
      container: true,
    },
  }

  describe('when no prop is passed', () => {
    it('then it uses the defaults', () => {
      const wrapper = mount(MazPageSection, {
        global: {
          provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config },
        },
      })

      expect(wrapper.element.tagName).toBe('SECTION')
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['maz:padded-container-no-p', 'maz:@container']))
      expect(wrapper.attributes('style')).toContain('--maz-container-max-width: 960px')
    })
  })

  describe('when the props are passed', () => {
    it('then the props win over the defaults', () => {
      const wrapper = mount(MazPageSection, {
        props: {
          as: 'footer',
          fullBleed: false,
          maxWidth: '50rem',
          container: false,
        },
        global: {
          provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config },
        },
      })

      expect(wrapper.element.tagName).toBe('FOOTER')
      expect(wrapper.classes()).toContain('maz:padded-container')
      expect(wrapper.classes()).not.toContain('maz:@container')
      expect(wrapper.attributes('style')).toContain('--maz-container-max-width: 50rem')
    })
  })
})
