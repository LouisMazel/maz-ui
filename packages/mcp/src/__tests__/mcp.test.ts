import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
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
          version: '0.0.1',
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
      mockDocumentationService.getAllComponents.mockReturnValue(['maz-btn'])
      mockDocumentationService.getAllGuides.mockReturnValue(['getting-started'])
      mockDocumentationService.getAllComposables.mockReturnValue(['use-toast'])
      mockDocumentationService.getAllDirectives.mockReturnValue(['tooltip'])
      mockDocumentationService.getAllPlugins.mockReturnValue(['toast'])
      mockDocumentationService.getAllHelpers.mockReturnValue(['currency'])

      const result = resourceListHandler()

      expect(result.resources).toHaveLength(7)
      expect(result.resources[0]).toEqual({
        uri: 'maz-ui://overview',
        name: 'Maz-UI Library Overview',
        description: 'Complete overview of the Maz-UI component library',
        mimeType: 'text/markdown',
      })
    })
  })

  describe('When handling resource read requests', () => {
    it('Then reads component documentation', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('# MazBtn Component')

      const mockRequest = {
        params: { uri: 'maz-ui://component/MazBtn' },
      }

      const result = resourceReadHandler(mockRequest)

      expect(mockDocumentationService.getComponentDocumentation).toHaveBeenCalledWith('MazBtn')
      expect(result).toEqual({
        contents: [{
          uri: 'maz-ui://component/MazBtn',
          mimeType: 'text/markdown',
          text: '# MazBtn Component',
        }],
      })
    })

    it('Then throws error for invalid URI format', () => {
      const mockRequest = {
        params: { uri: 'invalid://uri' },
      }

      expect(() => resourceReadHandler(mockRequest)).toThrow('Invalid URI')
    })

    it('Then throws error when resource not found', () => {
      mockDocumentationService.getComponentDocumentation.mockReturnValue('')

      const mockRequest = {
        params: { uri: 'maz-ui://component/NonExistent' },
      }

      expect(() => resourceReadHandler(mockRequest)).toThrow('Resource not found')
    })
  })

  describe('When handling tools list requests', () => {
    it('Then returns comprehensive tools list', () => {
      const result = toolsListHandler()

      expect(result.tools).toHaveLength(7)
    })
  })

  describe('When handling tool call requests', () => {
    it('Then executes list_all_components tool', () => {
      mockDocumentationService.getAllComponents.mockReturnValue(['maz-btn', 'maz-input'])

      const mockRequest = {
        params: {
          name: 'list_all_components',
          arguments: {},
        },
      }

      const result = callToolHandler(mockRequest)

      expect(result.content[0].text).toContain('Available components (2)')
      expect(result.content[0].text).toContain('- maz-btn')
      expect(result.content[0].text).toContain('- maz-input')
    })

    it('Then executes list_guides tool', () => {
      mockDocumentationService.getAllGuides.mockReturnValue(['getting-started', 'themes'])

      const mockRequest = {
        params: {
          name: 'list_guides',
          arguments: {},
        },
      }

      const result = callToolHandler(mockRequest)

      expect(result.content[0].text).toContain('Available guides (2)')
    })

    it('Then executes get_getting_started tool', () => {
      mockDocumentationService.getGuideDocumentation.mockReturnValue('# Getting Started')

      const mockRequest = {
        params: {
          name: 'get_getting_started',
          arguments: {},
        },
      }

      const result = callToolHandler(mockRequest)

      expect(result.content[0].text).toBe('# Getting Started')
    })

    it('Then throws error for unknown tool names', () => {
      const mockRequest = {
        params: {
          name: 'unknown_tool',
          arguments: {},
        },
      }

      expect(() => callToolHandler(mockRequest)).toThrow('Unknown tool: unknown_tool')
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
