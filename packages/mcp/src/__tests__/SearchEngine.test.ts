import type { SearchDocument } from '../SearchEngine'
import { SearchEngine } from '../SearchEngine'

const EXPECTED_MAX_SNIPPET_LENGTH = 160

function createDocuments(docs: Array<{ id: string, content: string }>): SearchDocument[] {
  return docs.map(d => ({
    id: d.id,
    type: 'component',
    name: d.id,
    content: d.content,
  }))
}

describe('Given SearchEngine', () => {
  let engine: SearchEngine

  beforeEach(() => {
    engine = new SearchEngine()
  })

  describe('When building an index', () => {
    it('Then indexes all documents', () => {
      const docs = createDocuments([
        { id: 'doc1', content: 'Vue component button' },
        { id: 'doc2', content: 'React component input' },
      ])

      engine.buildIndex(docs)

      expect(engine.getDocumentCount()).toBe(2)
      expect(engine.getIndexedTermCount()).toBeGreaterThan(0)
    })

    it('Then handles empty document list', () => {
      engine.buildIndex([])

      expect(engine.getDocumentCount()).toBe(0)
      expect(engine.getIndexedTermCount()).toBe(0)
    })

    it('Then rebuilds index when called multiple times', () => {
      const docs1 = createDocuments([{ id: 'doc1', content: 'first content' }])
      const docs2 = createDocuments([{ id: 'doc2', content: 'second content' }, { id: 'doc3', content: 'third content' }])

      engine.buildIndex(docs1)
      expect(engine.getDocumentCount()).toBe(1)

      engine.buildIndex(docs2)
      expect(engine.getDocumentCount()).toBe(2)
    })
  })

  describe('When tokenizing content', () => {
    it('Then converts to lowercase and splits on whitespace', () => {
      const tokens = engine.tokenize('Vue Component Button')
      expect(tokens).toEqual(['vue', 'component', 'button'])
    })

    it('Then removes markdown punctuation', () => {
      const tokens = engine.tokenize('# Hello **world** `code` [link](url)')
      expect(tokens).toEqual(['hello', 'world', 'code', 'link', 'url'])
    })

    it('Then splits on dashes and underscores', () => {
      const tokens = engine.tokenize('maz-btn use_toast')
      expect(tokens).toEqual(['maz', 'btn', 'use', 'toast'])
    })

    it('Then filters out single-character tokens', () => {
      const tokens = engine.tokenize('a is the b component')
      expect(tokens).toEqual(['is', 'the', 'component'])
    })
  })

  describe('When searching with a single term', () => {
    const docs = createDocuments([
      { id: 'btn', content: 'MazBtn is a button component for Vue applications. Use button for forms and actions.' },
      { id: 'input', content: 'MazInput is an input component for Vue forms with validation support.' },
      { id: 'dialog', content: 'MazDialog is a modal dialog component for overlay content.' },
    ])

    beforeEach(() => {
      engine.buildIndex(docs)
    })

    it('Then returns matching documents sorted by score', () => {
      const results = engine.search('button')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe('btn')
      expect(results[0].score).toBeGreaterThan(0)
    })

    it('Then returns empty array for non-matching query', () => {
      const results = engine.search('nonexistent')
      expect(results).toEqual([])
    })

    it('Then returns empty array for empty query', () => {
      const results = engine.search('')
      expect(results).toEqual([])
    })

    it('Then returns empty array for whitespace-only query', () => {
      const results = engine.search('   ')
      expect(results).toEqual([])
    })

    it('Then includes snippet in results', () => {
      const results = engine.search('button')

      expect(results[0].snippet).toBeTruthy()
      expect(typeof results[0].snippet).toBe('string')
    })

    it('Then respects maxResults parameter', () => {
      const results = engine.search('vue', 1)
      expect(results.length).toBe(1)
    })
  })

  describe('When searching with multiple terms', () => {
    const docs = createDocuments([
      { id: 'btn', content: 'MazBtn is a button component for Vue applications.' },
      { id: 'input', content: 'MazInput is a form input for Vue with validation.' },
      { id: 'dialog', content: 'MazDialog provides modal overlay functionality.' },
    ])

    beforeEach(() => {
      engine.buildIndex(docs)
    })

    it('Then combines scores from all matching terms', () => {
      const results = engine.search('vue button')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe('btn')
    })

    it('Then ranks documents matching more terms higher', () => {
      const results = engine.search('vue form input')

      expect(results[0].id).toBe('input')
    })
  })

  describe('When searching with exact phrases', () => {
    const docs = createDocuments([
      { id: 'doc1', content: 'The quick brown fox jumps over the lazy dog.' },
      { id: 'doc2', content: 'The quick red car drives over the hill.' },
      { id: 'doc3', content: 'A brown fox was seen near the river.' },
    ])

    beforeEach(() => {
      engine.buildIndex(docs)
    })

    it('Then matches exact phrase sequences', () => {
      const results = engine.search('"quick brown fox"')

      expect(results.length).toBe(1)
      expect(results[0].id).toBe('doc1')
    })

    it('Then returns empty for non-matching phrases', () => {
      const results = engine.search('"quick brown car"')
      expect(results).toEqual([])
    })

    it('Then combines phrase search with single terms', () => {
      const results = engine.search('"brown fox" river')

      expect(results.length).toBe(2)
      const ids = results.map(r => r.id)
      expect(ids).toContain('doc1')
      expect(ids).toContain('doc3')
    })
  })

  describe('When computing TF-IDF scores', () => {
    it('Then gives higher IDF weight to terms appearing in fewer documents', () => {
      const docs = createDocuments([
        { id: 'doc1', content: 'common term common term common term rare' },
        { id: 'doc2', content: 'common term something else here' },
        { id: 'doc3', content: 'common term another document' },
      ])

      engine.buildIndex(docs)

      const rareResults = engine.search('rare')
      const commonResults = engine.search('common')

      expect(rareResults.length).toBe(1)
      expect(rareResults[0].id).toBe('doc1')
      expect(commonResults.length).toBe(3)
      expect(rareResults[0].score).toBeGreaterThan(commonResults[1].score)
    })

    it('Then gives higher score to documents with higher term frequency', () => {
      const docs = createDocuments([
        { id: 'high-freq', content: 'button button button component' },
        { id: 'low-freq', content: 'button component input dialog' },
      ])

      engine.buildIndex(docs)

      const results = engine.search('button')

      expect(results[0].id).toBe('high-freq')
      expect(results[0].score).toBeGreaterThan(results[1].score)
    })
  })

  describe('When extracting snippets', () => {
    it('Then returns a snippet around the matched term', () => {
      const prefix = 'This is the beginning of the document. '.repeat(5)
      const suffix = 'This is the end of the document. '.repeat(5)
      const longContent = `${prefix}Here is the special keyword in context. ${suffix}`

      const docs = createDocuments([
        { id: 'doc1', content: longContent },
      ])

      engine.buildIndex(docs)
      const results = engine.search('special')

      expect(results[0].snippet).toContain('special')
      expect(results[0].snippet.length).toBeLessThanOrEqual(EXPECTED_MAX_SNIPPET_LENGTH)
    })

    it('Then returns beginning of content when no position data', () => {
      const docs = createDocuments([
        { id: 'doc1', content: 'Short document content' },
      ])

      engine.buildIndex(docs)
      const results = engine.search('short')

      expect(results[0].snippet).toBeTruthy()
    })
  })

  describe('When searching on empty index', () => {
    it('Then returns empty results', () => {
      const results = engine.search('anything')
      expect(results).toEqual([])
    })
  })

  describe('When handling edge cases', () => {
    it('Then handles documents with only punctuation', () => {
      const docs = createDocuments([
        { id: 'doc1', content: '---\n***\n```' },
      ])

      engine.buildIndex(docs)
      const results = engine.search('test')

      expect(results).toEqual([])
    })

    it('Then handles very large number of documents', () => {
      const docs = createDocuments(
        Array.from({ length: 100 }, (_, i) => ({
          id: `doc${i}`,
          content: `Document number ${i} about ${i % 2 === 0 ? 'vue components' : 'react hooks'} with various content.`,
        })),
      )

      engine.buildIndex(docs)
      const results = engine.search('vue components')

      expect(results.length).toBeGreaterThan(0)
      expect(results.length).toBeLessThanOrEqual(20)
    })

    it('Then handles query with only quotes', () => {
      const docs = createDocuments([
        { id: 'doc1', content: 'Some content here' },
      ])

      engine.buildIndex(docs)
      const results = engine.search('""')

      expect(results).toEqual([])
    })

    it('Then handles mixed phrase and term queries', () => {
      const docs = createDocuments([
        { id: 'doc1', content: 'The button component is interactive and responsive' },
        { id: 'doc2', content: 'An interactive dialog with button actions' },
      ])

      engine.buildIndex(docs)
      const results = engine.search('"button component" interactive')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].id).toBe('doc1')
    })
  })
})
