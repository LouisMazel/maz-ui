import MazCodeHighlight from '@components/MazCodeHighlight.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre class="shiki github-light"><code>highlighted code</code></pre>'),
  codeToTokens: vi.fn().mockImplementation((code: string, options: { grammarState?: { end: number } }) => Promise.resolve({
    tokens: code.split('\n').map(line => [
      {
        content: line,
        offset: 0,
        color: '#123456',
        fontStyle: line.startsWith('!')
          ? 3
          : 0,
      },
    ]),
    fg: '#000000',
    bg: '#ffffff',
    themeName: 'github-light',
    grammarState: { end: (options.grammarState?.end ?? 0) + code.length },
  })),
}))

describe('given MazCodeHighlight component', () => {
  describe('when rendered with code prop', () => {
    it('then it renders the highlighted html', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.html()).toContain('highlighted code')
    })

    it('then it calls shiki codeToHtml with the code', async () => {
      const { codeToHtml } = await import('shiki')
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1', language: 'typescript' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('const x = 1', expect.objectContaining({
        lang: 'typescript',
      }))
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when rendered with default slot', () => {
    it('then it uses slot text as code when code prop is not set', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        slots: { default: 'const y = 2' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('const y = 2', expect.any(Object))
    })

    it('then it extracts nested text from slot children arrays', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        slots: { default: '<span>hello<span> world</span></span>' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith(expect.stringContaining('hello'), expect.any(Object))
    })

    it('then it handles a slot with no children gracefully', async () => {
      const wrapper = mount(MazCodeHighlight, {
        slots: {
          default: () => [],
        },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight').exists()).toBe(true)
    })

    it('then code prop takes priority over slot content', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        props: { code: 'prop code' },
        slots: { default: 'slot code' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('prop code', expect.any(Object))
    })
  })

  describe('when rendered with language prop', () => {
    it('then it passes language to shiki', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        props: { code: 'echo hello', language: 'bash' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('echo hello', expect.objectContaining({
        lang: 'bash',
      }))
    })
  })

  describe('when rendered with theme prop', () => {
    it('then it uses the provided theme', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mount(MazCodeHighlight, {
        props: { code: 'const x = 1', theme: 'dracula' },
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('const x = 1', expect.objectContaining({
        theme: 'dracula',
      }))
    })
  })

  describe('when code prop is empty', () => {
    it('then it renders the root div without highlighted html', async () => {
      const wrapper = mount(MazCodeHighlight)
      await flushPromises()

      const root = wrapper.find('.m-code-highlight')
      expect(root.exists()).toBe(true)
      expect(root.find('.m-code-highlight__content').html()).toContain('class="m-code-highlight__content"></div>')
    })
  })

  describe('when the document dark class changes', () => {
    it('then the MutationObserver callback runs without error', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      document.documentElement.classList.add('dark')
      await flushPromises()
      document.documentElement.classList.remove('dark')
      await flushPromises()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when rendered before shiki resolves', () => {
    it('then it renders the escaped code with the shiki block styles', () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = <div>' },
      })

      expect(wrapper.html()).toContain('<pre class="shiki"><code>const x = &lt;div&gt;</code></pre>')
    })
  })

  describe('when rendered on the server', () => {
    it('then the html contains the code', async () => {
      const html = await renderToString(createSSRApp(MazCodeHighlight, { code: 'const x = 1' }))

      expect(html).toContain('<pre class="shiki"><code>const x = 1</code></pre>')
    })
  })

  describe('when shiki fails to load', () => {
    it('then it falls back to plain pre/code', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockRejectedValueOnce(new Error('shiki error'))

      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'fallback code' },
      })
      await flushPromises()

      expect(wrapper.html()).toContain('<pre class="shiki"><code>fallback code</code></pre>')
    })

    it('then it escapes html entities in the fallback to prevent xss', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockRejectedValueOnce(new Error('shiki error'))

      const wrapper = mount(MazCodeHighlight, {
        props: { code: '</code></pre><img src=x onerror="alert(1)">' },
      })
      await flushPromises()

      const html = wrapper.html()
      expect(wrapper.find('img').exists()).toBe(false)
      expect(html).not.toContain('</code></pre><img')
      expect(html).toContain('&lt;img src=x')
      expect(html).toContain('&lt;/code&gt;&lt;/pre&gt;')
    })
  })

  describe('when rendered with rounded prop set to false', () => {
    it('then it adds the --no-rounded modifier class', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1', rounded: false },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight').classes()).toContain('--no-rounded')
    })

    it('then it omits the --no-rounded modifier class by default', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight').classes()).not.toContain('--no-rounded')
    })
  })

  describe('when rendered with copyable prop', () => {
    it('then it renders the copy button by default', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').exists()).toBe(true)
    })

    it('then it hides the copy button when copyable is false', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1', copyable: false },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').exists()).toBe(false)
    })

    it('then it hides the copy button when there is no code', async () => {
      const wrapper = mount(MazCodeHighlight)
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').exists()).toBe(false)
    })
  })

  describe('when the copy button is clicked', () => {
    it('then it writes the resolved code to the clipboard', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText },
      })

      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'npm install' },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')

      expect(writeText).toHaveBeenCalledWith('npm install')
    })

    it('then it writes copyValue to the clipboard when provided', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText },
      })

      const wrapper = mount(MazCodeHighlight, {
        props: { code: '$ npm install', copyValue: 'npm install' },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')

      expect(writeText).toHaveBeenCalledWith('npm install')
    })
  })

  describe('when rendered without translations override', () => {
    it('then the copy button falls back to the translation composable output', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('test')
    })
  })

  describe('when rendered with custom translations prop', () => {
    it('then it overrides the copy aria label', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: {
          code: 'const x = 1',
          translations: { copyToClipboard: 'Custom copy label' },
        },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Custom copy label')
    })

    it('then it overrides the copied aria label after a successful copy', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText },
      })

      const wrapper = mount(MazCodeHighlight, {
        props: {
          code: 'const x = 1',
          translations: { copiedToClipboard: 'Custom copied label' },
        },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')
      await flushPromises()

      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Custom copied label')
    })
  })

  describe('when the copied state expires', () => {
    it('then it reverts to the default copy label after the timeout', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText },
      })

      const wrapper = mount(MazCodeHighlight, {
        props: {
          code: 'const x = 1',
          translations: { copyToClipboard: 'Copy', copiedToClipboard: 'Copied' },
        },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')
      await flushPromises()
      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Copied')

      vi.advanceTimersByTime(1600)
      await flushPromises()
      expect(wrapper.find('.m-code-highlight__copy-btn').attributes('aria-label')).toBe('Copy')

      vi.useRealTimers()
    })
  })

  describe('when the component is unmounted', () => {
    it('then it disconnects the observer and clears the copy timer', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText },
      })

      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      await wrapper.find('.m-code-highlight__copy-btn').trigger('click')
      await flushPromises()

      expect(() => wrapper.unmount()).not.toThrow()
    })
  })
  describe('when the color mode is resolved', () => {
    const themeStateProvide = (isDark: boolean) => ref({ isDark })

    async function lastTheme(options: {
      props?: Record<string, unknown>
      parentClass?: string
      themeState?: ReturnType<typeof themeStateProvide>
      htmlDark?: boolean
    } = {}) {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()
      document.documentElement.classList.toggle('dark', !!options.htmlDark)
      const parent = document.createElement('div')
      if (options.parentClass)
        parent.className = options.parentClass
      document.body.append(parent)
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1', ...options.props },
        attachTo: parent,
        global: {
          provide: options.themeState
            ? { mazThemeState: options.themeState }
            : {},
        },
      })
      await flushPromises()
      const calls = vi.mocked(codeToHtml).mock.calls
      const theme = (calls.at(-1)?.[1] as { theme: string }).theme
      return { wrapper, theme, parent }
    }

    afterEach(() => {
      document.documentElement.classList.remove('dark')
      document.body.innerHTML = ''
    })

    describe('given no theme plugin and no dark class', () => {
      it('then it uses the light theme', async () => {
        const { theme } = await lastTheme()
        expect(theme).toBe('github-light')
      })
    })

    describe('given the html element has the dark class and no theme plugin', () => {
      it('then it uses the dark theme', async () => {
        const { theme } = await lastTheme({ htmlDark: true })
        expect(theme).toBe('tokyo-night')
      })
    })

    describe('given a dark ancestor', () => {
      it('then it uses the dark theme without any prop', async () => {
        const { theme } = await lastTheme({ parentClass: 'dark' })
        expect(theme).toBe('tokyo-night')
      })

      it('then it takes priority over a light theme state', async () => {
        const { theme } = await lastTheme({
          parentClass: 'dark',
          themeState: themeStateProvide(false),
        })
        expect(theme).toBe('tokyo-night')
      })

      it('then it reacts when the ancestor class changes', async () => {
        const { theme, parent } = await lastTheme()
        const { codeToHtml } = await import('shiki')
        expect(theme).toBe('github-light')

        parent.classList.add('dark')
        await flushPromises()
        await vi.waitFor(() => expect(vi.mocked(codeToHtml).mock.calls.at(-1)?.[1]).toMatchObject({ theme: 'tokyo-night' }))

        parent.classList.remove('dark')
        await vi.waitFor(() => expect(vi.mocked(codeToHtml).mock.calls.at(-1)?.[1]).toMatchObject({ theme: 'github-light' }))
      })
    })

    describe('given a theme state', () => {
      it('then it uses the dark theme when the state is dark', async () => {
        const { theme } = await lastTheme({
          themeState: themeStateProvide(true),
        })
        expect(theme).toBe('tokyo-night')
      })

      it('then it uses the light theme when the state is light', async () => {
        const { theme } = await lastTheme({
          themeState: themeStateProvide(false),
        })
        expect(theme).toBe('github-light')
      })

      it('then it takes priority over the html class', async () => {
        const { theme } = await lastTheme({
          themeState: themeStateProvide(false),
          htmlDark: false,
        })
        expect(theme).toBe('github-light')
      })

      it('then it follows the state changes', async () => {
        const themeState = themeStateProvide(false)
        await lastTheme({ themeState })
        const { codeToHtml } = await import('shiki')
        themeState.value = { isDark: true }
        await vi.waitFor(() => expect(vi.mocked(codeToHtml).mock.calls.at(-1)?.[1]).toMatchObject({ theme: 'tokyo-night' }))
      })

      it('then it renders on the server with the state', async () => {
        const html = await renderToString(createSSRApp(MazCodeHighlight, { code: 'const x = 1' }).provide('mazThemeState', themeStateProvide(true)))
        expect(html).toContain('const x = 1')
      })
    })

    describe('given the colorMode prop', () => {
      it('then dark forces the dark theme and the dark class over a light state', async () => {
        const { theme, wrapper } = await lastTheme({
          props: { colorMode: 'dark' },
          themeState: themeStateProvide(false),
        })
        expect(theme).toBe('tokyo-night')
        expect(wrapper.find('.m-code-highlight').classes()).toContain('dark')
      })

      it('then light forces the light theme and the light class over a dark ancestor', async () => {
        const { theme, wrapper } = await lastTheme({
          props: { colorMode: 'light' },
          parentClass: 'dark',
          htmlDark: true,
        })
        expect(theme).toBe('github-light')
        expect(wrapper.find('.m-code-highlight').classes()).toContain('light')
        expect(wrapper.find('.m-code-highlight').classes()).not.toContain('dark')
      })

      it('then auto adds no mode class', async () => {
        const { wrapper } = await lastTheme({
          props: { colorMode: 'auto' },
        })
        expect(wrapper.find('.m-code-highlight').classes()).not.toContain('dark')
        expect(wrapper.find('.m-code-highlight').classes()).not.toContain('light')
      })

      it('then the theme prop keeps priority over the forced mode', async () => {
        const { theme } = await lastTheme({
          props: { colorMode: 'dark', theme: 'dracula' },
        })
        expect(theme).toBe('dracula')
      })
    })
  })

  describe('when rendered with the display props', () => {
    it('then size, wrap and max height are applied on the root', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: {
          code: 'const x = 1',
          size: 'xs',
          wrap: true,
          maxHeight: '12rem',
        },
      })
      await flushPromises()

      const root = wrapper.find('.m-code-highlight')
      expect(root.classes()).toEqual(expect.arrayContaining(['--size-xs', '--wrap']))
      expect(root.attributes('style')).toContain('--m-code-highlight-max-height: 12rem')
    })

    it('then the medium size and no max height are the defaults', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'const x = 1' },
      })
      await flushPromises()

      const root = wrapper.find('.m-code-highlight')
      expect(root.classes()).toContain('--size-md')
      expect(root.attributes('style')).toBeUndefined()
    })

    it('then hideLanguage removes the language badge', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'echo 1', language: 'log', hideLanguage: true },
      })
      await flushPromises()

      expect(wrapper.text()).not.toContain('log')
    })
  })

  describe('when following streamed code', () => {
    it('then only the appended lines are tokenized, from the grammar state of the previous ones', async () => {
      const { codeToHtml, codeToTokens } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()
      vi.mocked(codeToTokens).mockClear()

      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'one\ntwo', language: 'log', follow: true },
      })
      await flushPromises()
      expect(codeToHtml).not.toHaveBeenCalled()
      expect(vi.mocked(codeToTokens).mock.calls.map(call => call[0])).toEqual(['one', 'two'])

      vi.mocked(codeToTokens).mockClear()
      await wrapper.setProps({ code: 'one\ntwo\nthree' })
      await flushPromises()

      expect(vi.mocked(codeToTokens).mock.calls.map(call => [call[0], call[1].grammarState])).toEqual([
        [
          'two',
          { end: 3 },
        ],
        [
          'three',
          { end: 6 },
        ],
      ])
      const lines = wrapper.findAll('.line').map(line => line.text())
      expect(lines).toEqual(['one', 'two', 'three'])
      expect(wrapper.find('pre.shiki').attributes('style')).toContain('background-color:#ffffff')
    })

    it('then a code that is not an extension of the previous one is highlighted again from the start', async () => {
      const { codeToTokens } = await import('shiki')
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'one\ntwo', follow: true },
      })
      await flushPromises()

      vi.mocked(codeToTokens).mockClear()
      await wrapper.setProps({ code: 'other\nlines' })
      await flushPromises()

      expect(vi.mocked(codeToTokens).mock.calls.map(call => [call[0], call[1].grammarState])).toEqual([
        ['other', undefined],
        [
          'lines',
          { end: 5 },
        ],
      ])
      expect(wrapper.findAll('.line').map(line => line.text())).toEqual(['other', 'lines'])
    })

    it('then the token styles and the html are escaped', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: '!<b>bold</b>', follow: true },
      })
      await flushPromises()

      const token = wrapper.find('.line span')
      expect(token.text()).toBe('!<b>bold</b>')
      expect(token.attributes('style')).toBe('color:#123456;font-style:italic;font-weight:bold')
    })

    it('then it falls back to plain text when tokenizing fails', async () => {
      const { codeToTokens } = await import('shiki')
      vi.mocked(codeToTokens).mockRejectedValueOnce(new Error('no shiki'))
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'a\nb', follow: true },
      })
      await flushPromises()

      expect(wrapper.find('pre code').text()).toBe('a\nb')
    })

    it('then it sticks to the bottom until the user scrolls up', async () => {
      // jsdom has no layout: every pre measures 500px of content in a 100px box, and keeps its scroll position.
      const tops = new WeakMap<Element, number>()
      const scrollTop = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop')!
      const scrollHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight')!
      const clientHeight = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight')!
      Object.defineProperty(Element.prototype, 'scrollTop', {
        configurable: true,
        get() { return tops.get(this) ?? 0 },
        set(value: number) { tops.set(this, value) },
      })
      Object.defineProperty(Element.prototype, 'scrollHeight', {
        configurable: true,
        get: () => 500,
      })
      Object.defineProperty(Element.prototype, 'clientHeight', {
        configurable: true,
        get: () => 100,
      })

      try {
        const wrapper = mount(MazCodeHighlight, {
          props: { code: 'one', follow: true, maxHeight: '4rem' },
        })
        await flushPromises()
        const pre = () => wrapper.find('pre').element as HTMLElement

        await wrapper.setProps({ code: 'one\ntwo' })
        await flushPromises()
        expect(pre().scrollTop).toBe(500)

        pre().scrollTop = 120
        pre().dispatchEvent(new Event('scroll'))
        await wrapper.setProps({ code: 'one\ntwo\nthree' })
        await flushPromises()
        expect(pre().scrollTop).toBe(120)

        ;(wrapper.vm as unknown as { scrollToBottom: () => void }).scrollToBottom()
        await wrapper.setProps({ code: 'one\ntwo\nthree\nfour' })
        await flushPromises()
        expect(pre().scrollTop).toBe(500)
        wrapper.unmount()
      }
      finally {
        Object.defineProperty(Element.prototype, 'scrollTop', scrollTop)
        Object.defineProperty(Element.prototype, 'scrollHeight', scrollHeight)
        Object.defineProperty(Element.prototype, 'clientHeight', clientHeight)
      }
    })
  })
})

