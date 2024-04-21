import { type ComponentResolver } from 'unplugin-vue-components'

export function UnpluginDirectivesResolver(): ComponentResolver {
  return {
    type: 'directive',
    resolve: (name: string) => {
      return { from: `maz-ui`, as: `v${name}`, name: `v${name}` }
    },
  }
}
