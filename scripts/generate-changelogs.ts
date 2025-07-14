#!/usr/bin/env tsx

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/utils/src/utils/execPromise.js'
import { logger } from '@maz-ui/utils/src/utils/logger.js'
import {
  generateMarkDown,
  getGitDiff,
  type GitCommit,
  loadChangelogConfig,
  parseCommits,
  type ResolvedChangelogConfig,
  syncGithubRelease,
} from 'changelogen'
import { name, version } from '../package.json'

import changelogenConfig from './changelogen.config'

const packagesDir = join(__dirname, '..', 'packages')
const rootDir = join(__dirname, '..')

interface PackageInfo {
  name: string
  path: string
}

async function getChangelogConfig() {
  const config = await loadChangelogConfig(process.cwd(), {
    ...changelogenConfig,
    tokens: {
      github:
        process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
    },
    from: version,
    to: 'HEAD',
  })

  if (!config.output) {
    throw new Error('No output specified in changelog config')
  }

  if (!config.tokens.github) {
    throw new Error('No GitHub token specified in changelog config')
  }

  return config
}

async function getPackageCommits(
  from: string,
  to: string,
  pkg: PackageInfo,
  config: ResolvedChangelogConfig,
): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(from, to)

  const pathFilter = pkg.path === rootDir ? undefined : pkg.path.replace(`${rootDir}/`, '')

  const commits = parseCommits(rawCommits, config).filter((commit) => {
    const isAllowedType = config.types[commit.type]
    const isAllowedScope = pkg.name === 'root' || commit.scope === pkg.name

    const body: string = commit.body

    const isAllowedBody = (pathFilter && body.includes(`${pathFilter}`)) ?? true

    return isAllowedType && (isAllowedScope || isAllowedBody)
  })

  if (commits.length === 0) {
    return []
  }

  return commits
}

function writeChangelogToFile(pkg: PackageInfo, changelog: string) {
  const changelogPath = join(pkg.path, 'CHANGELOG.md')

  let existingChangelog = ''
  if (existsSync(changelogPath)) {
    existingChangelog = readFileSync(changelogPath, 'utf8')
  }

  // Insert new changelog at the top, after the title
  const lines = existingChangelog.split('\n')
  const titleIndex = lines.findIndex(line => line.startsWith('# '))

  let updatedChangelog: string
  if (titleIndex !== -1) {
    // Insert after the title
    const beforeTitle = lines.slice(0, titleIndex + 1)
    const afterTitle = lines.slice(titleIndex + 1)
    updatedChangelog = [...beforeTitle, '', changelog, '', ...afterTitle].join('\n')
  }
  else {
    // No title found, create one and add changelog
    const title = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n`
    updatedChangelog = `${title}\n${changelog}\n${existingChangelog}`
  }

  writeFileSync(changelogPath, updatedChangelog, 'utf8')
}

async function generateChangelog(pkg: PackageInfo, config: ResolvedChangelogConfig) {
  logger.log(`🔄 Generating changelog for ${pkg.name}...`)

  try {
    const { stdout: previousTag } = await execPromise('git tag --sort=-v:refname | sed -n \'1p\'', {
      noSuccess: true,
      noStdout: true,
    })
    const previousTagTrimed = previousTag.trim()

    // Get commits filtered by package path
    const commits = await getPackageCommits(previousTagTrimed, version, pkg, config)

    let newChangelog = await generateMarkDown(commits, config)

    if (commits.length === 0) {
      logger.log(`📭 No relevant commits found for ${pkg.name}`)

      newChangelog = `${newChangelog}\n\n` + `**Note:** Version bump only to follow ecosystem versioning`
    }

    logger.log(`📋 Changelog for ${pkg.name}:`, newChangelog)

    // Write changelog to file
    await writeChangelogToFile(pkg, newChangelog)

    logger.success(`✅ Changelog generated for ${pkg.name}!`)

    return newChangelog
  }
  catch (error) {
    logger.error(`❌ Error generating changelog for ${pkg.name}:`, (error as Error).message)
  }
}

function getPackages(): PackageInfo[] {
  const packages: PackageInfo[] = []

  if (existsSync(packagesDir)) {
    const packageFolders = readdirSync(packagesDir)

    for (const folder of packageFolders) {
      const packagePath = join(packagesDir, folder)
      const packageJsonPath = join(packagePath, 'package.json')

      if (!existsSync(packageJsonPath) || !statSync(packagePath).isDirectory()) {
        continue
      }

      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
        if (packageJson.private) {
          continue
        }

        packages.push({
          name: packageJson.name,
          path: packagePath,
        })
      }
      catch (error) {
        logger.warn(`⚠️ Unable to read ${packageJsonPath}:`, (error as Error).message)
      }
    }
  }

  return packages
}

async function main() {
  logger.log('🚀 Starting changelog generation...')

  const config = await getChangelogConfig()

  const releaseChangelog = await generateChangelog(
    {
      name,
      path: rootDir,
    },
    config,
  )

  if (!releaseChangelog) {
    logger.error('❌ No changelog generated')
    return
  }

  logger.log('📦 Generating package changelogs...')
  const packages = getPackages()

  for await (const pkg of packages) {
    await generateChangelog(pkg, config)
  }

  logger.success('✨ Changelog generation completed!')

  try {
    const response = await syncGithubRelease(config, {
      version,
      body: releaseChangelog,
    })

    logger.log()
    logger.success('Release pushed to GitHub.', JSON.stringify(response, null, 2))
    logger.log()
  }
  catch (error: any) {
    logger.error('error', error)
  }
}

main()
