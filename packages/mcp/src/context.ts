import type { Knowledge, LoadKnowledgeOptions } from './knowledge/load'

import { loadKnowledge } from './knowledge/load'
import { DocSearch } from './search/engine'

export interface ServerContext {
  knowledge: Knowledge
  /** Search index, built on the first search: the server answers `initialize` without reading the docs */
  readonly search: DocSearch
  /** Directory used to resolve relative file paths (review_code) */
  cwd: string
}

export interface CreateContextOptions extends LoadKnowledgeOptions {
  knowledge?: Knowledge
}

export function createContext(options: CreateContextOptions = {}): ServerContext {
  const cwd = options.cwd ?? process.cwd()
  const knowledge = options.knowledge ?? loadKnowledge({ ...options, cwd })

  let search: DocSearch | undefined

  return {
    knowledge,
    get search() {
      search ??= new DocSearch(knowledge)
      return search
    },
    cwd,
  }
}
