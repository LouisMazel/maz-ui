import type { ZodRawShape } from 'zod'
import type { ServerContext } from '../context'

/** An error the agent can fix by changing its call: returned as a tool error with this message */
export class ToolInputError extends Error {}

export interface ToolDefinition<Shape extends ZodRawShape = ZodRawShape> {
  name: string
  title: string
  description: string
  inputSchema: Shape
  /** Returns markdown for the agent */
  run: (context: ServerContext, args: any) => string | Promise<string>
}

export function defineTool<Shape extends ZodRawShape>(definition: ToolDefinition<Shape>): ToolDefinition<Shape> {
  return definition
}
