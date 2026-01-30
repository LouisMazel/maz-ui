// @ts-check

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rootPkg = require('../../../package.json');

/**
 * @param {{
 *   devDependencies?: Record<string, string>;
 *   peerDependencies?: Record<string, string>;
 *   dependencies?: Record<string, string>;
 * }} pkg
 * @param {{
 *   rootDevDependencies?: boolean;
 *   rootPeerDependencies?: boolean;
 *   rootDependencies?: boolean;
 *   peerDependencies?: boolean;
 *   devDependencies?: boolean;
 *   dependencies?: boolean;
 *   included?: string[];
 *   excluded?: string[];
 * }} options
 * @returns {(id: string) => boolean} External function of vite config
 */
export function getExternalDependencies(pkg, options) {
  const finalOptions = {
    rootDevDependencies: true,
    rootPeerDependencies: true,
    rootDependencies: true,
    peerDependencies: true,
    devDependencies: true,
    dependencies: true,
    included: [],
    excluded: [],
    ...options,
  };
  return (id) => {
    const externals = Object.keys({
      ...(finalOptions.rootDevDependencies && 'devDependencies' in rootPkg ? rootPkg.devDependencies ?? {} : {}),
      ...(finalOptions.rootPeerDependencies && 'peerDependencies' in rootPkg ? rootPkg.peerDependencies ?? {} : {}),
      ...(finalOptions.rootDependencies && 'dependencies' in rootPkg ? rootPkg.dependencies ?? {} : {}),
      ...(finalOptions.devDependencies && 'devDependencies' in pkg ? pkg.devDependencies ?? {} : {}),
      ...(finalOptions.peerDependencies && 'peerDependencies' in pkg ? pkg.peerDependencies ?? {} : {}),
      ...(finalOptions.dependencies && 'dependencies' in pkg ? pkg.dependencies ?? {} : {}),
    });

    externals.push(...finalOptions.excluded);
    const finalExternals = externals.filter(ext => !finalOptions.included.includes(ext));

    const isExternal = finalExternals.some((ext) => {
      return (id === ext || id.startsWith(`${ext}/`)) && !finalOptions.included.includes(id);
    });

    // Match exact package name or any sub-import (e.g., @accor/ads-theme/presets/*)
    return isExternal;
  };
}
