# agent-evals

Does Claude Code reuse maz-ui? Each run gives a task of a Vue app to the real `claude -p`, then scores what it wrote.

```bash
pnpm build:packages
pnpm -F agent-evals eval --tasks copy-link,price --runs 3
```

## Conditions

- `baseline`: Claude Code alone, without the settings, MCP servers and plugins of the user. The app does not install `@maz-ui/mcp`: only maz-ui and the docs it ships (`node_modules/maz-ui/agent-docs`).
- `init`: what `npx @maz-ui/mcp init` writes in the app (rule, MCP server, review hooks).
- `plugin`: the Claude Code plugin of `plugins/claude-code`, without init.

## Scoring

A run passes when:

- `maz-ui-mcp review` finds no error nor warning in the files of the agent;
- the code uses the expected maz-ui tools (`useClipboard`, `MazBtn`...);
- the code has no hand-made version (`navigator.clipboard`, `<button>`...).

The tasks live in `src/tasks.ts`. Their prompts never name maz-ui: the eval measures whether the agent finds the ecosystem by itself.

## Results

`results/<date>/` (or `--out`): `report.md`, `scores.json` and one folder per run with its score, the files of the agent, its last message and its transcript (`transcript.jsonl`). The report also tells what the agents used: the calls of the maz-ui MCP tools, the runs that read the agent docs and the ones that reviewed their code. `--keep` keeps the apps.

Each run costs tokens (about $0.25 for a small task): never run it in CI. `--dry-run` prints the runs and the commands.
