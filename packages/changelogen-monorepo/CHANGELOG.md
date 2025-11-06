# Changelog

## v4.3.1-alpha.0...v4.3.1-alpha.0

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Refactor determineReleaseType for clarity and robustness ([fe96c826b](https://github.com/LouisMazel/maz-ui/commit/fe96c826b))
  - Extract separate functions for each scenario (stable/prerelease, release/prerelease types)
  - Improve prerelease downgrade validation with explicit error messages
  - Simplify main function logic with clear branching
  - Add detailed logging for better debugging
  - Handle all edge cases: version graduation, preid changes, force flag override

- **@maz-ui/changelogen-monorepo:** Add suffix option support for prerelease versions ([de0a2138e](https://github.com/LouisMazel/maz-ui/commit/de0a2138e))
  - Introduce suffix parameter for customizing prerelease identifiers
  - Allow flexibility in prerelease version naming conventions
  - Update configuration and version handling to support suffix parameter

- **@maz-ui/changelogen-monorepo:** Add git fetch before bumping packages ([37ceba828](https://github.com/LouisMazel/maz-ui/commit/37ceba828))

### 📖 Documentation

- **@maz-ui/changelogen-monorepo:** Add documentation about --suffix flag of release and bump commands ([333f15b93](https://github.com/LouisMazel/maz-ui/commit/333f15b93))

### 🧪 Tests

- **@maz-ui/changelogen-monorepo:** Add comprehensive tests for bumpPackageVersion and determineReleaseType ([b1ce4072a](https://github.com/LouisMazel/maz-ui/commit/b1ce4072a))
  - Add 82 tests for bumpPackageVersion covering all scenarios
  - Add 51 tests for determineReleaseType with complete edge case coverage
  - Follow Gherkin method (Given/When/Then) for test clarity
  - Test stable releases, prerelease types, version graduation, and edge cases

- **@maz-ui/changelogen-monorepo:** Add vitest configuration ([8cc8de601](https://github.com/LouisMazel/maz-ui/commit/8cc8de601))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.0...v4.3.0

### 🚀 Features

- **@maz-ui/changelogen-monorepo:** Remove and replace commands 'gitlab' and 'github' by 'provider-release' ([b79f0eb5](https://github.com/LouisMazel/maz-ui/commit/b79f0eb5))
- **@maz-ui/changelogen-monorepo:** Add 'yes' option to bump config to have a confirmation prompt to accept new versions ([259f9e4b](https://github.com/LouisMazel/maz-ui/commit/259f9e4b))
- **@maz-ui/changelogen-monorepo:** Add support for multiple configuration files ([3b067cc9](https://github.com/LouisMazel/maz-ui/commit/3b067cc9))

  This enables users to manage different release workflows using separate config files.
  Use --config flag to specify custom config name (e.g., --config changelog.standalone).
  Supports all c12 formats: .ts, .js, .json, .yaml, .toml, etc.

- **@maz-ui/changelogen-monorepo:** Add support for commit body in changelog ([b7df0a05](https://github.com/LouisMazel/maz-ui/commit/b7df0a05))

  Allows including commit body content in changelog entries for richer context.

- **@maz-ui/changelogen-monorepo:** Support prerelease graduation between different preids ([713ad8c7](https://github.com/LouisMazel/maz-ui/commit/713ad8c7))

  Allow bumping packages from one prerelease channel to another without new
  commits (e.g., alpha to beta). This enables better control over release
  workflows when transitioning between prerelease stages.

- **@maz-ui/changelogen-monorepo:** Remove and replace commands 'gitlab' and 'github' by 'provider-release' ([b1329137](https://github.com/LouisMazel/maz-ui/commit/b1329137))
- **@maz-ui/changelogen-monorepo:** Add 'yes' option to bump config to have a confirmation prompt to accept new versions ([d676f2f9](https://github.com/LouisMazel/maz-ui/commit/d676f2f9))
- **@maz-ui/changelogen-monorepo:** Add support for multiple configuration files ([0d2a2251](https://github.com/LouisMazel/maz-ui/commit/0d2a2251))

  This enables users to manage different release workflows using separate config files.
  Use --config flag to specify custom config name (e.g., --config changelog.standalone).
  Supports all c12 formats: .ts, .js, .json, .yaml, .toml, etc.

- **@maz-ui/changelogen-monorepo:** Add support for commit body in changelog ([64537ba4](https://github.com/LouisMazel/maz-ui/commit/64537ba4))

  Allows including commit body content in changelog entries for richer context.

- **@maz-ui/changelogen-monorepo:** Support prerelease graduation between different preids ([a3e553b9](https://github.com/LouisMazel/maz-ui/commit/a3e553b9))

  Allow bumping packages from one prerelease channel to another without new
  commits (e.g., alpha to beta). This enables better control over release
  workflows when transitioning between prerelease stages.

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Store fromTag during bump to fix empty changelogs ([2fde3763](https://github.com/LouisMazel/maz-ui/commit/2fde3763))

  Store fromTag in PackageInfo during bump and reuse it in GitHub/GitLab
  releases instead of calling resolveTags which returned from===to

- **@maz-ui/changelogen-monorepo:** Prevent version inlining by reading package.json at runtime ([ecb263c6](https://github.com/LouisMazel/maz-ui/commit/ecb263c6))

  Read package.json dynamically instead of import to prevent unbuild
  from inlining the version at build time

- **@maz-ui/changelogen-monorepo:** Sort tags by date instead of version refname ([e88ee503](https://github.com/LouisMazel/maz-ui/commit/e88ee503))
- **@maz-ui/changelogen-monorepo:** Improve error handling in version confirmation prompt ([cbdf5db3](https://github.com/LouisMazel/maz-ui/commit/cbdf5db3))
- **@maz-ui/changelogen-monorepo:** Improve fromTag resolution by using config template as fallback ([cbe31407](https://github.com/LouisMazel/maz-ui/commit/cbe31407))
- **@maz-ui/changelogen-monorepo:** Store fromTag during bump to fix empty changelogs ([3d836f77](https://github.com/LouisMazel/maz-ui/commit/3d836f77))

  Store fromTag in PackageInfo during bump and reuse it in GitHub/GitLab
  releases instead of calling resolveTags which returned from===to

- **@maz-ui/changelogen-monorepo:** Prevent version inlining by reading package.json at runtime ([0f4e5c0f](https://github.com/LouisMazel/maz-ui/commit/0f4e5c0f))

  Read package.json dynamically instead of import to prevent unbuild
  from inlining the version at build time

- **@maz-ui/changelogen-monorepo:** Sort tags by date instead of version refname ([7c2947b6](https://github.com/LouisMazel/maz-ui/commit/7c2947b6))
- **@maz-ui/changelogen-monorepo:** Improve error handling in version confirmation prompt ([d550a072](https://github.com/LouisMazel/maz-ui/commit/d550a072))
- **@maz-ui/changelogen-monorepo:** Improve fromTag resolution by using config template as fallback ([d5950e0c](https://github.com/LouisMazel/maz-ui/commit/d5950e0c))

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Introduce new options: buildCmd to build your packages before publishing and dependencyTypes to choose how depends package should be bump ([9c5ce827](https://github.com/LouisMazel/maz-ui/commit/9c5ce827))
- **@maz-ui/changelogen-monorepo:** Extract tag resolution logic into dedicated module ([2fecb674](https://github.com/LouisMazel/maz-ui/commit/2fecb674))

  Create new tags.ts module to centralize all tag resolution logic:
  - resolveTags() for unified tag resolution across all version modes
  - getLastRepoTag() for repository-level tag queries
  - getLastPackageTag() for package-specific tags in independent mode
  - getCurrentGitRef() implementation adapted for monorepo usage

- **@maz-ui/changelogen-monorepo:** Simplify git utilities after tags extraction ([ec547d8d](https://github.com/LouisMazel/maz-ui/commit/ec547d8d))

  Remove tag-related functions moved to tags.ts module

- **@maz-ui/changelogen-monorepo:** Add interactive confirmation prompt before version bump ([e5854340](https://github.com/LouisMazel/maz-ui/commit/e5854340))

  Add @inquirer/prompts dependency and implement confirmBump
  function with display helpers for all version modes

- **@maz-ui/changelogen-monorepo:** Add dependencyTypes option ([1030e52b](https://github.com/LouisMazel/maz-ui/commit/1030e52b))

  Allow users to configure which dependency types (dependencies,
  devDependencies, peerDependencies) trigger dependent package bumping

- **@maz-ui/changelogen-monorepo:** Unify provider commands under provider-release ([0a0959d9](https://github.com/LouisMazel/maz-ui/commit/0a0959d9))

  Move github.ts and gitlab.ts to core/ and create unified
  provider-release command replacing separate github/gitlab commands

- **@maz-ui/changelogen-monorepo:** Add default values to command function parameters ([f2f04187](https://github.com/LouisMazel/maz-ui/commit/f2f04187))
  - Make command function options optional with default empty object
  - Improves API flexibility for programmatic usage

- **@maz-ui/changelogen-monorepo:** Show dry run mode in bump prompt ([e9c29a10](https://github.com/LouisMazel/maz-ui/commit/e9c29a10))
- **@maz-ui/changelogen-monorepo:** Use prerelease type to bump when specified ([d47b4397](https://github.com/LouisMazel/maz-ui/commit/d47b4397))
- **@maz-ui/changelogen-monorepo:** Typo - replace files by packages ([b7afbae3](https://github.com/LouisMazel/maz-ui/commit/b7afbae3))
- **@maz-ui/changelogen-monorepo:** Introduce new options: buildCmd to build your packages before publishing and dependencyTypes to choose how depends package should be bump ([099197c1](https://github.com/LouisMazel/maz-ui/commit/099197c1))
- **@maz-ui/changelogen-monorepo:** Extract tag resolution logic into dedicated module ([189226f1](https://github.com/LouisMazel/maz-ui/commit/189226f1))

  Create new tags.ts module to centralize all tag resolution logic:
  - resolveTags() for unified tag resolution across all version modes
  - getLastRepoTag() for repository-level tag queries
  - getLastPackageTag() for package-specific tags in independent mode
  - getCurrentGitRef() implementation adapted for monorepo usage

- **@maz-ui/changelogen-monorepo:** Simplify git utilities after tags extraction ([43e876fc](https://github.com/LouisMazel/maz-ui/commit/43e876fc))

  Remove tag-related functions moved to tags.ts module

- **@maz-ui/changelogen-monorepo:** Add interactive confirmation prompt before version bump ([e1db15aa](https://github.com/LouisMazel/maz-ui/commit/e1db15aa))

  Add @inquirer/prompts dependency and implement confirmBump
  function with display helpers for all version modes

- **@maz-ui/changelogen-monorepo:** Add dependencyTypes option ([a1cf556c](https://github.com/LouisMazel/maz-ui/commit/a1cf556c))

  Allow users to configure which dependency types (dependencies,
  devDependencies, peerDependencies) trigger dependent package bumping

- **@maz-ui/changelogen-monorepo:** Unify provider commands under provider-release ([24b71cb8](https://github.com/LouisMazel/maz-ui/commit/24b71cb8))

  Move github.ts and gitlab.ts to core/ and create unified
  provider-release command replacing separate github/gitlab commands

- **@maz-ui/changelogen-monorepo:** Add default values to command function parameters ([20673a9d](https://github.com/LouisMazel/maz-ui/commit/20673a9d))
  - Make command function options optional with default empty object
  - Improves API flexibility for programmatic usage

- **@maz-ui/changelogen-monorepo:** Show dry run mode in bump prompt ([45d1f29b](https://github.com/LouisMazel/maz-ui/commit/45d1f29b))
- **@maz-ui/changelogen-monorepo:** Use prerelease type to bump when specified ([eacba536](https://github.com/LouisMazel/maz-ui/commit/eacba536))
- **@maz-ui/changelogen-monorepo:** Typo - replace files by packages ([fdef9005](https://github.com/LouisMazel/maz-ui/commit/fdef9005))

### 📖 Documentation

- **@maz-ui/changelogen-monorepo:** Improve readme about configuration ([45c78fc8](https://github.com/LouisMazel/maz-ui/commit/45c78fc8))
- **@maz-ui/changelogen-monorepo:** Add comprehensive guide for multiple configuration files ([24ad9699](https://github.com/LouisMazel/maz-ui/commit/24ad9699))

  Includes real-world examples for:
  - Separating core packages from standalone utilities
  - Managing different registries
  - Using different version modes per package group
    Documents all supported config formats by c12.

- **@maz-ui/changelogen-monorepo:** Restructure README with improved formatting and completeness ([950bf9e6](https://github.com/LouisMazel/maz-ui/commit/950bf9e6))
  - Restructure Configuration section with compact table format for better readability
  - Add Package Manager Support section documenting npm, yarn, pnpm, bun auto-detection
  - Document all missing CLI options (--yes, --build-cmd, --no-clean, --no-commit, --no-changelog)
  - Add new 'tokens' configuration section with environment variable documentation
  - Add 'Inherited from Changelogen' section for inherited configuration options
  - Improve overall organization and consistency of documentation
  - Maintain all existing information while improving presentation

- **@maz-ui/changelogen-monorepo:** Improve readme about configuration ([2670a876](https://github.com/LouisMazel/maz-ui/commit/2670a876))
- **@maz-ui/changelogen-monorepo:** Add comprehensive guide for multiple configuration files ([031a6adf](https://github.com/LouisMazel/maz-ui/commit/031a6adf))

  Includes real-world examples for:
  - Separating core packages from standalone utilities
  - Managing different registries
  - Using different version modes per package group
    Documents all supported config formats by c12.

- **@maz-ui/changelogen-monorepo:** Restructure README with improved formatting and completeness ([77673de3](https://github.com/LouisMazel/maz-ui/commit/77673de3))
  - Restructure Configuration section with compact table format for better readability
  - Add Package Manager Support section documenting npm, yarn, pnpm, bun auto-detection
  - Document all missing CLI options (--yes, --build-cmd, --no-clean, --no-commit, --no-changelog)
  - Add new 'tokens' configuration section with environment variable documentation
  - Add 'Inherited from Changelogen' section for inherited configuration options
  - Improve overall organization and consistency of documentation
  - Maintain all existing information while improving presentation

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.0-rc.3...v4.3.0-rc.3

No relevant changes since last release

## v4.3.0-rc.2...v4.3.0-rc.2

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Typo - replace files by packages ([b7afbae33](https://github.com/LouisMazel/maz-ui/commit/b7afbae33))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.0-rc.1...v4.3.0-rc.1

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Improve fromTag resolution by using config template as fallback ([cbe314071](https://github.com/LouisMazel/maz-ui/commit/cbe314071))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.0-beta.0...v4.3.0-rc.0

### 🚀 Features

- **@maz-ui/changelogen-monorepo:** Support prerelease graduation between different preids ([713ad8c74](https://github.com/LouisMazel/maz-ui/commit/713ad8c74))

  Allow bumping packages from one prerelease channel to another without new
  commits (e.g., alpha to beta). This enables better control over release
  workflows when transitioning between prerelease stages.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.0-alpha.0...v4.3.0-alpha.1

### 🚀 Features

- **@maz-ui/changelogen-monorepo:** Add support for commit body in changelog ([b7df0a054](https://github.com/LouisMazel/maz-ui/commit/b7df0a054))

  Allows including commit body content in changelog entries for richer context.

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Add default values to command function parameters ([f2f04187a](https://github.com/LouisMazel/maz-ui/commit/f2f04187a))
  - Make command function options optional with default empty object
  - Improves API flexibility for programmatic usage

- **@maz-ui/changelogen-monorepo:** Show dry run mode in bump prompt ([e9c29a106](https://github.com/LouisMazel/maz-ui/commit/e9c29a106))
- **@maz-ui/changelogen-monorepo:** Use prerelease type to bump when specified ([d47b43976](https://github.com/LouisMazel/maz-ui/commit/d47b43976))

### 📖 Documentation

- **@maz-ui/changelogen-monorepo:** Restructure README with improved formatting and completeness ([950bf9e65](https://github.com/LouisMazel/maz-ui/commit/950bf9e65))
  - Restructure Configuration section with compact table format for better readability
  - Add Package Manager Support section documenting npm, yarn, pnpm, bun auto-detection
  - Document all missing CLI options (--yes, --build-cmd, --no-clean, --no-commit, --no-changelog)
  - Add new 'tokens' configuration section with environment variable documentation
  - Add 'Inherited from Changelogen' section for inherited configuration options
  - Improve overall organization and consistency of documentation
  - Maintain all existing information while improving presentation

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1...v4.3.0-alpha.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1...v4.3.0-alpha.0)

### 🚀 Features

- **@maz-ui/changelogen-monorepo:** Remove and replace commands 'gitlab' and 'github' by 'provider-release' ([b79f0eb5d](https://github.com/LouisMazel/maz-ui/commit/b79f0eb5d))
- **@maz-ui/changelogen-monorepo:** Add 'yes' option to bump config to have a confirmation prompt to accept new versions ([259f9e4bd](https://github.com/LouisMazel/maz-ui/commit/259f9e4bd))
- **@maz-ui/changelogen-monorepo:** Add support for multiple configuration files ([3b067cc92](https://github.com/LouisMazel/maz-ui/commit/3b067cc92))

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Store fromTag during bump to fix empty changelogs ([2fde3763f](https://github.com/LouisMazel/maz-ui/commit/2fde3763f))
- **@maz-ui/changelogen-monorepo:** Prevent version inlining by reading package.json at runtime ([ecb263c69](https://github.com/LouisMazel/maz-ui/commit/ecb263c69))
- **@maz-ui/changelogen-monorepo:** Sort tags by date instead of version refname ([e88ee503f](https://github.com/LouisMazel/maz-ui/commit/e88ee503f))
- **@maz-ui/changelogen-monorepo:** Improve error handling in version confirmation prompt ([cbdf5db30](https://github.com/LouisMazel/maz-ui/commit/cbdf5db30))

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Introduce new options: buildCmd to build your packages before publishing and dependencyTypes to choose how depends package should be bump ([9c5ce8279](https://github.com/LouisMazel/maz-ui/commit/9c5ce8279))
- **@maz-ui/changelogen-monorepo:** Extract tag resolution logic into dedicated module ([2fecb674d](https://github.com/LouisMazel/maz-ui/commit/2fecb674d))
- **@maz-ui/changelogen-monorepo:** Simplify git utilities after tags extraction ([ec547d8d2](https://github.com/LouisMazel/maz-ui/commit/ec547d8d2))
- **@maz-ui/changelogen-monorepo:** Add interactive confirmation prompt before version bump ([e58543402](https://github.com/LouisMazel/maz-ui/commit/e58543402))
- **@maz-ui/changelogen-monorepo:** Add dependencyTypes option ([1030e52b7](https://github.com/LouisMazel/maz-ui/commit/1030e52b7))
- **@maz-ui/changelogen-monorepo:** Unify provider commands under provider-release ([0a0959d9a](https://github.com/LouisMazel/maz-ui/commit/0a0959d9a))

### 📖 Documentation

- **@maz-ui/changelogen-monorepo:** Improve readme about configuration ([45c78fc84](https://github.com/LouisMazel/maz-ui/commit/45c78fc84))
- **@maz-ui/changelogen-monorepo:** Add comprehensive guide for multiple configuration files ([24ad96997](https://github.com/LouisMazel/maz-ui/commit/24ad96997))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.0...v4.2.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.0...v4.2.1)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Add lerna to commit release only if lerna exists ([5061bd2a](https://github.com/LouisMazel/maz-ui/commit/5061bd2a))
- **@maz-ui/changelogen-monorepo:** Gitlab release - support of CI_JOB_TOKEN environment variable ([2dfc37c5](https://github.com/LouisMazel/maz-ui/commit/2dfc37c5))
- **@maz-ui/changelogen-monorepo:** Release - generate changelog only for bumped packages ([9ea17178](https://github.com/LouisMazel/maz-ui/commit/9ea17178))
- **@maz-ui/changelogen-monorepo:** Improvement getting last tag ([dd5350e5](https://github.com/LouisMazel/maz-ui/commit/dd5350e5))
- **@maz-ui/changelogen-monorepo:** Add all changelog files to release commit ([e6719346](https://github.com/LouisMazel/maz-ui/commit/e6719346))
- **@maz-ui/changelogen-monorepo:** Add all changelog files to release commit ([c8a11701](https://github.com/LouisMazel/maz-ui/commit/c8a11701))
- **@maz-ui/changelogen-monorepo:** Config should not override tokens ([aefdfb5c](https://github.com/LouisMazel/maz-ui/commit/aefdfb5c))
- **@maz-ui/changelogen-monorepo:** User config was not apply for boolean properties ([4a113789](https://github.com/LouisMazel/maz-ui/commit/4a113789))
- **@maz-ui/changelogen-monorepo:** Release bugs with independent mode ([32420452](https://github.com/LouisMazel/maz-ui/commit/32420452))
- **@maz-ui/changelogen-monorepo:** Independent mode ([1922e37f](https://github.com/LouisMazel/maz-ui/commit/1922e37f))
- **@maz-ui/changelogen-monorepo:** Path to node package ([02b764ff](https://github.com/LouisMazel/maz-ui/commit/02b764ff))
- **@maz-ui/changelogen-monorepo:** Selective mode - changelog generation ([1634a005](https://github.com/LouisMazel/maz-ui/commit/1634a005))

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Logging improvements ([37144a9b](https://github.com/LouisMazel/maz-ui/commit/37144a9b))
- **@maz-ui/changelogen-monorepo:** Build for node20 instead of node18 ([d442f65d](https://github.com/LouisMazel/maz-ui/commit/d442f65d))
- **@maz-ui/changelogen-monorepo:** Doc improvement ([63980fa5](https://github.com/LouisMazel/maz-ui/commit/63980fa5))
- **@maz-ui/changelogen-monorepo:** Doc improvement ([1836be19](https://github.com/LouisMazel/maz-ui/commit/1836be19))
- **@maz-ui/changelogen-monorepo:** Add log-level options ([dc4dac95](https://github.com/LouisMazel/maz-ui/commit/dc4dac95))
- **@maz-ui/changelogen-monorepo:** Logging flow improvements ([7cfafb28](https://github.com/LouisMazel/maz-ui/commit/7cfafb28))
- **@maz-ui/utils:** Add helper type 'DeepRequired' ([ed82b303](https://github.com/LouisMazel/maz-ui/commit/ed82b303))
- **@maz-ui/changelogen-monorepo:** Config loading improvements ([f67ddc6a](https://github.com/LouisMazel/maz-ui/commit/f67ddc6a))
- **@maz-ui/node:** Choose log level of execPromise ([491bf63e](https://github.com/LouisMazel/maz-ui/commit/491bf63e))
- **@maz-ui/changelogen-monorepo:** Change log level for getting packages ([8ffbfc12](https://github.com/LouisMazel/maz-ui/commit/8ffbfc12))
- **@maz-ui/changelogen-monorepo:** Disable success log for get tag command ([e356a3fb](https://github.com/LouisMazel/maz-ui/commit/e356a3fb))
- **@maz-ui/changelogen-monorepo:** Add option to force packages bump ([a019327f](https://github.com/LouisMazel/maz-ui/commit/a019327f))
- **@maz-ui/changelogen-monorepo:** Manage graduating versions ([3a0bc873](https://github.com/LouisMazel/maz-ui/commit/3a0bc873))
- **@maz-ui/changelogen-monorepo:** Add banner ([9f8d866f](https://github.com/LouisMazel/maz-ui/commit/9f8d866f))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-beta.0...v4.2.1-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.2)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** User config was not apply for boolean properties ([9658123bf](https://github.com/LouisMazel/maz-ui/commit/9658123bf))
- **@maz-ui/changelogen-monorepo:** Release bugs with independent mode ([b32af65f6](https://github.com/LouisMazel/maz-ui/commit/b32af65f6))
- **@maz-ui/changelogen-monorepo:** Independent mode ([050df0f46](https://github.com/LouisMazel/maz-ui/commit/050df0f46))
- **@maz-ui/changelogen-monorepo:** Path to node package ([24a934cb0](https://github.com/LouisMazel/maz-ui/commit/24a934cb0))
- **@maz-ui/changelogen-monorepo:** Selective mode - changelog generation ([748f5a19e](https://github.com/LouisMazel/maz-ui/commit/748f5a19e))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-beta.0...v4.2.1-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.1)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** User config was not apply for boolean properties ([9658123b](https://github.com/LouisMazel/maz-ui/commit/9658123b))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.16...v4.2.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.16...v4.2.1-beta.0)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Add banner ([b6eafacb](https://github.com/LouisMazel/maz-ui/commit/b6eafacb))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.15...v4.2.1-alpha.16

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.15...v4.2.1-alpha.16)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Manage graduating versions ([fee8d3479](https://github.com/LouisMazel/maz-ui/commit/fee8d3479))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.14...v4.2.1-alpha.14

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.14...v4.2.1-alpha.14)

No relevant changes for this release

## v4.2.1-alpha.13...v4.2.1-alpha.14

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.13...v4.2.1-alpha.14)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Config should not override tokens ([6d917587d](https://github.com/LouisMazel/maz-ui/commit/6d917587d))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.12...v4.2.1-alpha.13

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.12...v4.2.1-alpha.13)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Add option to force packages bump ([c347fb84a](https://github.com/LouisMazel/maz-ui/commit/c347fb84a))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.11...v4.2.1-alpha.12

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.11...v4.2.1-alpha.12)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Disable success log for get tag command ([7fcd3dde2](https://github.com/LouisMazel/maz-ui/commit/7fcd3dde2))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.10...v4.2.1-alpha.11

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.10...v4.2.1-alpha.11)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Change log level for getting packages ([2ecad195f](https://github.com/LouisMazel/maz-ui/commit/2ecad195f))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.9...v4.2.1-alpha.10

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.9...v4.2.1-alpha.10)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Logging flow improvements ([4b231b0c2](https://github.com/LouisMazel/maz-ui/commit/4b231b0c2))
- **@maz-ui/utils:** Add helper type 'DeepRequired' ([5c5b903e6](https://github.com/LouisMazel/maz-ui/commit/5c5b903e6))
- **@maz-ui/changelogen-monorepo:** Config loading improvements ([3d4e85bc9](https://github.com/LouisMazel/maz-ui/commit/3d4e85bc9))
- **@maz-ui/node:** Choose log level of execPromise ([ece81b276](https://github.com/LouisMazel/maz-ui/commit/ece81b276))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.8...v4.2.1-alpha.9

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.8...v4.2.1-alpha.9)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Add log-level options ([c3045e859](https://github.com/LouisMazel/maz-ui/commit/c3045e859))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.7...v4.2.1-alpha.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.7...v4.2.1-alpha.8)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Add all changelog files to release commit ([38e08a93a](https://github.com/LouisMazel/maz-ui/commit/38e08a93a))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.6...v4.2.1-alpha.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.6...v4.2.1-alpha.7)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Add all changelog files to release commit ([5f106d4f2](https://github.com/LouisMazel/maz-ui/commit/5f106d4f2))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.5...v4.2.1-alpha.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.5...v4.2.1-alpha.6)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Release - generate changelog only for bumped packages ([05d0f08f4](https://github.com/LouisMazel/maz-ui/commit/05d0f08f4))
- **@maz-ui/changelogen-monorepo:** Improvement getting last tag ([6f58b4375](https://github.com/LouisMazel/maz-ui/commit/6f58b4375))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.4...v4.2.1-alpha.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.4...v4.2.1-alpha.5)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Gitlab release - support of CI_JOB_TOKEN environment variable ([9a0e0d386](https://github.com/LouisMazel/maz-ui/commit/9a0e0d386))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.3...v4.2.1-alpha.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.3...v4.2.1-alpha.4)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Doc improvement ([da19900cd](https://github.com/LouisMazel/maz-ui/commit/da19900cd))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.2...v4.2.1-alpha.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.2...v4.2.1-alpha.3)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Add lerna to commit release only if lerna exists ([42bdecdb4](https://github.com/LouisMazel/maz-ui/commit/42bdecdb4))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.1...v4.2.1-alpha.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.1...v4.2.1-alpha.2)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Doc improvement ([b381d6b22](https://github.com/LouisMazel/maz-ui/commit/b381d6b22))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.0...v4.2.1-alpha.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.0...v4.2.1-alpha.1)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Build for node20 instead of node18 ([9d2af2387](https://github.com/LouisMazel/maz-ui/commit/9d2af2387))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.0...v4.2.1-alpha.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.0...v4.2.1-alpha.0)

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Logging improvements ([37144a9bc](https://github.com/LouisMazel/maz-ui/commit/37144a9bc))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.8...v4.2.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8...v4.2.0)

### 🚀 Features

- **@maz-ui/changelogen-monorepo:** New package to manage monorepo with changelogen ([656033a1](https://github.com/LouisMazel/maz-ui/commit/656033a1))
- **@maz-ui/changelogen-monorepo:** New package to manage monorepo with changelogen ([1ca707d7](https://github.com/LouisMazel/maz-ui/commit/1ca707d7))

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Publish command ([f714835f](https://github.com/LouisMazel/maz-ui/commit/f714835f))
- **@maz-ui/changelogen-monorepo:** Publish command ([c49fe967](https://github.com/LouisMazel/maz-ui/commit/c49fe967))
- **@maz-ui/changelogen-monorepo:** Detect package manager to publish on npm - fix #1356 ([#1356](https://github.com/LouisMazel/maz-ui/issues/1356))

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Bump improvements ([6cb2a706](https://github.com/LouisMazel/maz-ui/commit/6cb2a706))
- **@maz-ui/changelogen-monorepo:** Changelog generation improvements ([0f4e86fa](https://github.com/LouisMazel/maz-ui/commit/0f4e86fa))
- **@maz-ui/changelogen-monorepo:** Bump improvements ([229e2d8c](https://github.com/LouisMazel/maz-ui/commit/229e2d8c))
- **@maz-ui/changelogen-monorepo:** Changelog generation improvements ([73925ca4](https://github.com/LouisMazel/maz-ui/commit/73925ca4))
- **@maz-ui/changelogen-monorepo:** Publish tag improvements - tag is set 'next' when no tag option is provided to avoid publish mistake ([64636d58](https://github.com/LouisMazel/maz-ui/commit/64636d58))
- **@maz-ui/changelogen-monorepo:** Publish tag improvements ([a7bd4ca3](https://github.com/LouisMazel/maz-ui/commit/a7bd4ca3))
- **@maz-ui/changelogen-monorepo:** Use resolved config instead writing options object ([0c666439](https://github.com/LouisMazel/maz-ui/commit/0c666439))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.9-alpha.0...v4.1.9-alpha.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.9-alpha.0...v4.1.9-alpha.1)

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Detect package manager to publish on npm - fix #1356 ([#1356](https://github.com/LouisMazel/maz-ui/issues/1356))

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Publish tag improvements - tag is set 'next' when no tag option is provided to avoid publish mistake ([ff527f62c](https://github.com/LouisMazel/maz-ui/commit/ff527f62c))
- **@maz-ui/changelogen-monorepo:** Publish tag improvements ([f4bca9397](https://github.com/LouisMazel/maz-ui/commit/f4bca9397))
- **@maz-ui/changelogen-monorepo:** Use resolved config instead writing options object ([84afa58b7](https://github.com/LouisMazel/maz-ui/commit/84afa58b7))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.8-beta.4...v4.1.9-alpha.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.4...v4.1.9-alpha.0)

No relevant commits

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7...v4.1.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7...v4.1.8)

### 🚀 Features

- **@maz-ui/changelogen-monorepo:** New package to manage monorepo with changelogen ([656033a15](https://github.com/LouisMazel/maz-ui/commit/656033a15))

### 🩹 Fixes

- **@maz-ui/changelogen-monorepo:** Publish command ([f714835f7](https://github.com/LouisMazel/maz-ui/commit/f714835f7))

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Bump improvements ([6cb2a7063](https://github.com/LouisMazel/maz-ui/commit/6cb2a7063))
- **@maz-ui/changelogen-monorepo:** Changelog generation improvements ([0f4e86fa3](https://github.com/LouisMazel/maz-ui/commit/0f4e86fa3))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.8-beta.3...v4.1.8-beta.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.3...v4.1.8-beta.4)

### 🚀 Features

- **@maz-ui/changelogen-monorepo:** New package to manage monorepo with changelogen ([656033a1](https://github.com/LouisMazel/maz-ui/commit/656033a1))

### 💅 Refactors

- **@maz-ui/changelogen-monorepo:** Bump improvements ([6cb2a706](https://github.com/LouisMazel/maz-ui/commit/6cb2a706))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))
