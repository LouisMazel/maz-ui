import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * Resolver for Maz-UI (directives)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazDirectivesResolver(): ComponentResolver {
  return {
    type: 'directive',
    resolve: (name: string) => {
      return { from: `maz-ui/directives`, as: `v${name}`, name: `v${name}` }
    },
  }
}
