# @maz-ui/changelogen-monorepo

Changelogen adapter for monorepo management with unified and independent versioning support.

## Features

- 🚀 Built on top of [changelogen](https://github.com/unjs/changelogen)
- 📦 Monorepo support with glob pattern matching
- 🔄 Unified or independent versioning (like Lerna)
- 📝 Generate changelogs per package + root aggregate
- 🏷️ Pre-release support (alpha, beta, rc)
- 🐙 GitHub release automation
- 🎯 Commit filtering by scope and path

## Installation

```bash
pnpm add -D @maz-ui/changelogen-monorepo
```

## Usage

### Bump versions

```bash
# Bump all changed packages (patch)
clm bump

# Bump with specific type
clm bump --minor
clm bump --major

# Pre-release
clm bump --prerelease --preid beta
```

### Generate changelogs

```bash
# Generate changelogs for all packages + root
clm changelog

# Generate for specific release type
clm changelog --release-type latest
clm changelog --release-type prerelease
```

### Full release workflow

```bash
# Complete release: bump + changelog + commit + tag
clm release --prerelease --preid beta

# With push
clm release --prerelease --preid beta --push

# Dry run
clm release --dry-run
```

### Publish GitHub releases

```bash
# Publish latest tag
clm github

# Publish specific versions
clm github v1.0.0 v1.0.1

# Publish all
clm github --all
```

## Configuration

Create a `changelogen.config.ts` in your project root:

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  // Standard changelogen config
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
  },
  templates: {
    commitMessage: 'chore(release): bump version to v{{newVersion}}',
  },

  // Monorepo-specific config
  monorepo: {
    versionMode: 'unified', // or 'independent'
    packages: ['packages/*'],
    ignorePackages: [],
    filterCommits: true,
    rootChangelog: true,
  },
})
```

### Monorepo Configuration Options

#### `versionMode`

- **Type:** `'unified' | 'independent'`
- **Default:** `'unified'`
- **Description:** Determines how package versions are managed
  - `'unified'`: All packages share the same version number (like Lerna's fixed mode)
  - `'independent'`: Each package has its own version number (like Lerna's independent mode)

#### `packages`

- **Type:** `string[]`
- **Default:** `['packages/*']`
- **Description:** Glob patterns to locate packages in your monorepo. Supports multiple patterns and can include specific paths or wildcards. The tool will find all publishable packages (non-private packages with a `package.json` file) matching these patterns.
- **Examples:**

  ```typescript
  export default {
    // Single directory with wildcard
    packages: ['packages/*'],

    // Multiple directories
    packages: ['packages/*', 'tools/*'],

    // Specific packages
    packages: ['packages/core', 'packages/utils', 'apps/cli'],

    // Mixed patterns
    packages: ['packages/*', 'tools/cli', 'apps/*'],
  }
  ```

#### `ignorePackages`

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Array of package names to ignore during changelog generation and version bumping. Useful for excluding internal tools or packages that shouldn't be versioned.
- **Example:** `['@myorg/internal-utils', '@myorg/scripts']`

#### `filterCommits`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** When enabled, filters commits for each package based on:
  - **Commit scope:** Only includes commits where the scope matches the package name (e.g., `feat(my-package): ...` will only appear in `my-package`'s changelog)
  - **File paths:** Only includes commits that modified files within the package directory

  When disabled, all commits appear in all package changelogs (not recommended for monorepos).

#### `rootChangelog`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** When enabled, generates a `CHANGELOG.md` at the repository root that aggregates changes from all packages. This provides an overview of all changes across the entire monorepo.

### Example Configurations

**Unified versioning (recommended for component libraries):**

```typescript
export default defineConfig({
  monorepo: {
    versionMode: 'unified',
    packages: ['packages/*'],
    filterCommits: true,
    rootChangelog: true,
  },
})
```

**Independent versioning (for separate tools):**

```typescript
export default defineConfig({
  monorepo: {
    versionMode: 'independent',
    packages: ['packages/*'],
    ignorePackages: ['@myorg/eslint-config'],
    filterCommits: true,
    rootChangelog: true,
  },
})
```

**Multiple directories (like Lerna):**

```typescript
export default defineConfig({
  monorepo: {
    versionMode: 'unified',
    packages: [
      'packages/*',
      'tools/*',
      'apps/cli',
    ],
    filterCommits: true,
    rootChangelog: true,
  },
})
```

## License

MIT
