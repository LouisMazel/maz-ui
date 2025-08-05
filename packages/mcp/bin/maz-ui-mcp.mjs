#!/usr/bin/env node
import { MazUiMcpServer } from '../dist/mcp.mjs'

new MazUiMcpServer().run().catch((error) => {
  console.error('Failed to start MCP server:', error.message)
  process.exit(1)
})
