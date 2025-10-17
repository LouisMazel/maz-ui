# Changelog

## 0.0.1 (2025-10-17)

### 🚀 Features

Initial release of `@maz-ui/changelogen-monorepo` - a changelogen adapter for monorepo management.

**Features:**
- Built on top of changelogen v0.6.2
- Monorepo support with package filtering
- Unified or independent versioning (like Lerna)
- Generate changelogs per package + root aggregate
- Pre-release support (alpha, beta, rc)
- GitHub release automation
- Commit filtering by scope and path

**Commands:**
- `clm bump` - Bump package versions
- `clm changelog` - Generate changelogs
- `clm release` - Complete release workflow
- `clm github` - Publish GitHub releases
