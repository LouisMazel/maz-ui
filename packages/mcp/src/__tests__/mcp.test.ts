import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { version } from '../../package.json' assert { type: 'json' }
import { DocumentationService } from '../DocumentationService'

import { MazUiMcpServer } from '../mcp'

vi.mock('@modelcontextprotocol/sdk/server/index.js')
vi.mock('@modelcontextprotocol/sdk/server/stdio.js')
vi.mock('../DocumentationService')

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

const MockServer = vi.mocked(Server)
const MockStdioServerTransport = vi.mocked(StdioServerTransport)
const MockDocumentationService = vi.mocked(DocumentationService)

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

    // Setup default return values for all methods with diverse data for coverage
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
  })

  describe('When handling resource list requests', () => {
    it('Then returns comprehensive resource list', () => {
      const result = resourceListHandler()

      expect(result.resources.length).toBeGreaterThan(0)

      // Check that overview is included
      const overview = result.resources.find((r: any) => r.uri === 'overview://')
      expect(overview).toBeDefined()
      expect(overview.name).toBe('Library Overview')
      expect(overview.mimeType).toBe('text/markdown')
    })
  })

  describe('When handling resource read requests', () => {
    it('Then reads component documentation', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const mockRequest = {
        params: { uri: 'component://maz-btn' },
      }

      const result = resourceReadHandler(mockRequest)

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
      const mockRequest = {
        params: { uri: 'invalid-format' },
      }

      expect(() => resourceReadHandler(mockRequest)).toThrow('Invalid URI format')
    })

    it('Then throws error when resource not found', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('')

      const mockRequest = {
        params: { uri: 'component://non-existent' },
      }

      expect(() => resourceReadHandler(mockRequest)).toThrow('Documentation not found')
    })
  })

  describe('When handling tools list requests', () => {
    it('Then returns comprehensive tools list', () => {
      const result = toolsListHandler()

      expect(result.tools).toHaveLength(6)
      const toolNames = result.tools.map((t: any) => t.name)
      expect(toolNames).toContain('list_all_docs')
      expect(toolNames).toContain('smart_search')
      expect(toolNames).toContain('get_doc')
      expect(toolNames).toContain('get_installation_guide')
      expect(toolNames).toContain('get_components_by_category')
      expect(toolNames).toContain('suggest_similar')
    })
  })

  describe('When handling tool call requests', () => {
    it('Then executes list_all_docs tool', () => {
      const result = callToolHandler({
        params: { name: 'list_all_docs', arguments: { category: 'all' } },
      })

      expect(result.content[0].text).toContain('# Maz-UI Documentation Index')
      expect(result.content[0].text).toContain('## Vue Components')
    })

    it('Then executes list_all_docs with specific category filter', () => {
      const result = callToolHandler({
        params: { name: 'list_all_docs', arguments: { category: 'components' } },
      })

      expect(result.content[0].text).toContain('# Maz-UI Documentation Index')
    })

    it('Then executes list_all_docs with guides category', () => {
      const result = callToolHandler({
        params: { name: 'list_all_docs', arguments: { category: 'guides' } },
      })

      expect(result.content[0].text).toContain('# Maz-UI Documentation Index')
    })

    it('Then executes list_all_docs without descriptions', () => {
      const result = callToolHandler({
        params: { name: 'list_all_docs', arguments: { category: 'all', includeDescriptions: false } },
      })

      expect(result.content[0].text).not.toContain('**Description**')
    })

    it('Then executes smart_search tool', () => {
      const result = callToolHandler({
        params: { name: 'smart_search', arguments: { query: 'button' } },
      })

      expect(result.content[0].text).toContain('# Search Results for "button"')
    })

    it('Then executes smart_search with maxResults', () => {
      const result = callToolHandler({
        params: { name: 'smart_search', arguments: { query: 'maz', maxResults: 2 } },
      })

      expect(result.content[0].text).toContain('Search Results')
    })

    it('Then executes smart_search with no results', () => {
      const result = callToolHandler({
        params: { name: 'smart_search', arguments: { query: 'xyznonexistent' } },
      })

      expect(result.content[0].text).toContain('No results found')
    })

    it('Then smart_search throws error when query is empty', () => {
      const result = callToolHandler({
        params: { name: 'smart_search', arguments: {} },
      })

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Error')
    })

    it('Then executes get_doc tool', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'maz-btn' } },
      })

      expect(result.content[0].text).toBe('# MazBtn Component')
    })

    it('Then get_doc retrieves guide documentation', () => {
      mockDocumentationService.getGuideDocumentation.mockReturnValue('# Getting Started Guide')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'getting-started' } },
      })

      expect(result.content[0].text).toBe('# Getting Started Guide')
    })

    it('Then get_doc retrieves composable documentation', () => {
      mockDocumentationService.getComposableDocumentation.mockReturnValue('# useToast Composable')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'use-toast' } },
      })

      expect(result.content[0].text).toBe('# useToast Composable')
    })

    it('Then get_doc retrieves directive documentation', () => {
      mockDocumentationService.getDirectiveDocumentation.mockReturnValue('# Tooltip Directive')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'tooltip' } },
      })

      expect(result.content[0].text).toBe('# Tooltip Directive')
    })

    it('Then get_doc retrieves plugin documentation', () => {
      mockDocumentationService.getPluginDocumentation.mockReturnValue('# Toast Plugin')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'toast' } },
      })

      expect(result.content[0].text).toBe('# Toast Plugin')
    })

    it('Then get_doc retrieves helper documentation', () => {
      mockDocumentationService.getHelperDocumentation.mockReturnValue('# Currency Helper')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'currency' } },
      })

      expect(result.content[0].text).toBe('# Currency Helper')
    })

    it('Then get_doc with type hint searches by type', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'btn', type: 'component' } },
      })

      expect(result.content[0].text).toContain('MazBtn')
    })

    it('Then get_doc returns suggestions when not found', () => {
      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'nonexistent-thing' } },
      })

      expect(result.content[0].text).toContain('not found')
    })

    it('Then get_doc returns fuzzy suggestions for partial name match', () => {
      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'maz-bt' } },
      })

      // Should fuzzy match "maz-btn" and show suggestions
      expect(result.content[0].text).toContain('Did you mean')
    })

    it('Then get_doc returns empty content message when found but no content', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('')

      const result = callToolHandler({
        params: { name: 'get_doc', arguments: { name: 'maz-btn' } },
      })

      expect(result.content[0].text).toContain('documentation content is not available')
    })

    it('Then get_doc throws error when name is missing', () => {
      const result = callToolHandler({
        params: { name: 'get_doc', arguments: {} },
      })

      expect(result.isError).toBe(true)
    })

    it('Then executes get_installation_guide tool', () => {
      mockDocumentationService.getGuideDocumentation.mockReturnValue('# Getting Started')

      const result = callToolHandler({
        params: { name: 'get_installation_guide', arguments: {} },
      })

      expect(result.content[0].text).toBe('# Getting Started')
    })

    it('Then get_installation_guide falls back to overview', () => {
      mockDocumentationService.getGuideDocumentation.mockReturnValue('')
      mockDocumentationService.getOverview.mockReturnValue('# Overview Fallback')

      const result = callToolHandler({
        params: { name: 'get_installation_guide', arguments: {} },
      })

      expect(result.content[0].text).toBe('# Overview Fallback')
    })

    it('Then get_installation_guide returns default when no guides or overview', () => {
      mockDocumentationService.getGuideDocumentation.mockReturnValue('')
      mockDocumentationService.getOverview.mockReturnValue('')

      const result = callToolHandler({
        params: { name: 'get_installation_guide', arguments: {} },
      })

      expect(result.content[0].text).toContain('Maz-UI Installation')
    })

    it('Then executes get_components_by_category with all', () => {
      const result = callToolHandler({
        params: { name: 'get_components_by_category', arguments: { category: 'all' } },
      })

      expect(result.content[0].text).toContain('# Components by Category')
    })

    it('Then executes get_components_by_category with specific category', () => {
      const result = callToolHandler({
        params: { name: 'get_components_by_category', arguments: { category: 'form' } },
      })

      expect(result.content[0].text).toContain('Form Components')
    })

    it('Then executes get_components_by_category with empty category', () => {
      const result = callToolHandler({
        params: { name: 'get_components_by_category', arguments: { category: 'data' } },
      })

      expect(result.content[0].text).toContain('Data Components')
    })

    it('Then executes suggest_similar tool', () => {
      const result = callToolHandler({
        params: { name: 'suggest_similar', arguments: { description: 'I need a button component for forms' } },
      })

      expect(result.content[0].text).toContain('Suggestions based on')
    })

    it('Then suggest_similar with very short description triggers fuzzy results', () => {
      const result = callToolHandler({
        params: { name: 'suggest_similar', arguments: { description: 'btn' } },
      })

      expect(result.content[0].text).toContain('Suggestions based on')
    })

    it('Then suggest_similar with no matching results', () => {
      const result = callToolHandler({
        params: { name: 'suggest_similar', arguments: { description: 'xyzzyqwerty nonexistent' } },
      })

      expect(result.content[0].text).toContain('No direct suggestions found')
    })

    it('Then resource read handler throws error when URI is missing', () => {
      expect(() => resourceReadHandler({ params: {} })).toThrow()
    })

    it('Then suggest_similar throws error when description is missing', () => {
      const result = callToolHandler({
        params: { name: 'suggest_similar', arguments: {} },
      })

      expect(result.isError).toBe(true)
    })

    it('Then returns error for unknown tool names', () => {
      const result = callToolHandler({
        params: { name: 'unknown_tool', arguments: {} },
      })

      expect(result.content[0].text).toContain('❌ **Error**: Unknown tool: unknown_tool')
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
