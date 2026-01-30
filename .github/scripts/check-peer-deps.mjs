// .github/scripts/check-peer-deps.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { logger } from '@maz-ui/node'
import { coerce, gt, minVersion } from 'semver'

const errors = []

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

function checkPackage(pkgPath) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const { peerDependencies = {}, devDependencies = {} } = pkg

  for (const [dep, peerRange] of Object.entries(peerDependencies)) {
    const devVersion = devDependencies[dep]
    if (!devVersion)
      continue

    const devSemver = coerce(devVersion)
    const peerMax = extractMaxVersion(peerRange)

    if (devSemver && peerMax && gt(devSemver, peerMax)) {
      errors.push({
        file: pkgPath,
        dep,
        devVersion: devSemver.version,
        peerRange,
        peerMax: peerMax.version,
      })
    }
  }
}

function extractMaxVersion(range) {
  // Gère "<=" (inclusive) - DOIT être avant "<"
  const lessThanOrEqualMatch = range.match(/<=\s*(\d+\.\d+\.\d+)/)
  if (lessThanOrEqualMatch) {
    return coerce(lessThanOrEqualMatch[1]) // La version est incluse
  }

  // Gère "<" (exclusive)
  const lessThanMatch = range.match(/<\s*(\d+\.\d+\.\d+)/)
  if (lessThanMatch) {
    const ver = coerce(lessThanMatch[1])
    // <29.0.0 → max réelle est 28.x.x
    return ver ? coerce(`${ver.major - 1}.999.999`) : null
  }

  // Pour "^28.0.0", la max est la major suivante - 1
  const caretMatch = range.match(/\^(\d+)/)
  if (caretMatch) {
    return coerce(`${caretMatch[1]}.999.999`)
  }

  // Pour "~28.0.0"
  const tildeMatch = range.match(/~(\d+\.\d+)/)
  if (tildeMatch) {
    return coerce(`${tildeMatch[1]}.999`)
  }

  // Pour ">=X" sans limite haute → pas de max
  if (range.startsWith('>=') && !range.includes('<')) {
    return null
  }

  return minVersion(range)
}

// Scan tout le monorepo
const packageJsons = findPackageJsons(process.cwd())
packageJsons.forEach(checkPackage)

if (errors.length > 0) {
  logger.error('Peer dependencies out of sync')
  for (const err of errors) {
    logger.error(`${err.file}`)
    logger.error(`${err.dep}: devDep=${err.devVersion} but peerDep="${err.peerRange}" (max ~${err.peerMax})\n`)
  }
  process.exit(1)
}
else {
  logger.success('All peer dependencies are synchronized with devDependencies')
}
