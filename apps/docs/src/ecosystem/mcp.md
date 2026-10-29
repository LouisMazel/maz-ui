---
title: MCP server
description: The maz-ui MCP server gives AI coding agents the version-matched knowledge of maz-ui and its ecosystem - search by need, exact component APIs, icons, Tailwind theme tokens, setup guides and code review.
head:
  - - meta
    - name: keywords
      content: mcp, model context protocol, ai agents, claude code, cursor, copilot, codex, windsurf, maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/mcp" />

::: tip Start with `npx @maz-ui/mcp init`
It registers the server and writes the maz-ui rules for the agents of your project. See [AI agents](./../guide/ai-agents.md) for the complete picture (rules, version-matched docs, Claude Code plugin, code review in CI).
:::

## Tools

| Tool | Purpose |
| --- | --- |
| `search_docs` | Find what maz-ui provides for a need, described in plain words ("user avatar with initials", "confirm before delete", "debounce search") or by name. Understands the vocabulary of other libraries ("modal", "snackbar", "combobox") |
| `get_component_api` | Exact API of up to 10 components: props with types, defaults and accepted values, `v-model`, events with payload, slots with bindings, exposed methods |
| `find_icons` | Icons of `@maz-ui/icons` by meaning ("delete", "settings", "france flag") with their imports |
| `get_theme_tokens` | The theme of your project (preset values, `@theme` tokens, variants, utilities, read from your files) and every Tailwind class and CSS variable of the maz-ui theme: colors, radius, shadows, spacing, breakpoints, fonts, z-index, utilities |
| `get_doc` | Any documentation page by id or name (`components/maz-btn`, `useToast`, `guide/tailwind`), whole or by sections |
| `list_docs` | Catalog of the components, composables, directives, plugins, helpers, packages and guides |
| `get_setup_guide` | Installation steps for Vue or Nuxt, with or without Tailwind |
| `review_code` | Review files or code against the installed maz-ui: unknown props or values, unknown icons, native elements and libraries maz-ui already covers, default Tailwind palette, `maz:` prefix... |

Every tool is read-only. The server also gives agents instructions on when to use them, so they look maz-ui up before writing code.

### Prompts

| Prompt | Purpose |
| --- | --- |
| `build` | Implement a feature with the maz-ui ecosystem (search, APIs, icons, tokens, review) |
| `audit` | Find and fix what re-implements maz-ui in existing files |
| `setup` | Install and configure maz-ui in the project |

In Claude Code, they are available as `/maz-ui:build`, `/maz-ui:audit` and `/maz-ui:setup`.

## Version-matched docs

The server serves the documentation of the **maz-ui version installed in your project** (`node_modules/maz-ui/docs`), found from the directory it is started in (monorepos: the root, then the workspaces of `pnpm-workspace.yaml` or of the `workspaces` field of `package.json`, `apps/*` and `packages/*` by default). Without maz-ui installed, it serves the docs bundled with `@maz-ui/mcp` (latest release).

To force a folder, pass `--docs <dir>` or set `MAZ_UI_DOCS_DIR`.

In a monorepo whose apps install different maz-ui versions, the first maz-ui found wins: an agent working on one app can get the docs of another app. Align the versions, or choose the app whose docs are served:

```json
{
  "mcpServers": {
    "maz-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@maz-ui/mcp@latest", "--docs", "apps/web/node_modules/maz-ui/docs"]
    }
  }
}
```

## Configuration

`npx @maz-ui/mcp init` writes the configuration of Claude Code, Cursor and VS Code for you.

### In a project: install it

Install `@maz-ui/mcp` as a dev dependency of the project root, then run `init`:

```bash
pnpm add -D @maz-ui/mcp
pnpm exec maz-ui-mcp init
```

The MCP configs then start the installed version through your package manager (`pnpm exec maz-ui-mcp`, `yarn run maz-ui-mcp`, `npx --no-install maz-ui-mcp`...): it starts in about a second, needs no download and follows your lockfile. Without it, `init` writes `npx -y @maz-ui/mcp@<version>`, pinned to its own version.

### By hand

The examples below use `npx -y @maz-ui/mcp@latest`, which works without installing anything. In a project, prefer the installed version (`pnpm exec maz-ui-mcp`) or a pinned version (`@maz-ui/mcp@5.1.0`): with a dist-tag, `npx` queries the registry at every start.

### Claude Code

```bash
# for every project, without any file in them
claude mcp add maz-ui --scope user -- npx -y @maz-ui/mcp@latest
# or for this project only (written in .mcp.json, shared with your team)
claude mcp add maz-ui --scope project -- npx -y @maz-ui/mcp@latest
```

Or in `.mcp.json`:

```json
{
  "mcpServers": {
    "maz-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@maz-ui/mcp@latest"]
    }
  }
}
```

The [Claude Code plugin](./../guide/ai-agents.md#claude-code-plugin) includes the server.

### Cursor

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "maz-ui": {
      "command": "npx",
      "args": ["-y", "@maz-ui/mcp@latest"]
    }
  }
}
```

### VS Code (GitHub Copilot)

`.vscode/mcp.json`:

```json
{
  "servers": {
    "maz-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@maz-ui/mcp@latest"]
    }
  }
}
```

### Codex

`~/.codex/config.toml`:

```toml
[mcp_servers.maz-ui]
command = "npx"
args = ["-y", "@maz-ui/mcp@latest"]
```

### Windsurf, Claude Desktop, Cline, Zed...

Add the same `command` and `args` to the MCP configuration of the client (`mcpServers` key):

```json
{
  "mcpServers": {
    "maz-ui": {
      "command": "npx",
      "args": ["-y", "@maz-ui/mcp@latest"]
    }
  }
}
```

## Command line

The package is also a CLI:

```bash
npx @maz-ui/mcp                   # start the MCP server (stdio)
npx @maz-ui/mcp init              # configure the AI agents of the project
npx @maz-ui/mcp review <paths...> # review files against maz-ui (CI)
npx @maz-ui/mcp search <query>    # search the docs from the terminal
npx @maz-ui/mcp --help
```

See [Code review in CI](./../guide/ai-agents.md#code-review-in-ci) for the review options and rules.

## Programmatic API

```ts
import { createMazUiMcpServer, loadKnowledge, reviewCode } from '@maz-ui/mcp'

const knowledge = loadKnowledge({ cwd: process.cwd() })
const findings = reviewCode('<template><MazBtn color="red" /></template>', {
  knowledge,
  filename: 'Example.vue',
})
```

## Troubleshooting

### The server does not start: `connection timed out`

Claude Code waits 30 seconds for a MCP server to start. The first `npx -y @maz-ui/mcp@latest` downloads the package, and behind a slow or proxied registry (Nexus, Artifactory...) it can exceed this delay. Then:

- install `@maz-ui/mcp` in the project and run `init` again (see [In a project: install it](#in-a-project-install-it)),
- or pin a version instead of `@latest`: `npx -y @maz-ui/mcp@5.1.0` only queries the registry on the first start,
- or raise the timeout of Claude Code: `MCP_TIMEOUT=60000 claude`.

Measure the start time of a command up to the `initialize` response:

```bash
time (echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' | npx -y @maz-ui/mcp@latest | head -1)
```

## Debugging

```bash
npx @modelcontextprotocol/inspector npx -y @maz-ui/mcp@latest
```
