import MazIcon from '@components/MazIcon.vue'
import { mount, shallowMount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

const RAW_SVG = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="currentColor"/></svg>'
const SECOND_RAW_SVG = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>'

const ComponentIcon = defineComponent({
  name: 'ComponentIcon',
  render() {
    return h('svg', { 'data-testid': 'component-icon' })
  },
})

describe('MazIcon', () => {
  describe('icon: raw SVG string', () => {
    it('renders the raw SVG inline', async () => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG } })
      await nextTick()
      expect(wrapper.html()).toContain('viewBox="0 0 24 24"')
      expect(wrapper.html()).toContain('<svg width="1em" height="1em"')
    })

    it('reacts to a new raw SVG when the icon prop changes', async () => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG } })
      await nextTick()
      expect(wrapper.html()).toContain('M0 0h24v24H0z')

      await wrapper.setProps({ icon: SECOND_RAW_SVG })
      await nextTick()
      expect(wrapper.html()).toContain('<circle')
    })
  })

  describe('icon: Vue component', () => {
    it('renders the component via <component :is>', async () => {
      const wrapper = mount(MazIcon, { props: { icon: ComponentIcon as any } })
      await nextTick()
      expect(wrapper.find('[data-testid="component-icon"]').exists()).toBe(true)
    })
  })

  describe('icon: URL', () => {
    let originalFetch: typeof globalThis.fetch

    beforeEach(() => {
      originalFetch = globalThis.fetch
    })

    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    it('fetches the SVG and inlines it', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue(RAW_SVG),
      } as unknown as Response)

      const wrapper = mount(MazIcon, { props: { icon: '/icons/star.svg' } })
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await nextTick()

      expect(globalThis.fetch).toHaveBeenCalledWith('/icons/star.svg')
      expect(wrapper.html()).toContain('viewBox="0 0 24 24"')
    })

    it('warns and renders the component fallback when a URL icon fails', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 } as Response)

      const wrapper = mount(MazIcon, {
        props: {
          icon: '/icons/missing.svg',
          fallback: ComponentIcon as any,
        },
      })
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await nextTick()

      expect(wrapper.emitted('error')).toBeDefined()
      expect(warnSpy).toHaveBeenCalled()
      expect(wrapper.find('[data-testid="component-icon"]').exists()).toBe(true)

      warnSpy.mockRestore()
    })

    it('emits "error" when fetch fails and falls back to a string fallback', async () => {
      let callCount = 0
      globalThis.fetch = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1)
          return Promise.resolve({ ok: false, status: 404 } as Response)
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(RAW_SVG),
        } as unknown as Response)
      })

      const wrapper = mount(MazIcon, {
        props: {
          icon: '/icons/missing.svg',
          fallback: '/icons/help.svg',
        },
      })
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))
      await nextTick()
      await nextTick()

      expect(wrapper.emitted('error')).toBeDefined()
      expect(wrapper.html()).toContain('viewBox="0 0 24 24"')
    })
  })

  describe('fallback', () => {
    it('renders the fallback component when no icon prop is provided', async () => {
      const wrapper = mount(MazIcon, { props: { fallback: ComponentIcon as any } })
      await nextTick()
      expect(wrapper.find('[data-testid="component-icon"]').exists()).toBe(true)
    })

    it('uses the default MazQuestionMarkCircle fallback when nothing is provided', () => {
      const wrapper = mount(MazIcon)
      // The default fallback is a Vue component — we just check the component renders without throwing.
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('size prop', () => {
    it('omits inline style for predefined keyword sizes', async () => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG, size: 'lg' } })
      await nextTick()
      expect(wrapper.attributes('style') ?? '').not.toContain('font-size')
      expect(wrapper.classes()).toContain('m-icon--lg')
    })

    it('applies fontSize style for custom CSS lengths', async () => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG, size: '2rem' } })
      await nextTick()
      expect(wrapper.attributes('style')).toContain('font-size: 2rem')
    })

    it.each([
      ['xs', 'maz:text-base'],
      ['sm', 'maz:text-xl'],
      ['md', 'maz:text-2xl'],
      ['lg', 'maz:text-4xl'],
      ['xl', 'maz:text-5xl'],
    ] as const)('maps size %s to the matching tailwind text class', async (size, expected) => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG, size } })
      await nextTick()
      expect(wrapper.classes()).toContain(expected)
    })
  })

  describe('title prop', () => {
    it('injects a <title> element inside the inlined SVG', async () => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG, title: 'Star icon' } })
      await nextTick()
      expect(wrapper.html()).toContain('<title>Star icon</title>')
    })

    it('escapes HTML special characters in the title', async () => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG, title: '<bad> & "co"' } })
      await nextTick()
      expect(wrapper.html()).toContain('&lt;bad&gt; &amp; "co"')
    })
  })

  describe('svgAttributes prop', () => {
    it('merges custom attributes onto the inlined <svg>', async () => {
      const wrapper = mount(MazIcon, {
        props: {
          icon: RAW_SVG,
          svgAttributes: { 'data-testid': 'star', 'fill': 'red' },
        },
      })
      await nextTick()
      expect(wrapper.html()).toContain('data-testid="star"')
      expect(wrapper.html()).toContain('fill="red"')
    })
  })

  describe('a11y', () => {
    it('marks the icon as decorative (aria-hidden) by default', async () => {
      const wrapper = mount(MazIcon, { props: { icon: RAW_SVG } })
      await nextTick()
      expect(wrapper.attributes('aria-hidden')).toBe('true')
      expect(wrapper.attributes('role')).toBeUndefined()
    })

    it('exposes role="img" and drops aria-hidden when an aria-label is provided', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG },
        attrs: { 'aria-label': 'star' },
      })
      await nextTick()
      expect(wrapper.attributes('role')).toBe('img')
      expect(wrapper.attributes('aria-hidden')).toBeUndefined()
    })

    it('exposes role="img" when aria-label is set via svgAttributes', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG, svgAttributes: { 'aria-label': 'star' } },
      })
      await nextTick()
      expect(wrapper.attributes('role')).toBe('img')
    })

    it('respects an explicit aria-hidden attribute from the consumer', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG },
        attrs: { 'aria-hidden': 'false' },
      })
      await nextTick()
      expect(wrapper.attributes('aria-hidden')).toBe('false')
    })
  })

  describe('flipIconForRtl', () => {
    it('does not add the flip class by default', () => {
      const wrapper = shallowMount(MazIcon, { props: { icon: ComponentIcon as any } })
      expect(wrapper.classes()).not.toContain('m-icon--flip-for-rtl')
    })

    it('adds the m-icon--flip-for-rtl class when enabled', () => {
      const wrapper = shallowMount(MazIcon, {
        props: { icon: ComponentIcon as any, flipIconForRtl: true },
      })
      expect(wrapper.classes()).toContain('m-icon--flip-for-rtl')
    })
  })

  describe('SVG normalization', () => {
    it('strips existing width/height from the root <svg> and pins them to 1em', async () => {
      const big = '<svg width="48" height="48" viewBox="0 0 48 48"><path d="M0 0h24v24H0z"/></svg>'
      const wrapper = mount(MazIcon, { props: { icon: big } })
      await nextTick()
      expect(wrapper.html()).toContain('width="1em"')
      expect(wrapper.html()).toContain('height="1em"')
      expect(wrapper.html()).not.toContain('width="48"')
      expect(wrapper.html()).not.toContain('height="48"')
    })
  })
})
