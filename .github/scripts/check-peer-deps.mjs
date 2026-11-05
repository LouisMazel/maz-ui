// @ts-check

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { minVersion, satisfies, validRange } from 'semver'
import { parse } from 'yaml'

/**
 * Every peer dependency of a project of the workspace is also declared in its devDependencies,
 * with a version (or a `catalog:` entry) inside the peer range
 */

const root = process.cwd()

/**
 * @type {{ packages: string[], catalog?: Record<string, string>, catalogs?: Record<string, Record<string, string>> }}
 */
const workspace = parse(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf-8'))

/**
 * Directories of the projects of the workspace, from the `packages` patterns of pnpm-workspace.yaml (`dir` or `dir/*`)
 * @returns {string[]} directories
 */
function getProjectDirs() {
  return workspace.packages
    .flatMap((pattern) => {
      if (!pattern.endsWith('/*')) {
        return [
          join(root, pattern),
        ]
      }

      const parent = join(root, pattern.slice(0, -2))

      return readdirSync(parent, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => join(parent, entry.name))
    })
    .filter(dir => existsSync(join(dir, 'package.json')))
}

/**
 * @param {string} dep
 * @param {string} specifier `^1.2.3`, `catalog:` or `catalog:<name>`
 * @returns {string | undefined} range
 */
function resolveRange(dep, specifier) {
  if (!specifier.startsWith('catalog:'))
    return specifier

  const name = specifier.slice('catalog:'.length)

  if (!name || name === 'default')
    return workspace.catalog?.[dep] ?? workspace.catalogs?.default?.[dep]

  return workspace.catalogs?.[name]?.[dep]
}

/**
 * @param {string} dir
 * @returns {string[]} problems
 */
function checkProject(dir) {
  const file = relative(root, join(dir, 'package.json')) || 'package.json'
  const { peerDependencies = {}, devDependencies = {} } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'))

  return Object.entries(peerDependencies).flatMap(([dep, peerRange]) => {
    if (peerRange.startsWith('workspace:'))
      return []

    const specifier = devDependencies[dep]

    if (!specifier)
      return [`${file}: ${dep} is a peer dependency, declare it in devDependencies too`]

    const devRange = resolveRange(dep, specifier)

    if (!devRange)
      return [`${file}: ${dep} uses "${specifier}" but this catalog has no ${dep}`]

    const lowest = validRange(devRange)
      ? minVersion(devRange)
      : null

    if (!lowest)
      return [`${file}: ${dep} has an unreadable version in devDependencies ("${devRange}")`]

    if (!satisfies(lowest, peerRange))
      return [`${file}: ${dep}@${devRange} (devDependencies) is outside the peer range "${peerRange}"`]

    return []
  })
}

const problems = getProjectDirs().flatMap(checkProject)

if (problems.length > 0) {
  logger.error('Peer dependencies out of sync with the devDependencies')
  for (const problem of problems)
    logger.error(problem)
  process.exit(1)
}

logger.success('All peer dependencies are declared in the devDependencies, inside their peer range')
