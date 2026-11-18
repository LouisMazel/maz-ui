---
title: Project helpers
description: Read a Node.js project - its package manager, the workspaces of a monorepo and the packages it installs - the way setupAgents does.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

These helpers power [`setupAgents`](./setup-agents.md), `npx @maz-ui/mcp init` and the Nuxt module. They never read the global folders (`NODE_PATH`, the home folder): every developer and the CI get the same result.

```ts
import { detectPackageManager, findProjectPackage, findWorkspaceDirs, readPackageVersion } from '@maz-ui/node'
```

They are also exported by the lightweight entry `@maz-ui/node/agents`.

## detectPackageManager

```ts
detectPackageManager(process.cwd()) // 'pnpm'
```

Returns `'pnpm'`, `'yarn'`, `'bun'` or `'npm'`: the `packageManager` field of `package.json`, else the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `bun.lockb`), else `'npm'`.

## findWorkspaceDirs

```ts
findWorkspaceDirs(process.cwd()) // ['/repo/apps/docs', '/repo/packages/ui']
```

Absolute paths of the workspaces of a monorepo, in the order of the patterns: the `packages` of `pnpm-workspace.yaml`, else the `workspaces` of `package.json` (npm, yarn, bun), else `apps/*` and `packages/*`. Negated patterns are ignored, `node_modules` and hidden folders are never explored, and a `**` pattern is explored 3 levels below its fixed part.

## findProjectPackage

```ts
findProjectPackage(process.cwd(), 'maz-ui') // '/repo/node_modules/maz-ui'
```

Folder of a package installed in the project: in the `node_modules` of the root and of each workspace (monorepos without hoisting), then in the parent folders. `undefined` when it is not installed.

## readPackageVersion

```ts
readPackageVersion('/repo/node_modules/maz-ui') // '5.7.0'
```

Version from the `package.json` of a package folder, `undefined` without `package.json`.
