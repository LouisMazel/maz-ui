// @ts-check

/**
 * Packages left out of the bundle: the consumers install them (`dependencies`, `peerDependencies`), so they get a
 * single copy, deduplicated and tree-shaken by their bundler. The `devDependencies` are external too, so that a package
 * imported by mistake is never bundled: `.github/scripts/check-dist-imports.mjs` fails when a `dist` imports a package
 * that is not declared in `dependencies` or `peerDependencies`.
 * @param {{
 *   devDependencies?: Record<string, string>;
 *   peerDependencies?: Record<string, string>;
 *   dependencies?: Record<string, string>;
 * }} pkg
 * @param {{
 *   peerDependencies?: boolean;
 *   devDependencies?: boolean;
 *   dependencies?: boolean;
 *   included?: string[];
 *   excluded?: string[];
 * }} options
 * @returns {(id: string) => boolean} External function of vite config
 */
export function getExternalDependencies(pkg, options = {}) {
  const finalOptions = {
    peerDependencies: true,
    devDependencies: true,
    dependencies: true,
    included: [],
    excluded: [],
    ...options,
  }

  const externals = [
    ...Object.keys({
      ...(finalOptions.devDependencies
        ? pkg.devDependencies ?? {}
        : {}),
      ...(finalOptions.peerDependencies
        ? pkg.peerDependencies ?? {}
        : {}),
      ...(finalOptions.dependencies
        ? pkg.dependencies ?? {}
        : {}),
    }),
    ...finalOptions.excluded,
  ].filter(ext => !finalOptions.included.includes(ext))

  // Match exact package name or any sub-import (e.g., @maz-ui/themes/presets/*)
  return id => !finalOptions.included.includes(id) && externals.some(ext => id === ext || id.startsWith(`${ext}/`))
}
