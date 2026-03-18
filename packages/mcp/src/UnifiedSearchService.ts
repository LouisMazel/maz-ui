import type { Document, DocumentType } from './DocumentationService'

import { SearchEngine } from './SearchEngine'

export interface UnifiedSearchResult {
  name: string
  displayName: string
  type: DocumentType
  description: string
  score: number
  snippet: string
}

export interface UnifiedSearchOptions {
  category?: DocumentType
  maxResults?: number
}

const NAME_BOOST = 3
const TAG_BOOST = 2
const CONTENT_BOOST = 1
const DEFAULT_MAX_RESULTS = 10

export class UnifiedSearchService {
  private searchEngine = new SearchEngine()
  private documents: Document[] = []

  initialize(documents: Document[]): void {
    this.documents = documents
    this.searchEngine.buildIndex(
      documents.map(doc => ({
        id: doc.name,
        type: doc.type,
        name: doc.name,
        content: doc.content,
      })),
    )
  }

  search(query: string, options: UnifiedSearchOptions = {}): UnifiedSearchResult[] {
    const { category, maxResults = DEFAULT_MAX_RESULTS } = options

    if (!query.trim()) {
      return []
    }

    const normalizedQuery = query.toLowerCase().trim()
    const queryTokens = this.searchEngine.tokenize(query)

    let candidates = this.documents
    if (category) {
      candidates = candidates.filter(doc => doc.type === category)
    }

    const tfidfResults = this.searchEngine.search(query, candidates.length || this.documents.length)
    const tfidfScoreMap = new Map<string, { score: number, snippet: string }>()
    for (const result of tfidfResults) {
      tfidfScoreMap.set(result.id, { score: result.score, snippet: result.snippet })
    }

    const scored: UnifiedSearchResult[] = []

    for (const doc of candidates) {
      const nameScore = this.scoreNameMatch(normalizedQuery, doc) * NAME_BOOST
      const tagScore = this.scoreTagMatch(normalizedQuery, queryTokens, doc) * TAG_BOOST
      const tfidfEntry = tfidfScoreMap.get(doc.name)
      const contentScore = (tfidfEntry?.score ?? 0) * CONTENT_BOOST

      const totalScore = nameScore + tagScore + contentScore

      if (totalScore > 0) {
        scored.push({
          name: doc.name,
          displayName: doc.metadata.displayName,
          type: doc.type,
          description: doc.metadata.description,
          score: Math.round(totalScore * 10000) / 10000,
          snippet: tfidfEntry?.snippet ?? doc.content.slice(0, 150).trim(),
        })
      }
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
  }

  private scoreNameMatch(normalizedQuery: string, doc: Document): number {
    const name = doc.name.toLowerCase()
    const displayName = doc.metadata.displayName.toLowerCase()

    if (name === normalizedQuery || displayName === normalizedQuery) {
      return 1
    }

    if (name.includes(normalizedQuery) || displayName.includes(normalizedQuery)) {
      return 0.7
    }

    if (normalizedQuery.includes(name)) {
      return 0.5
    }

    return 0
  }

  private scoreTagMatch(normalizedQuery: string, queryTokens: string[], doc: Document): number {
    const tags = doc.metadata.tags

    for (const tag of tags) {
      if (tag === normalizedQuery) {
        return 1
      }
    }

    if (queryTokens.length === 0) {
      return 0
    }

    let matchedTokens = 0
    for (const token of queryTokens) {
      for (const tag of tags) {
        if (tag.includes(token) || token.includes(tag)) {
          matchedTokens++
          break
        }
      }
    }

    return matchedTokens / queryTokens.length * 0.8
  }
}
