/**
 * OpenCode plugin of maz-ui (`"plugin": ["@maz-ui/mcp"]` in `opencode.json`, OpenCode 1): the plugin of Claude Code
 * and Codex, for OpenCode.
 * - Starts the maz-ui MCP server, unless the config already starts it.
 * - Registers the skills (`maz-ui`, `maz-ui-upgrade`) and the `maz-ui-editor` subagent of the plugin.
 * - Adds the maz-ui rules of the installed version to the system prompt, unless `AGENTS.md` (or `CLAUDE.md`) has them.
 * - Reviews the files the agent edits against the installed maz-ui: the findings are added to the result of the edit,
 *   and at the end of a task (`session.idle`), the findings not sent yet for the files changed in git are sent back.
 * Nothing here may break OpenCode: every hook swallows its errors.
 */
import type { HookReviewOptions } from './review/hook.ts'

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findProjectMazUi } from './knowledge/load.ts'

/** The part of the input of an OpenCode plugin used here */
export interface OpenCodePluginInput {
  directory: string
  client: OpenCodeClient
}

/** The part of the SDK client of OpenCode 1 used here */
export interface OpenCodeClient {
  session: {
    get: (options: { path: { id: string } }) => Promise<{ data?: { parentID?: string } }>
    promptAsync: (options: { path: { id: string }, body: { parts: Array<{ type: 'text', text: string }> } }) => Promise<unknown>
  }
}

interface McpConfig {
  type?: string
  command?: string[]
  [key: string]: unknown
}

interface ToolResult {
  title: string
  output: string
  metadata?: { files?: Array<{ filePath?: string, movePath?: string, type?: string }> }
}

interface AgentConfig {
  description?: string
  mode?: string
  prompt?: string
  [key: string]: unknown
}

/** The part of the config of OpenCode the plugin completes */
export interface OpenCodeConfig {
  mcp?: Record<string, McpConfig>
  skills?: { paths?: string[], urls?: string[] }
  agent?: Record<string, AgentConfig>
}

export interface OpenCodeHooks {
  'config': (config: OpenCodeConfig) => void
  'tool.execute.after': (input: { tool: string, sessionID: string, args?: { filePath?: string, patchText?: string } }, output: ToolResult) => Promise<void>
  'event': (input: { event: { type: string, properties?: { sessionID?: string } } }) => Promise<void>
  'experimental.chat.system.transform': (input: { sessionID?: string }, output: { system: string[] }) => void
}

const SERVER_NAME = 'maz-ui'
const EDIT_TOOLS = new Set(['edit', 'write', 'apply_patch'])
const MAZ_UI_SECTION = '<!-- BEGIN:maz-ui -->'
const MCP_BIN = 'node_modules/@maz-ui/mcp/bin/maz-ui-mcp.mjs'
/** The bin of this package: `dist/opencode.mjs` and `bin/maz-ui-mcp.mjs` */
const OWN_BIN = fileURLToPath(new URL('../bin/maz-ui-mcp.mjs', import.meta.url))
const EDITOR_AGENT = 'maz-ui-editor'
/**
 * The skills and the subagent of the maz-ui plugin: copied in `plugin/` by the build of the package, read from
 * `plugins/maz-ui` in the monorepo
 */
const PLUGIN_DIR = ['../plugin/', '../../../plugins/maz-ui/']
  .map(path => fileURLToPath(new URL(path, import.meta.url)))
  .find(directory => existsSync(join(directory, 'skills')))

function read(file: string): string | undefined {
  try {
    return readFileSync(file, 'utf8')
  }
  catch {
    return undefined
  }
}

function findUp(start: string, relativePath: string): string | undefined {
  for (let directory = start; ; directory = dirname(directory)) {
    if (existsSync(join(directory, relativePath)))
      return join(directory, relativePath)

    if (dirname(directory) === directory)
      return undefined
  }
}

/** A server of the config already starts the maz-ui MCP server */
function startsMcpServer(servers: Record<string, McpConfig>): boolean {
  return SERVER_NAME in servers || Object.values(servers).some(server => /@maz-ui\/mcp|maz-ui-mcp/.test(JSON.stringify(server)))
}

/** The MCP server of the @maz-ui/mcp installed in the project (the version of its lockfile), else of this plugin */
export function mcpServerConfig(directory: string): McpConfig {
  return {
    type: 'local',
    command: ['node', findUp(directory, MCP_BIN) ?? OWN_BIN, '--cwd', directory],
  }
}

