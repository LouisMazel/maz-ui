# @maz-ui/changelogen-monorepo

Changelogen adapter for monorepo management with unified and independent versioning support.

## Features

- 🚀 Built on top of [changelogen](https://github.com/unjs/changelogen)
- 📦 Monorepo support with glob pattern matching
- 🔄 Unified, independent, or selective versioning (like Lerna)
- 📝 Generate changelogs per package + root aggregate
- 🏷️ Pre-release support (alpha, beta, rc)
- 📢 NPM publish with smart tag detection and dependency ordering
- 🔗 **Automatic dependency bumping** - packages are bumped when their workspace dependencies change
- 🐙 GitHub & GitLab release automation
- 🔍 Auto-detect Git provider (GitHub/GitLab)
- 🎯 Commit filtering by scope and path
- 🔐 2FA/OTP support for npm publishing
- 🎛️ Custom registry support (private registries, GitHub Packages, etc.)
- 🪝 Skip git hooks with `--no-verify` option
- 🎨 Optional changelog formatting with custom commands
- ⚙️ Optional Lerna integration (updates `lerna.json` if present)

## Installation

```bash
pnpm add -D @maz-ui/changelogen-monorepo
```

## Usage

### Bump versions

```bash
# Bump all changed packages
# Automatically bumps dependent packages when their dependencies change
clm bump

# Bump with specific type
clm bump --minor
clm bump --major

# Pre-release
clm bump --prerelease --preid beta

# Example: If package-b is updated, package-a (which depends on package-b)
# will also be bumped (patch in independent mode, same version in selective/unified)
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

# Skip git hooks during commit (useful for CI or to bypass pre-commit hooks)
clm release --no-verify

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

  changelog: {
    formatCmd: 'pnpm lint'
  }
})
```

### Configuration Options

#### `types`

- **Type:** `Record<string, { title: string, semver: 'major' | 'minor' | 'patch' } | false>`
- **Default:** Changelogen defaults (feat, fix, etc.)
- **Description:** Defines commit types and their impact on version bumping:
  - **Object with `semver`**: Triggers version bump
    - `semver: 'major'`: Breaking changes → major version bump (1.0.0 → 2.0.0)
    - `semver: 'minor'`: New features → minor version bump (1.0.0 → 1.1.0)
    - `semver: 'patch'`: Bug fixes → patch version bump (1.0.0 → 1.0.1)
  - **`false`**: No version bump (commit type is ignored for versioning and won't appear in changelog)

**Controlling Version Bumps:**

By default, any commit that touches a package will cause it to be bumped. However, you can exclude certain commit types from triggering bumps by setting them to `false`:

```typescript
export default defineConfig({
  types: {
    // These WILL trigger version bumps
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
    perf: { title: '🔥 Performance', semver: 'patch' },

    // These will NOT trigger version bumps (set to false)
    chore: false,
    docs: false,
    style: false,
    ci: false,
    test: false,
  },
})
```

**Use Cases:**

- **Dependency updates**: Use `chore(deps):` for devDependencies updates that don't need a release
- **Documentation**: Use `docs:` for README updates that don't change functionality
- **CI/Tests**: Use `ci:` or `test:` for changes that don't affect the package code

**Example:**

```bash
# This WILL bump the version (feat has semver: 'minor')
git commit -m "feat(utils): add new utility function"

# This will NOT bump the version (chore is set to false)
git commit -m "chore(utils): upgrade vite to latest"

# This will NOT bump the version (docs is set to false)
git commit -m "docs(components): update API documentation"
```

**Note:** Commits with types set to `false` are completely ignored - they won't bump versions and won't appear in changelogs.

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

#### `noVerify`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Skip git hooks when creating the release commit. Useful in CI environments or when you want to bypass pre-commit hooks during automated releases.
- **Example:**

  ```typescript
  export default defineConfig({
    noVerify: true, // Skip all git hooks during commits
  })
  ```

#### `changelog`

- **Type:** `{ formatCmd?: string, from?: string, to?: string }`
- **Default:** `{}`
- **Description:** Changelog-specific configuration options.
  - `formatCmd`: Optional command to run after generating changelogs (e.g., `'pnpm lint:fix'` to format the files). If this command fails, a warning is displayed but the process continues.
  - `from`: Starting commit reference for changelog generation
  - `to`: Ending commit reference (defaults to HEAD)
- **Example:**

  ```typescript
  export default defineConfig({
    changelog: {
      formatCmd: 'pnpm lint:fix', // Auto-format generated changelogs
      from: 'v1.0.0',
      to: 'HEAD',
    }
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

## Dependency Management

The tool automatically detects and bumps packages that depend on other packages in the monorepo. This ensures that when a package is updated, all packages depending on it are also bumped and republished with the correct dependency versions.

### How It Works

**Automatic Detection:**

- When package B is updated, all packages that depend on B are automatically identified
- Only `dependencies` and `peerDependencies` are considered (not `devDependencies`, following industry best practices)
- Transitive dependencies are handled: if A→B→C and C is updated, both B and A are bumped

**Bump Types by Mode:**

- **Selective/Unified mode**: Dependent packages get the same unified version as the root
- **Independent mode**: Dependent packages get a `patch` bump minimum (can be higher if they also have commits)

**Example Scenario:**

```
Packages:
  - @maz-ui/utils@1.0.0
  - @maz-ui/components@2.0.0 (depends on @maz-ui/utils)
  - @maz-ui/forms@1.5.0 (depends on @maz-ui/components)

Commit: feat: add new utility function (in @maz-ui/utils)

Result in Independent Mode:
  - @maz-ui/utils: 1.0.0 → 1.1.0 (minor - from commit type)
  - @maz-ui/components: 2.0.0 → 2.0.1 (patch - dependency updated)
  - @maz-ui/forms: 1.5.0 → 1.5.1 (patch - transitive dependency)

Result in Selective Mode:
  - All three packages: bumped to unified version 2.1.0
  - Root version: 2.0.0 → 2.1.0
```

**Why This Matters:**

1. **Consistency**: Ensures `package.json` files reference the correct workspace dependency versions
2. **Publishing**: New versions on npm point to the updated dependencies
3. **Semver Compliance**: Dependency changes are considered package changes

**Exclusions:**

Changes to `devDependencies` do NOT trigger dependent package bumps, as dev dependencies are not published and don't affect runtime behavior (following Lerna and Changesets best practices).

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

```txt
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
