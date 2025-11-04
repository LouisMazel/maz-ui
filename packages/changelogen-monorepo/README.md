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
- ⚙️ Multiple configuration files support for different release workflows
- 🔧 Support for npm, yarn, pnpm, and bun (auto-detected)

## 📦 Installation

```bash
pnpm add -D @maz-ui/changelogen-monorepo
```

## 📦 Package Manager Support

This tool automatically detects your package manager and uses the appropriate commands:

- **npm** - Standard npm registry commands
- **yarn** - Supports both Yarn Classic and Yarn Berry
- **pnpm** - Optimized for pnpm workspaces
- **bun** - Full support for bun package manager

Detection is automatic based on:

1. `packageManager` field in package.json
2. Lock file presence (pnpm-lock.yaml, yarn.lock, package-lock.json, bun.lockb)
3. npm_config_user_agent environment variable

## ⚙️ Minimal configuration

Create a configuration file in the root of your project. The config file is loaded using [c12](https://github.com/unjs/c12), which supports multiple formats.

### Supported Configuration Formats

You can use any of these formats for your configuration file:

- **JavaScript/TypeScript:** `.js`, `.ts`, `.mjs`, `.cjs`, `.mts`, `.cts`
- **JSON:** `.json`, `.jsonc`, `.json5`
- **YAML:** `.yaml`, `.yml`
- **TOML:** `.toml`

**Examples:**

- `changelog.config.ts` (TypeScript - recommended)
- `changelog.config.js` (JavaScript)
- `changelog.config.json` (JSON)
- `changelog.config.yaml` (YAML)

### Minimal Configuration Example

**TypeScript/JavaScript** (recommended):

```typescript
// changelog.config.ts
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  monorepo: {
    versionMode: 'selective', // 'unified', 'selective', 'independent'
    packages: ['packages/*'], // glob pattern matching
  },
})
```

**JSON:**

```json
{
  "monorepo": {
    "versionMode": "selective",
    "packages": ["packages/*"]
  }
}
```

**YAML:**

```yaml
monorepo:
  versionMode: selective
  packages:
    - packages/*
```

Check all options in the [configuration section](#configuration-options).

## 🚀 Usage

### Available commands

The CLI uses the `clm` command (ChangeLogen Monorepo):

```bash
clm <command> [options]
```

#### 1. `release` - Complete release workflow

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
clm release --prerelease --preid beta --tag beta

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

# Force even without commits
clm release --patch --force
```

**Available options:**

All options from `bump`, `changelog`, `publish` and `provider-release` are available, and:

- `--no-push` - Don't push changes and tags to remote
- `--no-release` - Don't create GitHub/GitLab release
- `--no-publish` - Don't publish to npm
- `--no-verify` - Skip git hooks during commit
- `--no-commit` - Skip commit and tag creation
- `--no-changelog` - Skip changelog generation
- `--no-clean` - Skip working directory clean check
- `--token <token>` - Git token (GitHub or GitLab)
- `--force` - Force bump even without commits
- `--yes` - Skip confirmation prompt
- `--build-cmd <cmd>` - Command to build packages before publish

#### 2. `bump` - Update versions

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
clm bump --yes        # Skip confirmation prompt
clm bump --no-clean   # Skip working directory clean check
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
- `--yes` - Skip confirmation prompt
- `--no-clean` - Skip working directory clean check

#### 3. `changelog` - Generate changelogs

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
```

**Available options:**

- `--from <ref>` - Start commit reference
- `--to <ref>` - End commit reference
- `--format-cmd <cmd>` - Command to format CHANGELOGs after generation
- `--no-root-changelog` - Skip root changelog generation

#### 4. `publish` - Publish to npm

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

# Build before publish
clm publish --build-cmd "pnpm build"
```

**Available options:**

- `--registry <url>` - Custom npm registry URL
- `--tag <tag>` - Publish tag (default: `latest` for stable, `next` for prerelease)
- `--access <type>` - Access level (`public` or `restricted`)
- `--otp <code>` - OTP code for 2FA
- `--build-cmd <cmd>` - Command to build packages before publish

**Automatic tag detection:**

- Stable version (e.g., `1.2.3`) → tag `latest`
- Prerelease version (e.g., `1.2.3-beta.0`) → tag `next`

#### 5. `provider-release` - Publish a release to git provider (github or gitlab)

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
```

**Available options:**

- `--from <ref>` - Start commit reference
- `--to <ref>` - End commit reference
- `--token <token>` - Git provider token
- `--provider <provider>` - Git provider (github or gitlab)

**Token:**

Multiple ways to provide the token:

- Command line option (`--token`)
- Configuration file (see [tokens](#tokens) section)
- Environment variables (checked in order):
  - **GitHub:** `CHANGELOGEN_TOKENS_GITHUB`, `GITHUB_TOKEN`, `GH_TOKEN`
  - **GitLab:** `CHANGELOGEN_TOKENS_GITLAB`, `GITLAB_TOKEN`, `GITLAB_API_TOKEN`, `CI_JOB_TOKEN`

### Global options

All commands support these global options:

#### Config File

Use `--config` to specify a custom configuration file name (without the file extension):

```bash
# Use default config (changelog.config.{ts,js,json,yaml,...})
clm bump --patch

# Use custom config (changelog.standalone.config.{ts,js,json,yaml,...})
clm bump --config changelog.standalone --patch

# Use another config (changelog.experimental.config.{ts,js,json,yaml,...})
clm release --config changelog.experimental --minor
```

**Important:**

- The config file name must follow the pattern: `<name>.config.<ext>` (e.g., `myconfig.config.ts`, `myconfig.config.json`)
- In the `--config` option, you only specify the `<name>` part (without `.config.<ext>`)
- Supported extensions: `.ts`, `.js`, `.mjs`, `.cjs`, `.mts`, `.cts`, `.json`, `.jsonc`, `.json5`, `.yaml`, `.yml`, `.toml`

#### Dry Run

Use `--dry-run` to preview changes without writing files, creating tags, commits, or publishing:

```bash
# Preview bump
clm bump --patch --dry-run

# Preview entire release workflow
clm release --minor --dry-run

# Preview publish
clm publish --dry-run
```

#### Log Level

Use `--log-level` to control verbosity:

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

This tool extends [changelogen](https://github.com/unjs/changelogen) configuration with additional monorepo-specific options. Some options from changelogen are overridden to provide better monorepo support.

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

The configuration extends [ChangelogConfig](https://github.com/unjs/changelogen#configuration) from changelogen with additional monorepo-specific options.

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

Monorepo-specific configuration (required).

| Property             | Type                                            | Default          | Description                              |
| -------------------- | ----------------------------------------------- | ---------------- | ---------------------------------------- |
| `versionMode`        | `'unified'` \| `'selective'` \| `'independent'` | `'selective'`    | How versions are managed across packages |
| `packages`           | `string[]`                                      | `['packages/*']` | Glob patterns to locate packages         |
| `ignorePackageNames` | `string[]`                                      | `[]`             | Package names to ignore                  |

**Version modes:**

| Mode               | Version     | Scope                      | Root & Lerna | Best for                       |
| ------------------ | ----------- | -------------------------- | ------------ | ------------------------------ |
| **`selective`** ⭐ | Unified     | Only packages with commits | ✅ Updated   | Most monorepos                 |
| **`unified`**      | Unified     | ALL packages               | ✅ Updated   | Keep all packages synchronized |
| **`independent`**  | Independent | Only packages with commits | ❌ Unchanged | Collections of unrelated tools |

**Examples:**

```typescript
export default defineConfig({
  // Selective mode (recommended) - Only bump packages with commits
  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
  },

  // Unified mode - Bump ALL packages together
  // monorepo: {
  //   versionMode: 'unified',
  //   packages: ['packages/*', 'tools/*'],
  // },

  // Independent mode - Each package has its own version
  // monorepo: {
  //   versionMode: 'independent',
  //   packages: ['packages/*'],
  //   ignorePackageNames: ['@myorg/internal-utils'],
  // },
})
```

#### `changelog`

Changelog generation configuration.

| Property            | Type      | Default     | Description                                        |
| ------------------- | --------- | ----------- | -------------------------------------------------- |
| `formatCmd`         | `string`  | `undefined` | Command to format changelogs after generation      |
| `rootChangelog`     | `boolean` | `true`      | Generate root CHANGELOG.md with aggregated changes |
| `includeCommitBody` | `boolean` | `false`     | Include full commit bodies in changelog entries    |

**Example:**

```typescript
export default defineConfig({
  changelog: {
    formatCmd: 'pnpm lint:fix',
    rootChangelog: true,
    includeCommitBody: true,
  },
})
```

#### `bump`

Version bump configuration.

| Property          | Type                                                                        | Default            | Description                                             |
| ----------------- | --------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------- |
| `type`            | `'release'` \| `'major'` \| `'minor'` \| `'patch'` \| `'prerelease'` \| ... | `'release'`        | Default bump type ('release' auto-detects from commits) |
| `preid`           | `string`                                                                    | `undefined`        | Pre-release identifier (alpha, beta, rc, etc.)          |
| `clean`           | `boolean`                                                                   | `true`             | Check if working directory is clean before bumping      |
| `dependencyTypes` | `Array<'dependencies' \| 'devDependencies' \| 'peerDependencies'>`          | `['dependencies']` | Which dependency types trigger a version bump           |
| `yes`             | `boolean`                                                                   | `true`             | Skip confirmation prompt                                |

**Dependency types:** When a package is updated, this decides which dependent packages should also be bumped:

- `dependencies` - Packages that need it to work
- `devDependencies` - Packages that need it for building/testing
- `peerDependencies` - Packages that work alongside it

**Example:**

```typescript
export default defineConfig({
  bump: {
    type: 'release',
    dependencyTypes: ['dependencies', 'devDependencies'],
    clean: true,
    yes: true,
  },
})
```

#### `publish`

npm publishing configuration.

| Property   | Type                         | Default     | Description                                         |
| ---------- | ---------------------------- | ----------- | --------------------------------------------------- |
| `private`  | `boolean`                    | `false`     | Don't publish packages                              |
| `tag`      | `string`                     | `'latest'`  | npm tag (auto: 'latest' for stable, 'next' for pre) |
| `registry` | `string`                     | `undefined` | Custom registry URL                                 |
| `access`   | `'public'` \| `'restricted'` | `undefined` | Package access level                                |
| `otp`      | `string`                     | `undefined` | One-time password for 2FA                           |
| `buildCmd` | `string`                     | `undefined` | Command to build packages before publish            |
| `args`     | `string[]`                   | `[]`        | Additional arguments for publish command            |

**Example:**

```typescript
export default defineConfig({
  publish: {
    private: false,
    tag: 'latest',
    registry: 'https://registry.npmjs.org',
    access: 'public',
    buildCmd: 'pnpm build',
  },
})
```

#### `release`

Release workflow configuration.

| Property    | Type      | Default | Description                         |
| ----------- | --------- | ------- | ----------------------------------- |
| `commit`    | `boolean` | `true`  | Commit changes and create tag       |
| `push`      | `boolean` | `true`  | Push changes and tags to remote     |
| `changelog` | `boolean` | `true`  | Generate changelog files            |
| `release`   | `boolean` | `true`  | Create release on GitHub/GitLab     |
| `publish`   | `boolean` | `true`  | Publish to npm                      |
| `clean`     | `boolean` | `true`  | Check if working directory is clean |
| `noVerify`  | `boolean` | `false` | Skip git hooks during commit        |
| `force`     | `boolean` | `false` | Force bump even without commits     |

**Example:**

```typescript
export default defineConfig({
  release: {
    commit: true,
    push: true,
    changelog: true,
    release: true,
    publish: true,
    noVerify: false,
  },
})
```

#### `repo`

Git repository configuration (auto-detected by default).

| Property   | Type                     | Default       | Description                            |
| ---------- | ------------------------ | ------------- | -------------------------------------- |
| `provider` | `'github'` \| `'gitlab'` | Auto-detected | Git provider (auto from remote URL)    |
| `domain`   | `string`                 | `undefined`   | Custom domain for self-hosted instance |
| `repo`     | `string`                 | Auto-detected | Repository in 'owner/repo' format      |
| `token`    | `string`                 | From env vars | Authentication token                   |

**Auto-detection:**

- Provider: Detected from git remote URL (github.com → GitHub, gitlab.com → GitLab)
- Repository: Parsed from git remote URL
- Token: Read from environment variables (see [tokens](#tokens) section)

**Example:**

```typescript
export default defineConfig({
  // For self-hosted GitLab
  repo: {
    provider: 'gitlab',
    domain: 'gitlab.mycompany.com',
  },
})
```

#### `tokens`

Authentication tokens for git providers (read from environment variables by default).

| Property | Type     | Default       | Description                 |
| -------- | -------- | ------------- | --------------------------- |
| `github` | `string` | From env vars | GitHub authentication token |
| `gitlab` | `string` | From env vars | GitLab authentication token |

**Environment variables checked (in order):**

- GitHub: `CHANGELOGEN_TOKENS_GITHUB`, `GITHUB_TOKEN`, `GH_TOKEN`
- GitLab: `CHANGELOGEN_TOKENS_GITLAB`, `GITLAB_TOKEN`, `GITLAB_API_TOKEN`, `CI_JOB_TOKEN`

**Example:**

```typescript
export default defineConfig({
  tokens: {
    github: process.env.GITHUB_TOKEN,
    gitlab: process.env.GITLAB_TOKEN,
  },
})
```

#### `templates`

Templates for commit and tag messages.

| Property                | Type     | Default                                            | Description                                 |
| ----------------------- | -------- | -------------------------------------------------- | ------------------------------------------- |
| `commitMessage`         | `string` | `'chore(release): bump version to {{newVersion}}'` | Commit message template                     |
| `tagMessage`            | `string` | `'Bump version to v{{newVersion}}'`                | Git tag message template                    |
| `tagBody`               | `string` | `'v{{newVersion}}'`                                | Git tag body (not used in independent mode) |
| `emptyChangelogContent` | `string` | `'No relevant changes for this release'`           | Changelog content when no changes           |

**Available variables:** `{{newVersion}}`, `{{oldVersion}}`, `{{packageName}}`

**Example:**

```typescript
export default defineConfig({
  templates: {
    commitMessage: 'chore(release): v{{newVersion}} [skip ci]',
    tagMessage: 'Release {{newVersion}}',
    tagBody: 'Version {{newVersion}}',
  },
})
```

#### `logLevel`

Control verbosity of command output.

**Type:** `'silent' | 'error' | 'warning' | 'normal' | 'default' | 'debug' | 'trace' | 'verbose'`

**Default:** `'default'`

See [Log Level](#log-level) section for details.

#### Inherited from Changelogen

The following options are inherited from [changelogen configuration](https://github.com/unjs/changelogen#configuration):

| Property         | Type                     | Default         | Description                               |
| ---------------- | ------------------------ | --------------- | ----------------------------------------- |
| `cwd`            | `string`                 | `process.cwd()` | Working directory                         |
| `from`           | `string`                 | Last git tag    | Start reference for changelog             |
| `to`             | `string`                 | `HEAD`          | End reference for changelog               |
| `excludeAuthors` | `string[]`               | `[]`            | List of authors to exclude from changelog |
| `noAuthors`      | `boolean`                | `false`         | Don't include authors in changelog        |
| `scopeMap`       | `Record<string, string>` | `{}`            | Map scopes to custom names                |

**Example:**

```typescript
export default defineConfig({
  cwd: process.cwd(),
  from: 'v1.0.0',
  to: 'HEAD',
  excludeAuthors: ['bot[bot]', 'dependabot'],
  noAuthors: false,
  scopeMap: {
    ui: 'User Interface',
    api: 'API',
  },
})
```

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

## 📁 Multiple Configuration Files

You can create multiple configuration files to manage different release workflows in your monorepo. This is useful when you have packages with different versioning strategies or release cadences.

### Use Cases

**Common scenarios for multiple configs:**

1. **Separate core packages from standalone utilities** - Core UI packages use `selective` mode together, while standalone utilities use `independent` mode
2. **Different release cadences** - Stable packages vs experimental packages
3. **Different registries** - Public npm vs private registry
4. **Different package groups** - Apps vs libraries vs tools

### How to Create Multiple Configs

Create multiple configuration files following this naming pattern: `<name>.config.<ext>`

**Example file structure:**

```
/
├── changelog.config.ts              # Main config (core packages)
├── changelog.standalone.config.ts   # Standalone utilities config
└── changelog.experimental.config.json # Experimental packages config
```

You can use any supported format (`.ts`, `.js`, `.json`, `.yaml`, etc.) for each config file.

### Example: Core UI Packages vs Standalone Utilities

This is a real-world example where you want to separate UI components (which should be released together) from standalone utilities (which can evolve independently).

**`changelog.config.ts`** - Core UI packages (selective mode):

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
  },
  monorepo: {
    versionMode: 'selective',
    packages: [
      'packages/lib',
      'packages/icons',
      'packages/themes',
      'packages/nuxt',
      'packages/translations',
    ],
  },
  templates: {
    commitMessage: 'chore(release): v{{newVersion}}',
  },
})
```

**`changelog.standalone.config.ts`** - Standalone utilities (independent mode):

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
  },
  monorepo: {
    versionMode: 'independent',
    packages: [
      'packages/utils',
      'packages/node',
      'packages/changelogen-monorepo',
      'packages/eslint-config',
    ],
  },
  templates: {
    commitMessage: 'chore(release): {{packageName}}@{{newVersion}}',
  },
  changelog: {
    rootChangelog: false, // No root changelog for independent packages
  },
})
```

### Usage with Multiple Configs

```bash
# Release core UI packages together (selective mode)
pnpm clm release --patch
# or explicitly
pnpm clm release --config changelog --patch

# Release standalone utilities independently
pnpm clm release --config changelog.standalone --patch

# You can also use different configs for different commands
pnpm clm bump --config changelog.standalone --minor
pnpm clm changelog --config changelog.standalone
pnpm clm publish --config changelog.standalone
```

### Example: Different Registries

**`changelog.config.ts`** - Public packages (npm registry):

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  monorepo: {
    versionMode: 'selective',
    packages: ['packages/public/*'],
  },
  publish: {
    registry: 'https://registry.npmjs.org',
    access: 'public',
  },
})
```

**`changelog.private.config.ts`** - Private packages (GitHub Packages):

```typescript
import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
  monorepo: {
    versionMode: 'independent',
    packages: ['packages/private/*'],
  },
  publish: {
    registry: 'https://npm.pkg.github.com',
    access: 'restricted',
  },
})
```

```bash
# Publish public packages to npm
pnpm clm publish

# Publish private packages to GitHub Packages
pnpm clm publish --config changelog.private
```

### Best Practices

1. **Use descriptive config names** - `changelog.standalone.config.ts` is better than `changelog.alt.config.ts`
2. **Document your workflow** - Add comments in your config files explaining the purpose
3. **Keep it simple** - Don't create too many configs unless necessary
4. **Version control** - Commit all config files to your repository
5. **CI/CD integration** - Use different configs in different CI jobs if needed

### Tips

- The default config is `changelog.config.<ext>` where c12 will auto-detect the extension (you don't need `--config` flag)
- Config files must follow the pattern `<name>.config.<ext>` (c12 requirement)
- Supported formats: `.ts`, `.js`, `.mjs`, `.cjs`, `.mts`, `.cts`, `.json`, `.jsonc`, `.json5`, `.yaml`, `.yml`, `.toml`
- All commands support the `--config` option
- You can combine `--config` with `--dry-run` to preview different workflows

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
  providerRelease,
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
  tag: 'beta',
})

// GitHub release
// Git provider is detected automatically but you can also specify it explicitly
await providerRelease({
  provider: 'github',
})

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