describe('given a MazCodeHighlight longer than its max height', () => {
  /** jsdom has no layout: every pre measures `content` px of code in a 100px box, and keeps its scroll position. */
  async function withLayout(content: number, run: () => Promise<void>) {
    const tops = new WeakMap<Element, number>()
    const descriptors = ['scrollTop', 'scrollHeight', 'clientHeight'].map(key => [
      key,
      Object.getOwnPropertyDescriptor(Element.prototype, key)!,
    ] as const)
    Object.defineProperty(Element.prototype, 'scrollTop', {
      configurable: true,
      get() { return tops.get(this) ?? 0 },
      set(value: number) { tops.set(this, value) },
    })
    Object.defineProperty(Element.prototype, 'scrollHeight', {
      configurable: true,
      get: () => content,
    })
    Object.defineProperty(Element.prototype, 'clientHeight', {
      configurable: true,
      get: () => 100,
    })
    try {
      await run()
    }
    finally {
      for (const [key, descriptor] of descriptors)
        Object.defineProperty(Element.prototype, key, descriptor)
    }
  }

  const bottomButton = '.m-code-highlight__bottom-btn'

  describe('when the user scrolls up', () => {
    it('then a button scrolls back to the last line, without follow too', async () => {
      await withLayout(500, async () => {
        const wrapper = mount(MazCodeHighlight, {
          props: { code: 'one\ntwo', maxHeight: '4rem' },
        })
        await flushPromises()
        const pre = () => wrapper.find('pre').element as HTMLElement
        expect(wrapper.find(bottomButton).exists()).toBe(false)

        pre().scrollTop = 120
        pre().dispatchEvent(new Event('scroll'))
        // MazBtn is an async component: wait for its chunk before looking for the button.
        await vi.dynamicImportSettled()
        await flushPromises()
        const button = wrapper.find(bottomButton)
        expect(button.exists()).toBe(true)

        await button.trigger('click')
        await flushPromises()
        expect(pre().scrollTop).toBe(500)
        expect(wrapper.find(bottomButton).exists()).toBe(false)
        wrapper.unmount()
      })
    })
  })

  describe('when the code fits in the block', () => {
    it('then there is no button', async () => {
      await withLayout(100, async () => {
        const wrapper = mount(MazCodeHighlight, {
          props: { code: 'one', maxHeight: '4rem' },
        })
        await flushPromises()
        const pre = () => wrapper.find('pre').element as HTMLElement
        pre().dispatchEvent(new Event('scroll'))
        // MazBtn is an async component: wait for its chunk before looking for the button.
        await vi.dynamicImportSettled()
        await flushPromises()

        expect(wrapper.find(bottomButton).exists()).toBe(false)
        wrapper.unmount()
      })
    })
  })

  describe('when a custom label is given', () => {
    it('then the button uses it', async () => {
      await withLayout(500, async () => {
        const wrapper = mount(MazCodeHighlight, {
          props: {
            code: 'one\ntwo',
            maxHeight: '4rem',
            translations: { scrollToBottom: 'Aller en bas' },
          },
        })
        await flushPromises()
        const pre = () => wrapper.find('pre').element as HTMLElement
        pre().scrollTop = 0
        pre().dispatchEvent(new Event('scroll'))
        // MazBtn is an async component: wait for its chunk before looking for the button.
        await vi.dynamicImportSettled()
        await flushPromises()

        expect(wrapper.find(bottomButton).attributes('aria-label')).toBe('Aller en bas')
        wrapper.unmount()
      })
    })
  })
})

