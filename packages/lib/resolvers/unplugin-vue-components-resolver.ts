import { type ComponentResolver } from 'unplugin-vue-components'
import { pascalCase } from '../utils'

/**
 * Resolver for Maz-UI
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function UnpluginVueComponentsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^(Maz[A-Z])/.test(name)) return { from: `maz-ui/components/${name}` }
      else if (/^(maz-[a-z])/.test(name)) return { from: `maz-ui/components/${pascalCase(name)}` }
    },
  }
}
