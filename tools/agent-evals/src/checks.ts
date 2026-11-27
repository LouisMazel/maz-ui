import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

export interface Check {
  passed: boolean
  /** Start of the output of a failed check (its first errors), empty when it passes */
  output: string
}

/** `vue-tsc --noEmit` and `vite build` of the app */
export interface AppChecks {
  typecheck: Check
  build: Check
}

const TIMEOUT_MS = 5 * 60_000
const OUTPUT_LENGTH = 4000

function git(cwd: string, args: string[]): string {
  // eslint-disable-next-line sonarjs/no-os-command-from-path -- the git of the machine, in a temporary folder
  return execFileSync('git', args, { cwd, encoding: 'utf8' })
}

function check(directory: string, bin: string, args: string[]): Check {
  const { status, stdout, stderr, error } = spawnSync(process.execPath, [join(directory, 'node_modules', bin), ...args], { cwd: directory, encoding: 'utf8', timeout: TIMEOUT_MS, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } })
  const passed = status === 0

  return { passed, output: passed ? '' : [stdout, stderr, error?.message].filter(Boolean).join('\n').trim().slice(0, OUTPUT_LENGTH) }
}

/** Whether the app of the agent typechecks and builds */
export function runChecks(directory: string): AppChecks {
  return {
    typecheck: check(directory, 'vue-tsc/bin/vue-tsc.js', ['--noEmit']),
    build: check(directory, 'vite/bin/vite.js', ['build', '--logLevel', 'error']),
  }
}

type Manifest = Partial<Record<'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies', Record<string, string>>>

function dependencyNames(json: string): Set<string> {
  try {
    const manifest = JSON.parse(json) as Manifest

    return new Set([manifest.dependencies, manifest.devDependencies, manifest.peerDependencies, manifest.optionalDependencies].flatMap(deps => Object.keys(deps ?? {})))
  }
  catch {
    return new Set()
  }
}

/** The dependencies the agent added to the `package.json` of the app since the last commit */
export function addedDependencies(directory: string): string[] {
  const before = dependencyNames(git(directory, ['show', 'HEAD:package.json']))
  const after = dependencyNames(readFileSync(join(directory, 'package.json'), 'utf8'))

  return [...after].filter(name => !before.has(name)).sort()
}

/** Lines the agent added to these files since the last commit */
export function addedLines(directory: string, files: string[]): number {
  if (files.length === 0)
    return 0

  git(directory, ['add', '--intent-to-add', '--', ...files])

  return git(directory, ['diff', '--numstat', 'HEAD', '--', ...files])
    .split('\n')
    .filter(Boolean)
    .reduce((sum, line) => sum + (Number.parseInt(line.split('\t')[0], 10) || 0), 0)
}
