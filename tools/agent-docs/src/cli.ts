import type { GeneratedFragment } from './generate'
import type { AgentDocsBundle, OutputFile } from './types'

import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { generateKnowledge } from './generate'
import { PACKAGE_DEFINITIONS } from './packages'
import { getSourcePaths } from './paths'
import { AGENT_DOCS_SCHEMA_VERSION } from './types'
import { findOutdatedFiles, writeOutput } from './write'

const logger = {
  info: (message: string): void => console.log(message),
  success: (message: string): void => console.log(message),
  warn: (message: string): void => console.warn(message),
  error: (message: string): void => console.error(message),
}

const HELP = `Usage: tsx src/cli.ts [options]

Builds the agent knowledge of the maz-ui ecosystem: one fragment per package.

Options:
  --package <name>  Write the fragment of a package in packages/<dir>/agent-docs (repeatable)
  --out <dir>       With a single --package: write the fragment in <dir> instead
  --bundle <dir>    Write the fragment of every package in <dir>/<short>/ plus <dir>/index.json (@maz-ui/mcp)
  --site <dir>      Write the flat pages plus llms.txt and llms-full.txt (maz-ui.com)
  --skill <dir>     Write the Claude Code plugin skill
  --vitepress <dir>  Write the API tables of the component pages (apps/docs/.vitepress/generated-docs)
  --check           With --skill: fail when the committed files are outdated instead of writing them
  --strict          Fail on generation warnings
  --help            Show this help
`

function packageDir(root: string, name: string): string {
  const definition = PACKAGE_DEFINITIONS.find(item => item.name === name)

  if (!definition)
    throw new Error(`Unknown package "${name}", expected one of: ${PACKAGE_DEFINITIONS.map(item => item.name).join(', ')}`)

  return resolve(root, 'packages', definition.dir, 'agent-docs')
}

function writeBundle(directory: string, fragments: GeneratedFragment[]): void {
  const shorts = new Map(PACKAGE_DEFINITIONS.map(definition => [definition.name, definition.short]))
  const bundle: AgentDocsBundle = {
    schemaVersion: AGENT_DOCS_SCHEMA_VERSION,
    name: 'maz-ui',
    fragments: fragments.map(({ fragment }) => `${shorts.get(fragment.package)}/manifest.json`),
  }

  writeOutput(directory, [
    ...fragments.flatMap(({ fragment, files }) => files.map(file => ({
      path: join(shorts.get(fragment.package) as string, file.path),
      content: file.content,
    }))),
    { path: 'index.json', content: `${JSON.stringify(bundle)}\n` },
  ], { clean: true })
}

function syncSkill(directory: string, files: OutputFile[], check: boolean): void {
  if (!check) {
    writeOutput(directory, files)
    logger.success(`[agent-docs] plugin skill written to ${directory}`)
    return
  }

  const outdated = findOutdatedFiles(directory, files)

  if (outdated.length > 0)
    throw new Error(`Outdated plugin files in ${directory}: ${outdated.join(', ')}. Run \`pnpm -F agent-docs generate:plugin\`.`)

  logger.success('[agent-docs] plugin skill is up to date')
}

interface FragmentTargets {
  root: string
  packages: string[] | undefined
  out: string | undefined
  bundle: string | undefined
}

function writeFragments(fragments: GeneratedFragment[], { root, packages, out, bundle }: FragmentTargets): void {
  for (const { fragment, files } of fragments) {
    if (bundle && !packages?.includes(fragment.package))
      continue

    const directory = out
      ? resolve(out)
      : packageDir(root, fragment.package)

    writeOutput(directory, files, { clean: true })
    logger.success(`[agent-docs] ${fragment.package} ${fragment.version}: ${fragment.docs.length} docs written to ${directory}`)
  }

  if (bundle) {
    writeBundle(resolve(bundle), fragments)
    logger.success(`[agent-docs] ${fragments.length} fragments written to ${bundle}`)
  }
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      package: { type: 'string', multiple: true },
      out: { type: 'string' },
      bundle: { type: 'string' },
      site: { type: 'string' },
      skill: { type: 'string' },
      vitepress: { type: 'string' },
      check: { type: 'boolean', default: false },
      strict: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  })

  if (values.help || (!values.package && !values.bundle && !values.site && !values.skill && !values.vitepress)) {
    console.log(HELP)
    return
  }

  if (values.out && values.package?.length !== 1)
    throw new Error('--out needs exactly one --package')

  const { root } = getSourcePaths()
  const startedAt = Date.now()
  const knowledge = await generateKnowledge(getSourcePaths(), {
    packages: values.bundle
      ? undefined
      : values.package ?? [],
    site: !!values.site,
    vitepress: !!values.vitepress,
  })

  for (const warning of knowledge.warnings)
    logger.warn(`[agent-docs] ${warning}`)

  if (values.strict && knowledge.warnings.length > 0)
    throw new Error(`${knowledge.warnings.length} warning(s) with --strict`)

  writeFragments(knowledge.fragments, {
    root,
    packages: values.package,
    out: values.out,
    bundle: values.bundle,
  })

  if (values.site) {
    writeOutput(resolve(values.site), knowledge.site, { clean: true })
    logger.success(`[agent-docs] site files written to ${values.site}`)
  }

  if (values.vitepress) {
    writeOutput(resolve(values.vitepress), knowledge.vitepress, { clean: true })
    logger.success(`[agent-docs] component API tables written to ${values.vitepress}`)
  }

  if (values.skill)
    syncSkill(resolve(values.skill), knowledge.skill, values.check)

  logger.info(`[agent-docs] done (${Date.now() - startedAt}ms)`)
}

main().catch((error: unknown) => {
  logger.error(error instanceof Error
    ? error.message
    : String(error))
  process.exit(1)
})
