import type { Plugin } from 'vite'

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

interface Options {
  /**
   * Exclude peerDependencies
   * @default true
   */
  peerDependencies?: boolean
  /**
   * Exclude devDependencies
   * @default true
   */
  devDependencies?: boolean
  /**
   * Exclude dependencies
   * @default true
   */
  dependencies?: boolean
  /**
   * Manually include a dependency from the final bundle
   * @default []
   */
  included?: string[]
  /**
   * Manually exclude a dependency from the final bundle
   * @default []
   */
  excluded?: string[]
}

export function getExternalDependencies(pkg: PackageJson, options?: Options): (id: string) => boolean
export function VitePreNestedCss(): Plugin
/** Writes `exports.json` (or `fileName`): for each key, the names of the values exported by an entry of the build (`include` keeps only the names it matches) */
export function ViteExportNames(entries: Record<string, string | { entry: string, include: RegExp }>, options?: { fileName?: string }): Plugin

/** Writes explicit `.js` extensions on the relative specifiers of the emitted declarations, as `node16` and `nodenext` require for a package with `"type": "module"` */
export function appendDeclarationExtensions(files: Map<string, string>): void
