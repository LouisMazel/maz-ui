import type { HttpContext } from '@adonisjs/core/http'
import DocumentationService from '#services/documentation_service'
import { getErrorMessage } from '@maz-ui/utils/src/helpers/getErrorMessage.js'
import { normalizeString } from '@maz-ui/utils/src/helpers/normalizeString.js'

/* eslint-disable sonarjs/no-nested-template-literals */

export default class SimpleMcpController {
  private documentationService = new DocumentationService()

  /**
   * Convert query to kebab-case for consistent search
   */
  private normalizeQueryForSearch(query: string): string {
    return normalizeString(query, {
      case: 'kebab-case',
      removeAccents: true,
      normalizeSpaces: true,
      trim: true,
    })
  }

  /**
   * Enhanced component matching using kebab-case normalization
   */
  private matchesComponent(component: string, query: string): boolean {
    const normalizedComponent = normalizeString(component, {
      case: 'kebab-case',
      removeAccents: true,
      normalizeSpaces: true,
      trim: true,
    })

    const normalizedQuery = this.normalizeQueryForSearch(query)

    // Direct match
    if (normalizedComponent.includes(normalizedQuery)) {
      return true
    }

    // Partial match without 'maz-' prefix
    const withoutMazPrefix = normalizedQuery.replace(/^maz-/, '')
    if (withoutMazPrefix !== normalizedQuery && normalizedComponent.includes(withoutMazPrefix)) {
      return true
    }

    // Check word-level matches
    const componentWords = normalizedComponent.split('-')
    const queryWords = normalizedQuery.split('-')

    return queryWords.some(queryWord =>
      componentWords.some(componentWord =>
        componentWord.includes(queryWord),
      ),
    )
  }

