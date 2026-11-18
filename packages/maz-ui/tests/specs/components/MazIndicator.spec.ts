import MazIndicator from '@components/MazIndicator.vue'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'

describe('given MazIndicator component', () => {
  describe('when it has no content', () => {
    it('then it is an inline decorative dot', () => {
      const wrapper = mount(MazIndicator)

      expect(wrapper.classes()).toEqual(expect.arrayContaining([
        'm-indicator',
        '--dot',
        '--primary',
        'maz:relative',
      ]))
      expect(wrapper.classes()).not.toContain('--bordered')
      expect(wrapper.text()).toBe('')
      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('when the content is a number above the maximum', () => {
    it('then it shows the maximum followed by a plus', () => {
      const wrapper = mount(MazIndicator, {
        props: { content: 1200, max: 999 },
      })

      expect(wrapper.text()).toBe('999+')
      expect(wrapper.classes()).not.toContain('--dot')
    })
  })

  describe('when the content is 0', () => {
    it('then it is hidden, unless showZero is set', () => {
      expect(mount(MazIndicator, {
        props: { content: 0 },
      }).find('.m-indicator').exists()).toBe(false)
      expect(mount(MazIndicator, {
        props: { content: 0, showZero: true },
      }).text()).toBe('0')
    })
  })

  describe('when it wraps a content', () => {
    it('then it sits on the corner of that content with a ring', () => {
      const wrapper = mount(MazIndicator, {
        props: { content: 'new', position: 'bottom-start', color: 'success' },
        slots: { default: '<button>Inbox</button>' },
      })
      const badge = wrapper.find('.m-indicator__badge')

      expect(wrapper.find('button').exists()).toBe(true)
      expect(badge.text()).toBe('new')
      expect(badge.classes()).toEqual(expect.arrayContaining([
        'maz:absolute',
        'maz:bottom-0',
        'maz:start-0',
        '--bordered',
        '--success',
      ]))
      expect(badge.attributes('style')).toContain('background-color: var(--maz-success)')
    })
  })

  describe('when the wrapped content is circular', () => {
    it('then the indicator moves in to the edge of the circle', () => {
      const wrapper = mount(MazIndicator, {
        props: { overlap: 'circular' },
        slots: { default: '<span>A</span>' },
      })

      expect(wrapper.find('.m-indicator__badge').classes()).toEqual(expect.arrayContaining(['maz:top-[14.6%]', 'maz:end-[14.6%]']))
    })
  })

  describe('when it is attached', () => {
    it('then it is placed on its positioned parent without wrapping', () => {
      const wrapper = mount(MazIndicator, {
        props: { attached: true, position: 'top-start' },
      })

      expect(wrapper.classes()).toEqual(expect.arrayContaining([
        'maz:absolute',
        'maz:top-0',
        'maz:start-0',
        '--bordered',
      ]))
    })
  })

  describe('when it is invisible', () => {
    it('then the wrapped content stays and the indicator is hidden', () => {
      const wrapper = mount(MazIndicator, {
        props: { content: 3, invisible: true },
        slots: { default: '<span class="content">A</span>' },
      })

      expect(wrapper.find('.content').exists()).toBe(true)
      expect(wrapper.find('.m-indicator__badge').exists()).toBe(false)
    })
  })

  describe('when it has a size, a pulse and a label', () => {
    it('then it uses the size, draws the halo and is named', () => {
      const wrapper = mount(MazIndicator, {
        props: { size: 'lg', pulse: true, label: 'Online' },
      })

      expect(wrapper.classes()).toContain('maz:text-xs')
      expect(wrapper.find('.maz\\:animate-ping').exists()).toBe(true)
      expect(wrapper.attributes('role')).toBe('img')
      expect(wrapper.attributes('aria-label')).toBe('Online')
    })
  })

  describe('when the content slot is used', () => {
    it('then it receives the text of the counter', () => {
      const wrapper = mount(MazIndicator, {
        props: { content: 150 },
        slots: {
          content: ({ text }: { text: string }) => `${text} new`,
        },
      })

      expect(wrapper.text()).toBe('99+ new')
    })
  })

  describe('when it is audited with axe', () => {
    it('then it has no accessibility violations', async () => {
      const wrapper = mount(MazIndicator, {
        props: { content: 4, label: '4 notifications' },
        slots: { default: '<button>Inbox</button>' },
        attachTo: document.body,
      })

      expect(await runAxe(wrapper)).toHaveNoViolations()
      wrapper.unmount()
    })
  })
})
