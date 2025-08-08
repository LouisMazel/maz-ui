import type { ComponentResolver } from 'unplugin-vue-components/types'
import type { IconName } from './icon-list.js'
import { iconsList } from './icon-list.js'

/**
 * Resolver for @maz-ui/icons
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazIconsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const base = '@maz-ui/icons'
      if (iconsList.includes(name as IconName)) {
        return {
          name,
          from: base,
        }
      }

      return null
    },
  }
}
