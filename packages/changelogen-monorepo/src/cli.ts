#!/usr/bin/env node

import type { BumpOptions } from './types'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { printBanner } from '@maz-ui/node'
import { Command } from 'commander'
import { bump, changelog, providerRelease, publish, release } from './commands'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8'),
)
const version = packageJson.version

printBanner({
  name: 'CLM',
  version: `By Maz-UI (v${version})`,
  options: {
    horizontalLayout: 'full',
    verticalLayout: 'full',
    font: 'ANSI Shadow',
    breakAfter: false,
    breakBefore: false,
    clear: false,
  },
})

const program = new Command()

function hasCliFlag(flag: string): boolean {
  return process.argv.includes(flag)
}

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
  .option('--config <name>', 'Config file name (without .config.ts - e.g. changelog-test)', 'changelog')
  .option('--log-level <level>', 'Set log level (silent, error, warning, normal, default, debug, trace, verbose)', 'default')
  .option('--dry-run', 'Preview changes without writing files, creating tags, commits or publishing')

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
  .option('--no-clean', 'Skip check if the working directory is clean')
  .option('--force', 'Bump even if there are no commits')
  .option('--yes', 'Skip confirmation prompt about bumping packages')
  .action(async (options) => {
    try {
      await bump({
        type: getReleaseType(options),
        preid: options.preid,
        clean: hasCliFlag('--no-clean') ? false : undefined,
        dryRun: program.opts().dryRun,
        logLevel: program.opts().logLevel,
        force: options.force,
        yes: options.yes,
        configName: program.opts().config,
      })
    }
    catch {
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
  .action(async (options) => {
    try {
      await changelog({
        from: options.from,
        to: options.to,
        formatCmd: options.formatCmd,
        rootChangelog: hasCliFlag('--no-root-changelog') ? false : undefined,
        dryRun: program.opts().dryRun,
        logLevel: program.opts().logLevel,
        configName: program.opts().config,
      })
    }
    catch {
      process.exit(1)
    }
  })

program
  .command('publish')
  .description('Publish packages to registry')
  .option('--registry <url>', 'Custom registry URL')
  .option('--tag <tag>', 'Publish with specific tag (default: latest for stable, next for prerelease)')
  .option('--access <type>', 'Package access level (public or restricted)')
  .option('--otp <code>', 'One-time password for 2FA')
  .option('--build-cmd <cmd>', 'Command to build packages before publish (e.g. "pnpm build")')
  .action(async (options) => {
    try {
      await publish({
        registry: options.registry,
        tag: options.tag,
        access: options.access,
        otp: options.otp,
        buildCmd: options.buildCmd,
        dryRun: program.opts().dryRun,
        logLevel: program.opts().logLevel,
        configName: program.opts().config,
      })
    }
    catch {
      process.exit(1)
    }
  })

program
  .command('provider-release')
  .description('Publish release to git provider (github or gitlab)')
  .option('--from <ref>', 'Start commit reference')
  .option('--to <ref>', 'End commit reference')
  .option('--token <token>', 'Provider token')
  .option('--provider <provider>', 'Git provider (github or gitlab)')
  .action(async (options) => {
    try {
      await providerRelease({
        token: options.token,
        from: options.from,
        to: options.to,
        provider: options.provider,
        dryRun: program.opts().dryRun,
        logLevel: program.opts().logLevel,
        configName: program.opts().config,
      })
    }
    catch {
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
  .option('--build-cmd <cmd>', 'Command to build packages before publish (e.g. "pnpm build")')
  .option('--no-root-changelog', 'Skip generation of root changelog file')
  .option('--token <token>', 'Git token (github or gitlab)')
  .option('--force', 'Bump even if there are no commits')
  .option('--no-clean', 'Skip check if the working directory is clean')
  .option('--no-commit', 'Skip commit and tag')
  .option('--no-changelog', 'Skip changelog generation files')
  .option('--yes', 'Skip confirmation prompt about bumping packages')
  .action(async (options) => {
    try {
      await release({
        type: getReleaseType(options),
        preid: options.preid,
        from: options.from,
        to: options.to,
        changelog: hasCliFlag('--no-changelog') ? false : undefined,
        commit: hasCliFlag('--no-commit') ? false : undefined,
        push: hasCliFlag('--no-push') || hasCliFlag('--no-commit') ? false : undefined,
        publish: hasCliFlag('--no-publish') ? false : undefined,
        release: hasCliFlag('--no-release') ? false : undefined,
        noVerify: hasCliFlag('--no-verify') ? true : undefined,
        clean: hasCliFlag('--no-clean') ? false : undefined,
        registry: options.registry,
        tag: options.tag,
        access: options.access,
        otp: options.otp,
        dryRun: program.opts().dryRun,
        formatCmd: options.formatCmd,
        buildCmd: options.buildCmd,
        rootChangelog: hasCliFlag('--no-root-changelog') ? false : undefined,
        token: options.token,
        logLevel: program.opts().logLevel,
        force: options.force,
        yes: options.yes,
        configName: program.opts().config,
      })
    }
    catch {
      process.exit(1)
    }
  })

program.parse()
