import type { GitCommit, SemverBumpType } from 'changelogen'
import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { PackageInfo } from '../types'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { logger } from '@maz-ui/node'
import { getGitDiff, parseCommits } from 'changelogen'
import fastGlob from 'fast-glob'
import { expandPackagesToBumpWithDependents } from './dependencies'

function getPackageInfo(
  packagePath: string,
  ignorePackageNames: ResolvedChangelogMonorepoConfig['monorepo']['ignorePackageNames'],
): PackageInfo | null {
  const packageJsonPath = join(packagePath, 'package.json')

  if (!existsSync(packageJsonPath))
    return null
  if (!statSync(packagePath).isDirectory())
    return null

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    if (packageJson.private) {
      logger.debug(`${packageJson.name} is private and will be ignored`)
      return null
    }
    if (ignorePackageNames?.includes(packageJson.name)) {
      logger.debug(`${packageJson.name} ignored by config monorepo.ignorePackageNames`)
      return null
    }
    if (!packageJson.version) {
      logger.warn(`${packageJson.name} has no version and will be ignored`)
      return null
    }

    return {
      name: packageJson.name,
      path: packagePath,
      version: packageJson.version,
    }
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.warn(`Unable to read ${packageJsonPath}:`, errorMessage)
    return null
  }
}

export function getPackages({
  cwd,
  patterns,
  ignorePackageNames,
}: {
  cwd: string
  patterns: string[]
  ignorePackageNames: ResolvedChangelogMonorepoConfig['monorepo']['ignorePackageNames']
}): PackageInfo[] {
  const packages: PackageInfo[] = []
  const foundPaths = new Set<string>()

  for (const pattern of patterns) {
    try {
      const matches = fastGlob.sync(pattern, {
        cwd,
        onlyDirectories: true,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      })

      for (const matchPath of matches) {
        if (foundPaths.has(matchPath))
          continue

        const packageInfo = getPackageInfo(matchPath, ignorePackageNames)
        if (packageInfo) {
          foundPaths.add(matchPath)
          packages.push(packageInfo)
        }
      }
    }
    catch (error) {
      logger.error(`Unable to match pattern "${pattern}":`, error)
    }
  }

  return packages
}

function isAllowedType({
  type,
  changelog,
}: {
  type: {
    title: string
    semver?: SemverBumpType
  } | boolean
  changelog: boolean
}): boolean {
  if (typeof type === 'object') {
    return !!type.semver || (changelog && !!type.title)
  }

  if (typeof type === 'boolean') {
    return type
  }

  return false
}

export async function getPackageCommits({
  pkg,
  config,
  changelog,
}: {
  pkg: PackageInfo
  config: ResolvedChangelogMonorepoConfig
  changelog: boolean
}): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(config.from, config.to, config.cwd)
  const allCommits = parseCommits(rawCommits, config)

  const rootPackage = getRootPackage(config.cwd)

  const commits = allCommits.filter((commit) => {
    const type = config?.types[commit.type]

    if (!isAllowedType({ type, changelog })) {
      return false
    }

    if (pkg.path === config.cwd || pkg.name === rootPackage.name) {
      return true
    }

    const packageRelativePath = pkg.path.replace(`${config.cwd}/`, '')

    const scopeMatches = commit.scope === pkg.name
    const bodyContainsPath = commit.body.includes(packageRelativePath)

    return scopeMatches || bodyContainsPath
  })

  return commits
}

export function getRootPackage(rootDir: string): PackageInfo {
  const packageJsonPath = join(rootDir, 'package.json')

  if (!existsSync(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`)
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    return {
      name: packageJson.name,
      path: rootDir,
      version: packageJson.version || '0.0.0',
    }
  }
  catch (error) {
    throw new Error(`Unable to read ${packageJsonPath}: ${error}`)
  }
}

export async function getPackageToBump({
  packages,
  config,
}: {
  packages: PackageInfo[]
  config: ResolvedChangelogMonorepoConfig
}) {
  // First, identify packages with commits
  const packagesWithCommits: PackageInfo[] = []
  for (const pkg of packages) {
    const commits = await getPackageCommits({
      pkg,
      config,
      changelog: false,
    })
    if (commits.length > 0) {
      packagesWithCommits.push(pkg)
      logger.info(`${pkg.name}: ${commits.length} commit(s) found`)
    }
  }

  const allPackagesToBump = expandPackagesToBumpWithDependents(packagesWithCommits, packages)

  return allPackagesToBump
}