  /**
   * Handle MCP requests - supports both GET (info) and POST (JSON-RPC)
   */
  async handle({ request, response }: HttpContext) {
    if (request.method() === 'GET') {
      // Simple server info
      return response.json({
        name: 'maz-ui-mcp',
        version: '1.0.0',
        protocol: 'mcp/2025-03-26',
      })
    }

    // Handle POST - JSON-RPC messages
    try {
      const body = request.body()

      if (!body || typeof body !== 'object' || body.jsonrpc !== '2.0') {
        return response.status(400).json({
          jsonrpc: '2.0',
          error: { code: -32600, message: 'Invalid Request' },
        })
      }

      const result = await this.handleJsonRpc(body)
      return response.json(result)
    }
    catch (error) {
      return response.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: `Internal error - ${getErrorMessage(error)}` },
      })
    }
  }

  /**
   * Handle JSON-RPC methods
   */
  private async handleJsonRpc(request: any) {
    const { method, params, id } = request

    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2025-03-26',
            serverInfo: {
              name: 'maz-ui-mcp',
              version: '1.0.0',
            },
            capabilities: {
              resources: {},
              tools: {},
            },
          },
        }

      case 'resources/list':
        return {
          jsonrpc: '2.0',
          id,
          result: await this.listResources(),
        }

      case 'resources/read':
        return {
          jsonrpc: '2.0',
          id,
          result: await this.readResource(params?.uri),
        }

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: await this.listTools(),
        }

      case 'tools/call':
        return {
          jsonrpc: '2.0',
          id,
          result: await this.callTool(params?.name, params?.arguments),
        }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: 'Method not found' },
        }
    }
  }

  /**
   * List all available resources
   */
  private async listResources() {
    const [components, guides, composables, directives, plugins, helpers] = await Promise.all([
      this.documentationService.getAllComponents(),
      this.documentationService.getAllGuides(),
      this.documentationService.getAllComposables(),
      this.documentationService.getAllDirectives(),
      this.documentationService.getAllPlugins(),
      this.documentationService.getAllHelpers(),
    ])

    const resources = []

    // Overview
    resources.push({
      uri: 'maz-ui://overview',
      name: 'Maz-UI Library Overview',
      description: 'Complete overview of the Maz-UI component library',
      mimeType: 'text/markdown',
    })

    // Components
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

    // Guides
    for (const guide of guides) {
      resources.push({
        uri: `maz-ui://guide/${guide}`,
        name: `Guide: ${guide}`,
        description: `Guide for ${guide}`,
        mimeType: 'text/markdown',
      })
    }

    // Other resources...
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
  }

  /**
   * Read a specific resource
   */
  private async readResource(uri: string) {
    if (!uri || !uri.startsWith('maz-ui://')) {
      throw new Error('Invalid URI')
    }

    const path = uri.replace('maz-ui://', '')
    const [type, name] = path.split('/')

    let content = ''

    switch (type) {
      case 'overview':
        content = await this.documentationService.getOverview()
        break
      case 'component':
        content = await this.documentationService.getComponentDocumentation(name)
        break
      case 'guide':
        content = await this.documentationService.getGuideDocumentation(name)
        break
      case 'composable':
        content = await this.documentationService.getComposableDocumentation(name)
        break
      case 'directive':
        content = await this.documentationService.getDirectiveDocumentation(name)
        break
      case 'plugin':
        content = await this.documentationService.getPluginDocumentation(name)
        break
      case 'helper':
        content = await this.documentationService.getHelperDocumentation(name)
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
  }

  /**
   * List all available tools
   */
  private listTools() {
    return {
      tools: [
        {
          name: 'search_components',
          description: 'Search for components by name or functionality',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
            },
            required: ['query'],
          },
        },
        {
          name: 'search_documentation',
          description: 'Search across all documentation',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
            },
            required: ['query'],
          },
        },
        {
          name: 'list_all_components',
          description: 'List all available Vue components',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_guides',
          description: 'List all available guides',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'get_getting_started',
          description: 'Get the getting started guide',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_composables',
          description: 'List all available Vue composables',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_directives',
          description: 'List all available Vue directives',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_plugins',
          description: 'List all available Vue plugins',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_helpers',
          description: 'List all available utility helpers',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'get_component_usage',
          description: 'Get usage examples for a specific component',
          inputSchema: {
            type: 'object',
            properties: {
              component: { type: 'string', description: 'Component name' },
            },
            required: ['component'],
          },
        },
      ],
    }
  }

  /**
   * Call a specific tool
   */
  // eslint-disable-next-line complexity
  private async callTool(name: string, args: any) {
    if (!name) {
      throw new Error('Tool name is required')
    }

    switch (name) {
      case 'search_components': {
        const query = args?.query
        if (!query)
          throw new Error('Query parameter is required')

        const components = await this.documentationService.getAllComponents()
        const results = components.filter(component => this.matchesComponent(component, query))

        return {
          content: [{
            type: 'text',
            text: `Found ${results.length} components matching "${query}":\n\n${results.map(c => `- ${c}`).join('\n')}`,
          }],
        }
      }

      case 'search_documentation': {
        const query = args?.query
        if (!query)
          throw new Error('Query parameter is required')

        // Normalize query to kebab-case for consistent search
        const normalizedQuery = this.normalizeQueryForSearch(query)

        // Search with normalized query and original query
        const [normalizedResults, originalResults] = await Promise.all([
          this.documentationService.searchDocumentation(normalizedQuery),
          this.documentationService.searchDocumentation(query),
        ])

        // Combine and deduplicate results
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
        const components = await this.documentationService.getAllComponents()

        return {
          content: [{
            type: 'text',
            text: `Available components (${components.length}):\n\n${components.map(c => `- ${c}`).join('\n')}`,
          }],
        }
      }

      case 'list_guides': {
        const guides = await this.documentationService.getAllGuides()

        return {
          content: [{
            type: 'text',
            text: `Available guides (${guides.length}):\n\n${guides.map(g => `- ${g}`).join('\n')}`,
          }],
        }
      }

      case 'get_getting_started': {
        const guide = await this.documentationService.getGuideDocumentation('getting-started')

        return {
          content: [{
            type: 'text',
            text: guide || 'Getting started guide not found',
          }],
        }
      }

      case 'list_composables': {
        const composables = await this.documentationService.getAllComposables()

        return {
          content: [{
            type: 'text',
            text: `Available composables (${composables.length}):\n\n${composables.map(c => `- ${c}`).join('\n')}`,
          }],
        }
      }

      case 'list_directives': {
        const directives = await this.documentationService.getAllDirectives()

        return {
          content: [{
            type: 'text',
            text: `Available directives (${directives.length}):\n\n${directives.map(d => `- ${d}`).join('\n')}`,
          }],
        }
      }

      case 'list_plugins': {
        const plugins = await this.documentationService.getAllPlugins()

        return {
          content: [{
            type: 'text',
            text: `Available plugins (${plugins.length}):\n\n${plugins.map(p => `- ${p}`).join('\n')}`,
          }],
        }
      }

      case 'list_helpers': {
        const helpers = await this.documentationService.getAllHelpers()

        return {
          content: [{
            type: 'text',
            text: `Available helpers (${helpers.length}):\n\n${helpers.map(h => `- ${h}`).join('\n')}`,
          }],
        }
      }

      case 'get_component_usage': {
        const component = args?.component
        if (!component)
          throw new Error('Component parameter is required')

        const documentation = await this.documentationService.getComponentDocumentation(component)
        if (!documentation) {
          return {
            content: [{
              type: 'text',
              text: `Component '${component}' not found`,
            }],
          }
        }

        // Extract usage examples
        const usageSection = documentation.match(/## Basic usage[\s\S]*?(?=##|$)/i)
        const usage = usageSection ? usageSection[0] : `${documentation.substring(0, 1000)}...`

        return {
          content: [{
            type: 'text',
            text: usage,
          }],
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  }
}
