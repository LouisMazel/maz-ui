import type { GitCommit, ResolvedChangelogConfig } from 'changelogen'
import type { MonorepoConfig, PackageInfo } from '../types'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { getGitDiff, parseCommits } from 'changelogen'
import consola from 'consola'
import fg from 'fast-glob'

function isValidPackage(packagePath: string, monorepoConfig: MonorepoConfig): PackageInfo | null {
  const packageJsonPath = join(packagePath, 'package.json')

  if (!existsSync(packageJsonPath))
    return null
  if (!statSync(packagePath).isDirectory())
    return null

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    if (packageJson.private)
      return null
    if (monorepoConfig.ignorePackages?.includes(packageJson.name))
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
  monorepoConfig: MonorepoConfig,
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

        const packageInfo = isValidPackage(matchPath, monorepoConfig)
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
  config: ResolvedChangelogConfig,
  rootDir: string,
): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(config.from, config.to, config.cwd)

  const pathFilter = pkg.path === rootDir ? undefined : pkg.path.replace(`${rootDir}/`, '')

  const commits = parseCommits(rawCommits, config).filter((commit) => {
    const isAllowedType = config.types[commit.type]
    const isAllowedScope = pkg.name === 'root' || commit.scope === pkg.name

    const body: string = commit.body

    const isAllowedBody = (pathFilter && body.includes(`${pathFilter}`)) ?? true

    return isAllowedType && (isAllowedScope || isAllowedBody)
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
      name: packageJson.name || 'root',
      path: rootDir,
      version: packageJson.version,
    }
  }
  catch (error) {
    throw new Error(`Unable to read ${packageJsonPath}: ${(error as Error).message}`)
  }
}
