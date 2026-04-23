#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import process from 'node:process'
import { glob } from 'glob'
import { transformFile } from './transform'

interface CliOptions {
  command: 'tailwind-v4' | null
  dryRun: boolean
  addReference: string | null
  roots: string[]
}

function parseArgs(argv: string[]): CliOptions {
  const roots: string[] = []
  let dryRun = false
  let addReference: string | null = null
  let command: CliOptions['command'] = null

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run' || arg === '-n') dryRun = true
    else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
    else if (arg === '--version' || arg === '-v') {
      printVersion()
      process.exit(0)
    }
    else if (arg.startsWith('--add-reference=')) addReference = arg.slice('--add-reference='.length)
    else if (arg === '--add-reference') addReference = argv[++i]
    else if (arg === 'tailwind-v4') command = 'tailwind-v4'
    else if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`)
      process.exit(1)
    }
    else roots.push(arg)
  }

  if (command === null) {
    console.error('Missing command. Available: tailwind-v4')
    printHelp()
    process.exit(1)
  }

  if (roots.length === 0) {
    console.error('At least one path is required.')
    printHelp()
    process.exit(1)
  }

  return { command, dryRun, addReference, roots }
}

function printHelp(): void {
  console.log(`@maz-ui/codemod — automated source rewrites for the maz-ui Tailwind v4 migration

Usage:
  npx @maz-ui/codemod tailwind-v4 [options] <path...>

Commands:
  tailwind-v4       Rewrite a project's templates and styles from maz-ui v4
                    (Tailwind v3) to maz-ui v5 (Tailwind v4). Scans the given
                    paths for .vue, .ts/.tsx/.mts/.cts, and .css files.

Options:
  -n, --dry-run             Print what would change without writing any file.
  --add-reference=<css>     Inject \`@reference "<relative-css>";\` at the top
                            of every <style> block that doesn't already have
                            one. The argument is a path to your Tailwind entry
                            (e.g. --add-reference=src/tailwind.css).
  -h, --help                Show this help.
  -v, --version             Print the codemod version.

What \`tailwind-v4\` rewrites:
  - prefix:             maz-flex             → maz:flex
  - variants:           dark:maz-border      → maz:dark:border
  - important:          !maz-m-0             → maz:m-0!
  - negatives:          -maz-mt-4            → maz:-mt-4
  - utility renames:    rounded-sm → rounded-xs, shadow → shadow-sm,
                        shadow-sm → shadow-xs, blur → blur-sm, ring → ring-3,
                        outline-none → outline-hidden, bg-gradient-to-* →
                        bg-linear-to-*, and the matching backdrop / drop-shadow
                        lines.
  - @apply important:   @apply X !important  → @apply X!
  - hsl() double-wrap:  hsl(var(--maz-X))    → var(--maz-X)
                        hsl(var(--maz-X)/0.5) → color-mix(in srgb, var(--maz-X) 0.5, transparent)
  - arbitrary values:   bg-[var(--maz-X)]    → bg-(--maz-X)

See https://maz-ui.com/guide/migration-v5 for the full guide.
`)
}

function printVersion(): void {
  const pkg = JSON.parse(
    readFileSync(resolve(dirname(new URL(import.meta.url).pathname), '..', 'package.json'), 'utf8'),
  )
  console.log(pkg.version)
}

const STYLE_BLOCK = /(<style\b[^>]*>)(\n?)/g

function injectReference(filePath: string, content: string, entry: string): string {
  if (content.includes('@reference')) return content

  const rel = relative(dirname(filePath), entry).replace(/\\/g, '/')
  return content.replace(STYLE_BLOCK, (_match, open) => `${open}\n@reference "${rel}";\n`)
}

async function run(): Promise<void> {
  const opts = parseArgs(process.argv)
  const cwd = process.cwd()

  let scanned = 0
  let changed = 0

  const addReferenceAbs = opts.addReference ? resolve(cwd, opts.addReference) : null

  for (const root of opts.roots) {
    const absoluteRoot = resolve(cwd, root)
    const files = await glob(
      ['**/*.vue', '**/*.css', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
      {
        cwd: absoluteRoot,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/.nuxt/**', '**/.output/**'],
      },
    )

    for (const file of files) {
      scanned += 1
      const before = readFileSync(file, 'utf8')
      let after = transformFile(file, before)

      if (addReferenceAbs && file.endsWith('.vue')) {
        after = injectReference(file, after, addReferenceAbs)
      }

      if (after === before) continue
      changed += 1

      const shown = file.replace(`${cwd}/`, '')
      console.log(`${opts.dryRun ? '[dry-run] would update' : 'updated'}: ${shown}`)

      if (!opts.dryRun) {
        writeFileSync(file, after, 'utf8')
      }
    }
  }

  const prefix = opts.dryRun ? 'would update' : 'updated'
  console.log(`\nScanned ${scanned} files, ${prefix} ${changed}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
