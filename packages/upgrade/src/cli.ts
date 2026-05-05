#!/usr/bin/env node
import type { TransformGroup } from './transform'
import { readFileSync, writeFileSync } from 'node:fs'
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

interface CliOptions {
  dryRun: boolean
  groups: readonly TransformGroup[]
  roots: string[]
  gitignore: boolean
}

function parseArgs(argv: string[]): CliOptions {
  const roots: string[] = []
  let dryRun = false
  let gitignore = true
  let groups: readonly TransformGroup[] = ALL_GROUPS

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run' || arg === '-n') {
      dryRun = true
    }
    else if (arg === '--no-gitignore') {
      gitignore = false
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

  return { dryRun, groups, roots, gitignore }
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

Scans the given paths for .vue, .css, .ts/.tsx/.cts/.mts and
.js/.jsx/.cjs/.mjs files. By default it respects your .gitignore
(plus a built-in safe list of node_modules, dist, build, .nuxt,
.output, .next, .svelte-kit, .turbo, .cache, coverage, .vercel,
.netlify). Pass --no-gitignore to skip the .gitignore step.

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

async function run(): Promise<void> {
  const opts = parseArgs(process.argv)
  const cwd = process.cwd()

  let scanned = 0
  let changed = 0

  for (const root of opts.roots) {
    const absoluteRoot = resolve(cwd, root)
    const files = await globby(
      [
        '**/*.vue',
        '**/*.css',
        '**/*.{js,mjs,cjs,jsx}',
        '**/*.{ts,mts,cts,tsx}',
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
  logger.log(`\nNext: see https://maz-ui.com/guide/migration-v5 for the manual steps`)
  logger.log(`(foundation.radius → scales.rounded.md, MazIcon API, MazBadge sizes, MazChart update-mode).`)
}

run().catch((err) => {
  logger.error(err)
  process.exit(1)
})