describe('given MazUi global defaults for MazCodeHighlight', () => {
  function mountWithDefaults(props: Record<string, unknown> = {}) {
    return mount(MazCodeHighlight, {
      props: { code: 'echo 1', language: 'bash', ...props },
      global: {
        provide: {
          [GLOBAL_CONFIG_INJECTION_KEY as symbol]: {
            global: { size: 'lg' },
            MazCodeHighlight: {
              theme: 'github-dark-default',
              colorMode: 'dark',
              size: 'xs',
              wrap: true,
              hideLanguage: true,
              copyable: false,
              rounded: false,
            },
          },
        },
      },
    })
  }

  describe('when no prop is passed', () => {
    it('then the component defaults apply, before the global ones', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      const wrapper = mountWithDefaults()
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('echo 1', expect.objectContaining({ theme: 'github-dark-default' }))
      const root = wrapper.find('.m-code-highlight')
      expect(root.classes()).toEqual(expect.arrayContaining([
        '--size-xs',
        '--wrap',
        '--no-rounded',
        'dark',
      ]))
      expect(root.classes()).not.toContain('--size-lg')
      expect(wrapper.text()).not.toContain('bash')
      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('when the props are passed on the instance', () => {
    it('then the instance props win over the defaults', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      const wrapper = mountWithDefaults({
        theme: 'dracula',
        colorMode: 'light',
        size: 'sm',
        wrap: false,
        hideLanguage: false,
        rounded: true,
      })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('echo 1', expect.objectContaining({ theme: 'dracula' }))
      const root = wrapper.find('.m-code-highlight')
      expect(root.classes()).toEqual(expect.arrayContaining(['--size-sm', 'light']))
      expect(root.classes()).not.toEqual(expect.arrayContaining(['--wrap']))
      expect(root.classes()).not.toContain('--no-rounded')
      expect(wrapper.text()).toContain('bash')
    })
  })

  describe('when a light and a dark theme are set for the whole app', () => {
    function mountWithThemes(props: Record<string, unknown>) {
      return mount(MazCodeHighlight, {
        props: { code: 'echo 1', ...props },
        global: {
          provide: {
            [GLOBAL_CONFIG_INJECTION_KEY as symbol]: {
              MazCodeHighlight: { lightTheme: 'one-light', darkTheme: 'github-dark-default' },
            },
          },
        },
      })
    }

    it.each([
      ['light', 'one-light'],
      ['dark', 'github-dark-default'],
    ])('then the %s mode uses its theme', async (colorMode, expected) => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mountWithThemes({ colorMode })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('echo 1', expect.objectContaining({ theme: expected }))
    })

    it('then the theme of the instance wins over both', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mountWithThemes({ colorMode: 'dark', theme: 'dracula' })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('echo 1', expect.objectContaining({ theme: 'dracula' }))
    })

    it('then a dark theme of the instance wins over the app one', async () => {
      const { codeToHtml } = await import('shiki')
      vi.mocked(codeToHtml).mockClear()

      mountWithThemes({ colorMode: 'dark', darkTheme: 'vitesse-dark' })
      await flushPromises()

      expect(codeToHtml).toHaveBeenCalledWith('echo 1', expect.objectContaining({ theme: 'vitesse-dark' }))
    })
  })

  describe('when only the global defaults are set', () => {
    it('then the global size applies', async () => {
      const wrapper = mount(MazCodeHighlight, {
        props: { code: 'echo 1' },
        global: {
          provide: {
            [GLOBAL_CONFIG_INJECTION_KEY as symbol]: {
              global: { size: 'lg' },
            },
          },
        },
      })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight').classes()).toContain('--size-lg')
    })
  })
})
