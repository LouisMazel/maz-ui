import type { OutputFile } from './types'

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export function writeOutput(directory: string, files: OutputFile[], { clean = false } = {}): void {
  if (clean && existsSync(directory)) {
    rmSync(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  }

  for (const file of files) {
    const target = join(directory, file.path)

    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, file.content)
  }
}

/** Returns the paths of the files that are missing or differ on disk */
export function findOutdatedFiles(directory: string, files: OutputFile[]): string[] {
  return files
    .filter((file) => {
      const target = join(directory, file.path)

      return !existsSync(target) || readFileSync(target, 'utf8') !== file.content
    })
    .map(file => file.path)
}
