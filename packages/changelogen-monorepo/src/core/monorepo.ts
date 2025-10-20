import type { GitCommit } from 'changelogen'
import type { ResolvedChangelogMonorepoConfig } from '../config'
import type { PackageInfo } from '../types'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { getGitDiff, parseCommits } from 'changelogen'
import { consola } from 'consola'
import fg from 'fast-glob'
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
      consola.info(`${packageJson.name} is private and will be ignored`)
      return null
    }
    if (ignorePackageNames?.includes(packageJson.name)) {
      consola.info(`${packageJson.name} ignored by config monorepo.ignorePackageNames`)
      return null
    }
    if (!packageJson.version) {
      consola.warn(`${packageJson.name} has no version and will be ignored`)
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
    consola.warn(`Unable to read ${packageJsonPath}:`, errorMessage)
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
      const matches = fg.sync(pattern, {
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
      consola.warn(`Unable to match pattern "${pattern}":`, (error as Error).message)
    }
  }

  return packages
}

export async function getPackageCommits({
  pkg,
  config,
}: {
  pkg: PackageInfo
  config: ResolvedChangelogMonorepoConfig
}): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(config.from, config.to, config.cwd)
  const allCommits = parseCommits(rawCommits, config)

  const rootPackage = getRootPackage(config.cwd)

  const commits = allCommits.filter((commit) => {
    const isAllowedType = config.types[commit.type]

    if (!isAllowedType) {
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
    throw new Error(`Unable to read ${packageJsonPath}: ${(error as Error).message}`)
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
    })
    if (commits.length > 0) {
      packagesWithCommits.push(pkg)
      consola.info(`  ${pkg.name}: ${commits.length} commit(s) found`)
    }
  }

  // Expand with dependent packages (transitive)
  const allPackagesToBump = expandPackagesToBumpWithDependents(packagesWithCommits, packages)

  return allPackagesToBump
}
