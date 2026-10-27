import type { SearchCase } from './search-cases'

import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { loadKnowledge } from '../../knowledge/load'
import { DocSearch } from '../engine'
import { HELD_OUT_CASES, SEARCH_CASES } from './search-cases'

const knowledge = loadKnowledge({ bundledDir: resolve(__dirname, '../../../docs'), cwd: tmpdir() })
const search = new DocSearch(knowledge)

function rankOf(searchCase: SearchCase): number {
  const ids = search.search(searchCase.query, { limit: 10 }).map(hit => hit.doc.id)

  return ids.findIndex(id => searchCase.expected.includes(id)) + 1
}

function metrics(cases: SearchCase[]): { top1: number, top3: number, mrr: number } {
  const ranks = cases.map(rankOf)

  return {
    top1: ranks.filter(rank => rank === 1).length / cases.length,
    top3: ranks.filter(rank => rank >= 1 && rank <= 3).length / cases.length,
    mrr: ranks.reduce((sum, rank) => sum + (rank > 0 ? 1 / rank : 0), 0) / cases.length,
  }
}

describe('given the search engine over the maz-ui knowledge bundle', () => {
  describe('when every expected document of the reference cases exists', () => {
    it('then the cases only reference known docs', () => {
      const unknown = [...SEARCH_CASES, ...HELD_OUT_CASES]
        .flatMap(searchCase => searchCase.expected)
        .filter(id => !knowledge.docsById.has(id))

      expect(unknown).toEqual([])
    })
  })

  describe.each(SEARCH_CASES)('when an agent searches "$query"', (searchCase) => {
    it(`then ${searchCase.expected[0]} ranks within the first ${searchCase.rank}`, () => {
      const rank = rankOf(searchCase)

      expect(rank).toBeGreaterThan(0)
      expect(rank).toBeLessThanOrEqual(searchCase.rank)
    })
  })

  describe('when the reference cases are measured together', () => {
    it('then the mean reciprocal rank stays above 0.97', () => {
      expect(metrics(SEARCH_CASES).mrr).toBeGreaterThanOrEqual(0.97)
    })
  })

  describe('when paraphrased queries never used for tuning are measured', () => {
    it('then the expected document is in the top 3 for at least 90% of them', () => {
      expect(metrics(HELD_OUT_CASES).top3).toBeGreaterThanOrEqual(0.9)
    })

    it('then the mean reciprocal rank stays above 0.8', () => {
      expect(metrics(HELD_OUT_CASES).mrr).toBeGreaterThanOrEqual(0.8)
    })
  })
})
