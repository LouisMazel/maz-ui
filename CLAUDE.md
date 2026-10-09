# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Maz UI is a comprehensive Vue 3/Nuxt 3 component library featuring 50+ UI components, composables, directives, and utilities. It's built as a monorepo using NX and pnpm workspaces.

## Development Commands

### Main Commands

- `pnpm install` - Install dependencies (required pnpm)
- `pnpm health` - Run full CI pipeline (lint, typecheck, test, build packages, build docs)
- `pnpm build:packages` - Build all library packages
- `pnpm build:apps` - Build demo applications (docs, nuxt-app, vue-app)
- `pnpm lint:all` - Lint all packages
- `pnpm lint:fix:all` - Auto-fix lint issues across all packages
- `pnpm typecheck:all` - Type check all packages
- `pnpm test:unit:all` - Run unit tests across all packages
- `pnpm test:unit:coverage:all` - Run tests with coverage

### Package-Specific Commands

Within individual packages (e.g., `packages/lib/`):

- `pnpm build` - Build the package (includes typecheck)
- `pnpm lint` - Lint JavaScript and styles
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm test:unit` - Run unit tests
- `pnpm test:unit:watch` - Run tests in watch mode
- `pnpm test:unit:coverage` - Run tests with coverage
- `pnpm typecheck` - Type check with vue-tsc

### NX Commands

- `pnpm nx:cache:clear` - Clear NX cache

### Cleanup

- `make clean` - Clean all generated files (node_modules, dist, coverage, etc.)

## Architecture

### Monorepo Structure

- `packages/lib/` - Main Maz UI library (Vue components, composables, directives)
- `packages/icons/` - Icon package (@maz-ui/icons) based on Heroicons
- `packages/themes/` - Theme management package (@maz-ui/themes)
- `packages/translations/` - i18n support package (@maz-ui/translations)
- `packages/utils/` - Utility functions package (@maz-ui/utils)
- `packages/eslint-config/` - Shared ESLint configuration
- `packages/maz-cli/` - CLI tool for theme generation
- `packages/nuxt/` - Nuxt 3 module (@maz-ui/nuxt)
- `packages/node/` - Node.js utilities
- `apps/docs/` - Documentation site
- `apps/vue-app/` - Vue 3 demo application
- `apps/nuxt-app/` - Nuxt 3 demo application
- `tools/cli/` - Internal CLI tools

### Main Library Structure (`packages/lib/src/`)

- `components/` - Vue 3 components with TypeScript props and emit definitions
- `composables/` - Reusable composition functions (e.g., useFormValidator, useToast)
- `directives/` - Vue directives (vClickOutside, vTooltip, vLazyImg, etc.)
- `plugins/` - Vue plugins (toast, dialog, AOS animations, wait overlay)
- `resolvers/` - Auto-import resolvers for bundlers
- `css/` - Base CSS styles and animations
- `tailwindcss/` - TailwindCSS integration and utilities

### Component Architecture

- Each component is a single `.vue` file with TypeScript `<script setup>` syntax
- Components export props interfaces as `ComponentNameProps`
- Complex components have dedicated subdirectories (e.g., `MazDatePicker/`, `MazInputPhoneNumber/`)
- All components support theming via CSS custom properties
- Components follow a consistent size/color system (`MazSize`, `MazColor` types)

### Testing

- Uses Vitest with Vue Test Utils and jsdom
- Tests located in `packages/lib/tests/specs/`
- Coverage configured to exclude certain files (types, index files, some composables)
- Global test setup in `tests/vitest-global.setup.ts`

## Important Notes

### Code Style

- Uses @maz-ui/eslint-config (custom ESLint configuration)
- Enforces TypeScript strict mode
- Uses SonarJS rules for code quality
- Auto-formatting with ESLint formatters
- Stylelint for CSS/SCSS/Vue styles

### Build System

- Uses Vite for building with custom plugins
- Components are individually exportable (tree-shakeable)
- CSS is extracted and processed with PostCSS
- Icons are dynamically generated from SVG files
- Supports both ESM and CommonJS outputs

### Branch Strategy

- Main branch: `master`
- Current working branch: `fix/beta`
- Allowed version branches: `master`, `develop`, `release/*`, `fix/*`

### Dependencies

- Vue 3.5+ and Vue Router 4+ (peer dependencies)
- Chart.js for MazChart component
- libphonenumber-js for phone number validation
- dayjs for date handling
- TailwindCSS for styling utilities
- Valibot for form validation

## Unit Testing Guidelines

### Test Writing Rules

- Unit tests must always:
- Be written in English
- Have no comments
- Respect TypeScript and ESLint rules
- Use the Gherkin method (Given / When / Then): Given and When should each be in a separate describe block and "Then" block must be inside an "it" block, not a "describe" block
- Utility functions from vitest do not need to be imported
- Do not use conditional language in test descriptions (no "should", "must", etc.)

### Coverage Requirements

- **ALWAYS run `pnpm test:unit:coverage` (or `CI=1 pnpm vitest run --coverage` from `packages/lib`) before opening a PR that touches `packages/lib/src/**`**. Plain `pnpm test:unit` does not enforce the thresholds.
- The coverage thresholds are defined in `packages/lib/vitest.config.ts`. They are enforced in CI (`CI=1` disables `autoUpdate`). A run that drops below any threshold fails.
- New code must keep the global thresholds for **statements / branches / functions / lines** green. Per-file 100% is not enough — adding many covered functions can still shift the global ratio.
- `autoUpdate` only **raises** thresholds locally — it never lowers them. If a real coverage drift forces the threshold down, update `vitest.config.ts` manually and commit it with the PR.
