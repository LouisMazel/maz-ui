---
title: setupAgents
description: Configure the AI coding agents of a project for maz-ui - version-matched rules for Claude Code and AGENTS.md, and the maz-ui MCP server in the agent configs - without touching the files you own.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`setupAgents` is the engine of [`npx @maz-ui/mcp init`](./../mcp.md) and of the `agents` option of the [Nuxt module](./../nuxt.md#ai-agents). Use it directly to integrate the setup in your own tooling (a project generator, a postinstall script...). See the [AI agents guide](./../../guide/ai-agents.md) for what it brings to your agents.

## Quick start

```ts
import { setupAgents } from '@maz-ui/node'

const { changes } = setupAgents({ rootDir: process.cwd() })

for (const change of changes) {
  console.log(change.action, change.file)
}
```

## What it writes

The content comes from the `docs/agents` folder of the `maz-ui` package installed in `rootDir`, so the rules always match the installed version.

| Target | Files |
| --- | --- |
| `claude` | `.claude/rules/maz-ui.md` (a Claude Code rule, loaded on top of your `CLAUDE.md`) and the `maz-ui` server in `.mcp.json` |
| `agents-md` | A section between `<!-- BEGIN:maz-ui -->` and `<!-- END:maz-ui -->` in `AGENTS.md` (Codex, Cursor, Copilot, Windsurf, Zed...) |
| `cursor` | The `maz-ui` server in `.cursor/mcp.json` |
| `vscode` | The `maz-ui` server in `.vscode/mcp.json` (GitHub Copilot) |

Guarantees:

- A file it did not generate is never overwritten (it is reported as `skip`).
- Generated rules edited by hand are kept and no longer updated (`skip`): their header records a checksum of the content. A formatter that only changes the whitespace does not count as an edit. Delete the file (or the `AGENTS.md` section) to get the rules of a new version.
- In `AGENTS.md`, only the delimited section is managed: your content stays as is.
- MCP config files are edited in place, keeping their formatting and comments. When a server already runs `@maz-ui/mcp` under another name, nothing is added.
- An existing entry of the maz-ui MCP server only gets a better command (the installed `@maz-ui/mcp`, a newer pinned version) and keeps its other fields (`env`...). A command written by hand (with `--docs`, for example) is never changed.
- In a monorepo, rules written by a newer maz-ui and a newer pinned `@maz-ui/mcp` are never downgraded by an app with an older version. Files are written atomically: apps started together never read a half-written file.
- Without `CLAUDE.md` in the project, Claude Code reads `AGENTS.md`: the Claude rule is then skipped to avoid loading the rules twice.
- Running it again is idempotent: unchanged files are reported as `unchanged`.

## Options

```ts
import { setupAgents } from '@maz-ui/node'

setupAgents({
  rootDir: process.cwd(),
  // Agents to configure, default: the agents detected in the project
  targets: ['claude', 'agents-md', 'cursor', 'vscode'],
  // Write the rules (Claude Code rule, AGENTS.md section), default: true
  rules: true,
  // Register the maz-ui MCP server, default: true
  mcp: true,
  // Compute the changes without writing anything
  dryRun: false,
  // Remove everything setupAgents added
  remove: false,
  // Folder of the maz-ui agent docs, default: node_modules/maz-ui/docs
  docsDir: undefined,
  // Version pinned in the npx command when the project does not install @maz-ui/mcp, default: latest
  mcpVersion: '5.1.0',
  // Command of the MCP server, default: mcpServerCommand(rootDir, mcpVersion)
  mcpServer: undefined,
})
```

## Command of the MCP server

```ts
import { mcpServerCommand } from '@maz-ui/node'

mcpServerCommand(process.cwd(), '5.1.0')
```

| Project | Command |
| --- | --- |
| Installs `@maz-ui/mcp` with pnpm | `pnpm exec maz-ui-mcp` |
| Installs `@maz-ui/mcp` with yarn | `yarn run maz-ui-mcp` |
| Installs `@maz-ui/mcp` with bun | `bun x --no-install maz-ui-mcp` |
| Installs `@maz-ui/mcp` with npm | `npx --no-install maz-ui-mcp` |
| Does not install it | `npx -y @maz-ui/mcp@<mcpVersion>` |

The package manager comes from the `packageManager` field of `package.json`, else from the lockfile. The installed version starts in about a second and follows the lockfile. A pinned version avoids the registry query that `npx` makes at every start with a dist-tag (`@latest`).

## Result

```ts
import { setupAgents } from '@maz-ui/node'

const result = setupAgents({ rootDir: process.cwd(), dryRun: true })

result.version // version of the installed maz-ui
result.targets // configured agents
result.mcpServer // { command, args } registered in the MCP configs
result.localMcpServer // false when the server runs through npx -y
result.changes // [{ file: '.mcp.json', action: 'create' | 'update' | 'remove' | 'unchanged' | 'skip', reason?: string }]
```

## Detecting the agents

```ts
import { detectAgentTargets } from '@maz-ui/node'

detectAgentTargets(process.cwd()) // ['claude', 'agents-md']
```

| Target | Detected from |
| --- | --- |
| `claude` | `.claude/`, `CLAUDE.md`, `CLAUDE.local.md`, `.mcp.json` |
| `cursor` | `.cursor/`, `.cursorrules` |
| `vscode` | `.vscode/mcp.json`, `.github/copilot-instructions.md`, `.github/instructions/` |
| `agents-md` | `AGENTS.md`, `GEMINI.md`, `.codex/`, `.windsurf/`, `.devin/`, `.windsurfrules`, or any of `cursor` and `vscode` |

## Errors

`setupAgents` throws when the rules are requested and `maz-ui` is not installed in `rootDir` (or its parent folders), or when the installed version does not ship the agent docs: upgrade maz-ui to the latest version. With `rules: false`, only the MCP server is registered and the docs are not needed.
