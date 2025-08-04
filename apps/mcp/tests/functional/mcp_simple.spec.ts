import { test } from '@japa/runner'

test.group('MCP Simple Tests', () => {
  test('GET /mcp returns server info', async ({ client, assert }) => {
    const response = await client.get('/mcp')

    response.assertStatus(200)
    const body = response.body()

    assert.equal(body.name, 'maz-ui-mcp')
    assert.equal(body.version, '1.0.0')
    assert.equal(body.protocol, 'mcp/2025-03-26')
  })

  test('POST /mcp with initialize works', async ({ client, assert }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {},
      })

    response.assertStatus(200)
    const body = response.body()

    assert.equal(body.jsonrpc, '2.0')
    assert.equal(body.id, 1)
    assert.exists(body.result)
    assert.equal(body.result.protocolVersion, '2025-03-26')
  })

  test('search_components with MazBtn works', async ({ client, assert }) => {
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

    assert.equal(body.jsonrpc, '2.0')
    assert.equal(body.id, 1)
    assert.exists(body.result)
    assert.exists(body.result.content)
    assert.isArray(body.result.content)
    assert.isAbove(body.result.content.length, 0)

    const content = body.result.content[0]
    assert.equal(content.type, 'text')
    assert.include(content.text, 'Found')
  })

  test('search_components with kebab-case works', async ({ client, assert }) => {
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

    assert.equal(body.jsonrpc, '2.0')
    assert.exists(body.result)

    const content = body.result.content[0]
    assert.include(content.text, 'Found')
    assert.include(content.text, 'maz-btn')
  })

  test('list_all_components works', async ({ client, assert }) => {
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

    assert.exists(body.result)
    const content = body.result.content[0]
    assert.include(content.text, 'Available components')
  })

  test('resources/list works', async ({ client, assert }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/list',
        params: {},
      })

    response.assertStatus(200)
    const body = response.body()

    assert.equal(body.jsonrpc, '2.0')
    assert.exists(body.result)
    assert.exists(body.result.resources)
    assert.isArray(body.result.resources)
    assert.isAbove(body.result.resources.length, 0)

    // Vérifier qu'on a l'overview
    const hasOverview = body.result.resources.some((r: any) => r.uri === 'maz-ui://overview')
    assert.isTrue(hasOverview)
  })

  test('resources/read overview works', async ({ client, assert }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {
          uri: 'maz-ui://overview',
        },
      })

    response.assertStatus(200)
    const body = response.body()

    assert.equal(body.jsonrpc, '2.0')
    assert.exists(body.result)
    assert.exists(body.result.contents)
    assert.isArray(body.result.contents)
    assert.lengthOf(body.result.contents, 1)

    const content = body.result.contents[0]
    assert.equal(content.uri, 'maz-ui://overview')
    assert.equal(content.mimeType, 'text/markdown')
    assert.isString(content.text)
    assert.isAbove(content.text.length, 0)
  })

  test('error handling works', async ({ client, assert }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'unknown/method',
        params: {},
      })

    response.assertStatus(200)
    const body = response.body()

    assert.equal(body.jsonrpc, '2.0')
    assert.equal(body.id, 1)
    assert.exists(body.error)
    assert.equal(body.error.code, -32601)
    assert.equal(body.error.message, 'Method not found')
  })
})
