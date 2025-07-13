# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Maz UI is a monorepo containing a comprehensive component library for Vue 3 & Nuxt 3, built with TypeScript and managed with Lerna and pnpm workspaces. The main entry point is a TypeScript library that provides UI components, composables, directives, plugins, and utilities.

## Package Structure

- **packages/lib** (`maz-ui`) - Core component library with Vue components, composables, directives, and plugins
- **packages/icons** (`@maz-ui/icons`) - SVG icon library based on Heroicons
- **packages/nuxt-module** (`@maz-ui/nuxt`) - Nuxt 3 module for auto-imports and SSR support
- **packages/themes** (`@maz-ui/themes`) - Theme system with CSS variable generation
- **packages/translations** (`@maz-ui/translations`) - i18n translations for components
- **packages/utils** (`@maz-ui/utils`) - Utility functions and TypeScript helpers
- **packages/maz-cli** (`@maz-ui/cli`) - CLI tool for theme generation
- **apps/docs** - VitePress documentation site (<https://maz-ui.com>)
- **apps/vue-app** - Vue 3 demo/test application
- **apps/nuxt-app** - Nuxt 3 demo/test application
- **tools/cli** - Internal CLI tools for development

## Development Commands

### Root Level Commands

- `pnpm build:packages` - Build all packages
- `pnpm build:apps` - Build all applications
- `pnpm lint:all` - Lint all packages
- `pnpm lint:fix:all` - Lint and fix all packages
- `pnpm typecheck:all` - Type check all packages
- `pnpm test:unit:all` - Run unit tests for all packages
- `pnpm test:unit:coverage:all` - Run tests with coverage
- `pnpm healthcheck` - Complete build, lint, test, and typecheck pipeline

### Core Library (packages/lib)

- `pnpm build` - Build the library (includes typecheck)
- `pnpm build:dev` - Build in watch mode for development
- `pnpm test:unit` - Run Vitest tests
- `pnpm test:unit:watch` - Run tests in watch mode
- `pnpm test:unit:coverage` - Run tests with coverage
- `pnpm lint` - Run ESLint and Stylelint
- `pnpm typecheck` - Run Vue TypeScript checking

### Lerna Commands

- `pnpm lerna:version` - Version packages using conventional commits
- `pnpm lerna:publish` - Publish to npm
- `pnpm lerna:status` - Show changed packages

## Code Architecture

### Component Library Structure

The main library (`packages/lib/src/`) is organized as:

- **components/** - Vue 3 components using Composition API with TypeScript
- **composables/** - Reusable composition functions
- **directives/** - Vue directives (click-outside, tooltip, lazy-img, etc.)
- **plugins/** - Vue plugins (toast, dialog, AOS, wait)
- **resolvers/** - Auto-import resolvers for bundlers
- **tailwindcss/** - Tailwind CSS configuration and utilities
- **css/** - Base CSS styles and animations

### Build System

- **Vite** for building with tree-shaking optimization
- **TypeScript** strict mode enabled
- **ESM** format only with individual module exports
- **CSS** processed with Lightning CSS and PostCSS
- **Auto-generated** type definitions with vite-plugin-dts

### Component Patterns

- All components use Vue 3 Composition API with `<script setup>`
- Props and emits are strictly typed with TypeScript interfaces
- Components follow PascalCase naming (MazBtn, MazInput, etc.)
- Styling uses Tailwind CSS with CSS variables for theming
- Form components integrate with `useFormValidator` composable

### Testing

- **Vitest** for unit testing with JSDOM environment
- Tests use Gherkin-style (Given/When/Then) without conditional descriptions
- Test files located in `packages/lib/tests/specs/`
- Coverage reporting with v8 provider

### Styling and Theming

- **Tailwind CSS** as the primary styling system
- **CSS variables** for dynamic theming
- **@maz-ui/themes** package provides preset themes
- **@maz-ui/cli** generates custom theme CSS variables
- Dark mode support built-in

### Auto-imports and Resolvers

- **unplugin-vue-components** and **unplugin-auto-import** resolvers provided
- **Nuxt module** automatically configures auto-imports
- Components, composables, and directives are tree-shakeable

## Development Guidelines

### Code Standards

- TypeScript strict mode - no `any` types allowed
- Vue 3 Composition API preferred over Options API
- PascalCase for components, camelCase for functions/variables
- JSDoc comments for public APIs only
- English language for all code and documentation

### Component Development

- Always type props with interfaces
- Use `defineEmits` for event typing
- Include proper TypeScript generics for reusable components
- Follow existing component patterns and naming conventions
- Ensure accessibility (ARIA labels, keyboard navigation)

### Build and Quality

- Run `pnpm typecheck` before committing
- Run `pnpm lint:fix` to ensure code quality
- Run `pnpm test:unit` to verify tests pass
- Use `pnpm healthcheck` for complete validation before releases

### Monorepo Dependencies

- Use `workspace:*` for internal package dependencies
- External dependencies defined in each package's package.json
- Shared dev dependencies in root package.json
- Peer dependencies for Vue, Nuxt, and bundler integrations