/** The `maz-ui-editor` subagent of the plugin, from its markdown file (the frontmatter of Claude Code, then the prompt) */
export function editorAgent(pluginDir: string): AgentConfig | undefined {
  const content = read(join(pluginDir, `agents/${EDITOR_AGENT}.md`)) ?? ''
  const end = content.indexOf('\n---\n', 4)
  const description = content.startsWith('---\n') && end !== -1
    ? /^description: (.+)$/m.exec(content.slice(4, end))?.[1]
    : undefined

  return description
    ? { description, mode: 'subagent', prompt: content.slice(end + 5).trim() }
    : undefined
}

/** Adds the server, the skills and the subagent of the plugin to the config, without replacing what it already has */
export function completeConfig(config: OpenCodeConfig, directory: string, pluginDir: string | undefined): void {
  config.mcp ??= {}

  if (!startsMcpServer(config.mcp))
    config.mcp[SERVER_NAME] = mcpServerConfig(directory)

  if (!pluginDir)
    return

  const skills = join(pluginDir, 'skills')
  const paths = config.skills?.paths ?? []
  const agent = editorAgent(pluginDir)

  if (!paths.includes(skills))
    config.skills = { ...config.skills, paths: [...paths, skills] }

  config.agent ??= {}

  if (agent && !config.agent[EDITOR_AGENT])
    config.agent[EDITOR_AGENT] = agent
}

/** The files an edit of OpenCode wrote: `filePath` of `edit` and `write`, the files of `apply_patch` */
export function editedFiles(tool: string, args: { filePath?: string } | undefined, output: ToolResult): string[] {
  if (!EDIT_TOOLS.has(tool))
    return []

  if (args?.filePath)
    return [args.filePath]

  return (output.metadata?.files ?? [])
    .filter(file => file.type !== 'delete')
    .map(file => file.movePath ?? file.filePath)
    .filter((file): file is string => !!file)
}

/** The maz-ui rules of the installed version, `undefined` when the project already loads them or does not use maz-ui */
export function sessionRules(directory: string): string | undefined {
  if ([join(directory, 'AGENTS.md'), join(directory, 'CLAUDE.md')].some(file => read(file)?.includes(MAZ_UI_SECTION)))
    return undefined

  const mazUi = findProjectMazUi(directory)
  const rules = mazUi && read(join(mazUi.directory, 'agent-docs/agents/session-context.md'))

  return rules
    ? `maz-ui ${mazUi.version} is installed in this project. Its rules, from its docs (maz-ui OpenCode plugin):\n\n${rules}`
    : undefined
}

/** The server plugin: OpenCode awaits it, then each of its hooks */
export function MazUiOpenCodePlugin({ directory, client }: OpenCodePluginInput): Promise<OpenCodeHooks> {
  let reviewOptions: Promise<HookReviewOptions> | undefined
  let rules: string | undefined | null = null
  const reviewing = new Set<string>()

  // The review loads the docs and the parsers on the first edit, not when OpenCode starts
  async function review(files: string[] | undefined, sessionId: string, final: boolean): Promise<string | undefined> {
    reviewOptions ??= Promise.all([import('./context.ts'), import('./review/hook.ts')]).then(([{ createContext }, { knowledgeByProject }]) => ({
      knowledge: createContext({ cwd: directory }).knowledge,
      knowledgeFor: knowledgeByProject(),
      cwd: directory,
    }))
    const { reviewEdits } = await import('./review/hook.ts')

    return reviewEdits({ files, final, sessionId }, await reviewOptions)
  }

  return Promise.resolve({
    'config': function (config) {
      try {
        completeConfig(config, directory, PLUGIN_DIR)
      }
      catch {}
    },

    'tool.execute.after': async function (input, output) {
      try {
        const files = editedFiles(input.tool, input.args, output)
        const message = files.length > 0
          ? await review(files, input.sessionID, false)
          : undefined

        if (message)
          output.output = `${output.output}\n\n${message}`
      }
      catch {}
    },

    'event': async function ({ event }) {
      const sessionId = event.properties?.sessionID

      if (event.type !== 'session.idle' || !sessionId || reviewing.has(sessionId))
        return

      reviewing.add(sessionId)

      try {
        // A subagent reports to its parent session, which is reviewed when it stops
        const { data } = await client.session.get({ path: { id: sessionId } })
        const message = data?.parentID
          ? undefined
          : await review(undefined, sessionId, true)

        if (message)
          await client.session.promptAsync({ path: { id: sessionId }, body: { parts: [{ type: 'text', text: message }] } })
      }
      catch {}
      finally {
        reviewing.delete(sessionId)
      }
    },

    'experimental.chat.system.transform': function (_input, output) {
      try {
        if (rules === null)
          rules = sessionRules(directory)

        if (rules)
          output.system.push(rules)
      }
      catch {}
    },
  })
}

export default {
  id: 'maz-ui',
  server: MazUiOpenCodePlugin,
}
