/**
 * Icons registered by name, read by `<MazIcon icon="name" />`. On `globalThis`: a module would be duplicated (dev
 * SSR, pre-bundling, pnpm peers) and its icons lost without warning. The key is shared with the code `MazUi()`
 * (`@maz-ui/vite-plugin`) injects, which registers the icons each file of the app uses.
 */
const REGISTRY_KEY = Symbol.for('maz-ui.icons.v1')

type IconRegistry = Map<string, string>

function getRegistry(): IconRegistry {
  const scope = globalThis as unknown as Record<symbol, IconRegistry | undefined>
  scope[REGISTRY_KEY] ??= new Map()
  return scope[REGISTRY_KEY]
}

/** Registers an icon (an SVG string) under a name, for the icons `MazUi()` cannot find (names from an API...) */
export function registerIcon(name: string, svg: string): void {
  getRegistry().set(name, svg)
}

export function registerIcons(icons: Record<string, string>): void {
  for (const [name, svg] of Object.entries(icons)) {
    registerIcon(name, svg)
  }
}

export function getRegisteredIcon(name: string): string | undefined {
  return getRegistry().get(name)
}
