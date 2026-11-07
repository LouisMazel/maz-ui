import type { ComponentResolver } from 'unplugin-vue-components/types'
import { capitalize } from '@maz-ui/utils/helpers/capitalize'

const vRegex = /^v/
/**
 * Resolver for Maz-UI (directives)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazDirectivesResolver(options?: { prefix?: string }): ComponentResolver {
  return {
    type: 'directive',
    resolve: (name: string) => {
      const { prefix = '' } = options || {}
      return { from: 'maz-ui/directives', as: `v${capitalize(prefix)}${capitalize(name.replace(vRegex, ''))}`, name: `v${name}` }
    },
  }
}
