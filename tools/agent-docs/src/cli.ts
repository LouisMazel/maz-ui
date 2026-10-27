import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { logger } from '@maz-ui/node'
import { generateKnowledge } from './generate'
import { findOutdatedFiles, writeOutput } from './write'

const HELP = `Usage: tsx src/cli.ts [options]

Builds the maz-ui agent knowledge bundle.

Options:
  --out <dir>    Write the bundle (markdown docs, references, rules, manifest.json)
  --site <dir>   Write the bundle plus llms.txt and llms-full.txt (maz-ui.com)
  --skill <dir>  Write the Claude Code plugin skill
  --vitepress <dir>  Write the API tables of the component pages (apps/docs/.vitepress/generated-docs)
  --check        With --skill: fail when the committed files are outdated instead of writing them
  --strict       Fail on generation warnings
  --help         Show this help
`

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      out: { type: 'string', multiple: true },
      site: { type: 'string' },
      skill: { type: 'string' },
      vitepress: { type: 'string' },
      check: { type: 'boolean', default: false },
      strict: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  })

  if (values.help || (!values.out && !values.site && !values.skill && !values.vitepress)) {
    console.log(HELP)
    return
  }

  const startedAt = Date.now()
  const knowledge = await generateKnowledge()

  for (const warning of knowledge.warnings) {
    logger.warn(`[agent-docs] ${warning}`)
  }

  if (values.strict && knowledge.warnings.length > 0) {
    throw new Error(`${knowledge.warnings.length} warning(s) with --strict`)
  }

  for (const directory of values.out ?? []) {
    writeOutput(resolve(directory), knowledge.bundle, { clean: true })
    logger.success(`[agent-docs] bundle written to ${directory} (${knowledge.bundle.length} files)`)
  }

  if (values.site) {
    writeOutput(resolve(values.site), [...knowledge.bundle, ...knowledge.site], { clean: true })
    logger.success(`[agent-docs] site files written to ${values.site}`)
  }

  if (values.vitepress) {
    writeOutput(resolve(values.vitepress), knowledge.vitepress, { clean: true })
    logger.success(`[agent-docs] component API tables written to ${values.vitepress}`)
  }

  if (values.skill) {
    const outdated = findOutdatedFiles(resolve(values.skill), knowledge.skill)

    if (values.check) {
      if (outdated.length > 0) {
        throw new Error(`Outdated plugin files in ${values.skill}: ${outdated.join(', ')}. Run \`pnpm -F agent-docs generate:plugin\`.`)
      }
      logger.success('[agent-docs] plugin skill is up to date')
    }
    else {
      writeOutput(resolve(values.skill), knowledge.skill)
      logger.success(`[agent-docs] plugin skill written to ${values.skill}`)
    }
  }

  logger.info(`[agent-docs] maz-ui ${knowledge.manifest.version}: ${knowledge.manifest.docs.length} docs, ${knowledge.manifest.components.length} components, ${knowledge.manifest.icons.names.length} icons (${Date.now() - startedAt}ms)`)
}

main().catch((error: unknown) => {
  logger.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
