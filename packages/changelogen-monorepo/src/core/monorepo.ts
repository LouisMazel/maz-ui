import type { GitCommit } from 'changelogen'
import type { ChangelogMonorepoConfig, PackageInfo } from '../types'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { getGitDiff, parseCommits } from 'changelogen'
import { consola } from 'consola'
import fg from 'fast-glob'
import { expandPackagesToBumpWithDependents } from './dependencies'

function isValidPackage(
  packagePath: string,
  ignorePackages: ChangelogMonorepoConfig['monorepo']['ignorePackages'],
): PackageInfo | null {
  const packageJsonPath = join(packagePath, 'package.json')

  if (!existsSync(packageJsonPath))
    return null
  if (!statSync(packagePath).isDirectory())
    return null

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    if (packageJson.private)
      return null
    if (ignorePackages?.includes(packageJson.name))
      return null

    return {
      name: packageJson.name,
      path: packagePath,
      version: packageJson.version,
    }
  }
  catch (error) {
    consola.warn(`Unable to read ${packageJsonPath}:`, (error as Error).message)
    return null
  }
}

export function getPackages({
  cwd,
  patterns,
  ignorePackages,
}: {
  cwd: string
  patterns: string[]
  ignorePackages: ChangelogMonorepoConfig['monorepo']['ignorePackages']
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

        const packageInfo = isValidPackage(matchPath, ignorePackages)
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
  from,
  to,
  config,
}: {
  pkg: PackageInfo
  from: string
  to: string
  config: ChangelogMonorepoConfig
}): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(from, to, config.cwd)
  const allCommits = parseCommits(rawCommits, {
    ...config,
    from,
    to,
  })
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
      version: packageJson.version,
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
  config: ChangelogMonorepoConfig
}) {
  // First, identify packages with commits
  const packagesWithCommits: PackageInfo[] = []
  for (const pkg of packages) {
    const commits = await getPackageCommits({
      pkg,
      from: config.from,
      to: config.to,
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
