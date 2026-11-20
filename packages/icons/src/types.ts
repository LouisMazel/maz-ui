/**
 * The names of the icons registered by `MazUiIcons()`: the types it generates add the icons of `@maz-ui/icons` and of
 * the project to it, by augmentation of `@maz-ui/icons`. Empty without the plugin.
 * A component with an icon prop is generic (`generic="_T"`): passed as a `Component` (`h()`, a route), the
 * `LooseRequired<props>` of a `DefineComponent` intersects the 870+ names with themselves, over the limit of
 * TypeScript (TS2590).
 */
export interface IconNames {}

/** A registered name: `'x-mark'`, `'app:logo'`. `'~x-mark'` in an icon prop loads it when it is displayed */
export type IconName = keyof IconNames

/** Augmented with `{ strict: true }`: an icon only accepts the known names, URLs and raw SVG, a typo is an error */
export interface IconOptions {}

export type IconSource = `/${string}` | `http://${string}` | `https://${string}` | `data:${string}` | `blob:${string}` | `<svg${string}`

/**
 * A string icon: a name (`'x-mark'`, `'app:logo'`), a URL or a raw SVG. Any string without `strict`, so the icon props of
 * a published library accept the names of the app. `string &` gives `String` to the compiler of Vue, that does not read
 * the conditional type, for the runtime check of the prop
 */
export type IconString = IconName | `~${IconName}` | (string & (IconOptions extends { strict: true } ? IconSource : Record<never, never>))
