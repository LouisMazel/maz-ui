interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

interface Options {
  /**
   * Exclude root peerDependencies
   * @default true
   */
  rootDevDependencies?: boolean
  /**
   * Exclude root peerDependencies
   * @default true
   */
  rootPeerDependencies?: boolean
  /**
   * Exclude root dependencies
   * @default true
   */
  rootDependencies?: boolean
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
