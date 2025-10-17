# @maz-ui/changelogen-monorepo

Changelogen adapter for monorepo management with unified and independent versioning support.

## Features

- 🚀 Built on top of [changelogen](https://github.com/unjs/changelogen)
- 📦 Monorepo support with glob pattern matching
- 🔄 Unified, independent, or selective versioning (like Lerna)
- 📝 Generate changelogs per package + root aggregate
- 🏷️ Pre-release support (alpha, beta, rc)
- 📢 NPM publish with smart tag detection and dependency ordering
- 🐙 GitHub & GitLab release automation
- 🔍 Auto-detect Git provider (GitHub/GitLab)
- 🎯 Commit filtering by scope and path
- 🔐 2FA/OTP support for npm publishing
- 🎛️ Custom registry support (private registries, GitHub Packages, etc.)
- ⚙️ Optional Lerna integration (updates `lerna.json` if present)

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

# Generate from specific commit
clm changelog --from v1.0.0

# Dry run (preview without writing files)
clm changelog --dry-run
```

### Publish to npm

```bash
# Publish packages to npm registry
clm publish

# With custom registry
clm publish --registry https://npm.pkg.github.com

# With custom tag
clm publish --tag next

# For scoped packages (public access)
clm publish --access public

# With 2FA/OTP
clm publish --otp 123456

# Dry run (preview without publishing)
clm publish --dry-run
```

**Smart tag detection:**

- Stable versions (e.g., `1.2.3`) → published with tag `latest`
- Prerelease versions (e.g., `1.2.3-beta.0`) → published with tag `next`
- Use `--tag` to override automatic detection

**Selective mode:**
In selective mode, only packages that were bumped (have different version than root) will be published. This prevents unnecessary republishing of unchanged packages.

**Dependency order:**
Packages are published in dependency graph order, ensuring dependencies are available before dependents are published.

### Full release workflow

```bash
# Complete release: bump + changelog + commit + tag + publish to npm + publish release
clm release --prerelease --preid beta

# With push to remote
clm release --prerelease --preid beta --push

# Skip Git release publication (GitHub/GitLab)
clm release --no-release

# Skip npm publish
clm release --no-publish

# With npm options
clm release --registry https://npm.pkg.github.com --access public --otp 123456

# Dry run (preview changes)
clm release --dry-run
```

### Publish releases

The provider (GitHub or GitLab) is automatically detected from your git remote URL. You can also manually specify it in the configuration.

#### GitHub

```bash
# Publish latest tag to GitHub
clm github

# Publish specific versions
clm github v1.0.0 v1.0.1

# Publish all versions
clm github --all

# With custom token
clm github --token YOUR_GITHUB_TOKEN
```

**Required environment variables:**

- `GITHUB_TOKEN` or `GH_TOKEN` (for GitHub authentication)

#### GitLab

```bash
# Publish latest tag to GitLab
clm gitlab

# Publish specific versions
clm gitlab v1.0.0 v1.0.1

# Publish all versions
clm gitlab --all

# With custom token
clm gitlab --token YOUR_GITLAB_TOKEN
```

**Required environment variables:**

- `GITLAB_TOKEN` or `CI_JOB_TOKEN` (for GitLab authentication)

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

  // Git provider (optional, auto-detected if not specified)
  provider: 'github', // or 'gitlab'

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

### Configuration Options

#### `provider`

- **Type:** `'github' | 'gitlab'`
- **Default:** Auto-detected from git remote URL
- **Description:** Specifies which Git provider to use for release publication. When not specified, the tool automatically detects the provider by parsing the git remote URL:
  - URLs containing `github.com` → GitHub
  - URLs containing `gitlab.com` or `gitlab` → GitLab
- **Example:**

  ```typescript
  export default defineConfig({
    provider: 'gitlab', // Force GitLab even if auto-detection would choose GitHub
  })
  ```

### Monorepo Configuration Options

#### `versionMode`

- **Type:** `'unified' | 'independent' | 'selective'`
- **Default:** `'selective'` ⭐ (recommended)
- **Description:** Determines how package versions are managed

  **Version Modes:**
  - **`'selective'`** (default, recommended) - Smart unified versioning
    - 🎯 **Version**: Unified (all bumped packages get the same version from root)
    - 🔍 **Scope**: Only packages with commits are bumped
    - 📦 **Root & Lerna**: Always updated to the new version
    - 💡 **Best for**: Most monorepos (like Lerna's fixed mode with intelligence)
    - **Example**: If you have 10 packages but only 3 have changes, only those 3 are bumped to the new unified version

  - **`'unified'`** - Force all packages to same version
    - 🎯 **Version**: Unified (all packages get the same version)
    - 🔍 **Scope**: ALL packages are bumped, even without commits
    - 📦 **Root & Lerna**: Always updated
    - 💡 **Best for**: When you always want to keep all packages in sync
    - **Example**: All 10 packages are bumped to the new version, regardless of changes

  - **`'independent'`** - Each package has its own version
    - 🎯 **Version**: Independent (each package determines its own semver bump)
    - 🔍 **Scope**: Only packages with commits are bumped
    - 📦 **Root & Lerna**: Root stays unchanged, lerna.json not updated
    - 💡 **Best for**: Collections of unrelated tools/utilities
    - **Example**: package-a bumps to 2.1.0 (feat), package-b bumps to 1.0.1 (fix), package-c stays at 1.5.0

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

**Selective versioning (default, recommended for most projects):**

```typescript
export default defineConfig({
  monorepo: {
    versionMode: 'selective', // ← Default, can be omitted
    packages: ['packages/*'],
    filterCommits: true,
    rootChangelog: true,
  },
})
```

**Behavior example:**

```
Commits:
- feat(ui): add button component → ui has commits
- fix(utils): fix date parser → utils has commits
- (no commits for icons package)

Result with selective mode:
✅ @myorg/ui: 1.0.0 → 1.1.0 (feat = minor bump)
✅ @myorg/utils: 1.0.0 → 1.1.0 (same unified version)
❌ @myorg/icons: 1.0.0 → 1.0.0 (no commits, no bump)
✅ root: 1.0.0 → 1.1.0
✅ lerna.json: 1.1.0
```

**Unified versioning (force all packages to same version):**

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

**Independent versioning (each package has its own version):**

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

## Lerna Integration

This tool can work alongside or replace Lerna for versioning and changelog generation.

### Automatic `lerna.json` Updates

If a `lerna.json` file is present in your repository root, the tool will automatically update its `version` field during the bump process (in unified mode). This ensures compatibility with projects that use Lerna for other purposes (like hoisting dependencies or running scripts).

**No `lerna.json`?** No problem! The tool works perfectly fine without it. The version update is conditional and only happens if the file exists.

### Replacing Lerna Commands

You can replace Lerna versioning commands with `changelogen-monorepo`:

| Lerna Command                           | changelogen-monorepo Equivalent         |
| --------------------------------------- | --------------------------------------- |
| `lerna version patch`                   | `clm release --patch`                   |
| `lerna version minor`                   | `clm release --minor`                   |
| `lerna version major`                   | `clm release --major`                   |
| `lerna version prerelease --preid beta` | `clm release --prerelease --preid beta` |
| `lerna publish from-package`            | Not needed (use `pnpm publish -r`)      |

### Migration from Lerna

1. Keep your existing `lerna.json` (optional)
2. Create a `changelogen.config.ts` with your versioning strategy
3. Replace `lerna version` commands with `clm release`
4. Use your package manager for publishing (e.g., `pnpm publish -r`)

## GitLab Configuration

For GitLab repositories, you need to set up authentication:

### Personal Access Token

1. Go to GitLab → Settings → Access Tokens
2. Create a token with `api` scope
3. Set the environment variable:

```bash
export GITLAB_TOKEN="your-token-here"
```

### CI/CD Pipeline

GitLab CI automatically provides `CI_JOB_TOKEN` which can be used for releases:

```yaml
release:
  stage: deploy
  script:
    - pnpm install
    - pnpm clm release --push
  only:
    - main
```

### Self-hosted GitLab

For self-hosted GitLab instances, configure the domain in your changelogen config:

```typescript
export default defineConfig({
  repo: {
    domain: 'gitlab.mycompany.com',
    provider: 'gitlab',
  },
  provider: 'gitlab',
})
```

## API Usage

You can also use the tool programmatically:

```typescript
import {
  bumpCommand,
  changelogCommand,
  detectGitProvider,
  githubCommand,
  gitlabCommand,
  releaseCommand,
} from '@maz-ui/changelogen-monorepo'

// Auto-detect provider - 'github' or 'gitlab'
const provider = detectGitProvider()

// Run bump
await bumpCommand({ type: 'patch' })

// Run changelog
await changelogCommand({ releaseType: 'latest' })

// Run full release
await releaseCommand({
  type: 'minor',
  push: true,
  release: true,
})

// Publish to GitHub
await githubCommand()

// Publish to GitLab
await gitlabCommand()
```

## License

MIT
