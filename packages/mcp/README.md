# @maz-ui/mcp

MCP server and CLI that give AI coding agents (Claude Code, Cursor, GitHub Copilot, Codex, Windsurf...) the **version-matched** knowledge of [maz-ui](https://maz-ui.com) and its ecosystem, so they use its components, composables, icons, helpers and Tailwind theme tokens instead of re-implementing them.

## Quick start

At the root of a project that uses maz-ui:

```bash
npx @maz-ui/mcp init
```

It detects your agents and configures them without touching your own instructions:

- Claude Code: `.claude/rules/maz-ui.md` (rules, always loaded) and `.mcp.json`
- Cursor, Copilot, Codex, Windsurf...: a delimited `maz-ui` section in `AGENTS.md`, and `.cursor/mcp.json` / `.vscode/mcp.json`

Options: `--targets claude,agents-md,cursor,vscode`, `--no-rules` (MCP server only), `--no-mcp`, `--dry-run`, `--remove`. With Nuxt, the `mazUi.agents` option of `@maz-ui/nuxt` registers the MCP server of the detected agents automatically in development.

To use it without writing anything in your projects, register the server once for your user: `claude mcp add maz-ui --scope user -- npx -y @maz-ui/mcp@latest` (its instructions carry the maz-ui rules), or install the Claude Code plugin below.

## Tools

| Tool                | Purpose                                                                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_docs`       | Find what maz-ui provides for a need in plain words ("confirm before delete", "phone input", "debounce search")                                                       |
| `get_component_api` | Exact API of up to 10 components: props, accepted values, `v-model`, events, slots, exposed                                                                           |
| `find_icons`        | Icons of `@maz-ui/icons` by meaning, with imports                                                                                                                     |
| `get_theme_tokens`  | The theme of your project (preset, `@theme` tokens, variants, utilities) and every Tailwind class and CSS variable of the maz-ui theme                                |
| `get_doc`           | Any documentation page, whole or by sections                                                                                                                          |
| `list_docs`         | Catalog of everything maz-ui provides                                                                                                                                 |
| `get_setup_guide`   | Install maz-ui in a Vue or Nuxt app, with or without Tailwind                                                                                                         |
| `review_code`       | Review files against the installed maz-ui (unknown props or values, unknown icons, native elements, duplicated libraries, default Tailwind palette, `maz:` prefix...) |

Prompts: `build`, `audit`, `setup`. The server serves the docs shipped in the maz-ui package installed in your project (`node_modules/maz-ui/docs`), so agents read the docs of **your** version. Without maz-ui installed, it serves the docs bundled in this package.

## Manual configuration

Start the server with `npx -y @maz-ui/mcp@latest`:

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

Claude Code users can also install the plugin (skill, MCP server and review hook):

```txt
/plugin marketplace add LouisMazel/maz-ui
/plugin install maz-ui@maz-ui
```

## CLI

```bash
npx @maz-ui/mcp                                   # MCP server (stdio)
npx @maz-ui/mcp init                              # configure the AI agents of the project
npx @maz-ui/mcp review "src/**/*.{vue,ts,css}"    # review files, exits 1 on errors
npx @maz-ui/mcp review app --min-severity warning --max-warnings 0 --format json
npx @maz-ui/mcp search "date range picker"
```

Ignore an intended finding with a `maz-ui-review-ignore [rule]` comment on the line above, or `maz-ui-review-ignore-file`.

Options: `--docs <dir>` (or `MAZ_UI_DOCS_DIR`) to use another docs bundle, `--cwd <dir>` for the project root.

## Programmatic API

```ts
import { createMazUiMcpServer, loadKnowledge, reviewCode, setupAgents } from '@maz-ui/mcp'

const knowledge = loadKnowledge({ cwd: process.cwd() })
const findings = reviewCode(source, { knowledge, filename: 'Card.vue' })
```

## Documentation

- [AI agents guide](https://maz-ui.com/guide/ai-agents)
- [MCP server](https://maz-ui.com/ecosystem/mcp)
- [llms.txt](https://maz-ui.com/llms.txt)

## License

MIT
