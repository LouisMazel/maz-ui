# Migration to Lerna

This project has migrated from Changesets to Lerna for version and publication management.

## Configuration

### Fixed-Version Mode

All packages share the same version (currently `4.0.0-alpha.5`), configured in `lerna.json`.

### Conventional Commits

Lerna uses conventional commits to automatically determine versions (patch/minor/major).

## Available Scripts

### Version Management

```bash
# Create a new version (manual)
pnpm lerna:version

# Create an alpha version
pnpm lerna:version:alpha

# Create a beta version
pnpm lerna:version:beta

# Graduate pre-releases to stable
pnpm lerna:version:graduate
```

### Publication

```bash
# Publish to npm (latest)
pnpm lerna:publish

# Publish in alpha
pnpm lerna:publish:alpha

# Publish in beta
pnpm lerna:publish:beta
```

### Utilities

```bash
# View modified packages
pnpm lerna:status

# View differences
pnpm lerna:diff

# Generate changelogs
pnpm generate:changelogs
```

## GitHub Actions Workflows

### Release Beta (develop)

- **Trigger**: Push to `develop`
- **Action**: Creates a beta version and publishes with `beta` tag
- **Dist-tag**: `beta`

### Release Latest (master)

- **Trigger**: Push to `master`
- **Action**: Graduates pre-releases to stable and publishes
- **Dist-tag**: `latest`

## Required Secrets

Configure these secrets in your GitHub repository:

- `NPM_TOKEN`: npm authentication token
- `GITHUB_TOKEN`: GitHub token (automatically provided)

## Manual Workflow

### For a beta release

```bash
# 1. Make your commits with conventional commits
git commit -m "feat(maz-ui): new feature"

# 2. Create the beta version
pnpm lerna:version:beta

# 3. Publish
pnpm lerna:publish:beta

# 4. Push the tags
git push --follow-tags
```

### For a latest release

```bash
# 1. Graduate to stable
pnpm lerna:version:graduate

# 2. Publish
pnpm lerna:publish

# 3. Generate changelogs
pnpm generate:changelogs
```

## Changelogs

### Automatic

- A global changelog is generated at the root
- Each package has its own changelog
- Uses conventional-changelog with the conventionalcommits preset

### Manual generation

```bash
pnpm generate:changelogs
```

## Migration from Changesets

✅ **Completed**:

- Lerna configuration installed
- package.json scripts migrated
- GitHub Actions workflows created
- Changelog generation script
- Changesets configuration removed

## Affected Packages

All packages in the fixed group share the same version:

- `maz-ui`
- `@maz-ui/icons`
- `@maz-ui/nuxt`
- `@maz-ui/themes`
- `@maz-ui/eslint-config`
- `@maz-ui/cli`
- `@maz-ui/utils`
- `@maz-ui/translations`

## Nx Optimizations

### Optimized Scripts with Cache

Lerna v6+ uses Nx under the hood for powerful optimizations:

```bash
# Build with cache and parallelization
pnpm build:packages

# Lint with cache
pnpm lint

# Tests with cache
pnpm test:unit

# Typecheck with cache
pnpm typecheck
```

### Advanced Nx Commands

```bash
# Display dependency graph
pnpm nx:graph

# Build only modified packages
pnpm nx:affected:build

# Test only modified packages
pnpm nx:affected:test

# Lint only modified packages
pnpm nx:affected:lint

# Clear cache
pnpm nx:cache:clear

# Development mode with watch
pnpm dev:watch
```

### Benefits of Optimizations

- **🚀 Cache**: Results are cached, ~5x acceleration
- **⚡ Parallelization**: Simultaneous execution of independent tasks
- **📊 Graph**: Automatic respect of dependencies between packages
- **🎯 Incremental**: Only modified packages are re-built
- **💾 Persistence**: Shared cache between developers (optional)

## Important Notes

1. **Conventional Commits**: Follow the convention for auto-versioning
2. **Fixed Mode**: All packages use the same version
3. **Pre-releases**: Use alpha/beta for development versions
4. **Changelogs**: Generated automatically during releases
5. **Nx Cache**: The `.nx/cache` folder is automatically ignored by Git
