import { loadShiki } from '@components/MazCodeHighlight/shiki.ts'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

vi.mock('shiki/engine/javascript', async (importOriginal) => {
  const actual = await importOriginal<typeof import('shiki/engine/javascript')>()

  return {
    ...actual,
    createJavaScriptRegexEngine: vi.fn(actual.createJavaScriptRegexEngine),
  }
})

describe('given loadShiki', () => {
  describe('when it is called several times', () => {
    it('then the highlighter is created once', async () => {
      const [first, second] = await Promise.all([
        loadShiki(),
        loadShiki(),
      ])

      expect(first).toBe(second)
      expect(await loadShiki()).toBe(first)
    })
  })

  describe('when a code is highlighted', () => {
    it('then it uses the JavaScript regex engine, forgiving the regexes it cannot translate', async () => {
      const { codeToHtml } = await loadShiki()

      const html = await codeToHtml('const answer = 42', { lang: 'ts', theme: 'github-dark' })

      expect(html).toContain('<pre class="shiki github-dark"')
      expect(html).toContain('>const</span>')
      expect(createJavaScriptRegexEngine).toHaveBeenCalledWith({ forgiving: true })
    })

    it('then the tokens keep the grammar state for the streaming', async () => {
      const { codeToTokens } = await loadShiki()

      const first = await codeToTokens('/* open', { lang: 'ts', theme: 'github-light' })
      const second = await codeToTokens('still a comment */', { lang: 'ts', theme: 'github-light', grammarState: first.grammarState })

      expect(first.grammarState).toBeDefined()
      expect(second.tokens[0][0].color).toBe(first.tokens[0][0].color)
    })
  })
})
