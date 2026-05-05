#!/usr/bin/env node
import type { TransformGroup } from './transform'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { globby } from 'globby'
import { ALL_GROUPS, transformFile } from './transform'

const DEFAULT_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.nuxt/**',
  '**/.output/**',
  '**/.next/**',
  '**/.svelte-kit/**',
  '**/.turbo/**',
  '**/.cache/**',
  '**/coverage/**',
  '**/.vercel/**',
  '**/.netlify/**',
]

type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm'

interface CliOptions {
  dryRun: boolean
  groups: readonly TransformGroup[]
  roots: string[]
  gitignore: boolean
  install: boolean
}

function parseArgs(argv: string[]): CliOptions {
  const roots: string[] = []
  let dryRun = false
  let gitignore = true
  let install = true
  let groups: readonly TransformGroup[] = ALL_GROUPS

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run' || arg === '-n') {
      dryRun = true
    }
    else if (arg === '--no-gitignore') {
      gitignore = false
    }
    else if (arg === '--no-install') {
      install = false
    }
    else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
    else if (arg === '--version' || arg === '-v') {
      printVersion()
      process.exit(0)
    }
    else if (arg.startsWith('--only=')) {
      groups = parseGroups(arg.slice('--only='.length))
    }
    else if (arg === '--only') {
      groups = parseGroups(argv[++i] ?? '')
    }
    else if (arg.startsWith('-')) {
      logger.error(`Unknown option: ${arg}`)
      process.exit(1)
    }
    else {
      roots.push(arg)
    }
  }

  if (roots.length === 0) {
    logger.error('At least one path is required.')
    printHelp()
    process.exit(1)
  }

  return { dryRun, groups, roots, gitignore, install }
}

function parseGroups(value: string): readonly TransformGroup[] {
  const parts = value.split(',').map(p => p.trim()).filter(Boolean)
  for (const p of parts) {
    if (!ALL_GROUPS.includes(p as TransformGroup)) {
      logger.error(`Unknown group: ${p}. Valid: ${ALL_GROUPS.join(', ')}`)
      process.exit(1)
    }
  }
  return parts as readonly TransformGroup[]
}

function printHelp(): void {
  logger.log(`@maz-ui/upgrade — automated rewrites for migrating a project from Maz-UI v4 to v5.

Usage:
  npx @maz-ui/upgrade [options] <path...>

Options:
  -n, --dry-run        Print what would change without writing any file.
  --only=<groups>      Comma-separated list of transform groups to apply.
                       Default: ${ALL_GROUPS.join(',')}.
  --no-gitignore       Do not respect .gitignore (scan everything except the
                       built-in safe list of build / dependency directories).
  --no-install         Do not run the package manager after rewriting
                       package.json files. Default: install runs after a
                       successful rewrite.
  -h, --help           Show this help.
  -v, --version        Print the upgrade tool version.

Transform groups:
  imports   maz-ui/styles → maz-ui/style.css, maz-ui/aos-styles → maz-ui/aos.css
  props     left-icon/right-icon → start-icon/end-icon (props, slots,
            #icon-left/#icon-right, --has-*-icon classes), footer-align,
            variant, color="background", active-color, rounded-size="base"
  css       --maz-background → --maz-surface, --maz-border → --maz-divider,
            hsl(var(--maz-X)) collapse (incl. alpha → color-mix)
  config    Nuxt injectMainCss → injectCss, theme strategy 'hybrid' → 'runtime',
            removes dropped theme options (injectCriticalCSS, injectFullCSS,
            injectAllCSSOnServer), preset colors.{light,dark}.background → surface
            and .border → divider
  deps      Bumps every maz-ui / @maz-ui/* entry in package.json
            (dependencies, devDependencies, peerDependencies) to ^5.0.0.
            Workspace, link, file and url specs are left untouched.

Scans the given paths for .vue, .css, .ts/.tsx/.cts/.mts,
.js/.jsx/.cjs/.mjs and package.json files. By default it respects
your .gitignore (plus a built-in safe list of node_modules, dist,
build, .nuxt, .output, .next, .svelte-kit, .turbo, .cache, coverage,
.vercel, .netlify). Pass --no-gitignore to skip the .gitignore step.

After rewriting, if at least one package.json changed and the deps
group ran, the CLI detects your package manager (pnpm / yarn / bun /
npm — based on the lockfile in cwd) and runs <pm> install. Pass
--no-install to skip that step.

What it does NOT do (handle by hand or with the @maz-ui/mcp server):
  - Reshape foundation.radius into scales.rounded.md (move + key restructure).
  - Map MazIcon name=/path=/src= props to the new icon= API.
  - Map numeric MazBadge size to the keyword scale.
  - MazChart updateMode default change (judgment call).

Full migration guide: https://maz-ui.com/guide/migration-v5
`)
}

function printVersion(): void {
  const pkg = JSON.parse(
    readFileSync(resolve(dirname(new URL(import.meta.url).pathname), '..', 'package.json'), 'utf8'),
  )
  logger.log(pkg.version)
}

function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(resolve(cwd, 'bun.lockb')) || existsSync(resolve(cwd, 'bun.lock')))
    return 'bun'
  if (existsSync(resolve(cwd, 'pnpm-lock.yaml')))
    return 'pnpm'
  if (existsSync(resolve(cwd, 'yarn.lock')))
    return 'yarn'
  if (existsSync(resolve(cwd, 'package-lock.json')))
    return 'npm'
  return 'npm'
}

function runInstall(pm: PackageManager, cwd: string): number {
  const result = spawnSync(pm, ['install'], {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  return result.status ?? 1
}

function maybeInstallDeps(opts: CliOptions, depsChanged: boolean, cwd: string): void {
  if (!depsChanged || opts.dryRun)
    return

  const pm = detectPackageManager(cwd)

  if (!opts.install || !opts.groups.includes('deps')) {
    logger.log(`\npackage.json files updated. Run \`${pm} install\` to apply.`)
    return
  }

  logger.log(`\nDetected package manager: ${pm}. Running \`${pm} install\`…\n`)
  const code = runInstall(pm, cwd)
  if (code !== 0) {
    logger.error(`\n\`${pm} install\` exited with code ${code}.`)
    process.exit(code)
  }
}

async function run(): Promise<void> {
  const opts = parseArgs(process.argv)
  const cwd = process.cwd()

  let scanned = 0
  let changed = 0
  let depsChanged = false

  for (const root of opts.roots) {
    const absoluteRoot = resolve(cwd, root)
    const files = await globby(
      [
        '**/*.vue',
        '**/*.css',
        '**/*.{js,mjs,cjs,jsx}',
        '**/*.{ts,mts,cts,tsx}',
        '**/package.json',
      ],
      {
        cwd: absoluteRoot,
        absolute: true,
        gitignore: opts.gitignore,
        ignore: DEFAULT_IGNORES,
      },
    )

    for (const file of files) {
      scanned += 1
      const before = readFileSync(file, 'utf8')
      const after = transformFile(file, before, { groups: opts.groups })

      if (after === before)
        continue
      changed += 1

      if (file.endsWith('package.json'))
        depsChanged = true

      const shown = file.replace(`${cwd}/`, '')
      logger.log(`${opts.dryRun ? '[dry-run] would update' : 'updated'}: ${shown}`)

      if (!opts.dryRun) {
        writeFileSync(file, after, 'utf8')
      }
    }
  }

  const prefix = opts.dryRun ? 'would update' : 'updated'
  logger.log(`\nScanned ${scanned} files, ${prefix} ${changed}.`)
  logger.log(`Groups applied: ${opts.groups.join(', ')}`)

  maybeInstallDeps(opts, depsChanged, cwd)

  logger.log(`\nNext: see https://maz-ui.com/guide/migration-v5 for the manual steps`)
  logger.log(`(foundation.radius → scales.rounded.md, MazIcon API, MazBadge sizes, MazChart update-mode).`)
}

run().catch((err) => {
  logger.error(err)
  process.exit(1)
})
