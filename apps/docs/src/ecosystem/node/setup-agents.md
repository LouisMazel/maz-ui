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
- Generated rules edited by hand are kept and no longer updated (`skip`): their header records a checksum of the content, `paths:` frontmatter included. A formatter that only changes the whitespace does not count as an edit. Delete the file (or the `AGENTS.md` section) to get the rules of a new version.
- In `AGENTS.md`, only the delimited section is managed: your content stays as is.
- MCP config files are edited in place, keeping their formatting and comments. When a server already runs `@maz-ui/mcp` under another name, nothing is added.
- An existing entry of the maz-ui MCP server only gets a better command (the installed `@maz-ui/mcp`, a newer pinned version) and keeps its other fields (`env`...). A command written by hand (with `--docs`, for example) is never changed.
- In a monorepo, rules written by a newer maz-ui and a newer pinned `@maz-ui/mcp` are never downgraded by an app with an older version. Files are written atomically: apps started together never read a half-written file.
- The Claude rule is scoped with a `paths:` frontmatter, so that Claude Code only loads it when it reads or edits a file of the workspaces that depend on maz-ui (see [Scope of the Claude rule](#scope-of-the-claude-rule)), instead of at every session.
- Without `CLAUDE.md` in the project, Claude Code reads `AGENTS.md`: the Claude rule is then skipped to avoid loading the rules twice.
- Running it again is idempotent: unchanged files are reported as `unchanged`. A managed file is only rewritten when its rules change: after a release of the tool that keeps the same rules, it stays as is, its header keeps the version that last changed them.

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
  // Folder of the maz-ui agent docs, default: node_modules/maz-ui/agent-docs
  docsDir: undefined,
  // Version pinned in the npx command when the project does not install @maz-ui/mcp, default: latest
  mcpVersion: '5.1.0',
  // Command of the MCP server, default: mcpServerCommand(rootDir, mcpVersion, tool)
  mcpServer: undefined,
  // Scope of the Claude rule: 'auto' (default), 'all' (always loaded) or globs relative to rootDir
  paths: 'auto',
  // Tool whose agents are configured, default: MAZ_UI_AGENTS_TOOL
  tool: undefined,
  // Rules of the tool, required with another tool than maz-ui, default: the agent docs of docsDir
  agentDocs: undefined,
})
```

## Scope of the Claude rule

Without a `paths:` frontmatter, Claude Code loads a rule at every session, in every folder. `setupAgents` writes the frontmatter before the managed header (it must be the first thing of the file) and lists the globs in `result.claudeRulePaths`:

- `paths: 'auto'` (default): the workspaces of the monorepo (`pnpm-workspace.yaml`, or `workspaces` of `package.json`) whose `package.json` depends on one of the `packages` of the tool (`dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`), with the `ruleGlobs` of the tool inside each: `apps/pwa/**/*.{vue,ts,tsx,css,scss}`. A single package project, or a project where no dependency is found, gets the `ruleGlobs` of the tool for the whole project. A tool without `packages` is never scoped.
- `paths: 'all'`: no frontmatter, the rule is always loaded.
- `paths: ['apps/web/**', 'packages/ui/**']`: your globs, used as is.

The frontmatter is rewritten at every run from the project and the options, as long as the file was not edited: the checksum of the header covers the frontmatter and the rules, so an edit of either (your own `paths:`, an added rule) is detected and the file is kept. A rule written before the frontmatter existed, or with a checksum of the rules alone, is updated.

In `'auto'` mode:

- Workspaces excluded by a negated pattern (`!apps/legacy` in `pnpm-workspace.yaml` or `workspaces`) are left out, with the folders below them.
- The characters `[ ] { } ( ) * ? !` of a folder name are escaped in the globs.
- When the globs would expand to more than 1000 patterns (the budget of Claude Code for braces), the rule falls back to the `ruleGlobs` of the tool for the whole project.

## Use it for another tool

`setupAgents` configures maz-ui by default, but any package that ships an MCP server and rules for AI agents can reuse it with the `tool` option, and get the same guarantees. Its rules are passed with `agentDocs`, since they do not come from the maz-ui docs. For example, [relizy](https://relizy.dev) runs it in `relizy mcp init`:

```ts
import type { AgentsTool } from '@maz-ui/node'
import { setupAgents } from '@maz-ui/node'

