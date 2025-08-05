#!/usr/bin/env node

import { getErrorMessage, normalizeString } from '@maz-ui/utils'
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

  private normalizeQueryForSearch(query: string): string {
    return normalizeString(query, {
      case: 'kebab-case',
      removeAccents: true,
      normalizeSpaces: true,
      trim: true,
    })
  }

  private matchesComponent(component: string, query: string): boolean {
    const normalizedComponent = this.normalizeQueryForSearch(component)

    const normalizedQuery = this.normalizeQueryForSearch(query)

    if (normalizedComponent.includes(normalizedQuery)) {
      return true
    }

    const withoutMazPrefix = normalizedQuery.replace(/^maz-/, '')
    if (withoutMazPrefix !== normalizedQuery && normalizedComponent.includes(withoutMazPrefix)) {
      return true
    }

    const componentWords = normalizedComponent.split('-')
    const queryWords = normalizedQuery.split('-')

    return queryWords.some(queryWord =>
      componentWords.some(componentWord =>
        componentWord.includes(queryWord),
      ),
    )
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
            name: 'search_components',
            description: `Search for Vue components by name or functionality. Supports fuzzy matching and handles different naming conventions.

Examples:
- "btn" or "maz-btn" or "MazBtn" → finds MazBtn, etc.
- "input" → finds MazInput, MazInputPhoneNumber, MazInputNumber, etc.
- "date picker" → finds MazDatePicker
- "phone" → finds MazInputPhoneNumber
- "chart" → finds MazChart
- "table" → finds MazTable
- "dialog" → finds MazDialog

Tips:
- Component names can be searched with or without "Maz" prefix
- Works with kebab-case, camelCase, or regular words`,
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Component name or functionality to search for (e.g., "MazBtn", "input phone", "date picker")',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'search_documentation',
            description: `Search across all Maz-UI documentation including components, guides, composables, directives, plugins, and helpers.

Examples:
- "installation" → finds setup guides and getting started
- "theme" → finds theming documentation and theme-related content
- "form validation" → finds form-related components and validation guides
- "animation" → finds AOS plugin and animation utilities
- "toast" → finds toast plugin documentation
- "lazy loading" → finds vLazyImg directive
- "phone number" → finds MazInputPhoneNumber and related utilities
- "dark mode" → finds theme switching documentation

Tips:
- Use specific keywords for better results
- Search for concepts like "accessibility", "typescript", "nuxt"
- Include functionality terms like "validation", "formatting", "animation"
- Works with both English and technical terms`,
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Documentation search query (e.g., "installation", "theme setup", "form validation")',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'list_all_components',
            description: `Get a complete list of all 50+ Vue components available in Maz-UI.

Use this when:
- User asks "what components are available?"
- Need to browse all components
- Looking for component overview
- Want to see the full component catalog`,
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_guides',
            description: `List all available documentation guides including installation, configuration, theming, and usage guides.

Use this when:
- User needs help with setup or configuration
- Looking for tutorials or how-to guides
- Need migration information
- Want to see all available documentation sections`,
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_getting_started',
            description: `Get the complete getting started guide with installation instructions, basic setup, and first steps.

Use this when:
- User asks "how to install Maz-UI"
- "how to setup Maz-UI"
- "getting started with Maz-UI"
- Need basic installation and configuration steps`,
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_composables',
            description: `List all Vue 3 composables (composition functions) available in Maz-UI.

Examples include:
- useFormValidator (form validation)
- useToast (toast notifications)
- useDialog (dialog management)
- useTheme (theme switching)
- useAos (animations)

Use this when user asks about:
- "what composables are available?"
- "Vue composition functions"
- "reusable logic"`,
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_directives',
            description: `List all Vue directives available in Maz-UI.

Examples include:
- vClickOutside (detect clicks outside element)
- vTooltip (add tooltips)
- vLazyImg (lazy load images)
- vZoomImg (image zoom functionality)

Use this when user asks about:
- "what directives are available?"
- "Vue directives"
- "v-directives"`,
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_plugins',
            description: `List all Vue plugins available in Maz-UI.

Examples include:
- Toast (notification system)
- Dialog (modal dialogs)
- AOS (animations on scroll)
- Wait (loading overlays)

Use this when user asks about:
- "what plugins are available?"
- "Vue plugins"
- "global functionality"`,
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_helpers',
            description: `List all utility helper functions available in @maz-ui/utils package.

Examples include:
- String manipulation (normalizeString, kebabCase)
- Date formatting utilities
- Number formatting
- Color utilities
- Validation helpers

Use this when user asks about:
- "utility functions"
- "helper functions"
- "formatting utilities"
- "@maz-ui/utils"`,
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, (request) => {
      const { name, arguments: args } = request.params

      switch (name) {
        case 'search_components': {
          const query = args?.query as string
          if (!query) {
            throw new Error('Query parameter is required')
          }

          const components = this.documentationService.getAllComponents()
          const results = components.filter(component => this.matchesComponent(component, query))

          return {
            content: [{
              type: 'text',
              text: `Found ${results.length} components matching "${query}":\n\n${results.map(c => `- ${c}`).join('\n')}`,
            }],
          }
        }

        case 'search_documentation': {
          const query = args?.query as string
          if (!query) {
            throw new Error('Query parameter is required')
          }

          const normalizedQuery = this.normalizeQueryForSearch(query)
          const [normalizedResults, originalResults] = [
            this.documentationService.searchDocumentation(normalizedQuery),
            this.documentationService.searchDocumentation(query),
          ]

          const allResults = [...normalizedResults, ...originalResults]
          const uniqueResults = [...new Set(allResults)]

          return {
            content: [{
              type: 'text',
              text: `Found ${uniqueResults.length} items matching "${query}":\n\n${uniqueResults.map(r => `- ${r}`).join('\n')}`,
            }],
          }
        }

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
