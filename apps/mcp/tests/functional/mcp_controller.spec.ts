import { test } from '@japa/runner'

test.group('MCP Controller', () => {
  test('should return server info on GET /mcp', async ({ client }) => {
    const response = await client.get('/mcp')

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'maz-ui-mcp',
      version: '1.0.0',
      protocol: 'mcp/2025-03-26',
    })
  })

  test('should handle JSON-RPC initialize request', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {},
      })

    response.assertStatus(200)
    response.assertBodyContains({
      jsonrpc: '2.0',
      id: 1,
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
    })
  })

  test('should list resources', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 2,
        method: 'resources/list',
        params: {},
      })

    response.assertStatus(200)
    const body = response.body()

    response.assertBodyContains({
      jsonrpc: '2.0',
      id: 2,
    })

    // Vérifier qu'on a des ressources
    response.assertBodyContains({
      result: {
        resources: [],
      },
    })

    // Vérifier que le tableau resources n'est pas vide
    const resources = body.result.resources
    response.assertBodyContains({ result: { resources } })

    // Vérifier qu'on a l'overview
    const hasOverview = resources.some((r: any) => r.uri === 'maz-ui://overview')
    if (!hasOverview) {
      throw new Error('Overview resource not found')
    }
  })

  test('should list tools', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/list',
        params: {},
      })

    response.assertStatus(200)
    const body = response.body()

    response.assertBodyContains({
      jsonrpc: '2.0',
      id: 3,
    })

    const tools = body.result.tools

    // Vérifier qu'on a les outils principaux en vérifiant leur présence dans la réponse
    const toolNames = tools.map((t: any) => t.name)
    const expectedTools = ['search_components', 'search_documentation', 'list_all_components', 'get_getting_started']

    // Vérifier que chaque outil attendu est présent
    for (const expectedTool of expectedTools) {
      const toolExists = toolNames.includes(expectedTool)
      if (!toolExists) {
        throw new Error(`Expected tool ${expectedTool} not found in tools list`)
      }
    }
  })

  test('should handle invalid JSON-RPC request', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        invalid: 'request',
      })

    response.assertStatus(400)
    response.assertBodyContains({
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request',
      },
    })
  })

  test('should handle unknown method', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 999,
        method: 'unknown/method',
        params: {},
      })

    response.assertStatus(200)
    response.assertBodyContains({
      jsonrpc: '2.0',
      id: 999,
      error: {
        code: -32601,
        message: 'Method not found',
      },
    })
  })
})
