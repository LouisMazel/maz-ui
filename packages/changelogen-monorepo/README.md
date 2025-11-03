# @maz-ui/changelogen-monorepo

A tool to manage versions and changelogs in monorepos, built on top of [changelogen](https://github.com/unjs/changelogen).

## 🎯 Why use this tool?

Imagine you have multiple packages in your project (like a box with several toys). This tool helps you to:

1. **Update version numbers** of your packages automatically
2. **Create changelogs** to explain what changed
3. **Publish your packages** to npm so others can use them
4. **Create releases** on GitHub or GitLab

## ✨ Features

- 🚀 Built on top of [changelogen](https://github.com/unjs/changelogen)
- 📦 Monorepo support with glob pattern matching
- 🔄 Three versioning modes: unified, selective, independent
- 📝 Generate changelogs per package + root aggregate
- 🏷️ Pre-release support (alpha, beta, rc)
- 📢 NPM publish with smart tag detection
- 🔗 Automatic dependency bumping for workspace dependencies
- 🐙 GitHub & GitLab release automation
- 🔐 2FA/OTP support for npm publishing
- 🎛️ Custom registry support (private registries, GitHub Packages, etc.)

## 📦 Installation

```bash
pnpm add -D @maz-ui/changelogen-monorepo
```

## ⚙️ Minimal configuration

Create a `changelog.config.ts` file in the root of your project (the config file is loaded using [c12](https://github.com/unjs/c12), so you can use mulitple languages and formats, more information in [c12 docs](https://github.com/unjs/c12)).

This is a **minimal configuration example** (check all options in the [configuration section](#configuration-options)), you have to specify the version mode and the packages to bump.

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  monorepo: {
    versionMode: 'selective', // 'unified', 'selective', 'independent'
    packages: ['packages/*'], // glob pattern matching
  },
})
```

## 🚀 Usage

### Available commands

The CLI uses the `clm` command (ChangeLogen Monorepo):

```bash
clm <command> [options]
```

#### 1. `bump` - Update versions

Updates package version numbers.

```bash
# Auto-detect bump type from commits
clm bump

# Specify bump type
clm bump --patch    # 1.0.0 → 1.0.1
clm bump --minor    # 1.0.0 → 1.1.0
clm bump --major    # 1.0.0 → 2.0.0

# Pre-releases
clm bump --prerelease --preid beta     # 1.0.0 → 1.0.1-beta.0
clm bump --premajor --preid alpha      # 1.0.0 → 2.0.0-alpha.0
clm bump --preminor --preid rc         # 1.0.0 → 1.1.0-rc.0
clm bump --prepatch --preid beta       # 1.0.0 → 1.0.1-beta.0

# Options
clm bump --force      # Force bump even without commits
clm bump --dry-run    # Preview without writing
```

**Available options:**

- `--major` - Bump major version
- `--minor` - Bump minor version
- `--patch` - Bump patch version
- `--prerelease` - Bump prerelease version
- `--premajor` - Bump premajor version
- `--preminor` - Bump preminor version
- `--prepatch` - Bump prepatch version
- `--preid <id>` - Prerelease identifier (alpha, beta, rc, etc.)
- `--force` - Force bump even without commits
- `--dry-run` - Preview without writing

#### 2. `changelog` - Generate changelogs

Generates CHANGELOG.md files for each package and at the root.

```bash
# Generate all changelogs
clm changelog

# Specify commit range
clm changelog --from v1.0.0
clm changelog --from v1.0.0 --to v1.1.0

# Format after generation
clm changelog --format-cmd "pnpm lint:fix"

# Without root changelog
clm changelog --no-root-changelog

# Preview
clm changelog --dry-run
```

**Available options:**

- `--from <ref>` - Start commit reference
- `--to <ref>` - End commit reference
- `--format-cmd <cmd>` - Command to format CHANGELOGs after generation
- `--no-root-changelog` - Skip root changelog generation
- `--dry-run` - Preview without writing

#### 3. `publish` - Publish to npm

Publishes packages to npm registry (or other registry).

```bash
# Simple publish
clm publish

# With custom registry
clm publish --registry https://npm.pkg.github.com

# With custom tag
clm publish --tag next

# For scoped packages (public access)
clm publish --access public

# With 2FA
clm publish --otp 123456

# Preview
clm publish --dry-run
```

**Available options:**

- `--registry <url>` - Custom npm registry URL
- `--tag <tag>` - Publish tag (default: `latest` for stable, `next` for prerelease)
- `--access <type>` - Access level (`public` or `restricted`)
- `--otp <code>` - OTP code for 2FA
- `--dry-run` - Preview without publishing

**Automatic tag detection:**

- Stable version (e.g., `1.2.3`) → tag `latest`
- Prerelease version (e.g., `1.2.3-beta.0`) → tag `next`

#### 4. `provider-release` - Publish a release to git provider (github or gitlab)

Publishes a release for the latest tag.

```bash
# Publish release
clm provider-release

# With custom token
clm provider-release --token YOUR_GITHUB_TOKEN

# Force git provider
clm provider-release --provider github

# Specify range
clm provider-release --from v1.0.0 --to v1.1.0

# Preview
clm provider-release --dry-run
```

**Available options:**

- `--from <ref>` - Start commit reference
- `--to <ref>` - End commit reference
- `--token <token>` - Git provider token
- `--provider <provider>` - Git provider (github or gitlab)
- `--dry-run` - Preview release content

**Token:**

Multiple ways to provide the token:

- Command line option (`--token`)
- Checked environment variables:
  - GitHub
    - `CHANGELOGEN_TOKENS_GITHUB`
    - `GITHUB_TOKEN`
    - `GH_TOKEN`
  - GitLab
    - `CHANGELOGEN_TOKENS_GITLAB`
    - `GITLAB_TOKEN`
    - `GITLAB_API_TOKEN`
    - `CI_JOB_TOKEN`

#### 6. `release` - Complete release workflow

Executes the entire release workflow in one command:

1. Bump versions
2. Generate changelogs
3. Commit changes
4. Create git tag
5. Push to remote
6. Publish to npm
7. Create GitHub/GitLab release

```bash
# Complete release
clm release --patch

# Release with pre-release
clm release --prerelease --preid beta

# Without push to remote
clm release --patch --no-push

# Without GitHub/GitLab release creation
clm release --patch --no-release

# Without npm publish
clm release --patch --no-publish

# Without git verification (skip hooks)
clm release --patch --no-verify

# With npm options
clm release --patch --registry https://npm.pkg.github.com --access public --otp 123456

# Preview entire workflow
clm release --patch --dry-run

# Force even without commits
clm release --patch --force
```

**Available options:**

All options from `bump`, `changelog`, `publish` and `provider-release` are available, plus:

- `--no-push` - Don't push changes and tags to remote
- `--no-release` - Don't create GitHub/GitLab release
- `--no-publish` - Don't publish to npm
- `--no-verify` - Skip git hooks during commit
- `--token <token>` - Git token (GitHub or GitLab)
- `--force` - Force bump even without commits

### Global option: Log Level

All commands support the `--log-level` option to control verbosity:

```bash
# Default level (essential information)
clm bump

# Debug level (detailed information)
clm release --patch --log-level debug

# Silent level (errors only)
clm publish --log-level silent
```

**Available levels:**

- `silent` - Errors only
- `error` - Errors and critical warnings
- `warning` - Warnings and above
- `normal` - Normal information
- `default` - Essential information (default)
- `debug` - Detailed debugging information
- `trace` - Very detailed trace information
- `verbose` - Show everything

**Examples:**

```bash
# Clean output with essential info
$ clm bump --patch
ℹ 4.2.0 → 4.2.1 (unified mode)
✔ All 3 package(s) bumped to 4.2.1

# Detailed output for debugging
$ clm bump --patch --log-level debug
● Loading monorepo configuration
● Version mode: unified
● From: v4.2.0, To: HEAD
● Package patterns: packages/*
● Found 3 package(s)
● Starting bump in unified mode
● Fetching commits from v4.2.0 to HEAD
● Found 5 commits since v4.2.0
● Detected release type from commits: patch
ℹ 4.2.0 → 4.2.1 (unified mode)
● Writing version to 3 package(s)
● Updating lerna.json version
✔ All 3 package(s) bumped to 4.2.1
```

## ⚙️ Configuration

Create a `changelog.config.ts` file at the root of your project:

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  // Standard changelogen configuration
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
  },

  // Monorepo configuration
  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
    ignorePackageNames: [],
  },

  // Optional configuration
  changelog: {
    formatCmd: 'pnpm lint:fix',
    rootChangelog: true,
  },

  bump: {
    type: 'release',
    preid: undefined,
  },

  publish: {
    private: false,
    tag: 'latest',
    args: [],
  },

  release: {
    push: true,
    release: true,
    publish: true,
    noVerify: false,
  },
})
```

### Configuration options

#### `types`

**Type:** `Record<string, { title: string, semver?: 'major' | 'minor' | 'patch' } | false>`

**Description:** Defines commit types and their impact on versioning.

- With `semver`: Triggers a version bump
  - `'major'`: Breaking changes → 1.0.0 → 2.0.0
  - `'minor'`: New features → 1.0.0 → 1.1.0
  - `'patch'`: Bug fixes → 1.0.0 → 1.0.1
- Without `semver`: Appears in changelog but doesn't trigger a bump
- `false`: Completely ignored (no changelog, no bump)

**Example:**

```typescript
export default defineConfig({
  types: {
    // Trigger a bump
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
    perf: { title: '🔥 Performance', semver: 'patch' },

    // Appear in changelog but no bump
    docs: { title: '📖 Documentation' },
    chore: { title: '🏡 Chore' },

    // Completely ignored
    ci: false,
    test: false,
  },
})
```

#### `monorepo`

**Type:** `object`

Monorepo-specific configuration.

##### `monorepo.versionMode`

**Type:** `'unified' | 'selective' | 'independent'`

**Default:** `'selective'` (recommended)

**Description:** Determines how versions are managed.

| Mode               | Version     | Scope                      | Root & Lerna | Best for                       |
| ------------------ | ----------- | -------------------------- | ------------ | ------------------------------ |
| **`selective`** ⭐ | Unified     | Only packages with commits | ✅ Updated   | Most monorepos                 |
| **`unified`**      | Unified     | ALL packages               | ✅ Updated   | Keep all packages synchronized |
| **`independent`**  | Independent | Only packages with commits | ❌ Unchanged | Collections of unrelated tools |

**Examples:**

```typescript
// Selective mode (default, recommended)
// Example: 10 packages, 3 have commits
// → Only these 3 are bumped to the unified version
monorepo: {
  versionMode: 'selective'
}

// Unified mode
// Example: 10 packages, 3 have commits
// → All 10 packages are bumped to the unified version
monorepo: {
  versionMode: 'unified'
}

// Independent mode
// Example: 10 packages, 3 have commits
// → package-a: 2.1.0 (feat)
// → package-b: 1.0.1 (fix)
// → package-c: 1.5.0 (unchanged)
monorepo: {
  versionMode: 'independent'
}
```

##### `monorepo.packages`

**Type:** `string[]`

**Default:** `['packages/*']`

**Description:** Glob patterns to locate your packages. Only non-private packages (with `"private": false` or without `private` field) are included.

**Examples:**

```typescript
// Single directory
packages: ['packages/*']

// Multiple directories
packages: ['packages/*', 'tools/*']

// Specific packages
packages: ['packages/core', 'packages/utils', 'apps/cli']

// Mixed patterns
packages: ['packages/*', 'tools/cli', 'apps/*']
```

##### `monorepo.ignorePackageNames`

**Type:** `string[]`

**Default:** `[]`

**Description:** List of package names to ignore during changelog generation and version bumping.

**Example:**

```typescript
ignorePackageNames: ['@myorg/internal-utils', '@myorg/eslint-config']
```

#### `changelog`

**Type:** `object`

Changelog generation configuration.

##### `changelog.formatCmd`

**Type:** `string | undefined`

**Default:** `undefined`

**Description:** Command to execute after generating changelogs to format them (e.g., `'pnpm lint:fix'`). If the command fails, a warning is displayed but the process continues.

##### `changelog.rootChangelog`

**Type:** `boolean`

**Default:** `true`

**Description:** Generates a `CHANGELOG.md` at the root that aggregates changes from all packages.

#### `bump`

**Type:** `object`

Version bump configuration.

##### `bump.yes`

**Type:** `boolean`

**Default:** `true`

**Description:** Choose to skip the confirmation prompt to accept the version updates.

##### `bump.type`

**Type:** `'release' | 'major' | 'minor' | 'patch' | 'premajor' | 'preminor' | 'prepatch' | 'prerelease'`

**Default:** `'release'`

**Description:** Default bump type. `'release'` automatically detects the type from commits.

##### `bump.preid`

**Type:** `string | undefined`

**Default:** `undefined`

**Description:** Identifier for pre-releases (alpha, beta, rc, etc.)

##### `bump.clean`

**Type:** `boolean`

**Default:** `true`

**Description:** Check if there are any changes to commit before bumping.

##### `bump.dependencyTypes`

**Type:** `('dependencies' | 'devDependencies' | 'peerDependencies')[]`

**Default:** `['dependencies']`

**Description:** Choose which types of dependencies trigger a version bump.

When a package is updated, this option decides if other packages should be bumped based on how they use it:

- `'dependencies'`: Bump packages that need it to work (like a toy needs batteries)
- `'devDependencies'`: Bump packages that need it for building or testing (like tools to make the toy)
- `'peerDependencies'`: Bump packages that work alongside it (like compatible accessories)

**Example:**

```typescript
// Only bump when normal dependencies change
bump: {
  dependencyTypes: ['dependencies']
}

// Bump for all types of dependencies
bump: {
  dependencyTypes: ['dependencies', 'devDependencies', 'peerDependencies']
}
```

#### `publish`

**Type:** `object`

npm publishing configuration.

##### `publish.private`

**Type:** `boolean`

**Default:** `false`

**Description:** Don't publish packages (equivalent to `"private": true` in package.json).

##### `publish.tag`

**Type:** `string`

**Default:** `'latest'`

**Description:** Default npm tag. Auto-detected: `latest` for stable, `next` for prerelease.

##### `publish.args`

**Type:** `string[]`

**Default:** `[]`

**Description:** Additional arguments passed to the `npm publish` command.

#### `release`

**Type:** `object`

Release workflow configuration.

##### `release.clean`

**Type:** `boolean`

**Default:** `true`

**Description:** Check if there are any changes to commit before bumping.

##### `release.commit`

**Type:** `boolean`

**Default:** `true`

**Description:** Commit changes and create tag.

##### `release.push`

**Type:** `boolean`

**Default:** `true`

**Description:** Push changes and tags to remote. Will be false if `release.commit` is false.

##### `release.release`

**Type:** `boolean`

**Default:** `true`

**Description:** Create a release on GitHub/GitLab.

##### `release.publish`

**Type:** `boolean`

**Default:** `true`

**Description:** Publish to npm.

##### `release.noVerify`

**Type:** `boolean`

**Default:** `false`

**Description:** Skip git hooks during commit (`--no-verify` flag).

##### `release.force`

**Type:** `boolean`

**Default:** `false`

**Description:** Force bump even without commits.

#### `repo`

**Type:** `object`

Git repository configuration.

##### `repo.provider`

**Type:** `'github' | 'gitlab' | undefined`

**Default:** Auto-detected from git remote URL

**Description:** Forces git provider (GitHub or GitLab). Auto-detection:

- URLs containing `github.com` → GitHub
- URLs containing `gitlab.com` or `gitlab` → GitLab

##### `repo.domain`

**Type:** `string | undefined`

**Default:** `undefined`

**Description:** Custom domain for self-hosted GitLab.

**Example:**

```typescript
// For self-hosted GitLab
export default defineConfig({
  repo: {
    domain: 'gitlab.mycompany.com',
    provider: 'gitlab',
  }
})
```

##### `repo.repo`

**Type:** `string | undefined`

**Default:** Auto-detected from git remote

**Description:** Repository in `owner/repo` format.

##### `repo.token`

**Type:** `string | undefined`

**Default:** From environment variables

**Description:** Authentication token for GitHub/GitLab.

#### `templates`

**Type:** `object`

Templates for commit and tag messages.

##### `templates.commitMessage`

**Type:** `string`

**Default:** `'chore(release): bump version to v{{newVersion}}'`

**Description:** Commit message template during release. Tips: add `[skip ci]` with Gitlab to skip CI run for the release commit.

##### `templates.tagMessage`

**Type:** `string`

**Default:** `'Bump version to v{{newVersion}}'`

**Description:** Git tag message template.

##### `templates.tagBody`

**Type:** `string`

**Default:** `'v{{newVersion}}'`

**Description:** Git tag body template. **Not used with "independent" version mode, independent tags are created per package (e.g. `package-name@1.0.0`)**

##### `templates.emptyChangelogContent`

**Type:** `string`

**Default:** `'No relevant changes for this release'`

**Description:** Changelog content when there are no changes.

#### `logLevel`

**Type:** `'silent' | 'error' | 'warning' | 'normal' | 'default' | 'debug' | 'trace' | 'verbose'`

**Default:** `'default'`

**Description:** Default log level for all commands.

### Configuration Examples

#### Simple configuration (selective mode)

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
  },
  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
  },
})
```

#### Advanced configuration

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
    perf: { title: '🔥 Performance', semver: 'patch' },
    docs: { title: '📖 Documentation' },
    chore: { title: '🏡 Chore' },
    ci: false,
    test: false,
  },

  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*', 'tools/*'],
    ignorePackageNames: ['@myorg/eslint-config'],
  },

  changelog: {
    formatCmd: 'pnpm lint:fix',
    rootChangelog: true,
  },

  bump: {
    type: 'release',
  },

  publish: {
    private: false,
    tag: 'latest',
  },

  release: {
    push: true,
    release: true,
    publish: true,
    noVerify: false,
  },

  templates: {
    commitMessage: 'chore(release): v{{newVersion}}',
  },
})
```

#### Configuration for self-hosted GitLab

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  repo: {
    domain: 'gitlab.mycompany.com',
    provider: 'gitlab',
  },
  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
  },
})
```

## 🔗 Dependency Management

The tool automatically detects and bumps packages that depend on other packages in the monorepo.

### How it works

**Automatic detection:**

- When package B is updated, all packages that depend on B are automatically identified
- By default only `dependencies` are considered (not `devDependencies` or `peerDependencies`). You can change this behavior using the [dependencyTypes](#bumpdependencytypes) option.
- Transitive dependencies are handled: if A→B→C and C is updated, both B and A are bumped

**Bump types by mode:**

- **Selective/unified mode:** Dependent packages get the same unified version as the root
- **Independent mode:** Dependent packages get a minimum `patch` bump (can be higher if they also have commits)

**Example:**

```bash
Packages:
  - @maz-ui/utils@1.0.0
  - @maz-ui/components@2.0.0 (depends on @maz-ui/utils)
  - @maz-ui/forms@1.5.0 (depends on @maz-ui/components)

Commit: feat(utils): add new utility

Result in Independent mode:
  - @maz-ui/utils: 1.0.0 → 1.1.0 (minor - from commit)
  - @maz-ui/components: 2.0.0 → 2.0.1 (patch - dependency updated)
  - @maz-ui/forms: 1.5.0 → 1.5.1 (patch - transitive dependency)

Result in Selective mode:
  - All 3 packages: bumped to unified version 2.1.0
  - Root version: 2.0.0 → 2.1.0
```

## 🔄 Lerna Integration

### Automatic `lerna.json` updates

If a `lerna.json` file exists at the root, the tool automatically updates its `version` field during bump (in unified and selective modes only).

**No `lerna.json`?** No problem! The tool works perfectly without it.

### Replacing Lerna commands

| Lerna command                           | changelogen-monorepo equivalent         |
| --------------------------------------- | --------------------------------------- |
| `lerna version patch`                   | `clm release --patch`                   |
| `lerna version minor`                   | `clm release --minor`                   |
| `lerna version major`                   | `clm release --major`                   |
| `lerna version prerelease --preid beta` | `clm release --prerelease --preid beta` |
| `lerna publish from-package`            | Not needed (use `pnpm publish -r`)      |

### Migration from Lerna

1. Keep your existing `lerna.json` (optional)
2. Create a `changelog.config.ts` with your versioning strategy
3. Replace `lerna version` with `clm release`
4. Use your package manager to publish (e.g., `pnpm publish -r`)

## 🦊 GitLab CI/CD Configuration

### Personal Access Token

1. Go to GitLab → Settings → Access Tokens
2. Create a token with `api` scope
3. Set the environment variable:

```bash
GITLAB_TOKEN="your-token-here"
```

### CI/CD Pipeline

GitLab CI automatically provides `CI_JOB_TOKEN` which can be used for releases:

```yaml
release:
  stage: deploy
  script:
    - pnpm install
    - pnpm clm release --yes
  only:
    - main
```

## Programmatic Usage (API)

You can also use the tool programmatically:

```typescript
import {
  bump,
  changelog,
  github,
  gitlab,
  publish,
  release,
} from '@maz-ui/changelogen-monorepo'

// Bump versions
await bump({
  type: 'prerelease',
  preid: 'beta',
})

// Generate changelogs
await changelog({
  from: 'v1.0.0',
  to: 'v1.1.0',
})

// Publish to npm
await publish({
  registry: 'https://registry.npmjs.org',
  tag: 'latest',
})

// GitHub release
await github()

// GitLab release
await gitlab()

// Complete workflow
await release({
  type: 'prerelease',
  preid: 'beta',
  tag: 'beta',
  registry: 'https://registry.npmjs.org',
  push: true,
  release: true,
  publish: true,
})
```

## License

MIT
