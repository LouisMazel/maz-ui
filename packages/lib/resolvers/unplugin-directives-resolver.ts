import { type ComponentResolver } from 'unplugin-vue-components'

/**
 * Resolver for Maz-UI (directives)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function UnpluginDirectivesResolver(): ComponentResolver {
  return {
    type: 'directive',
    resolve: (name: string) => {
      return { from: `maz-ui`, as: `v${name}`, name: `v${name}` }
    },
  }
}
