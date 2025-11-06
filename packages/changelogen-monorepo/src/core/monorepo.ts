import type { GitCommit } from 'changelogen'
import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { ConfigType, PackageInfo, PackageWithCommits } from '../types'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { logger } from '@maz-ui/node'
import { getGitDiff, parseCommits } from 'changelogen'
import fastGlob from 'fast-glob'
import { isChangedPreid, isGraduating } from '../core'
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
      currentVersion: packageJson.version,
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

  logger.debug(`Getting packages from patterns: ${patterns.join(', ')}`)

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

function isAllowedCommit({
  commit,
  type,
  changelog,
}: {
  commit: GitCommit
  type?: ConfigType
  changelog: boolean
}): boolean {
  if (
    commit.type === 'chore'
    && ['deps', 'release'].includes(commit.scope)
    && !commit.isBreaking
  ) {
    return false
  }

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
  from,
  to,
  config,
  changelog,
}: {
  pkg: PackageInfo
  from: string
  to: string
  config: ResolvedChangelogMonorepoConfig
  changelog: boolean
}): Promise<GitCommit[]> {
  logger.debug(`Analyzing commits for ${pkg.name} since ${from} to ${to}`)

  const changelogConfig = {
    ...config,
    from,
    to,
  }

  const rawCommits = await getGitDiff(from, to, changelogConfig.cwd)
  const allCommits = parseCommits(rawCommits, changelogConfig)

  const hasBreakingChanges = allCommits.some(commit => commit.isBreaking)
  logger.debug(`Has breaking changes: ${hasBreakingChanges}`)

  const rootPackage = getRootPackage(changelogConfig.cwd)

  const commits = allCommits.filter((commit) => {
    const type = changelogConfig?.types[commit.type] as ConfigType | undefined

    if (!isAllowedCommit({ commit, type, changelog })) {
      return false
    }

    if (pkg.path === changelogConfig.cwd || pkg.name === rootPackage.name) {
      return true
    }

    const packageRelativePath = pkg.path.replace(`${changelogConfig.cwd}/`, '')

    const scopeMatches = commit.scope === pkg.name
    const bodyContainsPath = commit.body.includes(packageRelativePath)

    return scopeMatches || bodyContainsPath
  })

  logger.debug(`Found ${commits.length} commit(s) for ${pkg.name} from ${from} to ${to}`)

  if (commits.length > 0) {
    logger.debug(`${pkg.name}: ${commits.length} commit(s) found`)
  }
  else {
    logger.debug(`${pkg.name}: No commits found`)
  }

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
      currentVersion: packageJson.version || '0.0.0',
      path: rootDir,
      version: packageJson.version || '0.0.0',
    }
  }
  catch (error) {
    throw new Error(`Unable to read ${packageJsonPath}: ${error}`)
  }
}

export function hasLernaJson(rootDir: string): boolean {
  const lernaJsonPath = join(rootDir, 'lerna.json')
  return existsSync(lernaJsonPath)
}

export async function getPackageToBump({
  packages,
  config,
  from,
  to,
}: {
  packages: PackageInfo[]
  config: ResolvedChangelogMonorepoConfig
  from: string
  to: string
}) {
  const packagesWithCommits: PackageWithCommits[] = []

  for (const pkg of packages) {
    const commits = await getPackageCommits({
      pkg,
      from,
      to,
      config,
      changelog: false,
    })

    const graduating = isGraduating(pkg.version, config.bump.type) || isChangedPreid(pkg.version, config.bump.preid)

    if (commits.length > 0 || graduating) {
      packagesWithCommits.push({ ...pkg, commits })
    }
  }

  const allPackagesToBump = expandPackagesToBumpWithDependents({
    allPackages: packages,
    packagesWithCommits,
    dependencyTypes: config.bump?.dependencyTypes,
  })

  return allPackagesToBump
}
