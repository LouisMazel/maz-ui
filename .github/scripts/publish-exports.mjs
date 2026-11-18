// @ts-check

import { globSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { parse } from 'yaml'

/**
 * The `exports` of the packages start with a `monorepo:dev` condition: the apps of the monorepo resolve the sources
 * (`./src/*.ts`) with it, for the HMR without a build. The published package.json does not need it (`src` is not
 * published): pnpm publishes `publishConfig.exports` instead of `exports`, the same exports without this condition.
 * `node .github/scripts/publish-exports.mjs` writes them after a change of the `exports`, `--check` fails when they
 * are out of sync.
 */

const CONDITION = 'monorepo:dev'
const check = process.argv.includes('--check')
const root = process.cwd()

/** @type {{ packages: string[] }} */
const workspace = parse(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf-8'))

/**
 * @param {unknown} value
 * @returns {boolean} whether the exports use the condition
 */
function hasCondition(value) {
  return typeof value === 'object' && value !== null
    && Object.entries(value).some(([key, child]) => key === CONDITION || hasCondition(child))
}

/**
 * @param {unknown} value
 * @returns {unknown} the exports without the condition
 */
function withoutCondition(value) {
  if (typeof value !== 'object' || value === null)
    return value

  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== CONDITION)
    .map(([key, child]) => [
      key,
      withoutCondition(child),
    ]))
}

/** @type {string[]} */
const outdated = []

for (const file of globSync(workspace.packages.map(pattern => join(pattern, 'package.json')), { cwd: root })) {
  const path = join(root, file)
  const content = readFileSync(path, 'utf-8')
  /** @type {{ private?: boolean, exports?: unknown, publishConfig?: Record<string, unknown> }} */
  const pkg = JSON.parse(content)

  if (pkg.private || !hasCondition(pkg.exports))
    continue

  const exports = withoutCondition(pkg.exports)

  if (JSON.stringify(pkg.publishConfig?.exports) === JSON.stringify(exports))
    continue

  outdated.push(file)

  if (!check) {
    pkg.publishConfig = { ...pkg.publishConfig, exports }
    writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`)
  }
}

if (check && outdated.length > 0) {
  logger.error('publishConfig.exports is out of sync with exports, run `node .github/scripts/publish-exports.mjs`')
  for (const file of outdated)
    logger.error(file)
  process.exit(1)
}

logger.success(check || outdated.length === 0
  ? 'The publishConfig.exports are the exports without the monorepo:dev condition'
  : `publishConfig.exports written in ${outdated.join(', ')}`)
