#!/usr/bin/env node

import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
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
import { UnifiedSearchService } from './UnifiedSearchService'

interface DocumentationIndex {
  type: 'component' | 'guide' | 'composable' | 'directive' | 'plugin' | 'helper'
  name: string
  displayName: string
  description: string
  tags: string[]
  uri: string
}

/**
 * MCP server for Maz-UI documentation
 * Provides robust access to Vue.js components, guides, composables, directives, plugins, and helper utilities
 * with fuzzy search, comprehensive indexing, and intelligent fallbacks
 */
export class MazUiMcpServer {
  private server: Server
  private documentationService = new DocumentationService()
  private unifiedSearchService = new UnifiedSearchService()
  private documentationIndex: DocumentationIndex[] = []

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

    this.buildDocumentationIndex()
    this.setupHandlers()
  }

  public getDocumentationService(): DocumentationService {
    return this.documentationService
  }

  /**
   * Build a comprehensive index of all available documentation
   * This helps the AI understand what's available and how to access it
   */
  private buildDocumentationIndex() {
    const index: DocumentationIndex[] = []

    // Add library overview
    index.push({
      type: 'guide',
      name: 'overview',
      displayName: 'Library Overview',
      description: 'Complete overview and introduction to Maz-UI Vue.js component library',
      tags: ['overview', 'introduction', 'getting-started', 'maz-ui'],
      uri: 'overview://',
    })

    // Index components
    const components = this.documentationService.getAllComponents()
    for (const component of components) {
      const pascalName = component.split('-').map(part =>
        part.charAt(0).toUpperCase() + part.slice(1),
      ).join('')

      // Extract component type from name for better categorization
      const componentType = this.getComponentType(component)
      const tags = [
        'component',
        'vue',
        component,
        pascalName.toLowerCase(),
        componentType,
        ...this.generateSearchTags(component),
      ]

      index.push({
        type: 'component',
        name: component,
        displayName: `${pascalName} Component`,
        description: `Vue.js ${componentType} component: ${pascalName} - Interactive UI element with props, events, slots and styling options`,
        tags,
        uri: `component://${component}`,
      })
    }

    // Index guides
    const guides = this.documentationService.getAllGuides()
    for (const guide of guides) {
      const displayName = guide.split('-').map(part =>
        part.charAt(0).toUpperCase() + part.slice(1),
      ).join(' ')

      const tags = [
        'guide',
        'documentation',
        guide,
        displayName.toLowerCase(),
        ...this.generateSearchTags(guide),
      ]

      index.push({
        type: 'guide',
        name: guide,
        displayName: `Guide: ${displayName}`,
        description: `Documentation guide: ${displayName} - Setup instructions, configuration options, and best practices`,
        tags,
        uri: `guide://${guide}`,
      })
    }

    // Index composables
    const composables = this.documentationService.getAllComposables()
    for (const composable of composables) {
      const tags = [
        'composable',
        'vue3',
        'composition-api',
        composable,
        composable.replace('use', '').toLowerCase(),
        ...this.generateSearchTags(composable),
      ]

      index.push({
        type: 'composable',
        name: composable,
        displayName: `${composable} Composable`,
        description: `Vue 3 Composition API composable: ${composable} - Reactive state management and reusable logic`,
        tags,
        uri: `composable://${composable}`,
      })
    }

    // Index directives
    const directives = this.documentationService.getAllDirectives()
    for (const directive of directives) {
      const tags = [
        'directive',
        'vue',
        'dom',
        directive,
        `v-${directive}`,
        ...this.generateSearchTags(directive),
      ]

      index.push({
        type: 'directive',
        name: directive,
        displayName: `v-${directive} Directive`,
        description: `Vue directive: v-${directive} - DOM manipulation and behavioral enhancement for elements`,
        tags,
        uri: `directive://${directive}`,
      })
    }

    // Index plugins
    const plugins = this.documentationService.getAllPlugins()
    for (const plugin of plugins) {
      const tags = [
        'plugin',
        'vue',
        'global',
        plugin,
        plugin.toLowerCase(),
        ...this.generateSearchTags(plugin),
      ]

      index.push({
        type: 'plugin',
        name: plugin,
        displayName: `${plugin} Plugin`,
        description: `Vue plugin: ${plugin} - Application-wide functionality and global services integration`,
        tags,
        uri: `plugin://${plugin}`,
      })
    }

    // Index helpers
    const helpers = this.documentationService.getAllHelpers()
    for (const helper of helpers) {
      const helperType = this.getHelperType(helper)
      const tags = [
        'helper',
        'utility',
        'function',
        helper,
        helperType,
        ...this.generateSearchTags(helper),
      ]

      index.push({
        type: 'helper',
        name: helper,
        displayName: `${helper} Helper`,
        description: `Utility helper: ${helper} - ${helperType} utility functions for data processing and manipulation`,
        tags,
        uri: `helper://${helper}`,
      })
    }

    this.documentationIndex = index
    this.unifiedSearchService.initialize(this.documentationService.getAllDocuments())
  }

  /**
   * Generate additional search tags based on common patterns
   */
  private generateSearchTags(name: string): string[] {
    const tags: string[] = []

    // Add common aliases and variations
    const commonMappings = {
      btn: ['button'],
      input: ['form', 'field'],
      select: ['dropdown', 'option'],
      dialog: ['modal', 'popup'],
      tooltip: ['hint', 'tip'],
      toast: ['notification', 'snackbar'],
      card: ['panel'],
      avatar: ['profile', 'image'],
      badge: ['label', 'tag'],
      spinner: ['loader', 'loading'],
      divider: ['separator'],
      drawer: ['sidebar', 'panel'],
      tabs: ['tab', 'navigation'],
      accordion: ['collapse', 'expand'],
      carousel: ['slider', 'slideshow'],
      gallery: ['images', 'photos'],
      stepper: ['steps', 'wizard'],
      table: ['grid', 'data'],
      chart: ['graph', 'visualization'],
      date: ['calendar', 'picker'],
      time: ['clock', 'picker'],
    }

    for (const [key, aliases] of Object.entries(commonMappings)) {
      if (name.toLowerCase().includes(key)) {
        tags.push(...aliases)
      }
    }

    return tags
  }

  /**
   * Determine component type for better categorization
   */
  private getComponentType(componentName: string): string {
    const formComponents = ['btn', 'checkbox', 'checklist', 'date', 'input', 'radio', 'select', 'slider', 'switch', 'textarea']
    const layoutComponents = ['accordion', 'card']
    const navigationComponents = ['tabs', 'stepper', 'pagination', 'link', 'pull', 'reading']
    const overlayComponents = ['dialog', 'drawer', 'sheet', 'popover', 'dropdown', 'backdrop']
    const dataComponents = ['chart', 'table', 'dropzone']
    const feedbackComponents = ['spinner', 'loading', 'progress', 'badge']
    const displayComponents = ['avatar', 'gallery', 'lazy', 'carousel', 'icon']
    const animationComponents = ['animated', 'expand']

    const lowerName = componentName.toLowerCase()

    if (formComponents.some(type => lowerName.includes(type)))
      return 'form'
    if (layoutComponents.some(type => lowerName.includes(type)))
      return 'layout'
    if (navigationComponents.some(type => lowerName.includes(type)))
      return 'navigation'
    if (overlayComponents.some(type => lowerName.includes(type)))
      return 'overlay'
    if (dataComponents.some(type => lowerName.includes(type)))
      return 'data'
    if (feedbackComponents.some(type => lowerName.includes(type)))
      return 'feedback'
    if (displayComponents.some(type => lowerName.includes(type)))
      return 'display'
    if (animationComponents.some(type => lowerName.includes(type)))
      return 'animation'

    return 'general'
  }

  /**
   * Determine helper type for better categorization
   */
  private getHelperType(helperName: string): string {
    const lowerName = helperName.toLowerCase()

    if (lowerName.includes('string') || lowerName.includes('text'))
      return 'string'
    if (lowerName.includes('date') || lowerName.includes('time'))
      return 'date'
    if (lowerName.includes('number') || lowerName.includes('currency'))
      return 'number'
    if (lowerName.includes('color') || lowerName.includes('theme'))
      return 'color'
    if (lowerName.includes('format') || lowerName.includes('parse'))
      return 'formatting'
    if (lowerName.includes('valid') || lowerName.includes('check'))
      return 'validation'

    return 'general'
  }

  /**
   * Resolve a document name using intelligent matching:
   * PascalCase (MazBtn), kebab-case (maz-btn), short name (btn), aliases
   */
  private resolveDocumentName(name: string, type?: string): DocumentationIndex | undefined {
    const normalizedName = name.toLowerCase().trim()
    const candidates = type && type !== 'auto'
      ? this.documentationIndex.filter(item => item.type === type)
      : this.documentationIndex

    // 1. Exact match on name
    const exactMatch = candidates.find(item => item.name.toLowerCase() === normalizedName)
    if (exactMatch) {
      return exactMatch
    }

    // 2. PascalCase → kebab-case conversion (e.g. MazBtn → maz-btn)
    if (/[A-Z]/.test(name)) {
      const kebabName = name
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')

      const kebabMatch = candidates.find(item => item.name.toLowerCase() === kebabName)
      if (kebabMatch) {
        return kebabMatch
      }
    }

    // 3. Short name with maz- prefix (e.g. btn → maz-btn)
    if (!normalizedName.startsWith('maz-')) {
      const prefixedName = `maz-${normalizedName}`
      const prefixMatch = candidates.find(item => item.name.toLowerCase() === prefixedName)
      if (prefixMatch) {
        return prefixMatch
      }
    }

    // 4. Match on displayName
    const displayMatch = candidates.find(item =>
      item.displayName.toLowerCase() === normalizedName,
    )
    if (displayMatch) {
      return displayMatch
    }

    // 5. Match on tags/aliases
    const tagMatch = candidates.find(item =>
      item.tags.some(tag => tag.toLowerCase() === normalizedName),
    )
    if (tagMatch) {
      return tagMatch
    }

    // 6. Partial name match (contains)
    const partialMatch = candidates.find(item =>
      item.name.toLowerCase().includes(normalizedName)
      || item.displayName.toLowerCase().includes(normalizedName),
    )
    if (partialMatch) {
      return partialMatch
    }

    return undefined
  }

  private handleSearch(args: Record<string, unknown> | undefined) {
    const query = args?.query as string
    const category = args?.category as string | undefined
    const maxResults = (args?.maxResults as number) || 10

    if (!query) {
      throw new Error('Search query is required. Provide a component name, description, prop name, or use case.')
    }

    const results = this.unifiedSearchService.search(query, {
      category: category as any,
      maxResults,
    })

    if (results.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `No results found for "${query}".${category ? ` (filtered by category: ${category})` : ''}\n\n**Suggestions:**\n- Try broader or different terms (e.g. "button" instead of "btn")\n- Remove the category filter to search all documentation\n- Use \`list\` to browse all available documentation`,
        }],
      }
    }

    let resultText = `# Search Results for "${query}" (${results.length} found)\n\n`

    for (const item of results) {
      resultText += `## ${item.displayName}\n`
      resultText += `- **Name**: \`${item.name}\`\n`
      resultText += `- **Type**: ${item.type}\n`
      resultText += `- **Description**: ${item.description}\n`
      resultText += `- **Score**: ${item.score}\n`
      resultText += `- **Snippet**: ${item.snippet}\n`
      resultText += `- **Get full doc**: Use \`get_doc\` with name \`${item.name}\`\n\n`
    }

    return {
      content: [{
        type: 'text',
        text: resultText,
      }],
    }
  }

  private handleList(args: Record<string, unknown> | undefined) {
    const category = (args?.category as string) || 'all'

    const filteredIndex = category === 'all'
      ? this.documentationIndex
      : this.documentationIndex.filter(item => item.type === category)

    const groupedDocs = filteredIndex.reduce((acc, item) => {
      if (!acc[item.type])
        acc[item.type] = []
      acc[item.type].push(item)
      return acc
    }, {} as Record<string, DocumentationIndex[]>)

    const typeLabels: Record<string, string> = {
      component: 'Components',
      guide: 'Guides',
      composable: 'Composables',
      directive: 'Directives',
      plugin: 'Plugins',
      helper: 'Helpers',
    }

    const typeOrder = ['component', 'guide', 'composable', 'directive', 'plugin', 'helper']

    let result = `# Maz-UI Documentation (${filteredIndex.length} items)\n\n`

    for (const type of typeOrder) {
      if (!groupedDocs[type])
        continue

      const items = groupedDocs[type].sort((a, b) => a.name.localeCompare(b.name))
      result += `## ${typeLabels[type]} (${items.length})\n\n`

      for (const item of items) {
        result += `- **${item.displayName}** (\`${item.name}\`) — ${item.description}\n`
      }
      result += '\n'
    }

    return {
      content: [{
        type: 'text',
        text: result.trim(),
      }],
    }
  }

  private handleGetDoc(args: Record<string, unknown> | undefined) {
    const docName = args?.name as string
    const docType = (args?.type as string) || 'auto'

    if (!docName) {
      throw new Error('Name is required')
    }

    const found = this.resolveDocumentName(docName, docType)

    if (!found) {
      return this.handleDocNotFound(docName)
    }

    const content = this.getDocumentContent(found)

    if (!content) {
      return {
        content: [{
          type: 'text',
          text: `Found "${found.displayName}" but documentation content is not available. This might be a documentation file that needs to be created.`,
        }],
      }
    }

    return {
      content: [{
        type: 'text',
        text: content,
      }],
    }
  }

  private handleDocNotFound(docName: string) {
    const searchResults = this.unifiedSearchService.search(docName, { maxResults: 3 })

    if (searchResults.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `Documentation not found for "${docName}".\n\n**Available options:**\n- Use \`search\` to find similar items\n- Use \`list\` to see all available documentation`,
        }],
      }
    }

    const suggestions = searchResults
      .map(item => `- **${item.displayName}** (\`${item.name}\`) - ${item.description}`)
      .join('\n')

    return {
      content: [{
        type: 'text',
        text: `Exact match not found for "${docName}". Did you mean:\n\n${suggestions}\n\n**Use \`get_doc\` with the exact name from above.**`,
      }],
    }
  }

  private getDocumentContent(doc: DocumentationIndex): string {
    const contentMethods: Record<string, (name: string) => string> = {
      component: name => this.documentationService.getComponentDocumentation(name),
      guide: name => this.documentationService.getGuideDocumentation(name),
      composable: name => this.documentationService.getComposableDocumentation(name),
      directive: name => this.documentationService.getDirectiveDocumentation(name),
      plugin: name => this.documentationService.getPluginDocumentation(name),
      helper: name => this.documentationService.getHelperDocumentation(name),
    }

    const getContent = contentMethods[doc.type]
    return getContent ? getContent(doc.name) : ''
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, () => {
      return {
        resources: this.documentationIndex.map(item => ({
          uri: item.uri,
          name: item.displayName,
          description: item.description,
          mimeType: 'text/markdown',
        })),
      }
    })

    this.server.setRequestHandler(ReadResourceRequestSchema, (request) => {
      const { uri } = request.params

      if (!uri) {
        throw new Error('URI is required')
      }

      // Parse different URI formats
      let type: string, name: string

      if (uri === 'overview://') {
        type = 'overview'
        name = ''
      }
      else if (uri.includes('://')) {
        [type, name] = uri.split('://')
      }
      else {
        throw new Error('Invalid URI format. Expected format: type://name')
      }

      if (!name && type !== 'overview') {
        throw new Error('Resource name is required')
      }

      let content: string

      try {
        switch (type) {
          case 'overview':
            content = this.documentationService.getOverview()
            if (!content) {
              const diagnostics = this.documentationService.getDiagnostics()
              content = `# Maz-UI Vue.js Component Library\n\n## Quick Stats\n- **${diagnostics.components.total} Components** - Ready-to-use Vue components\n- **${diagnostics.composables.total} Composables** - Vue 3 reactive utilities\n- **${diagnostics.directives.total} Directives** - DOM helpers\n- **${diagnostics.plugins.total} Plugins** - App-wide services\n- **${diagnostics.helpers.total} Helpers** - Utility functions\n- **${diagnostics.guides.total} Guides** - Documentation\n\n## Getting Started\nUse the MCP tools to explore components and features:\n- \`list\` - See everything available\n- \`search\` - Find specific features\n- \`get_doc\` - Get detailed documentation`
            }
            break
          case 'component':
            content = this.documentationService.getComponentDocumentation(name!)
            break
          case 'guide':
            content = this.documentationService.getGuideDocumentation(name!)
            break
          case 'composable':
            content = this.documentationService.getComposableDocumentation(name!)
            break
          case 'directive':
            content = this.documentationService.getDirectiveDocumentation(name!)
            break
          case 'plugin':
            content = this.documentationService.getPluginDocumentation(name!)
            break
          case 'helper':
            content = this.documentationService.getHelperDocumentation(name!)
            break
          default:
            throw new Error(`Unknown resource type: ${type}. Valid types: overview, component, guide, composable, directive, plugin, helper`)
        }

        if (!content) {
          throw new Error(`Documentation not found for ${type}: ${name}`)
        }

        return {
          contents: [{
            uri,
            mimeType: 'text/markdown',
            text: content,
          }],
        }
      }
      catch (error) {
        throw new Error(`Failed to read ${type} documentation for "${name}": ${getErrorMessage(error)}`, { cause: error })
      }
    })

    this.server.setRequestHandler(ListToolsRequestSchema, () => {
      return {
        tools: [
          {
            name: 'search',
            description: 'Search across ALL Maz-UI documentation using a powerful unified search engine. Combines exact name matching, tag/alias matching, and full-text content search with TF-IDF scoring. Use this tool for any search query: component names (e.g. "MazBtn"), functional descriptions (e.g. "date picker"), prop names (e.g. "model-value"), use cases (e.g. "form validation"), or aliases (e.g. "modal" for dialog). Returns ranked results with contextual snippets.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query — can be a component name, description, prop name, use case, or alias. Examples: "button", "MazDialog", "model-value", "phone number input", "lazy loading"',
                },
                category: {
                  type: 'string',
                  enum: ['component', 'guide', 'composable', 'directive', 'plugin', 'helper'],
                  description: 'Optional filter to restrict results to a specific documentation category',
                },
                maxResults: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 10)',
                  default: 10,
                  minimum: 1,
                  maximum: 50,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_doc',
            description: 'Get the complete documentation for a specific item. Supports exact names and common aliases. If the exact name isn\'t found, provides intelligent suggestions based on fuzzy matching.',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Exact name or common alias. Examples: "maz-btn" or "MazBtn" for components, "useToast" for composables, "tooltip" for directives',
                },
                type: {
                  type: 'string',
                  enum: ['auto', 'component', 'guide', 'composable', 'directive', 'plugin', 'helper'],
                  description: 'Type hint to improve search accuracy (optional). Use "auto" to search all types.',
                  default: 'auto',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'list',
            description: 'Browse all available Maz-UI documentation grouped by category. Returns a structured list with counters per category and for each item: name, displayName, description. Use this tool to discover what components, composables, directives, plugins, helpers, and guides are available. Examples: list all docs, list only components, list composables.',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['all', 'component', 'guide', 'composable', 'directive', 'plugin', 'helper'],
                  description: 'Filter by documentation category. Use "all" or omit to see everything.',
                  default: 'all',
                },
              },
            },
          },
        ],
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'search':
            return this.handleSearch(args)
          case 'list':
            return this.handleList(args)
          case 'get_doc':
            return this.handleGetDoc(args)
          default:
            throw new Error(`Unknown tool: ${name}. Available tools: search, get_doc, list`)
        }
      }
      catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${getErrorMessage(error)}\n\n**Available tools:**\n- \`search\` - Search across all documentation\n- \`get_doc\` - Get specific documentation\n- \`list\` - Browse all available documentation`,
          }],
          isError: true,
        }
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
