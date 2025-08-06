#!/usr/bin/env node

import { getErrorMessage } from '@maz-ui/utils'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { version } from '../package.json' assert { type: 'json' }
import { DocumentationService } from './DocumentationService'

/**
 * MCP server using official SDK
 */
export class MazUiMcpServer {
  private server: Server
  private documentationService = new DocumentationService()

  constructor() {
    this.server = new Server(
      {
        name: 'maz-ui-mcp',
        version,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      },
    )

    this.setupHandlers()
  }

  public getDocumentationService(): DocumentationService {
    return this.documentationService
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, () => {
      const [components, guides, composables, directives, plugins, helpers] = [
        this.documentationService.getAllComponents(),
        this.documentationService.getAllGuides(),
        this.documentationService.getAllComposables(),
        this.documentationService.getAllDirectives(),
        this.documentationService.getAllPlugins(),
        this.documentationService.getAllHelpers(),
      ]

      const resources = []

      resources.push({
        uri: 'maz-ui://overview',
        name: 'Maz-UI Library Overview',
        description: 'Complete overview of the Maz-UI component library',
        mimeType: 'text/markdown',
      })

      for (const component of components) {
        const pascalName = component.split('-').map(part =>
          part.charAt(0).toUpperCase() + part.slice(1),
        ).join('')

        resources.push({
          uri: `maz-ui://component/${pascalName}`,
          name: `${pascalName} Component`,
          description: `Documentation for the ${pascalName} Vue component`,
          mimeType: 'text/markdown',
        })
      }

      for (const guide of guides) {
        resources.push({
          uri: `maz-ui://guide/${guide}`,
          name: `Guide: ${guide}`,
          description: `Guide for ${guide}`,
          mimeType: 'text/markdown',
        })
      }

      for (const composable of composables) {
        resources.push({
          uri: `maz-ui://composable/${composable}`,
          name: `Composable: ${composable}`,
          description: `Documentation for ${composable} Vue composable`,
          mimeType: 'text/markdown',
        })
      }

      for (const directive of directives) {
        resources.push({
          uri: `maz-ui://directive/${directive}`,
          name: `Directive: ${directive}`,
          description: `Documentation for ${directive} Vue directive`,
          mimeType: 'text/markdown',
        })
      }

      for (const plugin of plugins) {
        resources.push({
          uri: `maz-ui://plugin/${plugin}`,
          name: `Plugin: ${plugin}`,
          description: `Documentation for ${plugin} Vue plugin`,
          mimeType: 'text/markdown',
        })
      }

      for (const helper of helpers) {
        resources.push({
          uri: `maz-ui://helper/${helper}`,
          name: `Helper: ${helper}`,
          description: `Documentation for ${helper} utility function`,
          mimeType: 'text/markdown',
        })
      }

      return { resources }
    })

    this.server.setRequestHandler(ReadResourceRequestSchema, (request) => {
      const { uri } = request.params

      if (!uri || !uri.startsWith('maz-ui://')) {
        throw new Error('Invalid URI')
      }

      const path = uri.replace('maz-ui://', '')
      const [type, name] = path.split('/')

      let content = ''

      switch (type) {
        case 'overview':
          content = this.documentationService.getOverview()
          break
        case 'component':
          content = this.documentationService.getComponentDocumentation(name)
          break
        case 'guide':
          content = this.documentationService.getGuideDocumentation(name)
          break
        case 'composable':
          content = this.documentationService.getComposableDocumentation(name)
          break
        case 'directive':
          content = this.documentationService.getDirectiveDocumentation(name)
          break
        case 'plugin':
          content = this.documentationService.getPluginDocumentation(name)
          break
        case 'helper':
          content = this.documentationService.getHelperDocumentation(name)
          break
        default:
          throw new Error(`Unknown resource type: ${type}`)
      }

      if (!content) {
        throw new Error('Resource not found')
      }

      return {
        contents: [{
          uri,
          mimeType: 'text/markdown',
          text: content,
        }],
      }
    })

    this.server.setRequestHandler(ListToolsRequestSchema, () => {
      return {
        tools: [
          {
            name: 'list_all_components',
            description: 'Get complete list of all available Vue components',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_guides',
            description: 'List all documentation guides (installation, setup, etc.)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_getting_started',
            description: 'Get installation and setup guide for Maz-UI',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_composables',
            description: 'List all Vue 3 composables (useToast, useDialog, etc.)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_directives',
            description: 'List all Vue directives (v-tooltip, v-click-outside, etc.)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_plugins',
            description: 'List all Vue plugins (Toast, Dialog, AOS, Wait)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_helpers',
            description: 'List all utility functions (string, date, number formatting)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, (request) => {
      const { name } = request.params

      switch (name) {
        case 'list_all_components': {
          const components = this.documentationService.getAllComponents()
          return {
            content: [{
              type: 'text',
              text: `Available components (${components.length}):\n\n${components.map(c => `- ${c}`).join('\n')}`,
            }],
          }
        }

        case 'list_guides': {
          const guides = this.documentationService.getAllGuides()
          return {
            content: [{
              type: 'text',
              text: `Available guides (${guides.length}):\n\n${guides.map(g => `- ${g}`).join('\n')}`,
            }],
          }
        }

        case 'get_getting_started': {
          const guide = this.documentationService.getGuideDocumentation('getting-started')
          return {
            content: [{
              type: 'text',
              text: guide || 'Getting started guide not found',
            }],
          }
        }

        case 'list_composables': {
          const composables = this.documentationService.getAllComposables()
          return {
            content: [{
              type: 'text',
              text: `Available composables (${composables.length}):\n\n${composables.map(c => `- ${c}`).join('\n')}`,
            }],
          }
        }

        case 'list_directives': {
          const directives = this.documentationService.getAllDirectives()
          return {
            content: [{
              type: 'text',
              text: `Available directives (${directives.length}):\n\n${directives.map(d => `- ${d}`).join('\n')}`,
            }],
          }
        }

        case 'list_plugins': {
          const plugins = this.documentationService.getAllPlugins()
          return {
            content: [{
              type: 'text',
              text: `Available plugins (${plugins.length}):\n\n${plugins.map(p => `- ${p}`).join('\n')}`,
            }],
          }
        }

        case 'list_helpers': {
          const helpers = this.documentationService.getAllHelpers()
          return {
            content: [{
              type: 'text',
              text: `Available helpers (${helpers.length}):\n\n${helpers.map(h => `- ${h}`).join('\n')}`,
            }],
          }
        }

        default:
          throw new Error(`Unknown tool: ${name}`)
      }
    })
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new MazUiMcpServer()
  server.run().catch((error) => {
    console.error('Failed to start MCP server:', getErrorMessage(error))
    process.exit(1)
  })
}
