/**
 * Copies the skills and the subagent of the maz-ui plugin (`plugins/maz-ui`) into `plugin/`, published with the
 * package: the OpenCode plugin (`src/opencode.ts`) registers them. The plugin folder stays their only source.
 */
import { cpSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(new URL('../../../plugins/maz-ui/', import.meta.url))
const target = fileURLToPath(new URL('../plugin/', import.meta.url))

rmSync(target, { recursive: true, force: true })

for (const folder of ['skills', 'agents'])
  cpSync(`${source}${folder}`, `${target}${folder}`, { recursive: true })
