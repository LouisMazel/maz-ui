import MazMarkdown from '@components/MazMarkdown.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

async function mountMarkdown(props: Record<string, unknown>, slots?: Record<string, string>) {
  const wrapper = mount(MazMarkdown, { props, slots })
  await nextTick()
  await flushPromises()
  return wrapper
}

describe('given MazMarkdown component', () => {
  describe('when rendered with markdown', () => {
    it('then it renders the formatted html in a rich-text root', async () => {
      const wrapper = await mountMarkdown({ content: '# Title\n\nSome **bold** text', highlight: false })

      expect(wrapper.find('h1').text()).toBe('Title')
      expect(wrapper.find('strong').text()).toBe('bold')
      expect(wrapper.classes()).toContain('m-markdown')
      expect(wrapper.classes()).toContain('maz:rich-text')
    })

    it('then it renders again when the content changes', async () => {
      const wrapper = await mountMarkdown({ content: '# One', highlight: false })

      await wrapper.setProps({ content: '## Two' })
      await flushPromises()

      expect(wrapper.find('h1').exists()).toBe(false)
      expect(wrapper.find('h2').text()).toBe('Two')
    })

    it('then it applies the class and style props on the root', async () => {
      const wrapper = await mountMarkdown({ content: 'x', class: 'custom', style: 'margin: 1px' })

      expect(wrapper.classes()).toContain('custom')
      expect(wrapper.attributes('style')).toContain('margin')
    })
  })

  describe('when the content is empty', () => {
    it('then it renders the empty slot and no root', async () => {
      const wrapper = await mountMarkdown({ content: '  ' }, { empty: '<p class="empty">Nothing</p>' })

      expect(wrapper.find('.m-markdown').exists()).toBe(false)
      expect(wrapper.find('.empty').text()).toBe('Nothing')
    })

    it('then it renders nothing without the slot', async () => {
      const wrapper = await mountMarkdown({})

      expect(wrapper.find('.m-markdown').exists()).toBe(false)
    })
  })

  describe('when the size prop is set', () => {
    it.each([
      ['xs', 'maz:rich-text-xs'],
      ['mini', 'maz:rich-text-xs'],
      ['sm', 'maz:rich-text-sm'],
      ['lg', 'maz:rich-text-lg'],
      ['xl', 'maz:rich-text-lg'],
    ] as const)('then size %s sets %s', async (size, expected) => {
      const wrapper = await mountMarkdown({ content: 'x', size })

      expect(wrapper.classes()).toContain(expected)
    })

    it('then the default size adds no scale class', async () => {
      const wrapper = await mountMarkdown({ content: 'x' })

      expect(wrapper.classes().some(name => name.startsWith('maz:rich-text-'))).toBe(false)
    })
  })

  describe('when the color prop is set', () => {
    it('then it applies the matching text color classes', async () => {
      const wrapper = await mountMarkdown({ content: 'x', color: 'muted' })

      expect(wrapper.classes()).toContain('maz:text-muted!')
    })

    it('then the default color is foreground', async () => {
      const wrapper = await mountMarkdown({ content: 'x' })

      expect(wrapper.classes()).toContain('maz:text-foreground!')
    })

    it('then an unknown color falls back to foreground', async () => {
      const wrapper = await mountMarkdown({ content: 'x', color: 'unknown' })

      expect(wrapper.classes()).toContain('maz:text-foreground!')
    })
  })

  describe('when the html contains unsafe content', () => {
    it('then it sanitizes it by default', async () => {
      const wrapper = await mountMarkdown({ content: 'hello <img src="x" onerror="alert(1)"><script>alert(1)</script>', highlight: false })

      expect(wrapper.html()).not.toContain('onerror')
      expect(wrapper.html()).not.toContain('<script')
    })

    it('then it keeps the html when sanitize is disabled', async () => {
      const wrapper = await mountMarkdown({ content: '<span class="raw">raw</span>', sanitize: false, highlight: false })

      expect(wrapper.find('.raw').exists()).toBe(true)
    })
  })

  describe('when a custom renderFunction is provided', () => {
    it('then it renders its output instead of marked', async () => {
      const renderFunction = vi.fn(() => '<p class="custom">custom</p>')
      const wrapper = await mountMarkdown({ content: '# ignored', renderFunction })

      expect(renderFunction).toHaveBeenCalledWith('# ignored')
      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(wrapper.find('h1').exists()).toBe(false)
    })

    it('then it supports an async renderer', async () => {
      const renderFunction = vi.fn(() => Promise.resolve('<p class="async">async</p>'))
      const wrapper = await mountMarkdown({ content: 'x', renderFunction })

      expect(wrapper.find('.async').exists()).toBe(true)
    })

    it('then it falls back to an escaped block when the renderer throws', async () => {
      const renderFunction = vi.fn(() => {
        throw new Error('boom')
      })
      const wrapper = await mountMarkdown({ content: '<b>x', renderFunction })

      expect(wrapper.find('pre').html()).toContain('&lt;b&gt;x')
    })

    it('then it falls back to an escaped block when the async renderer rejects', async () => {
      const renderFunction = vi.fn(() => Promise.reject(new Error('boom')))
      const wrapper = await mountMarkdown({ content: '<b>x', renderFunction })

      expect(wrapper.find('pre').html()).toContain('&lt;b&gt;x')
    })

    it('then it ignores a stale async result', async () => {
      let resolveFirst: (value: string) => void = () => {}
      const renderFunction = vi.fn((markdown: string) => markdown === 'first'
        ? new Promise<string>((resolve) => {
            resolveFirst = resolve
          })
        : Promise.resolve('<p>second</p>'))
      const wrapper = await mountMarkdown({ content: 'first', renderFunction })

      await wrapper.setProps({ content: 'second' })
      await flushPromises()
      resolveFirst('<p>first</p>')
      await flushPromises()

      expect(wrapper.text()).toBe('second')
    })
  })

  describe('when markedOptions are provided', () => {
    it('then they are forwarded to marked', async () => {
      const wrapper = await mountMarkdown({ content: 'a\nb', highlight: false, markedOptions: { breaks: false } })

      expect(wrapper.find('br').exists()).toBe(false)
    })

    it('then line breaks are kept by default', async () => {
      const wrapper = await mountMarkdown({ content: 'a\nb', highlight: false })

      expect(wrapper.find('br').exists()).toBe(true)
    })
  })

  describe('when the content has fenced code blocks', () => {
    const content = 'Intro\n\n```ts\nconst a = 1\n```\n\nOutro'

    it('then it renders them with MazCodeHighlight by default', async () => {
      const wrapper = await mountMarkdown({ content })
      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'MazCodeHighlight' }).exists()).toBe(true))

      expect(wrapper.findComponent({ name: 'MazCodeHighlight' }).props('language')).toBe('ts')
      expect(wrapper.text()).toContain('Intro')
      expect(wrapper.text()).toContain('Outro')
    })

    it('then it keeps indented code blocks as plain code', async () => {
      const wrapper = await mountMarkdown({ content: 'Text\n\n    indented code' })

      expect(wrapper.findComponent({ name: 'MazCodeHighlight' }).exists()).toBe(false)
      expect(wrapper.find('pre code').exists()).toBe(true)
    })

    it('then it renders plain pre blocks when highlight is disabled', async () => {
      const wrapper = await mountMarkdown({ content, highlight: false })

      expect(wrapper.findComponent({ name: 'MazCodeHighlight' }).exists()).toBe(false)
      expect(wrapper.find('pre code').exists()).toBe(true)
    })

    it('then it resolves reference links across the parts', async () => {
      const wrapper = await mountMarkdown({ content: '```\ncode\n```\n\n[docs][ref]\n\n[ref]: https://maz-ui.com' })

      expect(wrapper.find('a').attributes('href')).toBe('https://maz-ui.com')
    })

    it('then a block without language hides the language label', async () => {
      const wrapper = await mountMarkdown({ content: '```\ncode\n```' })
      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'MazCodeHighlight' }).exists()).toBe(true))

      expect(wrapper.findComponent({ name: 'MazCodeHighlight' }).props('hideLanguage')).toBe(true)
    })
  })

  describe('when the content has links', () => {
    it('then absolute links open in a new tab with a safe rel', async () => {
      const wrapper = await mountMarkdown({ content: '[a](https://maz-ui.com) [b](/guide) [c](//cdn.test)', highlight: false })
      const links = wrapper.findAll('a')

      expect(links[0]?.attributes('target')).toBe('_blank')
      expect(links[0]?.attributes('rel')).toBe('noopener noreferrer')
      expect(links[1]?.attributes('target')).toBeUndefined()
      expect(links[2]?.attributes('target')).toBe('_blank')
    })

    it('then links stay untouched when externalLinks is disabled', async () => {
      const wrapper = await mountMarkdown({ content: '[a](https://maz-ui.com)', highlight: false, externalLinks: false })

      expect(wrapper.find('a').attributes('target')).toBeUndefined()
    })

    it('then it keeps the target of an existing link when not sanitized', async () => {
      const wrapper = await mountMarkdown({ content: '<a href="https://maz-ui.com" target="_self">a</a>', highlight: false, sanitize: false })

      expect(wrapper.find('a').attributes('target')).toBe('_self')
    })

    it('then it emits link-click with the event and the href', async () => {
      const wrapper = await mountMarkdown({ content: '[a](/guide)', highlight: false })

      await wrapper.find('a').trigger('click')

      const [event, href] = wrapper.emitted('link-click')![0] as [MouseEvent, string]
      expect(event).toBeInstanceOf(MouseEvent)
      expect(href).toBe('/guide')
    })

    it('then a click outside a link emits nothing', async () => {
      const wrapper = await mountMarkdown({ content: 'plain text', highlight: false })

      await wrapper.find('p').trigger('click')

      expect(wrapper.emitted('link-click')).toBeUndefined()
    })
  })

  describe('when headingAnchors is enabled', () => {
    it('then the titles get unique slug ids', async () => {
      const wrapper = await mountMarkdown({ content: '# Hello World\n\n## Hello World\n\n### Été **fort**\n\n#### !!!', highlight: false, headingAnchors: true })

      expect(wrapper.find('h1').attributes('id')).toBe('hello-world')
      expect(wrapper.find('h2').attributes('id')).toBe('hello-world-1')
      expect(wrapper.find('h3').attributes('id')).toBe('ete-fort')
      expect(wrapper.find('h4').attributes('id')).toBe('section')
    })

    it('then the punctuation and the html entities are left out of the ids', async () => {
      const wrapper = await mountMarkdown({ content: '# Don\'t panic\n\n## Q&A', highlight: false, headingAnchors: true })

      expect(wrapper.find('h1').attributes('id')).toBe('dont-panic')
      expect(wrapper.find('h2').attributes('id')).toBe('qa')
    })

    it('then the titles have no id by default', async () => {
      const wrapper = await mountMarkdown({ content: '# Hello', highlight: false })

      expect(wrapper.find('h1').attributes('id')).toBeUndefined()
    })

    it('then the anchors also work around code blocks', async () => {
      const wrapper = await mountMarkdown({ content: '# A\n\n```\nx\n```\n\n# A', headingAnchors: true })

      expect(wrapper.findAll('h1').map(heading => heading.attributes('id'))).toEqual(['a', 'a-1'])
    })
  })

  describe('when the inline prop is set', () => {
    it('then it renders inline markdown in a span without block elements', async () => {
      const wrapper = await mountMarkdown({ content: 'Some **bold** and `code`', inline: true })

      expect(wrapper.element.tagName).toBe('SPAN')
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['--inline', 'maz:rich-text']))
      expect(wrapper.find('p').exists()).toBe(false)
      expect(wrapper.find('strong').text()).toBe('bold')
      expect(wrapper.find('code').text()).toBe('code')
    })

    it('then it applies the text size class', async () => {
      const wrapper = await mountMarkdown({ content: 'x', inline: true, size: 'sm' })

      expect(wrapper.classes()).toContain('maz:text-sm!')
    })

    it('then it renders a custom renderer output in the span', async () => {
      const wrapper = await mountMarkdown({ content: 'x', inline: true, renderFunction: () => '<em>custom</em>' })

      expect(wrapper.find('em').text()).toBe('custom')
    })
  })

  describe('when the render method is called', () => {
    it('then it renders the content again', async () => {
      const renderFunction = vi.fn(() => '<p>x</p>')
      const wrapper = await mountMarkdown({ content: 'x', renderFunction })
      renderFunction.mockClear()

      wrapper.vm.render()
      await flushPromises()

      expect(renderFunction).toHaveBeenCalledTimes(1)
    })
  })

  describe('when sanitize is enabled before the component is mounted', () => {
    it('then it renders only once mounted', () => {
      const wrapper = mount(MazMarkdown, { props: { content: 'x', highlight: false } })

      expect(wrapper.find('.m-markdown').exists()).toBe(false)
    })
  })

  describe('when it is rendered on the server without sanitize', () => {
    it('then the html contains the content', async () => {
      const html = await renderToString(createSSRApp({ render: () => h(MazMarkdown, { content: '# Server', sanitize: false, highlight: false }) }))

      expect(html).toContain('<h1>Server</h1>')
    })

    it('then an async render function is awaited', async () => {
      const renderFunction = (markdown: string) => Promise.resolve(`<p>${markdown}</p>`)
      const html = await renderToString(createSSRApp({ render: () => h(MazMarkdown, { content: 'async', sanitize: false, renderFunction }) }))

      expect(html).toContain('<p>async</p>')
    })
  })
})

describe('given MazMarkdown with the neutral color', () => {
  it('then it applies the neutral foreground text classes', async () => {
    const wrapper = await mountMarkdown({ content: 'x', color: 'neutral' })

    expect(wrapper.classes()).toContain('maz:text-neutral-foreground!')
  })
})
