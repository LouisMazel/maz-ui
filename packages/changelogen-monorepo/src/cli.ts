#!/usr/bin/env node

import { Command } from 'commander'
import consola from 'consola'
import { bumpCommand } from './commands/bump'
import { changelogCommand } from './commands/changelog'
import { githubCommand } from './commands/github'
import { releaseCommand } from './commands/release'

const program = new Command()

program
  .name('changelogen-monorepo')
  .description('Changelogen adapter for monorepo management')
  .version('0.0.1')

program
  .command('bump')
  .description('Bump package versions')
  .option('--major', 'Bump major version')
  .option('--minor', 'Bump minor version')
  .option('--patch', 'Bump patch version')
  .option('--prerelease', 'Bump prerelease version')
  .option('--preid <id>', 'Prerelease identifier (alpha, beta, rc, etc.)')
  .option('--dry-run', 'Preview changes without writing files')
  .action(async (options) => {
    try {
      let type: 'major' | 'minor' | 'patch' | 'prerelease' | undefined
      if (options.major)
        type = 'major'
      else if (options.minor)
        type = 'minor'
      else if (options.patch)
        type = 'patch'
      else if (options.prerelease)
        type = 'prerelease'

      await bumpCommand({
        type,
        preid: options.preid,
        dryRun: options.dryRun,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program
  .command('changelog')
  .description('Generate changelogs for all packages')
  .option('--release-type <type>', 'Release type (latest or prerelease)', 'prerelease')
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference', 'HEAD')
  .option('--dry-run', 'Preview changes without writing files')
  .action(async (options) => {
    try {
      await changelogCommand({
        releaseType: options.releaseType,
        from: options.from,
        to: options.to,
        dryRun: options.dryRun,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program
  .command('release')
  .description('Complete release workflow (bump + changelog + commit + tag)')
  .option('--major', 'Bump major version')
  .option('--minor', 'Bump minor version')
  .option('--patch', 'Bump patch version')
  .option('--prerelease', 'Bump prerelease version')
  .option('--preid <id>', 'Prerelease identifier (alpha, beta, rc, etc.)')
  .option('--release-type <type>', 'Release type (latest or prerelease)', 'prerelease')
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference', 'HEAD')
  .option('--push', 'Push changes and tags to remote')
  .option('--no-github', 'Skip GitHub release creation')
  .option('--dry-run', 'Preview changes without writing files or making commits')
  .action(async (options) => {
    try {
      let type: 'major' | 'minor' | 'patch' | 'prerelease' | undefined
      if (options.major)
        type = 'major'
      else if (options.minor)
        type = 'minor'
      else if (options.patch)
        type = 'patch'
      else if (options.prerelease)
        type = 'prerelease'

      await releaseCommand({
        type,
        preid: options.preid,
        releaseType: options.releaseType,
        from: options.from,
        to: options.to,
        push: options.push,
        github: options.github,
        dryRun: options.dryRun,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program
  .command('github')
  .description('Publish GitHub release for the latest tag')
  .option('--token <token>', 'GitHub token (or use GITHUB_TOKEN env var)')
  .option('--all', 'Publish releases for all versions in CHANGELOG.md')
  .argument('[versions...]', 'Specific versions to publish')
  .action(async (versions, options) => {
    try {
      await githubCommand({
        versions,
        all: options.all,
        token: options.token,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program.parse()
