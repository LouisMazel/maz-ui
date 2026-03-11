/* eslint-disable regexp/no-unused-capturing-group */

import type { IconName } from '@maz-ui/icons/icon-list'
import type { ComponentResolver } from 'unplugin-vue-components/types'
import { iconList } from '@maz-ui/icons/icon-list'
import { pascalCase } from '@maz-ui/utils/helpers/pascalCase'

const mazRegexPascalCase = /^(Maz[A-Z])/
const mazRegexKebabCase = /^(maz-[a-z])/

/**
 * Resolver for Maz-UI (components)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazComponentsResolver(options?: { devMode?: boolean }): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { devMode = false } = options || {}
      const base = devMode ? 'maz-ui/src/components' : 'maz-ui/components'
      const extension = devMode ? '.vue' : ''

      if (mazRegexPascalCase.test(name) && !iconList.includes(name as IconName)) {
        return { from: `${base}/${name}${extension}` }
      }
      else if (mazRegexKebabCase.test(name)) {
        return { from: `${base}/${pascalCase(name)}` }
      }
    },
  }
}
