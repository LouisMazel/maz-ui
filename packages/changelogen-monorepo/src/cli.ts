#!/usr/bin/env node

import type { BumpOptions } from './types'
import { Command } from 'commander'
import { consola } from 'consola'
import { version } from './../package.json'
import { bump } from './commands/bump'
import { changelog } from './commands/changelog'
import { github } from './commands/github'
import { gitlab } from './commands/gitlab'
import { publish } from './commands/publish'
import { release } from './commands/release'

const program = new Command()

function getReleaseType(options: any) {
  let type: BumpOptions['type'] = 'release'

  if (options.major)
    type = 'major'
  else if (options.minor)
    type = 'minor'
  else if (options.patch)
    type = 'patch'
  else if (options.premajor)
    type = 'premajor'
  else if (options.prerelease)
    type = 'prerelease'
  else if (options.preminor)
    type = 'preminor'
  else if (options.prepatch)
    type = 'prepatch'

  return type
}

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
  .option('--premajor', 'Bump premajor version')
  .option('--preminor', 'Bump preminor version')
  .option('--prepatch', 'Bump prepatch version')
  .option('--preid <id>', 'Prerelease identifier (alpha, beta, rc, etc.)')
  .option('--dry-run', 'Preview changes without writing files')
  .action(async (options) => {
    try {
      await bump({
        type: getReleaseType(options),
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
  .option('--to <ref>', 'End commit reference')
  .option('--format-cmd <cmd>', 'Command to format CHANGELOG files after generation (e.g. "pnpm lint")')
  .option('--no-root-changelog', 'Skip generation of root changelog file')
  .option('--dry-run', 'Preview changes without writing files')
  .action(async (options) => {
    try {
      await changelog({
        from: options.from,
        to: options.to,
        formatCmd: options.formatCmd,
        rootChangelog: !options.noRootChangelog,
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
      await publish({
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
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference')
  .option('--token <token>', 'GitHub token (or use GITHUB_TOKEN env var)')
  .option('--dry-run', 'Preview github release content')
  .action(async (options) => {
    try {
      await github({
        token: options.token,
        dryRun: options.dryRun,
        from: options.from,
        to: options.to,
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
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference')
  .option('--token <token>', 'GitLab token (or use GITLAB_TOKEN env var)')
  .option('--dry-run', 'Preview github release content')
  .action(async (options) => {
    try {
      await gitlab({
        token: options.token,
        dryRun: options.dryRun,
        from: options.from,
        to: options.to,
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
  .option('--premajor', 'Bump premajor version')
  .option('--preminor', 'Bump preminor version')
  .option('--prepatch', 'Bump prepatch version')
  .option('--preid <id>', 'Prerelease identifier (alpha, beta, rc, etc.)')
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference')
  .option('--no-push', 'Skip push changes and tags to remote')
  .option('--no-release', 'Skip release creation (GitHub/GitLab)')
  .option('--no-publish', 'Skip npm publish')
  .option('--registry <url>', 'Custom npm registry URL')
  .option('--tag <tag>', 'Publish with specific tag (default: latest for stable, next for prerelease)')
  .option('--access <type>', 'Package access level (public or restricted)')
  .option('--otp <code>', 'One-time password for 2FA')
  .option('--no-verify', 'Skip git hooks during commit')
  .option('--format-cmd <cmd>', 'Command to format CHANGELOG files after generation (e.g. "pnpm lint")')
  .option('--no-root-changelog', 'Skip generation of root changelog file')
  .option('--dry-run', 'Preview changes without writing files or making commits')
  .option('--token <token>', 'Git token (github or gitlab)')
  .action(async (options) => {
    try {
      await release({
        type: getReleaseType(options),
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
        formatCmd: options.formatCmd,
        rootChangelog: !options.noRootChangelog,
        token: options.token,
      })
    }
    catch (error) {
      consola.error(error)
      process.exit(1)
    }
  })

program.parse()
