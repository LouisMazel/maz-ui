import type { ResolverFunction } from 'unplugin-auto-import/types'
import { createRequire } from 'node:module'
import { capitalize } from '@maz-ui/utils/helpers/capitalize'

interface ExportNames {
  modules: Set<string>
  composables: Set<string>
}

let exportNames: ExportNames | undefined

/** The helpers of `@maz-ui/utils` and the composables of maz-ui, written by their builds (`exports.json`) */
function getExportNames(): ExportNames {
  if (!exportNames) {
    const require = createRequire(import.meta.url)

    exportNames = {
      modules: new Set((require('@maz-ui/utils/exports.json') as { helpers: string[] }).helpers),
      composables: new Set((require('maz-ui/exports.json') as { composables: string[] }).composables),
    }
  }

  return exportNames
}

/**
 * Resolver for Maz-UI (modules)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */

const useRegex = /^use/

export function MazModulesResolver(options?: { prefix?: string }): ResolverFunction {
  return (name) => {
    const { prefix = '' } = options || {}
    const { modules, composables } = getExportNames()

    if (modules.has(name)) {
      return {
        from: '@maz-ui/utils',
        name,
        as: `${prefix.toLowerCase()}${capitalize(name)}`,
      }
    }

    if (composables.has(name)) {
      return {
        from: 'maz-ui/composables',
        name,
        as: `use${capitalize(prefix)}${name.replace(useRegex, '')}`,
      }
    }

    return undefined
  }
}
