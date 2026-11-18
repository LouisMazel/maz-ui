import MazIcon from '@components/MazIcon.vue'
import { registerIcon, registerIcons } from '@maz-ui/icons/registry'
import { mount, shallowMount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SVG_PREFETCH_FAILURE_TTL_MS, svgTextCache } from '../../../src/utils/svg-utils'

const serverMode = vi.hoisted(() => ({ enabled: false }))

vi.mock('@maz-ui/utils/helpers/isServer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@maz-ui/utils/helpers/isServer')>()
  return {
    isServer: () => serverMode.enabled || actual.isServer(),
  }
})

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
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG },
      })
      await nextTick()
      expect(wrapper.html()).toContain('viewBox="0 0 24 24"')
      expect(wrapper.html()).toContain('<svg width="1em" height="1em"')
    })

    it('reacts to a new raw SVG when the icon prop changes', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG },
      })
      await nextTick()
      expect(wrapper.html()).toContain('M0 0h24v24H0z')

      await wrapper.setProps({ icon: SECOND_RAW_SVG })
      await nextTick()
      expect(wrapper.html()).toContain('<circle')
    })
  })

  describe('given registered icon names', () => {
    beforeEach(() => {
      registerIcons({
        'test-star': RAW_SVG,
        'app:test-logo': SECOND_RAW_SVG,
      })
    })

    describe('when the icon is a registered name', () => {
      it('then it renders the registered SVG inline', () => {
        const wrapper = mount(MazIcon, {
          props: { icon: 'test-star' },
        })

        expect(wrapper.html()).toContain('<svg width="1em" height="1em" viewBox="0 0 24 24">')
      })
    })

    describe('when the icon is a prefixed name', () => {
      it('then it renders the SVG registered under the prefix', () => {
        const wrapper = mount(MazIcon, {
          props: { icon: 'app:test-logo' },
        })

        expect(wrapper.html()).toContain('<circle')
      })
    })

    describe('when the name changes', () => {
      it('then it renders the new icon synchronously', async () => {
        const wrapper = mount(MazIcon, {
          props: { icon: 'test-star' },
        })

        await wrapper.setProps({ icon: 'app:test-logo' })

        expect(wrapper.html()).toContain('<circle')
      })
    })

    describe('when the icon is a registered name rendered on the server', () => {
      it('then the server output contains the SVG', async () => {
        const html = await renderToString(createSSRApp({
          render: () => h(MazIcon, { icon: 'test-star' }),
        }))

        expect(html).toContain('M0 0h24v24H0z')
      })
    })

    describe('when the name is registered after the first render', () => {
      it('then the icon replaces the fallback on the next change', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const wrapper = mount(MazIcon, {
          props: { icon: 'test-late', fallback: ComponentIcon as any },
        })

        registerIcon('test-late', RAW_SVG)
        await wrapper.setProps({ title: 'Late' })

        expect(wrapper.html()).toContain('<title>Late</title>')
        warnSpy.mockRestore()
      })
    })
  })

  describe('given an unknown icon name', () => {
    describe('when it is rendered', () => {
      it('then it warns, emits an error and renders the fallback', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const wrapper = mount(MazIcon, {
          props: { icon: 'test-unknown', fallback: ComponentIcon as any },
        })

        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown icon "test-unknown"'))
        expect(wrapper.emitted('error')?.[0][0]).toBeInstanceOf(Error)
        expect(wrapper.find('[data-testid="component-icon"]').exists()).toBe(true)
        warnSpy.mockRestore()
      })
    })

    describe('when it is rendered several times', () => {
      it('then it warns once', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        mount(MazIcon, {
          props: { icon: 'test-unknown-twice' },
        })
        mount(MazIcon, {
          props: { icon: 'test-unknown-twice' },
        })

        expect(warnSpy).toHaveBeenCalledTimes(1)
        warnSpy.mockRestore()
      })
    })

    describe('when the fallback is a raw SVG', () => {
      it('then it renders the fallback inline', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const wrapper = mount(MazIcon, {
          props: { icon: 'test-unknown-raw', fallback: SECOND_RAW_SVG },
        })

        expect(wrapper.html()).toContain('<circle')
        warnSpy.mockRestore()
      })
    })

    describe('when it is rendered on the server', () => {
      it('then the server output has no pending placeholder', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const html = await renderToString(createSSRApp({
          render: () => h(MazIcon, { icon: 'app:test-missing', fallback: ComponentIcon }),
        }))

        expect(html).toContain('data-testid="component-icon"')
        warnSpy.mockRestore()
      })
    })
  })

  describe('given a string that is neither a name, a SVG nor a URL', () => {
    describe('when it replaces a raw SVG', () => {
      it('then nothing is rendered', async () => {
        const wrapper = mount(MazIcon, {
          props: { icon: RAW_SVG },
        })

        await wrapper.setProps({ icon: 'not an icon' })

        expect(wrapper.find('svg').exists()).toBe(false)
      })
    })
  })

  describe('given a raw SVG icon', () => {
    describe('when it is replaced by a component', () => {
      it('then the component is rendered', async () => {
        const wrapper = mount(MazIcon, {
          props: { icon: RAW_SVG },
        })

        await wrapper.setProps({ icon: ComponentIcon as any })

        expect(wrapper.find('[data-testid="component-icon"]').exists()).toBe(true)
        expect(wrapper.html()).not.toContain('M0 0h24v24H0z')
      })
    })
  })

  describe('icon: Vue component', () => {
    it('renders the component via <component :is>', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: ComponentIcon as any },
      })
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

      const wrapper = mount(MazIcon, {
        props: { icon: '/icons/star.svg' },
      })
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

    it('reserves the icon box while the URL loads', () => {
      globalThis.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof globalThis.fetch

      const wrapper = mount(MazIcon, {
        props: { icon: 'https://cdn.example.com/loading.svg' },
      })

      expect(wrapper.find('span.m-icon').exists()).toBe(true)
      expect(wrapper.find('svg').exists()).toBe(false)
    })

    it('inlines an SVG data URI synchronously, without fetching it', () => {
      globalThis.fetch = vi.fn() as unknown as typeof globalThis.fetch

      const wrapper = mount(MazIcon, {
        props: { icon: `data:image/svg+xml,${encodeURIComponent(RAW_SVG)}` },
      })

      expect(globalThis.fetch).not.toHaveBeenCalled()
      expect(wrapper.html()).toContain('viewBox="0 0 24 24"')
    })

    it('fetches a data URI that is not an SVG', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('not an svg'),
      }) as unknown as typeof globalThis.fetch
      const icon = 'data:image/png;base64,iVBORw0KGgo='

      const wrapper = mount(MazIcon, {
        props: { icon, fallback: ComponentIcon as any },
      })
      await new Promise(resolve => setTimeout(resolve, 0))
      await nextTick()

      expect(globalThis.fetch).toHaveBeenCalledWith(icon)
      expect(wrapper.find('[data-testid="component-icon"]').exists()).toBe(true)

      warnSpy.mockRestore()
    })
  })

  describe('fallback', () => {
    it('renders the fallback component when no icon prop is provided', async () => {
      const wrapper = mount(MazIcon, {
        props: { fallback: ComponentIcon as any },
      })
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
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG, size: 'lg' },
      })
      await nextTick()
      expect(wrapper.attributes('style') ?? '').not.toContain('font-size')
      expect(wrapper.classes()).toContain('m-icon--lg')
    })

    it('applies fontSize style for custom CSS lengths', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG, size: '2rem' },
      })
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
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG, size },
      })
      await nextTick()
      expect(wrapper.classes()).toContain(expected)
    })
  })

  describe('title prop', () => {
    it('injects a <title> element inside the inlined SVG', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG, title: 'Star icon' },
      })
      await nextTick()
      expect(wrapper.html()).toContain('<title>Star icon</title>')
    })

    it('escapes HTML special characters in the title', async () => {
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG, title: '<bad> & "co"' },
      })
      await nextTick()
      expect(wrapper.html()).toContain('&lt;bad&gt; &amp; "co"')
    })

    describe('given a title on a raw SVG', () => {
      describe('when the icon is rendered', () => {
        it('then the icon is exposed as an image named by the title', async () => {
          const wrapper = mount(MazIcon, {
            props: { icon: RAW_SVG, title: 'Toggle dark mode' },
          })
          await nextTick()

          expect(wrapper.attributes('role')).toBe('img')
          expect(wrapper.attributes('aria-label')).toBe('Toggle dark mode')
          expect(wrapper.attributes('aria-hidden')).toBeUndefined()
        })
      })
    })

    describe('given a title on a component icon', () => {
      describe('when the icon is rendered', () => {
        it('then the component is exposed as an image named by the title', async () => {
          const wrapper = mount(MazIcon, {
            props: { icon: ComponentIcon, title: 'Delete' },
          })
          await nextTick()

          const svg = wrapper.find('[data-testid="component-icon"]')

          expect(svg.attributes('role')).toBe('img')
          expect(svg.attributes('aria-label')).toBe('Delete')
          expect(svg.attributes('aria-hidden')).toBeUndefined()
        })
      })
    })

    describe('given a title and an aria-label', () => {
      describe('when the icon is rendered', () => {
        it('then the aria-label is kept', async () => {
          const wrapper = mount(MazIcon, {
            props: { icon: ComponentIcon, title: 'Delete' },
            attrs: { 'aria-label': 'Remove the row' },
          })
          await nextTick()

          expect(wrapper.find('[data-testid="component-icon"]').attributes('aria-label')).toBe('Remove the row')
        })
      })
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
      const wrapper = mount(MazIcon, {
        props: { icon: RAW_SVG },
      })
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
        props: {
          icon: RAW_SVG,
          svgAttributes: { 'aria-label': 'star' },
        },
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
      const wrapper = shallowMount(MazIcon, {
        props: { icon: ComponentIcon as any },
      })
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
      const wrapper = mount(MazIcon, {
        props: { icon: big },
      })
      await nextTick()
      expect(wrapper.html()).toContain('width="1em"')
      expect(wrapper.html()).toContain('height="1em"')
      expect(wrapper.html()).not.toContain('width="48"')
      expect(wrapper.html()).not.toContain('height="48"')
    })
  })

  describe('SSR', () => {
    let originalFetch: typeof globalThis.fetch
    let fetchMock: ReturnType<typeof vi.fn>

    const SVG_DATA_URI = `data:image/svg+xml,${encodeURIComponent(RAW_SVG)}`

    function renderOnServer(render: () => any, provides: Record<string, unknown> = {}) {
      serverMode.enabled = true
      const app = createSSRApp({ render })
      for (const [key, value] of Object.entries(provides))
        app.provide(key, value)
      return renderToString(app).finally(() => {
        serverMode.enabled = false
      })
    }

    /** Let the background requests settle. */
    function flushRequests() {
      return new Promise(resolve => setTimeout(resolve, 0))
    }

    beforeEach(() => {
      originalFetch = globalThis.fetch
      fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(RAW_SVG),
      })
      globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch
    })

    afterEach(() => {
      globalThis.fetch = originalFetch
      serverMode.enabled = false
      vi.restoreAllMocks()
    })

    describe('URL icon not cached on the server', () => {
      it('renders an empty placeholder without waiting for the network', async () => {
        fetchMock.mockReturnValue(new Promise(() => {}))

        const html = await renderOnServer(() => h(MazIcon, { icon: 'https://cdn.example.com/ssr-hanging.svg' }))

        expect(html).toContain('class="m-icon')
        expect(html).not.toContain('<svg')
      })

      it('warms the server cache so that the next renders inline the icon', async () => {
        const url = 'https://cdn.example.com/ssr-warm-up.svg'

        await renderOnServer(() => h(MazIcon, { icon: url }))
        await flushRequests()
        const html = await renderOnServer(() => h(MazIcon, { icon: url }))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock).toHaveBeenCalledWith(url, {
          signal: expect.any(AbortSignal),
        })
        expect(html).toContain('viewBox="0 0 24 24"')
      })

      it('neither refetches nor logs a failed URL again until the failure expires', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(0)
        fetchMock.mockResolvedValue({ ok: false, status: 404 })
        const render = () => h(MazIcon, { icon: 'https://cdn.example.com/ssr-missing.svg' })

        await renderOnServer(render)
        await flushRequests()
        await renderOnServer(render)
        await flushRequests()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(warnSpy).toHaveBeenCalledTimes(1)

        dateSpy.mockReturnValue(SVG_PREFETCH_FAILURE_TTL_MS)
        await renderOnServer(render)
        await flushRequests()

        expect(fetchMock).toHaveBeenCalledTimes(2)
      })

      it('does not fetch a relative URL without an absolute mazIconPath', async () => {
        await renderOnServer(() => h(MazIcon, { icon: '/icons/ssr-relative.svg' }))
        await renderOnServer(() => h(MazIcon, { icon: '/icons/ssr-relative.svg' }), { mazIconPath: '/icons' })

        expect(fetchMock).not.toHaveBeenCalled()
      })

      it('fetches a relative URL resolved with an absolute mazIconPath', async () => {
        await renderOnServer(() => h(MazIcon, { icon: '/icons/ssr-public.svg' }), { mazIconPath: 'https://my-app.com' })

        expect(fetchMock).toHaveBeenCalledWith('https://my-app.com/icons/ssr-public.svg', expect.anything())
      })
    })

    describe('icon resolved without network', () => {
      it.each([
        ['a raw SVG', RAW_SVG],
        ['a percent-encoded SVG data URI', SVG_DATA_URI],
        ['a base64 SVG data URI', `data:image/svg+xml;base64,${btoa(RAW_SVG)}`],
      ])('inlines %s in the server output', async (_, icon) => {
        const html = await renderOnServer(() => h(MazIcon, { icon }))

        expect(fetchMock).not.toHaveBeenCalled()
        expect(html).toContain('viewBox="0 0 24 24"')
      })
    })

    describe('hydration', () => {
      async function hydrate(render: () => any) {
        const html = await renderOnServer(render)
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        // The browser starts with an empty cache.
        svgTextCache.clear()
        fetchMock.mockClear()

        const container = document.createElement('div')
        container.innerHTML = html
        createSSRApp({ render }).mount(container)

        const hasMismatch = () => [
          ...warnSpy.mock.calls,
          ...errorSpy.mock.calls,
        ]
          .some(([message]) => /hydration/i.test(String(message)))
        return { html, container, hasMismatch }
      }

      it('keeps the icon rendered by the server while the client loads it', async () => {
        const url = 'https://cdn.example.com/hydrate-cached.svg'
        svgTextCache.set(url, RAW_SVG)

        const { html, container, hasMismatch } = await hydrate(() => h(MazIcon, { icon: url }))

        expect(html).toContain('viewBox="0 0 24 24"')
        expect(container.innerHTML).toContain('viewBox="0 0 24 24"')
        expect(hasMismatch()).toBe(false)

        await flushRequests()
        await nextTick()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).toContain('viewBox="0 0 24 24"')
      })

      it('renders the same placeholder on both sides when the server has not loaded the icon yet', async () => {
        const { html, container, hasMismatch } = await hydrate(() => h(MazIcon, { icon: 'https://cdn.example.com/hydrate-cold.svg' }))

        expect(html).not.toContain('<svg')
        expect(hasMismatch()).toBe(false)

        await flushRequests()
        await nextTick()

        expect(container.innerHTML).toContain('viewBox="0 0 24 24"')
      })

      it('hydrates a data URI icon without fetching it', async () => {
        const { container, hasMismatch } = await hydrate(() => h(MazIcon, { icon: SVG_DATA_URI }))

        expect(container.innerHTML).toContain('viewBox="0 0 24 24"')
        expect(hasMismatch()).toBe(false)

        await flushRequests()

        expect(fetchMock).not.toHaveBeenCalled()
      })
    })
  })

  describe('mazIconPath', () => {
    let originalFetch: typeof globalThis.fetch

    beforeEach(() => {
      originalFetch = globalThis.fetch
    })

    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    it('renders a cached relative URL synchronously on remount, without refetching', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(RAW_SVG),
      })
      globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch
      const options = {
        props: { icon: '/icons/remount.svg' },
        global: {
          provide: { mazIconPath: 'https://cdn.example.com/' },
        },
      }

      mount(MazIcon, options)
      await new Promise(resolve => setTimeout(resolve, 0))
      const remounted = mount(MazIcon, options)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith('https://cdn.example.com/icons/remount.svg')
      expect(remounted.html()).toContain('viewBox="0 0 24 24"')
    })

    describe('when resolving relative URLs', () => {
      it.each([
        ['/icons', '/star.svg', '/icons/star.svg'],
        ['/icons/', '/icons/star.svg', '/icons/star.svg'],
        ['/icons', '/icons-v2/star.svg', '/icons/icons-v2/star.svg'],
        ['https://cdn.example.com/icons', '/icons/star.svg', 'https://cdn.example.com/icons/star.svg'],
        ['https://cdn.example.com/icons', '/star.svg', 'https://cdn.example.com/icons/star.svg'],
        ['https://cdn.example.com', '/icons/star.svg', 'https://cdn.example.com/icons/star.svg'],
      ])('then with the path %s, %s is fetched from %s', async (mazIconPath, icon, url) => {
        const fetchMock = vi.fn().mockResolvedValue({
          ok: true,
          text: () => Promise.resolve(RAW_SVG),
        })
        const query = `?base=${mazIconPath}&icon=${icon}`
        globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch

        mount(MazIcon, {
          props: { icon: `${icon}${query}` },
          global: {
            provide: { mazIconPath },
          },
        })
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(fetchMock).toHaveBeenCalledWith(`${url}${query}`)
      })
    })
  })

  describe('given an SVG file with an XML prolog and a doctype', () => {
    const PROLOG = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'

    describe('when it is fetched from a URL', () => {
      it('then its svg is rendered without the prolog', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
          ok: true,
          text: () => Promise.resolve(`${PROLOG}${RAW_SVG}`),
        }) as unknown as typeof globalThis.fetch

        const wrapper = mount(MazIcon, {
          props: { icon: '/prolog/star.svg' },
        })
        await new Promise(resolve => setTimeout(resolve, 0))
        await nextTick()

        expect(wrapper.html()).toContain('d="M0 0h24v24H0z"')
        expect(wrapper.html()).not.toContain('DOCTYPE')
      })
    })

    describe('when it is passed as a raw string', () => {
      it('then its svg is rendered without the prolog and without request', () => {
        globalThis.fetch = vi.fn() as unknown as typeof globalThis.fetch

        const wrapper = mount(MazIcon, {
          props: { icon: `${PROLOG}${RAW_SVG}` },
        })

        expect(globalThis.fetch).not.toHaveBeenCalled()
        expect(wrapper.html()).toContain('d="M0 0h24v24H0z"')
        expect(wrapper.html()).not.toContain('DOCTYPE')
      })
    })
  })
})
