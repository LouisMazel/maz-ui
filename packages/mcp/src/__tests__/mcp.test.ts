import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { version } from '../../package.json' with { type: 'json' }
import { DocumentationService } from '../DocumentationService'

import { MazUiMcpServer } from '../mcp'
import { UnifiedSearchService } from '../UnifiedSearchService'

vi.mock('@modelcontextprotocol/sdk/server/index.js')
vi.mock('@modelcontextprotocol/sdk/server/stdio.js')
vi.mock('../DocumentationService')
vi.mock('../UnifiedSearchService')

const mockServer = {
  setRequestHandler: vi.fn(),
  connect: vi.fn(),
}

const mockDocumentationService = {
  getAllComponents: vi.fn(),
  getAllGuides: vi.fn(),
  getAllComposables: vi.fn(),
  getAllDirectives: vi.fn(),
  getAllPlugins: vi.fn(),
  getAllHelpers: vi.fn(),
  getAllDocuments: vi.fn(),
  getOverview: vi.fn(),
  getComponentDocumentation: vi.fn(),
  getGuideDocumentation: vi.fn(),
  getComposableDocumentation: vi.fn(),
  getDirectiveDocumentation: vi.fn(),
  getPluginDocumentation: vi.fn(),
  getHelperDocumentation: vi.fn(),
  searchDocumentation: vi.fn(),
  getDiagnostics: vi.fn(),
}

const mockUnifiedSearchService = {
  initialize: vi.fn(),
  search: vi.fn(),
}

const MockServer = vi.mocked(Server)
const MockStdioServerTransport = vi.mocked(StdioServerTransport)
const MockDocumentationService = vi.mocked(DocumentationService)
const MockUnifiedSearchService = vi.mocked(UnifiedSearchService)

let resourceListHandler: any = null
let resourceReadHandler: any = null
let toolsListHandler: any = null
let callToolHandler: any = null

