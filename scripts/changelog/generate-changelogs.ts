#!/usr/bin/env tsx

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise, logger } from '@maz-ui/node/index.js'
import { name } from '../../package.json'
import { generateChangelog, getChangelogConfig, packagesDir, rootDir } from './utils'

type ReleaseType = 'latest' | 'prerelease'

interface PackageInfo {
  name: string
  path: string
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
    const title = `# Changelog\n`
    updatedChangelog = `${title}\n${changelog}\n${existingChangelog}`
  }

  writeFileSync(changelogPath, updatedChangelog, 'utf8')
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

async function getLastTag(releaseType: ReleaseType): Promise<string> {
  if (releaseType === 'latest') {
    const { stdout } = await execPromise(
      'git tag --sort=-v:refname | grep -E \'^v[0-9]+\\.[0-9]+\\.[0-9]+$\' | sed -n \'1p\'',
      {
        noSuccess: true,
        noStdout: true,
      },
    )
    return stdout.trim()
  }

  const { stdout } = await execPromise('git tag --sort=-v:refname | sed -n \'1p\'', {
    noSuccess: true,
    noStdout: true,
  })
  return stdout.trim()
}

async function main() {
  logger.log('🚀 Starting changelog generation...')

  const args = process.argv.slice(2)
  const releaseTypeArg = args.find(arg => arg.startsWith('--release-type='))
  const releaseType: ReleaseType = releaseTypeArg?.split('=')[1] as ReleaseType || 'prerelease'

  logger.log(`📋 Release type: ${releaseType}`)

  const lastTag = await getLastTag(releaseType)
  logger.log(`🏷️  Last tag: ${lastTag}`)

  const config = await getChangelogConfig({ from: lastTag, to: 'HEAD' })

  const releaseChangelog = await generateChangelog(
    {
      pkg: {
        name,
        path: rootDir,
      },
      config,
      to: 'HEAD',
    },
  )

  if (!releaseChangelog) {
    logger.error('❌ No changelog generated')
    return
  }

  writeChangelogToFile(
    {
      name,
      path: rootDir,
    },
    releaseChangelog,
  )

  logger.log('📦 Generating package changelogs...')
  const packages = getPackages()

  for await (const pkg of packages) {
    const changelog = await generateChangelog({ pkg, config, to: 'HEAD' })

    writeChangelogToFile(pkg, changelog)
  }

  logger.success('✨ Changelog generation completed!')
  logger.log('💡 Run `pnpm run scripts:publish-github-release` to publish the release to GitHub')
}

main()
