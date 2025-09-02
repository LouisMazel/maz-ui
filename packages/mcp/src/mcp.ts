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
   * Fuzzy search implementation
   */
  private fuzzySearch(query: string, targets: string[]): string[] {
    const normalizedQuery = query.toLowerCase().trim()

    return targets
      .map(target => ({
        target,
        score: this.calculateFuzzyScore(normalizedQuery, target.toLowerCase()),
      }))
      .filter(item => item.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .map(item => item.target)
  }

  /**
   * Calculate fuzzy match score
   */
  private calculateFuzzyScore(query: string, target: string): number {
    if (target.includes(query))
      return 1.0
    if (query.length === 0)
      return 0

    let score = 0
    let queryIndex = 0

    for (let i = 0; i < target.length && queryIndex < query.length; i++) {
      if (target[i] === query[queryIndex]) {
        score += 1 / target.length
        queryIndex++
      }
    }

    return queryIndex === query.length ? score : 0
  }

  /**
   * Search in documentation index with fuzzy matching
   */
  private searchInIndex(query: string): DocumentationIndex[] {
    const normalizedQuery = query.toLowerCase().trim()
    const results: Array<{ item: DocumentationIndex, score: number }> = []

    for (const item of this.documentationIndex) {
      let maxScore = 0

      // Check exact name match (highest priority)
      if (item.name.toLowerCase() === normalizedQuery) {
        maxScore = 1.0
      }
      // Check display name match
      else if (item.displayName.toLowerCase().includes(normalizedQuery)) {
        maxScore = Math.max(maxScore, 0.9)
      }
      // Check tag matches with fuzzy search
      else {
        // Use fuzzy search on all tags
        const tagMatches = this.fuzzySearch(normalizedQuery, item.tags)
        if (tagMatches.length > 0) {
          maxScore = Math.max(maxScore, 0.8)
        }

        // Also check fuzzy match on name and display name
        const nameScore = this.calculateFuzzyScore(normalizedQuery, item.name.toLowerCase())
        const displayScore = this.calculateFuzzyScore(normalizedQuery, item.displayName.toLowerCase())

        maxScore = Math.max(maxScore, nameScore * 0.7, displayScore * 0.6)
      }

      if (maxScore > 0.3) {
        results.push({ item, score: maxScore })
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Limit results
      .map(r => r.item)
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

      let content = ''

      try {
        switch (type) {
          case 'overview':
            content = this.documentationService.getOverview()
            if (!content) {
              const diagnostics = this.documentationService.getDiagnostics()
              content = `# Maz-UI Vue.js Component Library\n\n## Quick Stats\n- **${diagnostics.components.total} Components** - Ready-to-use Vue components\n- **${diagnostics.composables.total} Composables** - Vue 3 reactive utilities\n- **${diagnostics.directives.total} Directives** - DOM helpers\n- **${diagnostics.plugins.total} Plugins** - App-wide services\n- **${diagnostics.helpers.total} Helpers** - Utility functions\n- **${diagnostics.guides.total} Guides** - Documentation\n\n## Getting Started\nUse the MCP tools to explore components and features:\n- \`list_all_docs\` - See everything available\n- \`smart_search\` - Find specific features\n- \`get_doc\` - Get detailed documentation`
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
        throw new Error(`Failed to read ${type} documentation for "${name}": ${getErrorMessage(error)}`)
      }
    })

    this.server.setRequestHandler(ListToolsRequestSchema, () => {
      return {
        tools: [
          {
            name: 'list_all_docs',
            description: 'Get a complete, categorized index of ALL available documentation in Maz-UI. This is the best starting point to understand what\'s available. Returns components, guides, composables, directives, plugins, and helpers with descriptions and search tags.',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['all', 'components', 'guides', 'composables', 'directives', 'plugins', 'helpers'],
                  description: 'Filter by category (optional). Use "all" or omit to see everything.',
                  default: 'all',
                },
                includeDescriptions: {
                  type: 'boolean',
                  description: 'Include detailed descriptions for each item',
                  default: true,
                },
              },
            },
          },
          {
            name: 'smart_search',
            description: 'Intelligent search across ALL Maz-UI documentation with fuzzy matching and suggestions. Searches names, descriptions, and tags. Perfect when you know roughly what you\'re looking for but not the exact name (e.g., "button", "dropdown", "form validation", "dark mode").',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search term - can be partial, fuzzy, or describe functionality. Examples: "button", "modal", "form", "tooltip", "validation", "date picker"',
                },
                maxResults: {
                  type: 'number',
                  description: 'Maximum number of results to return',
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
            name: 'get_installation_guide',
            description: 'Get comprehensive installation and setup instructions for Maz-UI, including npm installation, Vue.js integration, and initial configuration.',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_components_by_category',
            description: 'Get components organized by functional category (form, layout, navigation, overlay, data, feedback, display, animation). Helps discover related components and understand the library structure.',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['all', 'form', 'layout', 'navigation', 'overlay', 'data', 'feedback', 'display', 'animation', 'general'],
                  description: 'Component category to filter by',
                  default: 'all',
                },
              },
            },
          },
          {
            name: 'suggest_similar',
            description: 'When you can\'t find exactly what you\'re looking for, this tool suggests similar or related documentation based on functionality, naming patterns, and common use cases.',
            inputSchema: {
              type: 'object',
              properties: {
                description: {
                  type: 'string',
                  description: 'Describe what you\'re trying to achieve or find. Example: "I need a way to show notifications", "looking for form validation", "need a date selector"',
                },
              },
              required: ['description'],
            },
          },
        ],
      }
    })

    // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
    this.server.setRequestHandler(CallToolRequestSchema, (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'list_all_docs': {
            const category = (args?.category as string) || 'all'
            const includeDescriptions = (args?.includeDescriptions as boolean) ?? true

            let filteredIndex = this.documentationIndex
            if (category !== 'all') {
              filteredIndex = this.documentationIndex.filter(item =>
                category === 'components' ? item.type === 'component' : item.type === category,
              )
            }

            const groupedDocs = filteredIndex.reduce((acc, item) => {
              if (!acc[item.type])
                acc[item.type] = []
              acc[item.type].push(item)
              return acc
            }, {} as Record<string, DocumentationIndex[]>)

            let result = `# Maz-UI Documentation Index (${filteredIndex.length} items)\n\n`

            const typeOrder = ['component', 'guide', 'composable', 'directive', 'plugin', 'helper']
            const typeLabels = {
              component: 'Vue Components',
              guide: 'Documentation Guides',
              composable: 'Vue 3 Composables',
              directive: 'Vue Directives',
              plugin: 'Vue Plugins',
              helper: 'Utility Helpers',
            }

            for (const type of typeOrder) {
              if (!groupedDocs[type])
                continue

              result += `## ${typeLabels[type as keyof typeof typeLabels]} (${groupedDocs[type].length})\n\n`

              for (const item of groupedDocs[type].sort((a, b) => a.name.localeCompare(b.name))) {
                result += `### ${item.displayName}\n`
                result += `- **Name**: \`${item.name}\`\n`

                // eslint-disable-next-line max-depth
                if (includeDescriptions) {
                  result += `- **Description**: ${item.description}\n`
                  result += `- **Tags**: ${item.tags.slice(0, 5).join(', ')}\n`
                }
                result += `- **Get docs**: Use \`get_doc\` with name \`${item.name}\`\n\n`
              }
            }

            result += `\n---\n**💡 Tips:**\n- Use \`smart_search\` to find specific functionality\n- Use \`get_doc\` with any name from above\n- Use \`get_components_by_category\` to explore by function`

            return {
              content: [{
                type: 'text',
                text: result,
              }],
            }
          }

          case 'smart_search': {
            const query = args?.query as string
            const maxResults = (args?.maxResults as number) || 10

            if (!query) {
              throw new Error('Search query is required')
            }

            const results = this.searchInIndex(query).slice(0, maxResults)

            if (results.length === 0) {
              // Provide helpful suggestions when nothing is found
              const suggestions = this.documentationIndex
                .map(item => item.name)
                .slice(0, 10)
                .join(', ')

              return {
                content: [{
                  type: 'text',
                  text: `No results found for "${query}".\n\n**Suggestions:**\n- Try broader terms like "button", "form", "modal"\n- Check available items: ${suggestions}\n- Use \`list_all_docs\` to see everything available\n- Use \`suggest_similar\` if you're looking for specific functionality`,
                }],
              }
            }

            let resultText = `# Search Results for "${query}" (${results.length} found)\n\n`

            for (const item of results) {
              resultText += `## ${item.displayName}\n`
              resultText += `- **Type**: ${item.type}\n`
              resultText += `- **Name**: \`${item.name}\`\n`
              resultText += `- **Description**: ${item.description}\n`
              resultText += `- **Use**: \`get_doc\` with name \`${item.name}\`\n\n`
            }

            resultText += `\n**💡 Use \`get_doc\` with any name above to see full documentation.**`

            return {
              content: [{
                type: 'text',
                text: resultText,
              }],
            }
          }

          case 'get_doc': {
            const name = args?.name as string
            const type = (args?.type as string) || 'auto'

            if (!name) {
              throw new Error('Name is required')
            }

            // First, try exact match in index
            let found = this.documentationIndex.find(item =>
              item.name.toLowerCase() === name.toLowerCase()
              || item.displayName.toLowerCase() === name.toLowerCase()
              || item.tags.some(tag => tag.toLowerCase() === name.toLowerCase()),
            )

            // If type specified, filter by type
            if (!found && type !== 'auto') {
              found = this.documentationIndex.find(item =>
                item.type === type && (
                  item.name.toLowerCase().includes(name.toLowerCase())
                  || item.displayName.toLowerCase().includes(name.toLowerCase())
                ),
              )
            }

            if (!found) {
              // Use fuzzy search as fallback with enhanced matching
              const fuzzyResults = this.searchInIndex(name).slice(0, 5)

              // Also try fuzzy search specifically on names
              const allNames = this.documentationIndex.map(item => item.name)
              const fuzzyNameMatches = this.fuzzySearch(name, allNames).slice(0, 3)

              // Combine results
              const combinedResults = new Set([
                ...fuzzyResults.map(item => item.name),
                ...fuzzyNameMatches,
              ])

              if (combinedResults.size === 0) {
                return {
                  content: [{
                    type: 'text',
                    text: `Documentation not found for "${name}".\n\n**Available options:**\n- Use \`smart_search\` to find similar items\n- Use \`list_all_docs\` to see all available documentation\n- Use \`suggest_similar\` to describe what you're looking for`,
                  }],
                }
              }

              // Build suggestions from combined results
              const suggestions = Array.from(combinedResults)
                .slice(0, 5)
                .map((itemName) => {
                  const item = this.documentationIndex.find(i => i.name === itemName)
                  return item ? `- **${item.displayName}** (\`${item.name}\`) - ${item.description}` : `- \`${itemName}\``
                })
                .join('\n')

              return {
                content: [{
                  type: 'text',
                  text: `Exact match not found for "${name}". Did you mean:\n\n${suggestions}\n\n**💡 Use \`get_doc\` with the exact name from above.**`,
                }],
              }
            }

            // Get the actual documentation content
            let content = ''
            const docName = found.name

            switch (found.type) {
              case 'component':
                content = this.documentationService.getComponentDocumentation(docName)
                break
              case 'guide':
                content = this.documentationService.getGuideDocumentation(docName)
                break
              case 'composable':
                content = this.documentationService.getComposableDocumentation(docName)
                break
              case 'directive':
                content = this.documentationService.getDirectiveDocumentation(docName)
                break
              case 'plugin':
                content = this.documentationService.getPluginDocumentation(docName)
                break
              case 'helper':
                content = this.documentationService.getHelperDocumentation(docName)
                break
            }

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

          case 'get_installation_guide': {
            // Try multiple common guide names for installation
            const installationGuides = ['getting-started', 'installation', 'setup', 'quick-start']
            let guide = ''

            for (const guideName of installationGuides) {
              guide = this.documentationService.getGuideDocumentation(guideName)
              if (guide)
                break
            }

            if (!guide) {
              guide = this.documentationService.getOverview()
            }

            if (!guide) {
              guide = `# Maz-UI Installation\n\n## Quick Start\n\n\`\`\`bash\nnpm install maz-ui\n# or\nyarn add maz-ui\n# or  \npnpm add maz-ui\n\`\`\`\n\n## Vue.js Integration\n\n\`\`\`javascript\nimport { createApp } from 'vue'\nimport MazUI from 'maz-ui'\nimport 'maz-ui/dist/style.css'\n\nconst app = createApp(App)\napp.use(MazUI)\napp.mount('#app')\n\`\`\`\n\n**💡 Use \`smart_search\` with "setup" or "configuration" for more detailed guides.**`
            }

            return {
              content: [{
                type: 'text',
                text: guide,
              }],
            }
          }

          case 'get_components_by_category': {
            const category = (args?.category as string) || 'all'

            const componentsByCategory = this.documentationIndex
              .filter(item => item.type === 'component')
              .reduce((acc, item) => {
                const componentType = this.getComponentType(item.name)
                if (!acc[componentType])
                  acc[componentType] = []
                acc[componentType].push(item)
                return acc
              }, {} as Record<string, DocumentationIndex[]>)

            let result = ''

            if (category === 'all') {
              result = `# Components by Category\n\n`

              const categoryDescriptions = {
                form: 'Input elements and form controls',
                layout: 'Structure and positioning components',
                navigation: 'Navigation and wayfinding components',
                overlay: 'Modal dialogs and overlay components',
                data: 'Data visualization and table components',
                feedback: 'Loading states and progress indicators',
                display: 'Media display and visual components',
                animation: 'Animated and interactive elements',
                general: 'General purpose components',
              }

              for (const [cat, components] of Object.entries(componentsByCategory)) {
                result += `## ${cat.charAt(0).toUpperCase() + cat.slice(1)} Components (${components.length})\n`
                result += `*${categoryDescriptions[cat as keyof typeof categoryDescriptions]}*\n\n`

                // eslint-disable-next-line max-depth
                for (const component of components.sort((a, b) => a.name.localeCompare(b.name))) {
                  result += `- **${component.displayName}** (\`${component.name}\`) - ${component.description.split(' - ')[1]}\n`
                }
                result += '\n'
              }
            }
            else {
              const components = componentsByCategory[category] || []
              result = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Components (${components.length})\n\n`

              for (const component of components.sort((a, b) => a.name.localeCompare(b.name))) {
                result += `## ${component.displayName}\n`
                result += `- **Name**: \`${component.name}\`\n`
                result += `- **Description**: ${component.description}\n`
                result += `- **Get docs**: Use \`get_doc\` with name \`${component.name}\`\n\n`
              }
            }

            result += `\n**💡 Use \`get_doc\` with any component name to see full documentation.**`

            return {
              content: [{
                type: 'text',
                text: result,
              }],
            }
          }

          case 'suggest_similar': {
            const description = args?.description as string

            if (!description) {
              throw new Error('Description is required')
            }

            // Extract keywords from description
            const keywords = description.toLowerCase()
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 2)

            const suggestions = new Map<string, number>()

            // Score items based on keyword matches and fuzzy search
            for (const item of this.documentationIndex) {
              let score = 0
              const itemText = `${item.name} ${item.displayName} ${item.description} ${item.tags.join(' ')}`.toLowerCase()

              // Keyword matching
              for (const keyword of keywords) {
                // eslint-disable-next-line max-depth
                if (itemText.includes(keyword)) {
                  score += 1
                }
              }

              // Fuzzy search on tags for each keyword
              for (const keyword of keywords) {
                const fuzzyMatches = this.fuzzySearch(keyword, item.tags)
                // eslint-disable-next-line max-depth
                if (fuzzyMatches.length > 0) {
                  score += 0.5 * fuzzyMatches.length
                }
              }

              if (score > 0) {
                suggestions.set(`${item.type}:${item.name}`, score)
              }
            }

            // Also do direct fuzzy search on the full description
            const fuzzyResults = this.searchInIndex(description)

            // Combine and deduplicate results
            const allSuggestions = new Set([
              ...Array.from(suggestions.entries())
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([key]) => key),
              ...fuzzyResults.slice(0, 3).map(item => `${item.type}:${item.name}`),
            ])

            if (allSuggestions.size === 0) {
              return {
                content: [{
                  type: 'text',
                  text: `No direct suggestions found for "${description}".\n\n**Try these approaches:**\n- Use \`list_all_docs\` to browse all available features\n- Use \`smart_search\` with simpler keywords\n- Use \`get_components_by_category\` to explore by function\n\nCommon categories: form, layout, navigation, feedback, display, action`,
                }],
              }
            }

            let result = `# Suggestions based on: "${description}"\n\n`

            for (const suggestionKey of Array.from(allSuggestions).slice(0, 8)) {
              const [type, name] = suggestionKey.split(':')
              const item = this.documentationIndex.find(i => i.type === type && i.name === name)

              if (item) {
                result += `## ${item.displayName}\n`
                result += `- **Type**: ${item.type}\n`
                result += `- **Description**: ${item.description}\n`
                result += `- **Get docs**: Use \`get_doc\` with name \`${item.name}\`\n\n`
              }
            }

            result += `\n**💡 Use \`get_doc\` with any name above, or try \`smart_search\` with specific terms.**`

            return {
              content: [{
                type: 'text',
                text: result,
              }],
            }
          }

          default:
            throw new Error(`Unknown tool: ${name}. Available tools: list_all_docs, smart_search, get_doc, get_installation_guide, get_components_by_category, suggest_similar`)
        }
      }
      catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ **Error**: ${getErrorMessage(error)}\n\n**Available tools:**\n- \`list_all_docs\` - See all documentation\n- \`smart_search\` - Search by keyword\n- \`get_doc\` - Get specific documentation\n- \`get_installation_guide\` - Setup instructions\n- \`get_components_by_category\` - Browse by function\n- \`suggest_similar\` - Find related items`,
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
