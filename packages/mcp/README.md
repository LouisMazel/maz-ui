# @maz-ui/mcp

MCP server, CLI and OpenCode plugin that give AI coding agents (Claude Code, Codex, OpenCode, Cursor, GitHub Copilot, Windsurf...) the **version-matched** knowledge of [maz-ui](https://maz-ui.com) and its ecosystem, so they use its components, composables, icons, helpers and Tailwind theme tokens instead of re-implementing them.

## Quick start

At the root of a project that uses maz-ui:

```bash
pnpm add -D @maz-ui/mcp   # optional, for a fast start of the server
npx @maz-ui/mcp init
```

With Claude Code or Codex, install the maz-ui plugin once for your user: the server, the maz-ui skill and hooks that review each edited file, in all your projects:

```bash
claude plugin install maz-ui --marketplace LouisMazel/maz-ui
codex plugin marketplace add LouisMazel/maz-ui && codex plugin add maz-ui@maz-ui
```

With OpenCode, this package is the plugin: add `"plugin": ["@maz-ui/mcp"]` to `opencode.json`. It starts the server, adds the `maz-ui` and `maz-ui-upgrade` skills, the `maz-ui-editor` subagent and the rules of the installed maz-ui, and reviews each edited file.

When the project installs `@maz-ui/mcp`, the MCP configs start the installed version through your package manager (`pnpm exec maz-ui-mcp`, `yarn run maz-ui-mcp`, `npx --no-install maz-ui-mcp`...), in about a second and at the version of your lockfile. Otherwise they run `npx -y @maz-ui/mcp@<version>`, pinned.

It detects your agents and configures them without touching your own instructions:

- Claude Code: `.claude/rules/maz-ui.md` (rules, loaded for the files of the workspaces that use maz-ui), `.mcp.json` and a hook in `.claude/settings.json` that reviews each edited file
- Codex, OpenCode, Cursor, Copilot, Windsurf...: a delimited `maz-ui` section in `AGENTS.md`, and their MCP config (`.codex/config.toml`, `opencode.json` with the OpenCode plugin, `.cursor/mcp.json`, `.vscode/mcp.json`...)

Options: `--targets claude,agents-md,cursor,vscode`, `--paths "apps/web/**"` (files the Claude Code rule is scoped to, default: the workspaces that use maz-ui, `all` to always load it), `--no-rules` (MCP server only), `--no-mcp`, `--no-hooks` (no review hook nor OpenCode plugin), `--dry-run`, `--remove`. In a project without maz-ui (`@maz-ui/utils` or `@maz-ui/node` only), `init` only registers the MCP server, with the docs bundled in `@maz-ui/mcp`. With Nuxt, the `mazUi.agents` option of `@maz-ui/nuxt` registers the MCP server of the detected agents automatically in development.

To use it without writing anything in your projects, register the server once for your user: `claude mcp add maz-ui --scope user -- npx -y @maz-ui/mcp@latest` (its instructions carry the maz-ui rules), or install the plugin of your agent.

## Tools

| Tool                | Purpose                                                                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_docs`       | Find what maz-ui provides for a need in plain words ("confirm before delete", "phone input", "debounce search")                                                        |
| `get_project_info`  | How the project uses maz-ui: versions, plugins, auto-imports, icons by name, theme presets, components and tools already used                                          |
| `get_component_api` | Exact API of up to 10 components: props, accepted values, `v-model`, events, slots, exposed, the sections of their examples (`compact: true` for names and types only) |
| `find_icons`        | Icons of `@maz-ui/icons` by meaning, with imports                                                                                                                      |
| `get_theme_tokens`  | The theme of your project (preset, `@theme` tokens, variants, utilities) and every Tailwind class and CSS variable of the maz-ui theme                                 |
| `get_doc`           | Any documentation page, whole or by sections                                                                                                                           |
| `list_docs`         | Catalog of everything maz-ui provides                                                                                                                                  |
| `get_setup_guide`   | Install maz-ui in a Vue or Nuxt app, with or without Tailwind                                                                                                          |
| `review_code`       | Review files against the installed maz-ui (unknown props or values, unknown icons, native elements, duplicated libraries, default Tailwind palette, `maz:` prefix...)  |

Prompts: `build`, `audit`, `setup`. The server serves the docs shipped by each package installed in your project (`node_modules/maz-ui/agent-docs`, `node_modules/@maz-ui/<package>/agent-docs`), so agents read the docs of **your** versions. A package that is not installed is served from the docs bundled in this package.

## Manual configuration

Start the server with the installed package (`pnpm exec maz-ui-mcp`), or with `npx -y @maz-ui/mcp@latest` without installing anything (prefer a pinned version in a project: with a dist-tag, npx queries the registry at every start):

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

Claude Code: `claude mcp add maz-ui --scope project -- npx -y @maz-ui/mcp@latest`. VS Code uses the `servers` key in `.vscode/mcp.json`, Codex a `[mcp_servers.maz-ui]` table in `~/.codex/config.toml`.

## Troubleshooting

`npx @maz-ui/mcp doctor` checks how Claude Code gets maz-ui in the project: the servers of each scope, the duplicates with the Claude Code plugin, the versions, with the fix of each problem.

`connection timed out after 30000ms` in Claude Code: the first `npx -y` download exceeded the start timeout, usually behind a slow registry. Install `@maz-ui/mcp` in the project and run `init` again, pin a version (`npx -y @maz-ui/mcp@5.1.0`), or raise the timeout: `MCP_TIMEOUT=60000 claude`.

## CLI

```bash
npx @maz-ui/mcp                                   # MCP server (stdio)
npx @maz-ui/mcp init                              # configure the AI agents of the project
npx @maz-ui/mcp doctor                            # check the MCP servers, plugin and rules Claude Code gets
npx @maz-ui/mcp review "src/**/*.{vue,ts,css}"    # review files, exits 1 on errors
npx @maz-ui/mcp review app --min-severity warning --max-warnings 0 --format json
npx @maz-ui/mcp search "date range picker"
```

Ignore an intended finding with a `maz-ui-review-ignore <rule> -- <reason>` comment on the line above, or `maz-ui-review-ignore-file -- <reason>`. A comment without a reason is not applied, and the errors of a code that does not work (unknown component, prop or import...) cannot be ignored.

Options: `--docs <dir>` (or `MAZ_UI_DOCS_DIR`) to use another docs bundle, `--cwd <dir>` for the project root.

## Programmatic API

```ts
import { createMazUiMcpServer, loadKnowledge, reviewCode, setupAgents } from '@maz-ui/mcp'

const knowledge = loadKnowledge({
  cwd: process.cwd()
})
const findings = reviewCode(source, { knowledge, filename: 'Card.vue' })
```

## Documentation

- [AI agents guide](https://maz-ui.com/guide/ai-agents)
- [MCP server](https://maz-ui.com/ecosystem/mcp)
- [llms.txt](https://maz-ui.com/llms.txt)

## License

MIT
