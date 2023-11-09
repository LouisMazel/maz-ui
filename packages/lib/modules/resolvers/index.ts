import { type ComponentResolver } from 'unplugin-vue-components'

export function MazUiUnpluginVueComponentsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^Maz[A-Z]/.test(name)) {
        return { from: `maz-ui/components/${name}` }
      }
    },
  } satisfies ComponentResolver
}
