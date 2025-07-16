import type { ComponentResolverObject } from 'unplugin-vue-components/types'
import { capitalize } from '@maz-ui/utils/src/formatters/capitalize.js'

/**
 * Resolver for Maz-UI (directives)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazDirectivesResolver(options?: { devMode?: boolean, prefix?: string }) {
  return {
    type: 'directive',
    resolve: (name: string) => {
      const { devMode = false, prefix = '' } = options || {}
      const base = devMode ? 'maz-ui/src/directives/index.ts' : 'maz-ui/directives'

      return { from: base, as: `v${capitalize(prefix)}${name.replace(/^v/, '')}`, name: `v${name}` }
    },
  } satisfies ComponentResolverObject
}
