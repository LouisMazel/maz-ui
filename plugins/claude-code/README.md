# maz-ui plugin for Claude Code

Makes Claude Code use the maz-ui ecosystem (components, composables, directives, `@maz-ui/icons`, `@maz-ui/utils`, `@maz-ui/themes`, Tailwind theme tokens) instead of re-implementing it.

```txt
/plugin marketplace add LouisMazel/maz-ui
/plugin install maz-ui@maz-ui
```

It contains:

- **`maz-ui` skill**: the maz-ui rules and the look-up workflow, loaded when Claude works on Vue or Nuxt UI code.
- **`maz-ui` MCP server** (`npx -y @maz-ui/mcp@latest`): search by need, component APIs, icons, theme tokens, docs of the maz-ui version installed in the project, code review.
- **Review hook**: after each edit of a `.vue`, `.ts`, `.js` or `.css` file in a project that depends on maz-ui, the file is reviewed against the installed maz-ui and Claude gets the findings to fix (unknown props, invalid values, native elements, default Tailwind palette, `maz:` prefix...).

To configure a project for your whole team (rules in `AGENTS.md` and `.claude/rules/`, MCP server in the project config), run `npx @maz-ui/mcp init` instead or as well. Documentation: https://maz-ui.com/guide/ai-agents

The skill is generated from `tools/agent-docs/content`: run `pnpm -F agent-docs generate:plugin` after changing the rules.
