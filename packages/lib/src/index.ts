// Root entry (`maz-ui`) — type-only public surface.
//
// Components, composables, directives and plugins keep their own subpath
// entries (`maz-ui/components`, `maz-ui/composables`, …) so tree-shaking stays
// optimal: the root intentionally ships NO runtime component barrel. It only
// re-exports the transverse public types (design-system scales and plugin
// config), which are erased at build time and cost nothing at runtime.

export type { MazColor, MazRoundedSize, MazSize, MazSizeUnit } from './components/types'
export type { GlobalizableProps, MazComponentName, MazUiDefaultsOptions } from './composables/useGlobalConfig'
export type { MazUiOptions } from './plugins/maz-ui'
