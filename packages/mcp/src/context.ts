import type { Knowledge, LoadKnowledgeOptions } from './knowledge/load.ts'

import { statSync } from 'node:fs'
import { join } from 'node:path'
import { findProjectMazUi, loadKnowledge } from './knowledge/load.ts'
import { DocSearch } from './search/engine.ts'

export interface ServerContext {
  readonly knowledge: Knowledge
  /** Search index, built on the first search: the server answers `initialize` without reading the docs */
  readonly search: DocSearch
  /** Directory used to resolve relative file paths (review_code) */
  cwd: string
  /** Reloads the knowledge when the maz-ui installed in the project changed since it was loaded. Returns true when it did. */
  refresh: () => boolean
}

export interface CreateContextOptions extends LoadKnowledgeOptions {
  knowledge?: Knowledge
}

interface InstalledSignature {
  directory: string
  version: string
  mtimeMs: number
}

function readSignature(cwd: string, known?: InstalledSignature): InstalledSignature | undefined {
  try {
    if (known) {
      const { mtimeMs } = statSync(join(known.directory, 'package.json'))

      if (mtimeMs === known.mtimeMs)
        return known
    }

    const installed = findProjectMazUi(cwd)

    return installed
      ? { ...installed, mtimeMs: statSync(join(installed.directory, 'package.json')).mtimeMs }
      : undefined
  }
  catch {
    return undefined
  }
}

function sameInstall(a: InstalledSignature | undefined, b: InstalledSignature | undefined): boolean {
  return a?.directory === b?.directory && a?.version === b?.version
}

export function createContext(options: CreateContextOptions = {}): ServerContext {
  const cwd = options.cwd ?? process.cwd()
  const pinned = Boolean(options.knowledge || options.docsDir || process.env.MAZ_UI_DOCS_DIR)
  let knowledge = options.knowledge ?? loadKnowledge({ ...options, cwd })
  let signature = pinned ? undefined : readSignature(cwd)
  let search: DocSearch | undefined

  return {
    get knowledge() {
      return knowledge
    },
    get search() {
      search ??= new DocSearch(knowledge)
      return search
    },
    cwd,
    refresh() {
      if (pinned)
        return false

      const current = readSignature(cwd, signature)

      if (sameInstall(current, signature)) {
        signature = current
        return false
      }

      knowledge = loadKnowledge({ ...options, cwd })
      search = undefined
      signature = current

      return true
    },
  }
}
