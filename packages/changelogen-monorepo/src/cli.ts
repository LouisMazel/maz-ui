#!/usr/bin/env node

import { Command } from 'commander'
import { consola } from 'consola'
import { version } from './../package.json'
import { bumpCommand } from './commands/bump'
import { changelogCommand } from './commands/changelog'
import { githubCommand } from './commands/github'
import { gitlabCommand } from './commands/gitlab'
import { publishCommand } from './commands/publish'
import { releaseCommand } from './commands/release'

const program = new Command()

program
  .name('changelogen-monorepo')
  .description('Changelogen adapter for monorepo management')
  .version(version)

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
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference', 'HEAD')
  .option('--format-cmd <cmd>', 'Command to format CHANGELOG files after generation (e.g. "pnpm lint"')
  .option('--dry-run', 'Preview changes without writing files')
  .action(async (options) => {
    try {
      await changelogCommand({
        from: options.from,
        formatCmd: options.formatCmd,
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
  .description('Complete release workflow (bump + changelog + commit + tag + push to remote + publish release)')
  .option('--major', 'Bump major version')
  .option('--minor', 'Bump minor version')
  .option('--patch', 'Bump patch version')
  .option('--prerelease', 'Bump prerelease version')
  .option('--preid <id>', 'Prerelease identifier (alpha, beta, rc, etc.)')
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference', 'HEAD')
  .option('--no-push', 'Skip push changes and tags to remote')
  .option('--no-release', 'Skip release creation (GitHub/GitLab)')
  .option('--no-publish', 'Skip npm publish')
  .option('--registry <url>', 'Custom npm registry URL')
  .option('--tag <tag>', 'Publish with specific tag (default: latest for stable, next for prerelease)')
  .option('--access <type>', 'Package access level (public or restricted)')
  .option('--otp <code>', 'One-time password for 2FA')
  .option('--no-verify', 'Skip git hooks during commit')
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
        from: options.from,
        to: options.to,
        push: !options.noPush,
        release: options.release,
        publish: !options.noPublish,
        registry: options.registry,
        tag: options.tag,
        access: options.access,
        otp: options.otp,
        noVerify: options.noVerify,
        dryRun: options.dryRun,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program
  .command('publish')
  .description('Publish packages to npm registry')
  .option('--registry <url>', 'Custom npm registry URL')
  .option('--tag <tag>', 'Publish with specific tag (default: latest for stable, next for prerelease)')
  .option('--access <type>', 'Package access level (public or restricted)')
  .option('--otp <code>', 'One-time password for 2FA')
  .option('--dry-run', 'Preview publish without actually publishing')
  .action(async (options) => {
    try {
      await publishCommand({
        registry: options.registry,
        tag: options.tag,
        access: options.access,
        otp: options.otp,
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
  .option('--dry-run', 'Preview github release content')
  .argument('[versions...]', 'Specific versions to publish')
  .action(async (versions, options) => {
    try {
      await githubCommand({
        versions,
        all: options.all,
        token: options.token,
        dryRun: options.dryRun,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program
  .command('gitlab')
  .description('Publish GitLab release for the latest tag')
  .option('--token <token>', 'GitLab token (or use GITLAB_TOKEN env var)')
  .option('--all', 'Publish releases for all versions in CHANGELOG.md')
  .option('--dry-run', 'Preview github release content')
  .argument('[versions...]', 'Specific versions to publish')
  .action(async (versions, options) => {
    try {
      await gitlabCommand({
        versions,
        all: options.all,
        token: options.token,
        dryRun: options.dryRun,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program.parse()
