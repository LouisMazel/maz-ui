---
title: '@maz-ui/upgrade'
description: CLI that rewrites a project from Maz-UI v4 to v5 (imports, props, CSS, config, dependencies) before the manual steps of the migration guide.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Run it once at the start of the migration to clear the mechanical changes, then follow the [migration guide](../guide/migration-v5.md) for the items that need a human eye.

## Usage

```bash
# Preview the rewrites without touching anything
npx @maz-ui/upgrade ./ --dry-run

# Apply when the diff looks good
npx @maz-ui/upgrade ./
```

In a monorepo, point at the app: `npx @maz-ui/upgrade ./apps/web --dry-run`. At least one path is required.

It walks `.vue`, stylesheets, `.ts`, `.js` and every `package.json` of the given paths, respects the `.gitignore`, and writes the result in place.

## Options

| Flag | Description |
| --- | --- |
| `-n`, `--dry-run` | Print every file that would change without writing it |
| `--only=<groups>` | Comma-separated transform groups to run: `imports`, `props`, `css`, `config`, `deps` (default: all) |
| `--no-gitignore` | Do not respect the `.gitignore` of the project |
| `--no-install` | Do not run the package manager after rewriting the `package.json` files |
| `-h`, `--help` | Print the help |
| `-v`, `--version` | Print the version |

## Transform groups

- `imports`: renames the CSS subpaths (`maz-ui/styles` to `maz-ui/style.css`) and moves the root imports.
- `props`: rewrites renamed props, values and class names of the maz-ui components (`MazIcon`, `MazBadge`, `MazPullToRefresh`...).
- `css`: renames the CSS variables (`--maz-background` to `--maz-surface`, `--maz-border` to `--maz-divider`) and collapses `hsl(var(...))`.
- `config`: rewrites the plugin, Nuxt module and theme preset options (`strategy: 'hybrid'`, removed critical CSS options...).
- `deps`: bumps `maz-ui` and every `@maz-ui/*` dependency of the `package.json` files to `^5.0.0`, then runs the install.

Re-running the tool on migrated code is a no-op, except for the `MazAvatar` size rewrite: run it once, on v4 code.

The full reference (every rewrite, exit codes, programmatic API) is in the [README of the package](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade#readme).
