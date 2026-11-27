import MazCodeHighlight from '@components/MazCodeHighlight.vue'
import { flushPromises, mount } from '@vue/test-utils'

const shiki = vi.hoisted(() => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre class="shiki"><code>highlighted code</code></pre>'),
  codeToTokens: vi.fn().mockImplementation((code: string) => Promise.resolve({
    tokens: code.split('\n').map(line => [{ content: line, offset: 0, color: '#123456' }]),
    fg: '#000000',
    bg: '#ffffff',
    themeName: 'github-light',
  })),
}))

vi.mock('@components/MazCodeHighlight/shiki.ts', () => ({
  loadShiki: () => Promise.resolve(shiki),
}))

const before = 'a\nb\nc'
const after = 'a\nx\nc'
const many = Array.from({ length: 30 }, (_, i) => `line ${i + 1}`).join('\n')
const manyChanged = many.replace('line 15', 'changed')

async function mountDiff(props: Record<string, unknown>) {
  const wrapper = mount(MazCodeHighlight, { props })
  await vi.waitFor(() => expect(wrapper.find('.m-code-highlight-diff').exists()).toBe(true))
  await flushPromises()
  return wrapper
}

describe('given MazCodeHighlight with the diff prop', () => {
  beforeEach(() => {
    shiki.codeToHtml.mockClear()
    shiki.codeToTokens.mockClear()
  })

  describe('when diff and code differ', () => {
    it('then added and removed lines are rendered with their marks', async () => {
      const wrapper = await mountDiff({ code: after, diff: before, language: 'ts' })

      expect(wrapper.findAll('.m-code-highlight-diff__line.--add')).toHaveLength(1)
      expect(wrapper.findAll('.m-code-highlight-diff__line.--remove')).toHaveLength(1)
      expect(wrapper.find('.--add .m-code-highlight-diff__mark').text()).toBe('+')
      expect(wrapper.find('.--remove .m-code-highlight-diff__mark').text()).toBe('-')
    })

    it('then the old and new line numbers are rendered', async () => {
      const wrapper = await mountDiff({ code: after, diff: before })
      const numbers = wrapper.findAll('.m-code-highlight-diff__line.--same')[1]!.findAll('.m-code-highlight-diff__number')

      expect(numbers.map(n => n.text())).toEqual(['3', '3'])
    })

    it('then the counts show next to the language', async () => {
      const wrapper = await mountDiff({ code: after, diff: before, language: 'ts' })
      const badge = wrapper.find('.maz\\:text-caption')

      expect(badge.text()).toContain('+1')
      expect(badge.text()).toContain('-1')
      expect(badge.text()).toContain('ts')
    })

    it('then the lines are highlighted from the tokens of the old and the new text in one pass', async () => {
      const wrapper = await mountDiff({ code: after, diff: before, language: 'ts' })

      expect(shiki.codeToTokens).toHaveBeenCalledTimes(2)
      expect(shiki.codeToTokens).toHaveBeenCalledWith(before, expect.objectContaining({ lang: 'ts', theme: 'github-light' }))
      expect(shiki.codeToTokens).toHaveBeenCalledWith(after, expect.objectContaining({ lang: 'ts', theme: 'github-light' }))
      expect(wrapper.find('.m-code-highlight-diff__text').html()).toContain('color:#123456')
      expect(wrapper.find('pre').attributes('style')).toContain('background-color: rgb(255, 255, 255)')
    })

    it('then the full highlight of the code alone is not used', async () => {
      await mountDiff({ code: after, diff: before })

      expect(shiki.codeToHtml).not.toHaveBeenCalled()
    })
  })

  describe('when diff is an empty string', () => {
    it('then every line of the code is added', async () => {
      const wrapper = await mountDiff({ code: 'a\nb', diff: '' })

      expect(wrapper.findAll('.m-code-highlight-diff__line.--add')).toHaveLength(2)
      expect(wrapper.findAll('.m-code-highlight-diff__line.--remove')).toHaveLength(0)
    })
  })

  describe('when diff and code are the same', () => {
    it('then the identical state is shown without lines', async () => {
      const wrapper = await mountDiff({ code: before, diff: before })

      expect(wrapper.find('.m-code-highlight-diff__identical').exists()).toBe(true)
      expect(wrapper.find('.m-code-highlight-diff__line').exists()).toBe(false)
    })

    it('then the custom translation is used', async () => {
      const wrapper = await mountDiff({ code: before, diff: before, translations: { diff: { identical: 'Same' } } })

      expect(wrapper.find('.m-code-highlight-diff__identical').text()).toBe('Same')
    })
  })

  describe('when the unchanged lines are folded', () => {
    it('then a gap button replaces the lines out of the context', async () => {
      const wrapper = await mountDiff({ code: manyChanged, diff: many, translations: { diff: { expand: 'Show {count}' } } })

      expect(wrapper.findAll('.m-code-highlight-diff__gap')).toHaveLength(2)
      expect(wrapper.find('.m-code-highlight-diff__gap').text()).toBe('Show 11')
    })

    it('then clicking a gap shows its lines without highlighting again', async () => {
      const wrapper = await mountDiff({ code: manyChanged, diff: many })
      const calls = shiki.codeToTokens.mock.calls.length

      await wrapper.find('.m-code-highlight-diff__gap').trigger('click')

      expect(wrapper.findAll('.m-code-highlight-diff__gap')).toHaveLength(1)
      expect(wrapper.findAll('.m-code-highlight-diff__line')).toHaveLength(7 + 11 + 1)
      expect(shiki.codeToTokens.mock.calls).toHaveLength(calls)
    })

    it('then diffContext sets the kept lines', async () => {
      const wrapper = await mountDiff({ code: manyChanged, diff: many, diffContext: 1 })

      expect(wrapper.findAll('.m-code-highlight-diff__line')).toHaveLength(4)
    })

    it('then an infinite diffContext folds nothing', async () => {
      const wrapper = await mountDiff({ code: manyChanged, diff: many, diffContext: Infinity })

      expect(wrapper.find('.m-code-highlight-diff__gap').exists()).toBe(false)
      expect(wrapper.findAll('.m-code-highlight-diff__line')).toHaveLength(31)
    })

    it('then the custom expand translation is used', async () => {
      const wrapper = await mountDiff({ code: manyChanged, diff: many, translations: { diff: { expand: 'More {count}' } } })

      expect(wrapper.find('.m-code-highlight-diff__gap').text()).toBe('More 11')
    })
  })

  describe('when diffIgnoreWhitespace is set', () => {
    it('then lines that only differ by whitespace are unchanged', async () => {
      const wrapper = await mountDiff({ code: 'a\n  b', diff: 'a\nb', diffIgnoreWhitespace: true })

      expect(wrapper.find('.m-code-highlight-diff__identical').exists()).toBe(true)
    })
  })

  describe('when the code changes', () => {
    it('then the diff and the counts are updated', async () => {
      const wrapper = await mountDiff({ code: after, diff: before })

      await wrapper.setProps({ code: `${after}\nd` })
      await flushPromises()

      expect(wrapper.findAll('.m-code-highlight-diff__line.--add')).toHaveLength(2)
      expect(wrapper.find('.maz\\:text-caption').text()).toContain('+2')
    })
  })

  describe('when the copy button is used', () => {
    it('then the new code is the value copied', async () => {
      const wrapper = await mountDiff({ code: after, diff: before })

      expect(wrapper.findComponent({ name: 'MazCodeFrameButtons' }).props('copyable')).toBe(true)
    })
  })

  describe('when hideLanguage is set', () => {
    it('then the counts still show', async () => {
      const wrapper = await mountDiff({ code: after, diff: before, language: 'ts', hideLanguage: true })

      expect(wrapper.find('.maz\\:text-caption').text()).not.toContain('ts')
      expect(wrapper.find('.maz\\:text-caption').text()).toContain('+1')
    })
  })

  describe('when shiki fails', () => {
    it('then the lines are shown as plain text', async () => {
      shiki.codeToTokens.mockRejectedValueOnce(new Error('fail'))
      const wrapper = await mountDiff({ code: after, diff: before })

      expect(wrapper.find('.--add .m-code-highlight-diff__text').text()).toBe('x')
    })
  })

  describe('when diff is not set', () => {
    it('then the block is the usual one and the diff markup is absent', async () => {
      const wrapper = mount(MazCodeHighlight, { props: { code: after } })
      await flushPromises()

      expect(wrapper.find('.m-code-highlight-diff').exists()).toBe(false)
      expect(wrapper.html()).toContain('highlighted code')
    })
  })
})
