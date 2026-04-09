// @ts-check

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { coerce, satisfies } from 'semver'

/**
 * @type {Array<{ file: string, dep: string, devVersion: string, peerRange: string }>}
 */
const errors = []

const rootPkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
const rootDevDependencies = rootPkg.devDependencies || {}

/**
 * @param {string} dir
 * @param {Array<string>} results
 * @returns {Array<string>} results
 */
function findPackageJsons(dir, results = []) {
  for (const file of readdirSync(dir)) {
    if (file === 'node_modules' || file.startsWith('.'))
      continue

    const fullPath = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      findPackageJsons(fullPath, results)
    }
    else if (file === 'package.json') {
      results.push(fullPath)
    }
  }
  return results
}

/**
 * @param {string} pkgPath
 */
function checkPackage(pkgPath) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const { peerDependencies = {}, devDependencies = {} } = pkg

  for (const [dep, peerRange] of Object.entries(peerDependencies)) {
    const devVersion = devDependencies[dep] || rootDevDependencies[dep]
    if (!devVersion)
      continue

    const devSemver = coerce(devVersion)

    if (devSemver?.version && !satisfies(devSemver, peerRange)) {
      errors.push({
        file: pkgPath,
        dep,
        devVersion: devSemver.version,
        peerRange,
      })
    }
  }
}

// Scan the entire monorepo
const packageJsons = findPackageJsons(process.cwd())
packageJsons.forEach(checkPackage)

if (errors.length > 0) {
  logger.error('Peer dependencies out of sync')
  for (const err of errors) {
    logger.error(`${err.file}`)
    logger.error(`${err.dep}: devDep=${err.devVersion} does not satisfy peerDep="${err.peerRange}"\n`)
  }
  process.exit(1)
}
else {
  logger.success('All peer dependencies are synchronized with devDependencies')
}
