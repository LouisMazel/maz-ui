#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { glob } from 'glob'
import { transformCssFile, transformText, transformVueFile } from './transform'

interface CliOptions {
  dryRun: boolean
  roots: string[]
}

function parseArgs(argv: string[]): CliOptions {
  const roots: string[] = []
  let dryRun = false
  for (const arg of argv.slice(2)) {
    if (arg === '--dry-run' || arg === '-n') dryRun = true
    else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
    else if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`)
      process.exit(1)
    }
    else roots.push(arg)
  }
  if (roots.length === 0) {
    roots.push('packages/lib/src')
  }
  return { dryRun, roots }
}

function printHelp(): void {
  console.log(`Usage: tsx tools/migrate-tw-prefix/cli.ts [options] [root...]

Rewrite Tailwind v3 \`maz-\` prefixed classes to v4 \`maz:\` syntax, rename
v3 utilities that were renamed in v4, and move the important modifier
to the v4 suffix form.

Arguments:
  root         One or more source roots to walk (default: packages/lib/src).

Options:
  -n, --dry-run   Preview the changes without writing files.
  -h, --help      Print this help and exit.

File types processed:
  *.vue          Template and style blocks only (script blocks untouched).
  *.css          Whole file.
`)
}

function processFile(filePath: string, dryRun: boolean): boolean {
  const original = readFileSync(filePath, 'utf8')

  let transformed: string
  if (filePath.endsWith('.vue')) {
    transformed = transformVueFile(original)
  }
  else if (filePath.endsWith('.css')) {
    transformed = transformCssFile(original)
  }
  else {
    transformed = transformText(original)
  }

  if (transformed === original) return false

  if (!dryRun) writeFileSync(filePath, transformed, 'utf8')
  return true
}

function globExtensions(): string[] {
  return ['**/*.vue', '**/*.css', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']
}

async function run(): Promise<void> {
  const { dryRun, roots } = parseArgs(process.argv)
  const repoRoot = process.cwd()

  let changed = 0
  let scanned = 0

  for (const root of roots) {
    const absoluteRoot = resolve(repoRoot, root)
    const files = await glob(globExtensions(), {
      cwd: absoluteRoot,
      absolute: true,
      ignore: ['**/node_modules/**', '**/dist/**'],
    })

    for (const file of files) {
      scanned += 1
      const didChange = processFile(file, dryRun)
      if (didChange) {
        changed += 1
        console.log(`${dryRun ? '[dry-run] would update' : 'updated'}: ${file.replace(`${repoRoot}/`, '')}`)
      }
    }
  }

  console.log(`\nScanned ${scanned} files, ${changed} ${dryRun ? 'would be' : ''} updated${dryRun ? '' : '.'}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
