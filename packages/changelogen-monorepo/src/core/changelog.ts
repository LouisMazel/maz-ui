import type { GitCommit, ResolvedChangelogConfig } from 'changelogen'
import type { PackageInfo } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { generateMarkDown } from 'changelogen'
import { consola } from 'consola'

export async function generateChangelog(
  { pkg, commits, config }: {
    pkg: PackageInfo
    commits: GitCommit[]
    config: ResolvedChangelogConfig
  },
) {
  try {
    if (commits.length === 0) {
      return undefined
    }

    consola.info(`Generating changelog for ${pkg.name} - from ${config.from} to ${config.to}`)

    let changelog = await generateMarkDown(commits, config)

    if (!config.to.startsWith('v')) {
      changelog = changelog.replaceAll(config.to, `v${pkg.version}`)
    }

    consola.success(`Changelog generated for ${pkg.name} (${commits.length} commits)`)
    return changelog
  }
  catch (error) {
    throw new Error(`Error generating changelog for ${pkg.name}: ${(error as Error).message}`)
  }
}

export function writeChangelogToFile({
  pkg,
  changelog,
  dryRun = false,
}: {
  pkg: PackageInfo
  changelog: string
  dryRun: boolean
}) {
  const changelogPath = join(pkg.path, 'CHANGELOG.md')

  let existingChangelog = ''
  if (existsSync(changelogPath)) {
    existingChangelog = readFileSync(changelogPath, 'utf8')
  }

  const lines = existingChangelog.split('\n')
  const titleIndex = lines.findIndex(line => line.startsWith('# '))

  let updatedChangelog: string
  if (titleIndex !== -1) {
    const beforeTitle = lines.slice(0, titleIndex + 1)
    const afterTitle = lines.slice(titleIndex + 1)
    updatedChangelog = [...beforeTitle, '', changelog, '', ...afterTitle].join('\n')
  }
  else {
    const title = '# Changelog\n'
    updatedChangelog = `${title}\n${changelog}\n${existingChangelog}`
  }

  if (dryRun) {
    consola.info(`[DRY RUN] ${pkg.name} - Would write changelog to ${changelogPath}`)
    consola.info(`[DRY RUN] ${pkg.name} - ${changelog}`)
    return
  }

  writeFileSync(changelogPath, updatedChangelog, 'utf8')

  consola.success(`Updated ${changelogPath}`)
}
