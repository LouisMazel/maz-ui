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

/**
 * Loaders of the icons of a `lazy` folder of `MazUiIcons()`, by name: the SVG is a chunk, downloaded when the icon is
 * displayed. On `globalThis` too, with the key of the code the plugin injects.
 */
const LOADERS_KEY = Symbol.for('maz-ui.icons.loaders.v1')

/** Loads the SVG of an icon: a module whose default export is the SVG string, or the string */
export type IconLoader = () => Promise<{ default: string } | string>

const inflight = new Map<string, Promise<string | undefined>>()

function getLoaders(): Map<string, IconLoader> {
  const scope = globalThis as unknown as Record<symbol, Map<string, IconLoader> | undefined>
  scope[LOADERS_KEY] ??= new Map()
  return scope[LOADERS_KEY]
}

/** Registers the loader of an icon: `registerIconLoader('flag-fr', () => import('./flags/fr.svg?raw'))` */
export function registerIconLoader(name: string, loader: IconLoader): void {
  getLoaders().set(name, loader)
}

export function registerIconLoaders(loaders: Record<string, IconLoader>): void {
  for (const [name, loader] of Object.entries(loaders)) {
    registerIconLoader(name, loader)
  }
}

/** Whether the icon has a loader: its SVG is not registered until it is loaded */
export function hasIconLoader(name: string): boolean {
  return getLoaders().has(name)
}

/** The SVG of an icon: registered, or loaded once by its loader then registered. `undefined` for an unknown name */
export function loadIcon(name: string): Promise<string | undefined> {
  const registered = getRegisteredIcon(name)
  if (registered !== undefined)
    return Promise.resolve(registered)

  const loader = getLoaders().get(name)
  if (!loader)
    return Promise.resolve(undefined)

  let promise = inflight.get(name)
  if (!promise) {
    promise = loader()
      .then((module) => {
        const svg = typeof module === 'string'
          ? module
          : module.default
        registerIcon(name, svg)
        return svg
      })
      .finally(() => inflight.delete(name))
    inflight.set(name, promise)
  }
  return promise
}
