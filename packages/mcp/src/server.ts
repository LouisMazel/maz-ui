import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { CreateContextOptions, ServerContext } from './context'
import type { ToolDefinition } from './tools/types'

import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { version } from '../package.json' with { type: 'json' }
import { createContext } from './context'
import { buildInstructions } from './instructions'
import { registerPrompts } from './prompts'
import { findIconsTool } from './tools/find-icons'
import { getComponentApiTool } from './tools/get-component-api'
import { getDocTool } from './tools/get-doc'
import { getSetupGuideTool } from './tools/get-setup-guide'
import { getThemeTokensTool } from './tools/get-theme-tokens'
import { listDocsTool } from './tools/list-docs'
import { reviewCodeToolDefinition } from './tools/review-code'
import { searchDocsTool } from './tools/search-docs'
import { ToolInputError } from './tools/types'

/** Tools in a stable order (prompt caching on the client side) */
export const TOOLS: ToolDefinition[] = [
  searchDocsTool,
  getComponentApiTool,
  findIconsTool,
  getThemeTokensTool,
  getDocTool,
  listDocsTool,
  getSetupGuideTool,
  reviewCodeToolDefinition,
]

export async function runTool(context: ServerContext, tool: ToolDefinition, args: unknown): Promise<CallToolResult> {
  try {
    return { content: [{ type: 'text', text: await tool.run(context, args) }] }
  }
  catch (error) {
    const message = error instanceof ToolInputError
      ? error.message
      : `Unexpected error in ${tool.name}: ${getErrorMessage(error)}. Retry with other arguments or fall back to the docs in node_modules/maz-ui/docs.`

    return { content: [{ type: 'text', text: message }], isError: true }
  }
}

export function createMazUiMcpServer(options: CreateContextOptions = {}): { server: McpServer, context: ServerContext } {
  const context = createContext(options)
  const server = new McpServer(
    { name: 'maz-ui', title: 'maz-ui', version },
    { instructions: buildInstructions(context) },
  )

  for (const tool of TOOLS) {
    server.registerTool(tool.name, {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: {
        title: tool.title,
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      _meta: { 'anthropic/maxResultSizeChars': 80_000 },
    }, (args: unknown) => runTool(context, tool, args))
  }

  registerPrompts(server)

  return { server, context }
}

export async function startStdioServer(options: CreateContextOptions = {}): Promise<McpServer> {
  const { server } = createMazUiMcpServer(options)

  await server.connect(new StdioServerTransport())

  return server
}
