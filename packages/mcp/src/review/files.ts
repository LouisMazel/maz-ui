import type { Knowledge } from '../knowledge/load'
import type { Finding, Framework, IconNames, Severity } from './types'

import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { glob } from 'tinyglobby'
import { loadIconNames } from './icons'
import { filterBySeverity, reviewCode } from './index'

export const REVIEWABLE_EXTENSIONS = [
  'vue',
  'ts',
  'tsx',
  'js',
  'jsx',
  'mjs',
  'mts',
  'css',
  'scss',
  'pcss',
  'postcss',
]
export const MAX_REVIEWED_FILES = 200

const IGNORED_DIRECTORIES = [
  'node_modules',
  'dist',
  '.nuxt',
  '.output',
  'coverage',
]

/** A file of a dependency or of a build output (`node_modules`, `dist`, `coverage`...) */
export function isIgnoredPath(path: string): boolean {
  return path.split(/[\\/]/).some(segment => IGNORED_DIRECTORIES.includes(segment))
}

export interface FileReview {
  file: string
  findings: Finding[]
}

const NUXT_CONFIGS = ['nuxt.config.ts', 'nuxt.config.js', 'nuxt.config.mjs']

/** The closest directory with a `package.json` or a Nuxt config, walking up from a directory */
export function findProjectRoot(fromDirectory: string): string | undefined {
  let directory = fromDirectory

  for (;;) {
    if ([...NUXT_CONFIGS, 'package.json'].some(file => existsSync(join(directory, file))))
      return directory

    const parent = dirname(directory)

    if (parent === directory)
      return undefined

    directory = parent
  }
}

/** Detects a Nuxt project by walking up from a directory to the closest `package.json` */
export function detectFramework(fromDirectory: string): Framework {
  const root = findProjectRoot(fromDirectory)

  return root && NUXT_CONFIGS.some(file => existsSync(join(root, file)))
    ? 'nuxt'
    : 'vue'
}

/** The icon names of the project of a directory, `undefined` outside of a project */
export function projectIconNames(fromDirectory: string, knowledge: Knowledge, cache = new Map<string, IconNames>()): IconNames | undefined {
  const root = findProjectRoot(fromDirectory)

  if (!root)
    return undefined
  if (!cache.has(root))
    cache.set(root, loadIconNames(root, detectFramework(root), knowledge))

  return cache.get(root)
}

export async function expandPaths(patterns: string[], cwd: string): Promise<string[]> {
  const files = new Set<string>()
  const globs: string[] = []

  for (const pattern of patterns) {
    const absolute = isAbsolute(pattern)
      ? pattern
      : resolve(cwd, pattern)

    if (existsSync(absolute) && statSync(absolute).isFile())
      files.add(absolute)
    else if (existsSync(absolute) && statSync(absolute).isDirectory())
      globs.push(`${relative(cwd, absolute) || '.'}/**/*.{${REVIEWABLE_EXTENSIONS.join(',')}}`)
    else
      globs.push(pattern)
  }

  if (globs.length > 0) {
    const matches = await glob(globs, {
      cwd,
      absolute: true,
      ignore: IGNORED_DIRECTORIES.map(directory => `**/${directory}/**`),
    })

    // the ignore patterns do not apply to the patterns outside of cwd (`../app`)
    for (const match of matches.filter(entry => !isIgnoredPath(relative(cwd, entry)))) files.add(match)
  }

  return [...files].filter(file => REVIEWABLE_EXTENSIONS.includes(file.split('.').pop() ?? '')).sort()
}

/** Path relative to the working directory, or absolute for a file outside of it */
export function displayPath(cwd: string, file: string): string {
  const path = relative(cwd, file)

  return path && !path.startsWith('..') && !isAbsolute(path)
    ? path
    : file
}

export interface ReviewFilesOptions {
  knowledge: Knowledge
  cwd: string
  framework?: Framework
  minSeverity?: Severity
}

export async function reviewFiles(patterns: string[], { knowledge, cwd, framework, minSeverity = 'info' }: ReviewFilesOptions): Promise<{ reviews: FileReview[], truncated: boolean }> {
  const files = await expandPaths(patterns, cwd)
  const icons = new Map<string, IconNames>()

  return {
    truncated: files.length > MAX_REVIEWED_FILES,
    reviews: files.slice(0, MAX_REVIEWED_FILES).map(file => ({
      file: displayPath(cwd, file),
      findings: filterBySeverity(
        reviewCode(readFileSync(file, 'utf8'), {
          knowledge,
          filename: file,
          framework: framework ?? detectFramework(dirname(file)),
          icons: projectIconNames(dirname(file), knowledge, icons),
        }),
        minSeverity,
      ),
    })),
  }
}
