import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { CreateContextOptions, ServerContext } from './context.ts'
import type { ToolDefinition } from './tools/types.ts'

import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createContext } from './context.ts'
import { buildInstructions } from './instructions.ts'
import { registerPrompts } from './prompts.ts'
import { findIconsTool } from './tools/find-icons.ts'
import { getComponentApiTool } from './tools/get-component-api.ts'
import { getDocTool } from './tools/get-doc.ts'
import { getProjectInfoTool } from './tools/get-project-info.ts'
import { getSetupGuideTool } from './tools/get-setup-guide.ts'
import { getThemeTokensTool } from './tools/get-theme-tokens.ts'
import { listDocsTool } from './tools/list-docs.ts'
import { reviewCodeToolDefinition } from './tools/review-code.ts'
import { searchDocsTool } from './tools/search-docs.ts'
import { ToolInputError } from './tools/types.ts'
import { readOwnVersion } from './version.ts'

/** Tools in a stable order (prompt caching on the client side) */
export const TOOLS: ToolDefinition[] = [
  searchDocsTool,
  getComponentApiTool,
  findIconsTool,
  getThemeTokensTool,
  getDocTool,
  listDocsTool,
  getSetupGuideTool,
  getProjectInfoTool,
  reviewCodeToolDefinition,
]

export async function runTool(context: ServerContext, tool: ToolDefinition, args: unknown): Promise<CallToolResult> {
  try {
    context.refresh()

    return {
      content: [
        { type: 'text', text: await tool.run(context, args) },
      ],
    }
  }
  catch (error) {
    const message = error instanceof ToolInputError
      ? error.message
      : `Unexpected error in ${tool.name}: ${getErrorMessage(error)}. Retry with other arguments or fall back to the docs of the installed packages (node_modules/maz-ui/agent-docs, node_modules/@maz-ui/<package>/agent-docs).`

    return {
      content: [
        { type: 'text', text: message },
      ],
      isError: true,
    }
  }
}

export function createMazUiMcpServer(options: CreateContextOptions = {}): { server: McpServer, context: ServerContext } {
  const context = createContext(options)
  const server = new McpServer(
    {
      name: 'maz-ui',
      title: 'maz-ui',
      version: readOwnVersion(),
    },
    {
      instructions: buildInstructions(context),
    },
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
