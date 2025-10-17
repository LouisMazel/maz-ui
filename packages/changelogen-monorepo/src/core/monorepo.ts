import type { GitCommit } from 'changelogen'
import type { ChangelogMonorepoConfig, PackageInfo } from '../types'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { getGitDiff, parseCommits } from 'changelogen'
import { consola } from 'consola'
import fg from 'fast-glob'

function isValidPackage(packagePath: string, config: ChangelogMonorepoConfig): PackageInfo | null {
  const packageJsonPath = join(packagePath, 'package.json')

  if (!existsSync(packageJsonPath))
    return null
  if (!statSync(packagePath).isDirectory())
    return null

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    if (packageJson.private)
      return null
    if (config.monorepo.ignorePackages?.includes(packageJson.name))
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

export function getPackages(
  cwd: string,
  patterns: string[],
  config: ChangelogMonorepoConfig,
): PackageInfo[] {
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

        const packageInfo = isValidPackage(matchPath, config)
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

export async function getPackageCommits(
  pkg: PackageInfo,
  config: ChangelogMonorepoConfig,
  rootDir: string,
): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(config.from, config.to, config.cwd)
  const allCommits = parseCommits(rawCommits, config)

  const commits = allCommits.filter((commit) => {
    const isAllowedType = config.types[commit.type]

    if (!isAllowedType) {
      return false
    }

    if (pkg.path === rootDir || pkg.name === 'root') {
      return true
    }

    const packageRelativePath = pkg.path.replace(`${rootDir}/`, '')

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
