import type { ComponentResolver } from 'unplugin-vue-components/types'
import type { IconName } from './icon-list.js'
import { iconList } from './icon-list.js'

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
      if (!iconList.includes(name as IconName)) {
        return null
      }

      const isLazy = name.startsWith('Lazy')
      const staticName = isLazy ? name.slice(4) : name

      return {
        name: isLazy ? staticName : name,
        from: isLazy ? `@maz-ui/icons/lazy/${staticName}` : `@maz-ui/icons/${name}`,
      }
    },
  }
}
