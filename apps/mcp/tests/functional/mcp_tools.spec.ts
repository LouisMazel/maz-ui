import { test } from '@japa/runner'

test.group('MCP Tools', () => {
  test('should search components with kebab-case', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_components',
          arguments: {
            query: 'maz-btn',
          },
        },
      })

    response.assertStatus(200)
    const body = response.body()

    response.assertBodyContains({
      jsonrpc: '2.0',
      id: 1,
    })

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Found')
    response.assert?.include(content.text, 'maz-btn')
  })

  test('should search components with PascalCase', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_components',
          arguments: {
            query: 'MazBtn',
          },
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Found')
    // Devrait trouver des résultats grâce à la normalisation
  })

  test('should search components with camelCase', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_components',
          arguments: {
            query: 'mazBtn',
          },
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Found')
  })

  test('should search components with spaces', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_components',
          arguments: {
            query: 'Maz Btn',
          },
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Found')
  })

  test('should search components without prefix', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_components',
          arguments: {
            query: 'btn',
          },
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Found')
    // Devrait trouver des composants contenant "btn"
  })

  test('should handle search_components without query', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_components',
          arguments: {},
        },
      })

    response.assertStatus(500)
    response.assertBodyContains({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error - Query parameter is required',
      },
    })

    const body = response.body()
    response.assert?.include(body.error.message, 'Query parameter is required')
  })

  test('should search documentation', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_documentation',
          arguments: {
            query: 'installation',
          },
        },
      })

    response.assertStatus(200)
    const body = response.body()

    response.assertBodyContains({
      jsonrpc: '2.0',
      id: 1,
    })

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Found')
  })

  test('should list all components', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'list_all_components',
          arguments: {},
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Available components')
    response.assert?.include(content.text, 'maz-btn')
  })

  test('should list composables', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'list_composables',
          arguments: {},
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Available composables')
  })

  test('should list directives', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'list_directives',
          arguments: {},
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    response.assert?.include(content.text, 'Available directives')
  })

  test('should get component usage', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'get_component_usage',
          arguments: {
            component: 'MazBtn',
          },
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const content = body.result.content[0]
    response.assert?.equal(content.type, 'text')
    // Devrait retourner la documentation du composant ou "not found"
    response.assert?.isString(content.text)
  })

  test('should handle unknown tool', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'unknown_tool',
          arguments: {},
        },
      })

    response.assertStatus(500)
    response.assertBodyContains({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error - Unknown tool: unknown_tool',
      },
    })

    const body = response.body()
    response.assert?.include(body.error.message, 'Unknown tool: unknown_tool')
  })
})
