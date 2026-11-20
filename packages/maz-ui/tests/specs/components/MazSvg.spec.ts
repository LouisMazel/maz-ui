import MazSvg from '@components/MazSvg.vue'
import { registerIcons } from '@maz-ui/icons/registry'
import { runAxe } from '@tests/helpers/axe.ts'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const FLAG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="513" height="342" viewBox="0 0 513 342"><rect width="171" height="342" fill="#00318A"/></svg>'

const ComponentSvg = defineComponent({
  name: 'ComponentSvg',
  render() {
    return h('svg', { 'data-testid': 'component-svg', 'width': '1em', 'height': '1em' })
  },
})

describe('MazSvg', () => {
  beforeEach(() => {
    registerIcons({ 'test-flag': FLAG_SVG })
  })

  describe('given a registered name', () => {
    describe('when it is rendered without dimensions', () => {
      it('then it keeps the size and the colors of the SVG', () => {
        const wrapper = mount(MazSvg, {
          props: { icon: 'test-flag' },
        })

        expect(wrapper.html()).toContain('width="513" height="342"')
        expect(wrapper.html()).toContain('fill="#00318A"')
        expect(wrapper.classes()).toContain('m-svg--fluid')
      })
    })

    describe('when it is rendered with a width', () => {
      it('then the SVG takes the width and its own ratio', () => {
        const wrapper = mount(MazSvg, {
          props: { icon: 'test-flag', width: 120 },
        })

        expect(wrapper.find('svg').attributes('width')).toBe('120')
        expect(wrapper.find('svg').attributes('height')).toBeUndefined()
      })
    })

    describe('when it is rendered with a height', () => {
      it('then the SVG takes the height and is not fluid', () => {
        const wrapper = mount(MazSvg, {
          props: { icon: 'test-flag', height: '4rem' },
        })

        expect(wrapper.find('svg').attributes('height')).toBe('4rem')
        expect(wrapper.classes()).not.toContain('m-svg--fluid')
      })
    })

    describe('when the width changes', () => {
      it('then the SVG is rendered with the new width', async () => {
        const wrapper = mount(MazSvg, {
          props: { icon: 'test-flag', width: 120 },
        })

        await wrapper.setProps({ width: 240 })

        expect(wrapper.find('svg').attributes('width')).toBe('240')
      })
    })

    describe('when it has a title', () => {
      it('then it is exposed as an image', () => {
        const wrapper = mount(MazSvg, {
          props: { icon: 'test-flag', title: 'France' },
        })

        expect(wrapper.attributes('role')).toBe('img')
        expect(wrapper.attributes('aria-label')).toBe('France')
        expect(wrapper.html()).toContain('<title>France</title>')
      })
    })

    describe('when it is rendered on the server', () => {
      it('then the server output contains the SVG', async () => {
        const html = await renderToString(createSSRApp({
          render: () => h(MazSvg, { icon: 'test-flag' }),
        }))

        expect(html).toContain('fill="#00318A"')
      })
    })
  })

  describe('given a component', () => {
    describe('when it is rendered with dimensions', () => {
      it('then the component receives them', () => {
        const wrapper = mount(MazSvg, {
          props: { icon: ComponentSvg as any, width: 32, height: 24 },
        })

        const svg = wrapper.find('[data-testid="component-svg"]')
        expect(svg.attributes('width')).toBe('32')
        expect(svg.attributes('height')).toBe('24')
        expect(svg.attributes('aria-hidden')).toBe('true')
      })
    })
  })

  describe('given an unknown name', () => {
    describe('when it is rendered', () => {
      it('then it emits an error and renders the fallback', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const wrapper = mount(MazSvg, {
          props: { icon: 'test-missing-svg', fallback: ComponentSvg as any },
        })

        expect(wrapper.emitted('error')).toHaveLength(1)
        expect(wrapper.find('[data-testid="component-svg"]').exists()).toBe(true)
        warnSpy.mockRestore()
      })
    })

    describe('when it has no fallback', () => {
      it('then nothing is rendered', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const wrapper = mount(MazSvg, {
          props: { icon: 'test-missing-svg' },
        })

        expect(wrapper.find('svg').exists()).toBe(false)
        warnSpy.mockRestore()
      })
    })
  })

  describe('given a URL', () => {
    describe('when it is loading', () => {
      it('then it renders an empty placeholder', () => {
        const originalFetch = globalThis.fetch
        globalThis.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof globalThis.fetch

        const wrapper = mount(MazSvg, {
          props: { icon: 'https://cdn.example.com/hero.svg' },
        })

        expect(wrapper.find('span.m-svg').exists()).toBe(true)
        expect(wrapper.find('svg').exists()).toBe(false)
        globalThis.fetch = originalFetch
      })
    })
  })

  describe('given a registered name with a title', () => {
    describe('when it is rendered', () => {
      it('then the wrapper is an image named by the title, without axe violation', async () => {
        const wrapper = mount(MazSvg, {
          props: { icon: 'test-flag', title: 'France' },
        })
        const svg = wrapper.find('svg')

        expect(wrapper.attributes()).toMatchObject({ 'role': 'img', 'aria-label': 'France' })
        expect(svg.attributes('role')).toBeUndefined()
        expect(svg.attributes('width')).toBe('513')
        expect(await runAxe(wrapper)).toHaveNoViolations()
      })
    })
  })

  describe('given a raw SVG with a width', () => {
    describe('when it is rendered', () => {
      it('then the SVG takes the width', () => {
        const wrapper = mount(MazSvg, {
          props: { icon: FLAG_SVG, width: 100 },
        })

        expect(wrapper.find('svg').attributes('width')).toBe('100')
        expect(wrapper.find('svg').attributes('height')).toBeUndefined()
      })
    })
  })
})
