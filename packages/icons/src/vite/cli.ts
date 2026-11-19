import type { Plugin } from 'vite'
import type { MazUiIconsApi } from './plugin.ts'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

export const HELP = `maz-ui-icons: the icons of @maz-ui/icons by name

Usage:
  maz-ui-icons types [options]   Write the types of the icon names, without a build (before vue-tsc)

Options:
  --config <file>   The Vite config (default: vite.config.* of the root)
  --mode <mode>     The mode of the config (default: production)
  --root <dir>      The root of the project (default: the current folder)
  --help            Show this help

With Nuxt, \`nuxi prepare\` and \`nuxi typecheck\` write them.`

interface CliLogger {
  log: (message: string) => void
  error: (message: string) => void
}

type ExportTarget = string | { import?: ExportTarget, default?: ExportTarget }

function getImportTarget(target: ExportTarget | undefined): string | undefined {
  return typeof target === 'string' || target === undefined
    ? target
    : getImportTarget(target.import ?? target.default)
}

/** The Vite of the project: `npx @maz-ui/icons` runs from a folder without it, `vite` is an optional peer */
function resolveVite(root: string): string {
  try {
    const packageFile = createRequire(join(root, 'package.json')).resolve('vite/package.json')
    const { exports } = JSON.parse(readFileSync(packageFile, 'utf8')) as { exports: Record<string, ExportTarget> }
    return pathToFileURL(join(dirname(packageFile), getImportTarget(exports['.']) as string)).href
  }
  catch {
    return 'vite'
  }
}

/** Resolves the Vite config, without a build: `MazUiIcons()` writes its types once the config is resolved */
async function writeTypes(root: string, configFile: string | undefined, mode: string | undefined): Promise<string> {
  const { resolveConfig } = await import(resolveVite(root)) as typeof import('vite')
  const config = await resolveConfig({
    root,
    configFile,
    mode,
    logLevel: 'warn',
  }, 'build')
  const plugin = config.plugins.find((entry): entry is Plugin<MazUiIconsApi> => entry.name === 'maz-ui:icons')

  if (!plugin)
    throw new Error('MazUiIcons() is not in the Vite config: add it, or MazUi() of @maz-ui/vite-plugin')

  if (!plugin.api?.dts)
    throw new Error('MazUiIcons() does not write the types: remove `dts: false`')

  return plugin.api.dts
}

/** `maz-ui-icons <command>`: the exit code */
export async function runCli(argv: string[], logger: CliLogger = console): Promise<number> {
  try {
    const { positionals, values } = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        config: { type: 'string' },
        mode: { type: 'string' },
        root: { type: 'string' },
        help: { type: 'boolean' },
      },
    })
    const [command] = positionals

    if (values.help || !command) {
      logger.log(HELP)
      return values.help ? 0 : 1
    }

    if (command !== 'types')
      throw new Error(`Unknown command "${command}"\n\n${HELP}`)

    const root = resolve(values.root ?? process.cwd())
    const dts = await writeTypes(root, values.config && resolve(root, values.config), values.mode)
    logger.log(`[maz-ui:icons] Types written in ${relative(root, dts)}`)
    return 0
  }
  catch (error) {
    logger.error(`[maz-ui:icons] ${(error as Error).message}`)
    return 1
  }
}
