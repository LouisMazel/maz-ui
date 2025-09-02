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

    // Setup default return values for all methods
    mockDocumentationService.getAllComponents.mockReturnValue(['maz-btn', 'maz-input'])
    mockDocumentationService.getAllGuides.mockReturnValue(['getting-started'])
    mockDocumentationService.getAllComposables.mockReturnValue(['use-toast'])
    mockDocumentationService.getAllDirectives.mockReturnValue(['tooltip'])
    mockDocumentationService.getAllPlugins.mockReturnValue(['toast'])
    mockDocumentationService.getAllHelpers.mockReturnValue(['currency'])
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

    MockServer.mockImplementation(() => mockServer as any)
    MockStdioServerTransport.mockImplementation(() => ({}) as any)
    MockDocumentationService.mockImplementation(() => mockDocumentationService as any)

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
      const mockRequest = {
        params: {
          name: 'list_all_docs',
          arguments: { category: 'all' },
        },
      }

      const result = callToolHandler(mockRequest)

      expect(result.content[0].text).toContain('# Maz-UI Documentation Index')
      expect(result.content[0].text).toContain('## Vue Components')
    })

    it('Then executes smart_search tool', () => {
      const mockRequest = {
        params: {
          name: 'smart_search',
          arguments: { query: 'button' },
        },
      }

      const result = callToolHandler(mockRequest)

      expect(result.content[0].text).toContain('# Search Results for "button"')
    })

    it('Then executes get_doc tool', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const mockRequest = {
        params: {
          name: 'get_doc',
          arguments: { name: 'maz-btn' },
        },
      }

      const result = callToolHandler(mockRequest)

      expect(result.content[0].text).toBe('# MazBtn Component')
    })

    it('Then returns error for unknown tool names', () => {
      const mockRequest = {
        params: {
          name: 'unknown_tool',
          arguments: {},
        },
      }

      const result = callToolHandler(mockRequest)

      expect(result.content[0].text).toContain('❌ **Error**: Unknown tool: unknown_tool')
      expect(result.isError).toBe(true)
    })
  })

  describe('When running server', () => {
    it('Then creates transport and connects server', async () => {
      const mockTransport = {}
      MockStdioServerTransport.mockImplementation(() => mockTransport as any)

      await server.run()

      expect(MockStdioServerTransport).toHaveBeenCalled()
      expect(mockServer.connect).toHaveBeenCalledWith(mockTransport)
    })
  })
})
