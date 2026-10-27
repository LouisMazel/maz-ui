import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Version of @maz-ui/mcp read at runtime: the release bumps the version
 * after the build, so a version inlined at build time would be outdated.
 */
export function readOwnVersion(from: string = dirname(fileURLToPath(import.meta.url))): string {
  let directory = from

  for (;;) {
    const file = join(directory, 'package.json')

    if (existsSync(file)) {
      const { name, version } = JSON.parse(readFileSync(file, 'utf8')) as { name?: string, version?: string }

      if (name === '@maz-ui/mcp' && version)
        return version
    }

    const parent = dirname(directory)

    if (parent === directory)
      return '0.0.0'

    directory = parent
  }
}