describe('Given MazUiMcpServer instance', () => {
  let server: MazUiMcpServer

  beforeEach(() => {
    vi.clearAllMocks()
    resourceListHandler = null
    resourceReadHandler = null
    toolsListHandler = null
    callToolHandler = null

    mockDocumentationService.getAllComponents.mockReturnValue([
      'maz-btn',
      'maz-input',
      'maz-select',
      'maz-dialog',
      'maz-card',
      'maz-tabs',
      'maz-table',
      'maz-spinner',
      'maz-avatar',
      'maz-animated-counter',
    ])
    mockDocumentationService.getAllGuides.mockReturnValue(['getting-started', 'theming'])
    mockDocumentationService.getAllComposables.mockReturnValue(['use-toast', 'useThemeHandler'])
    mockDocumentationService.getAllDirectives.mockReturnValue(['tooltip', 'zoom-img'])
    mockDocumentationService.getAllPlugins.mockReturnValue(['toast', 'aos'])
    mockDocumentationService.getAllHelpers.mockReturnValue([
      'currency',
      'date',
      'capitalize',
      'checkAvailability',
      'formatNumber',
      'colorUtils',
    ])
    mockDocumentationService.getOverview.mockReturnValue('# Maz-UI Overview')
    mockDocumentationService.getAllDocuments.mockReturnValue([])

    let callIndex = 0
    mockServer.setRequestHandler.mockImplementation((schema: any, handler: any) => {
      if (callIndex === 0)
        resourceListHandler = handler
      else if (callIndex === 1)
        resourceReadHandler = handler
      else if (callIndex === 2)
        toolsListHandler = handler
      else if (callIndex === 3)
        callToolHandler = handler
      callIndex++
    })

    // eslint-disable-next-line prefer-arrow-callback
    MockServer.mockImplementation(function () {
      return mockServer as any
    })
    // eslint-disable-next-line prefer-arrow-callback
    MockStdioServerTransport.mockImplementation(function () {
      return {} as any
    })
    // eslint-disable-next-line prefer-arrow-callback
    MockDocumentationService.mockImplementation(function () {
      return mockDocumentationService as any
    })
    // eslint-disable-next-line prefer-arrow-callback
    MockUnifiedSearchService.mockImplementation(function () {
      return mockUnifiedSearchService as any
    })

    server = new MazUiMcpServer()
  })

  describe('When initializing server', () => {
    it('Then creates server with name and version', () => {
      expect(MockServer).toHaveBeenCalledWith(
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
    })

    it('Then registers all required request handlers', () => {
      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(4)
    })

    it('Then initializes unified search service with all documents', () => {
      expect(mockUnifiedSearchService.initialize).toHaveBeenCalledWith([])
    })
  })

  describe('When handling resource list requests', () => {
    it('Then returns comprehensive resource list', () => {
      const result = resourceListHandler()

      expect(result.resources.length).toBeGreaterThan(0)

      const overview = result.resources.find((r: any) => r.uri === 'overview://')
      expect(overview).toBeDefined()
      expect(overview.name).toBe('Library Overview')
      expect(overview.mimeType).toBe('text/markdown')
    })

    it('Then includes resources for all documentation types', () => {
      const result = resourceListHandler()
      const uris = result.resources.map((r: any) => r.uri)

      expect(uris).toContain('overview://')
      expect(uris.some((u: string) => u.startsWith('component://'))).toBe(true)
      expect(uris.some((u: string) => u.startsWith('guide://'))).toBe(true)
      expect(uris.some((u: string) => u.startsWith('composable://'))).toBe(true)
      expect(uris.some((u: string) => u.startsWith('directive://'))).toBe(true)
      expect(uris.some((u: string) => u.startsWith('plugin://'))).toBe(true)
      expect(uris.some((u: string) => u.startsWith('helper://'))).toBe(true)
    })
  })

  describe('When handling resource read requests', () => {
    it('Then reads component documentation', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const result = resourceReadHandler({
        params: { uri: 'component://maz-btn' },
      })

      expect(mockDocumentationService.getComponentDocumentation).toHaveBeenCalledWith('maz-btn')
      expect(result).toEqual({
        contents: [{
          uri: 'component://maz-btn',
          mimeType: 'text/markdown',
          text: '# MazBtn Component',
        }],
      })
    })

    it('Then reads overview documentation', () => {
      const result = resourceReadHandler({ params: { uri: 'overview://' } })

      expect(result.contents[0].text).toBe('# Maz-UI Overview')
    })

    it('Then provides fallback overview when getOverview returns empty', () => {
      mockDocumentationService.getOverview.mockReturnValue('')
      mockDocumentationService.getDiagnostics = vi.fn().mockReturnValue({
        components: { total: 10 },
        composables: { total: 5 },
        directives: { total: 3 },
        plugins: { total: 2 },
        helpers: { total: 8 },
        guides: { total: 4 },
      })

      const result = resourceReadHandler({ params: { uri: 'overview://' } })
      expect(result.contents[0].text).toContain('10 Components')
    })

    it('Then reads guide documentation', () => {
      mockDocumentationService.getGuideDocumentation.mockReturnValue('# Getting Started')
      const result = resourceReadHandler({ params: { uri: 'guide://getting-started' } })
      expect(result.contents[0].text).toBe('# Getting Started')
    })

    it('Then reads composable documentation', () => {
      mockDocumentationService.getComposableDocumentation.mockReturnValue('# useToast')
      const result = resourceReadHandler({ params: { uri: 'composable://use-toast' } })
      expect(result.contents[0].text).toBe('# useToast')
    })

    it('Then reads directive documentation', () => {
      mockDocumentationService.getDirectiveDocumentation.mockReturnValue('# Tooltip')
      const result = resourceReadHandler({ params: { uri: 'directive://tooltip' } })
      expect(result.contents[0].text).toBe('# Tooltip')
    })

    it('Then reads plugin documentation', () => {
      mockDocumentationService.getPluginDocumentation.mockReturnValue('# Toast Plugin')
      const result = resourceReadHandler({ params: { uri: 'plugin://toast' } })
      expect(result.contents[0].text).toBe('# Toast Plugin')
    })

    it('Then reads helper documentation', () => {
      mockDocumentationService.getHelperDocumentation.mockReturnValue('# Currency Helper')
      const result = resourceReadHandler({ params: { uri: 'helper://currency' } })
      expect(result.contents[0].text).toBe('# Currency Helper')
    })

    it('Then throws error for unknown resource type', () => {
      expect(() => resourceReadHandler({ params: { uri: 'unknown://test' } })).toThrow('Failed to read')
    })

    it('Then throws error for missing name in non-overview URI', () => {
      expect(() => resourceReadHandler({ params: { uri: 'component://' } })).toThrow()
    })

    it('Then throws error for invalid URI format', () => {
      expect(() => resourceReadHandler({ params: { uri: 'invalid-format' } })).toThrow('Invalid URI format')
    })

    it('Then throws error when resource not found', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('')

      expect(() => resourceReadHandler({ params: { uri: 'component://non-existent' } })).toThrow('Documentation not found')
    })
  })

  describe('When handling tools list requests', () => {
    it('Then returns exactly 3 tools', () => {
      const result = toolsListHandler()

      expect(result.tools).toHaveLength(3)
      const toolNames = result.tools.map((t: any) => t.name)
      expect(toolNames).toContain('search')
      expect(toolNames).toContain('get_doc')
      expect(toolNames).toContain('list')
    })

    it('Then search tool has AI-optimized description with examples', () => {
      const result = toolsListHandler()
      const searchTool = result.tools.find((t: any) => t.name === 'search')

      expect(searchTool.description).toContain('MazBtn')
      expect(searchTool.description).toContain('date picker')
      expect(searchTool.description).toContain('TF-IDF')
      expect(searchTool.inputSchema.required).toEqual(['query'])
    })

    it('Then get_doc tool has name resolution description', () => {
      const result = toolsListHandler()
      const getDocTool = result.tools.find((t: any) => t.name === 'get_doc')

      expect(getDocTool.description).toContain('aliases')
      expect(getDocTool.inputSchema.required).toEqual(['name'])
    })

    it('Then list tool has category filter enum', () => {
      const result = toolsListHandler()
      const listTool = result.tools.find((t: any) => t.name === 'list')

      expect(listTool.inputSchema.properties.category.enum).toEqual([
        'all',
        'component',
        'guide',
        'composable',
        'directive',
        'plugin',
        'helper',
      ])
    })
  })

  describe('When calling search tool', () => {
    it('Then returns ranked results with scores and snippets', () => {
      mockUnifiedSearchService.search.mockReturnValue([
        {
          name: 'maz-btn',
          displayName: 'MazBtn',
          type: 'component',
          description: 'A versatile button component',
          score: 5.5,
          snippet: 'MazBtn is a button component...',
        },
      ])

      const result = callToolHandler({
        params: { name: 'search', arguments: { query: 'button' } },
      })

      expect(result.content[0].text).toContain('Search Results for "button"')
      expect(result.content[0].text).toContain('MazBtn')
      expect(result.content[0].text).toContain('5.5')
      expect(mockUnifiedSearchService.search).toHaveBeenCalledWith('button', {
        category: undefined,
        maxResults: 10,
      })
    })

    it('Then applies category filter', () => {
      mockUnifiedSearchService.search.mockReturnValue([])

      callToolHandler({
        params: { name: 'search', arguments: { query: 'toast', category: 'composable' } },
      })

      expect(mockUnifiedSearchService.search).toHaveBeenCalledWith('toast', {
        category: 'composable',
        maxResults: 10,
      })
    })

    it('Then returns suggestions when no results found', () => {
      mockUnifiedSearchService.search.mockReturnValue([])

      const result = callToolHandler({
        params: { name: 'search', arguments: { query: 'nonexistent' } },
      })

      expect(result.content[0].text).toContain('No results found')
      expect(result.content[0].text).toContain('Suggestions')
    })

    it('Then returns error when query is empty', () => {
      const result = callToolHandler({
        params: { name: 'search', arguments: {} },
      })

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Error')
    })
  })

  describe('When calling get_doc tool', () => {
    it('Then resolves kebab-case name', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'maz-btn' } },
      })

      expect(result.content[0].text).toBe('# MazBtn Component')
    })

    it('Then resolves PascalCase name', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'MazBtn' } },
      })

      expect(result.content[0].text).toBe('# MazBtn Component')
    })

    it('Then resolves short name with maz- prefix', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'btn' } },
      })

      expect(result.content[0].text).toContain('MazBtn')
    })

    it('Then resolves known alias', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'button' } },
      })

      expect(result.content[0].text).toBe('# MazBtn Component')
    })

    it('Then auto-detects type across all categories', () => {
      mockDocumentationService.getGuideDocumentation.mockReturnValue('# Getting Started Guide')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'getting-started' } },
      })

      expect(result.content[0].text).toBe('# Getting Started Guide')
    })

    it('Then retrieves composable documentation', () => {
      mockDocumentationService.getComposableDocumentation.mockReturnValue('# useToast Composable')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'use-toast' } },
      })

      expect(result.content[0].text).toBe('# useToast Composable')
    })

    it('Then retrieves directive documentation', () => {
      mockDocumentationService.getDirectiveDocumentation.mockReturnValue('# Tooltip Directive')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'tooltip' } },
      })

      expect(result.content[0].text).toBe('# Tooltip Directive')
    })

    it('Then retrieves plugin documentation', () => {
      mockDocumentationService.getPluginDocumentation.mockReturnValue('# Toast Plugin')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'toast' } },
      })

      expect(result.content[0].text).toBe('# Toast Plugin')
    })

    it('Then retrieves helper documentation', () => {
      mockDocumentationService.getHelperDocumentation.mockReturnValue('# Currency Helper')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'currency' } },
      })

      expect(result.content[0].text).toBe('# Currency Helper')
    })

    it('Then filters by type hint', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'btn', type: 'component' } },
      })

      expect(result.content[0].text).toContain('MazBtn')
    })

    it('Then returns 3 suggestions via search when not found', () => {
      mockUnifiedSearchService.search.mockReturnValue([
        { name: 'maz-btn', displayName: 'MazBtn', type: 'component', description: 'Button', score: 3, snippet: '' },
        { name: 'maz-input', displayName: 'MazInput', type: 'component', description: 'Input', score: 2, snippet: '' },
        { name: 'maz-select', displayName: 'MazSelect', type: 'component', description: 'Select', score: 1, snippet: '' },
      ])

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'nonexistent-thing' } },
      })

      expect(result.content[0].text).toContain('Did you mean')
      expect(result.content[0].text).toContain('MazBtn')
      expect(result.content[0].text).toContain('MazInput')
      expect(result.content[0].text).toContain('MazSelect')
      expect(mockUnifiedSearchService.search).toHaveBeenCalledWith('nonexistent-thing', { maxResults: 3 })
    })

    it('Then returns not found message when no suggestions available', () => {
      mockUnifiedSearchService.search.mockReturnValue([])

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'xyzzyqwerty' } },
      })

      expect(result.content[0].text).toContain('Documentation not found')
    })

    it('Then returns empty content message when found but no content', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'maz-btn' } },
      })

      expect(result.content[0].text).toContain('documentation content is not available')
    })

    it('Then returns error when name is missing', () => {
      const result = callToolHandler({
        params: { name: 'get_doc', arguments: {} },
      })

      expect(result.isError).toBe(true)
    })
  })

  describe('When calling list tool', () => {
    it('Then returns all docs grouped by category with counters', () => {
      const result = callToolHandler({
        params: { name: 'list', arguments: {} },
      })

      const text = result.content[0].text
      expect(text).toContain('# Maz-UI Documentation')
      expect(text).toContain('## Components (10)')
      expect(text).toContain('## Guides (3)')
      expect(text).toContain('## Composables (2)')
      expect(text).toContain('## Directives (2)')
      expect(text).toContain('## Plugins (2)')
      expect(text).toContain('## Helpers (6)')
    })

    it('Then filters by single category', () => {
      const result = callToolHandler({
        params: { name: 'list', arguments: { category: 'guide' } },
      })

      const text = result.content[0].text
      expect(text).toContain('## Guides (3)')
      expect(text).not.toContain('## Components')
      expect(text).not.toContain('## Helpers')
    })

    it('Then returns items with name, displayName, and description', () => {
      const result = callToolHandler({
        params: { name: 'list', arguments: { category: 'directive' } },
      })

      const text = result.content[0].text
      expect(text).toContain('`tooltip`')
      expect(text).toContain('v-tooltip Directive')
      expect(text).toContain('Vue directive:')
    })

    it('Then returns markdown formatted output', () => {
      const result = callToolHandler({
        params: { name: 'list', arguments: { category: 'all' } },
      })

      const text = result.content[0].text
      expect(text).toMatch(/^# Maz-UI Documentation \(\d+ items\)/)
      expect(text).toMatch(/## \w+ \(\d+\)/)
      expect(text).toMatch(/- \*\*.+\*\* \(`.+`\) — .+/)
    })
  })

  describe('When calling unknown tool', () => {
    it('Then returns error with available tools list', () => {
      const result = callToolHandler({
        params: { name: 'unknown_tool', arguments: {} },
      })

      expect(result.content[0].text).toContain('Error')
      expect(result.content[0].text).toContain('Unknown tool: unknown_tool')
      expect(result.isError).toBe(true)
    })
  })

  describe('When accessing documentation service', () => {
    it('Then getDocumentationService returns the service', () => {
      expect(server.getDocumentationService()).toBeDefined()
    })
  })

  describe('When running server', () => {
    it('Then creates transport and connects server', async () => {
      const mockTransport = {}
      // eslint-disable-next-line prefer-arrow-callback
      MockStdioServerTransport.mockImplementation(function () {
        return mockTransport as any
      })

      await server.run()

      expect(MockStdioServerTransport).toHaveBeenCalled()
      expect(mockServer.connect).toHaveBeenCalledWith(mockTransport)
    })
  })
})
