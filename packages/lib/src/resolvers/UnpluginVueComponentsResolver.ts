/* eslint-disable regexp/no-unused-capturing-group */

import type { ComponentResolver } from 'unplugin-vue-components/types'
import { pascalCase } from '../formatters/pascalCase'

/**
 * Resolver for Maz-UI (components)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function UnpluginVueComponentsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^(Maz[A-Z])/.test(name))
        return { from: `maz-ui/components/${name}` }
      else if (/^(maz-[a-z])/.test(name))
        return { from: `maz-ui/components/${pascalCase(name)}` }
    },
  }
}
