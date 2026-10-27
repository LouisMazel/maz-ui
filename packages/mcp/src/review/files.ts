import type { Knowledge } from '../knowledge/load'
import type { Finding, Framework, Severity } from './types'

import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { glob } from 'tinyglobby'
import { filterBySeverity, reviewCode } from './index'

export const REVIEWABLE_EXTENSIONS = ['vue', 'ts', 'tsx', 'js', 'jsx', 'mjs', 'mts', 'css', 'scss', 'pcss', 'postcss']
export const MAX_REVIEWED_FILES = 200

export interface FileReview {
  file: string
  findings: Finding[]
}

/** Detects a Nuxt project by walking up from a directory to the closest `package.json` */
export function detectFramework(fromDirectory: string): Framework {
  let directory = fromDirectory

  for (;;) {
    if (['nuxt.config.ts', 'nuxt.config.js', 'nuxt.config.mjs'].some(file => existsSync(join(directory, file))))
      return 'nuxt'
    if (existsSync(join(directory, 'package.json')))
      return 'vue'

    const parent = dirname(directory)

    if (parent === directory)
      return 'vue'

    directory = parent
  }
}

export async function expandPaths(patterns: string[], cwd: string): Promise<string[]> {
  const files = new Set<string>()
  const globs: string[] = []

  for (const pattern of patterns) {
    const absolute = isAbsolute(pattern) ? pattern : resolve(cwd, pattern)

    if (existsSync(absolute) && statSync(absolute).isFile())
      files.add(absolute)
    else if (existsSync(absolute) && statSync(absolute).isDirectory())
      globs.push(`${relative(cwd, absolute) || '.'}/**/*.{${REVIEWABLE_EXTENSIONS.join(',')}}`)
    else
      globs.push(pattern)
  }

  if (globs.length > 0) {
    const matches = await glob(globs, { cwd, absolute: true, ignore: ['**/node_modules/**', '**/dist/**', '**/.nuxt/**', '**/.output/**', '**/coverage/**'] })

    for (const match of matches) files.add(match)
  }

  return [...files].filter(file => REVIEWABLE_EXTENSIONS.includes(file.split('.').pop() ?? '')).sort()
}

/** Path relative to the working directory, or absolute for a file outside of it */
export function displayPath(cwd: string, file: string): string {
  const path = relative(cwd, file)

  return path && !path.startsWith('..') && !isAbsolute(path) ? path : file
}

export interface ReviewFilesOptions {
  knowledge: Knowledge
  cwd: string
  framework?: Framework
  minSeverity?: Severity
}

export async function reviewFiles(patterns: string[], { knowledge, cwd, framework, minSeverity = 'info' }: ReviewFilesOptions): Promise<{ reviews: FileReview[], truncated: boolean }> {
  const files = await expandPaths(patterns, cwd)

  return {
    truncated: files.length > MAX_REVIEWED_FILES,
    reviews: files.slice(0, MAX_REVIEWED_FILES).map(file => ({
      file: displayPath(cwd, file),
      findings: filterBySeverity(
        reviewCode(readFileSync(file, 'utf8'), { knowledge, filename: file, framework: framework ?? detectFramework(dirname(file)) }),
        minSeverity,
      ),
    })),
  }
}