const tool: AgentsTool = {
  // Key of the MCP server, `.claude/rules/relizy.md` and markers of the generated content
  name: 'relizy',
  // Package that ships the MCP server, and the bin and arguments that start it
  mcpPackage: 'relizy',
  mcpBin: 'relizy',
  mcpArgs: ['mcp'],
  // Written in the header of the generated rules
  generatedBy: '`relizy mcp init`',
  // Marker written in the header of the generated content, default: `Managed by relizy` (`Managed by <name>`)
  marker: 'Managed by relizy',
  // Line under the title of the rules, default: `> These rules match the installed relizy.`
  // Use `false` to write no note. Keep the version out of it: it would rewrite the rules at every release
  versionNote: () => '> These rules and the docs in `node_modules/relizy/agent-docs` match the installed relizy.',
  // Packages (or bins) of former MCP servers: an entry that references one of them is replaced by the entry of the tool, default: none
  legacyMcpPackages: ['relizy-legacy-mcp'],
  // Scope of the Claude rule: the workspaces that depend on these packages, and the files of the rule inside them
  packages: ['relizy'],
  ruleGlobs: ['relizy.config.*', '**/CHANGELOG.md'],
}

setupAgents({
  rootDir: process.cwd(),
  tool,
  agentDocs: {
    directory: '/path/to/relizy/agent-docs',
    version: '1.14.0',
    claudeRule: '# relizy\n\n...',
    agentsMdSection: '## relizy\n\n...',
  },
  mcpVersion: '1.14.0',
})
```

| Written for the tool | relizy | maz-ui (`MAZ_UI_AGENTS_TOOL`) |
| --- | --- | --- |
| Claude Code rule | `.claude/rules/relizy.md` | `.claude/rules/maz-ui.md` |
| `AGENTS.md` section | `<!-- BEGIN:relizy -->` ... `<!-- END:relizy -->` | `<!-- BEGIN:maz-ui -->` ... `<!-- END:maz-ui -->` |
| MCP server entry | `relizy` | `maz-ui` |
| Command, package installed with pnpm | `pnpm exec relizy mcp` | `pnpm exec maz-ui-mcp` |
| Command, package not installed | `npx -y relizy@<mcpVersion> mcp` | `npx -y @maz-ui/mcp@<mcpVersion>` |

Each tool only manages its own files, section and server entry: maz-ui and relizy can be set up in the same project, and removing one (`remove: true` with its `tool`) keeps the other. `mcpServerCommand`, `installsMcpPackage`, `readManagedVersion` and `isEditedManagedContent` also take the tool as last argument.

Set `marker` to keep recognizing files generated under a different marker than the name of the tool (e.g. `'Managed by @acme/mcp'` for a tool named `acme`): the header, the owned files and the version are all read from it. With `legacyMcpPackages`, an entry of the MCP config files (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`) that references a former package is replaced in place by the entry of the tool, only when the tool has no entry yet. `remove` never touches it.

## Lightweight entry

`@maz-ui/node/agents` exports `setupAgents` and its helpers without the rest of the package: it does not load `consola` nor `figlet` (logger and banner), and its types do not reference them. Use it in tools that only configure agents.

```ts
import { setupAgents } from '@maz-ui/node/agents'
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

`setupAgents` throws when the rules are requested and `maz-ui` is not installed in `rootDir` (or its parent folders), or when the installed version does not ship the agent docs: upgrade maz-ui to the latest version. With another `tool`, it throws when the rules are requested without `agentDocs`. With `rules: false`, only the MCP server is registered and the docs are not needed.
