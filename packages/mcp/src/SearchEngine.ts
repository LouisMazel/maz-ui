export interface SearchDocument {
  id: string
  type: string
  name: string
  content: string
}

export interface SearchResult {
  id: string
  type: string
  name: string
  score: number
  snippet: string
}

interface PostingEntry {
  docIndex: number
  frequency: number
  positions: number[]
}

const SNIPPET_LENGTH = 150

export class SearchEngine {
  private documents: SearchDocument[] = []
  private invertedIndex = new Map<string, PostingEntry[]>()
  private documentLengths: number[] = []

  buildIndex(documents: SearchDocument[]): void {
    this.documents = documents
    this.invertedIndex.clear()
    this.documentLengths = []

    for (let docIndex = 0; docIndex < documents.length; docIndex++) {
      const tokens = this.tokenize(documents[docIndex].content)
      this.documentLengths.push(tokens.length)

      const termFrequencies = new Map<string, { count: number, positions: number[] }>()

      for (let pos = 0; pos < tokens.length; pos++) {
        const token = tokens[pos]
        const entry = termFrequencies.get(token)
        if (entry) {
          entry.count++
          entry.positions.push(pos)
        }
        else {
          termFrequencies.set(token, { count: 1, positions: [pos] })
        }
      }

      for (const [term, { count, positions }] of termFrequencies) {
        let postings = this.invertedIndex.get(term)
        if (!postings) {
          postings = []
          this.invertedIndex.set(term, postings)
        }
        postings.push({ docIndex, frequency: count, positions })
      }
    }
  }

  search(query: string, maxResults = 20): SearchResult[] {
    if (this.documents.length === 0 || !query.trim()) {
      return []
    }

    const exactPhrases = this.extractExactPhrases(query)
    const remainingQuery = query.replace(/"[^"]*"/g, '').trim()
    const singleTerms = remainingQuery ? this.tokenize(remainingQuery) : []

    const scores = new Map<number, number>()
    const matchPositions = new Map<number, number[]>()

    for (const term of singleTerms) {
      this.scoreTerm(term, scores, matchPositions)
    }

    for (const phrase of exactPhrases) {
      this.scorePhrase(phrase, scores, matchPositions)
    }

    return Array.from(scores.entries())
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxResults)
      .map(([docIndex, score]) => {
        const doc = this.documents[docIndex]
        const positions = matchPositions.get(docIndex) ?? []
        return {
          id: doc.id,
          type: doc.type,
          name: doc.name,
          score: Math.round(score * 10000) / 10000,
          snippet: this.extractSnippet(doc.content, positions),
        }
      })
  }

  getIndexedTermCount(): number {
    return this.invertedIndex.size
  }

  getDocumentCount(): number {
    return this.documents.length
  }

  private scoreTerm(term: string, scores: Map<number, number>, matchPositions: Map<number, number[]>): void {
    const postings = this.invertedIndex.get(term)
    if (!postings) {
      return
    }

    const totalDocs = this.documents.length
    const df = postings.length
    const idf = Math.log(1 + totalDocs / df)

    for (const posting of postings) {
      const docLength = this.documentLengths[posting.docIndex]
      const tf = docLength > 0 ? posting.frequency / docLength : 0
      const tfidf = tf * idf

      scores.set(posting.docIndex, (scores.get(posting.docIndex) ?? 0) + tfidf)

      const existing = matchPositions.get(posting.docIndex) ?? []
      existing.push(posting.positions[0])
      matchPositions.set(posting.docIndex, existing)
    }
  }

  private scorePhrase(phrase: string, scores: Map<number, number>, matchPositions: Map<number, number[]>): void {
    const phraseTokens = this.tokenize(phrase)
    if (phraseTokens.length === 0) {
      return
    }

    const phraseMatches = this.findPhraseMatches(phraseTokens)
    const matchedDocs = new Set(phraseMatches.map(m => m.docIndex))

    if (matchedDocs.size === 0) {
      return
    }

    const totalDocs = this.documents.length
    const idf = Math.log(1 + totalDocs / matchedDocs.size)

    for (const docIndex of matchedDocs) {
      const docMatches = phraseMatches.filter(m => m.docIndex === docIndex)
      const docLength = this.documentLengths[docIndex]
      const tf = docLength > 0 ? docMatches.length / docLength : 0
      const tfidf = tf * idf * phraseTokens.length

      scores.set(docIndex, (scores.get(docIndex) ?? 0) + tfidf)

      const existing = matchPositions.get(docIndex) ?? []
      existing.push(docMatches[0].position)
      matchPositions.set(docIndex, existing)
    }
  }

  private findPhraseMatches(phraseTokens: string[]): Array<{ docIndex: number, position: number }> {
    const firstTermPostings = this.invertedIndex.get(phraseTokens[0])
    if (!firstTermPostings) {
      return []
    }

    const matches: Array<{ docIndex: number, position: number }> = []

    for (const posting of firstTermPostings) {
      for (const startPos of posting.positions) {
        if (this.isPhraseAtPosition(phraseTokens, posting.docIndex, startPos)) {
          matches.push({ docIndex: posting.docIndex, position: startPos })
        }
      }
    }

    return matches
  }

  private isPhraseAtPosition(phraseTokens: string[], docIndex: number, startPos: number): boolean {
    for (let i = 1; i < phraseTokens.length; i++) {
      const nextPostings = this.invertedIndex.get(phraseTokens[i])
      if (!nextPostings) {
        return false
      }
      const nextPosting = nextPostings.find(p => p.docIndex === docIndex)
      if (!nextPosting || !nextPosting.positions.includes(startPos + i)) {
        return false
      }
    }
    return true
  }

  private extractExactPhrases(query: string): string[] {
    const phrases: string[] = []
    const regex = /"([^"]+)"/g

    for (const match of query.matchAll(regex)) {
      if (match[1].trim()) {
        phrases.push(match[1].trim())
      }
    }

    return phrases
  }

  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[#*`|[\](){}!@$%^&+=~<>/\\,;:.?'"_-]+/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1)
  }

  private extractSnippet(content: string, tokenPositions: number[]): string {
    if (!content || tokenPositions.length === 0) {
      return content.slice(0, SNIPPET_LENGTH).trim()
    }

    const tokens = this.tokenize(content)
    if (tokens.length === 0) {
      return content.slice(0, SNIPPET_LENGTH).trim()
    }

    const bestPosition = tokenPositions[0]
    const targetToken = tokens[Math.min(bestPosition, tokens.length - 1)]

    const contentLower = content.toLowerCase()
    const charIndex = contentLower.indexOf(targetToken)

    if (charIndex === -1) {
      return content.slice(0, SNIPPET_LENGTH).trim()
    }

    const halfSnippet = Math.floor(SNIPPET_LENGTH / 2)
    let start = Math.max(0, charIndex - halfSnippet)
    let end = Math.min(content.length, start + SNIPPET_LENGTH)

    if (end === content.length) {
      start = Math.max(0, end - SNIPPET_LENGTH)
    }

    if (start > 0) {
      const spaceIndex = content.indexOf(' ', start)
      if (spaceIndex !== -1 && spaceIndex < start + 20) {
        start = spaceIndex + 1
      }
    }

    if (end < content.length) {
      const spaceIndex = content.lastIndexOf(' ', end)
      if (spaceIndex !== -1 && spaceIndex > end - 20) {
        end = spaceIndex
      }
    }

    let snippet = content.slice(start, end).trim()

    if (start > 0) {
      snippet = `...${snippet}`
    }
    if (end < content.length) {
      snippet = `${snippet}...`
    }

    return snippet
  }
}
