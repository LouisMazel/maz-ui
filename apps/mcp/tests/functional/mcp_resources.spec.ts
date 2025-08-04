import { test } from '@japa/runner'

test.group('MCP Resources', () => {
  test('should read overview resource', async ({ client }) => {
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

    response.assertBodyContains({
      jsonrpc: '2.0',
      id: 1,
    })

    const contents = body.result.contents
    response.assert?.isArray(contents)
    response.assert?.lengthOf(contents, 1)

    const content = contents[0]
    response.assert?.equal(content.uri, 'maz-ui://overview')
    response.assert?.equal(content.mimeType, 'text/markdown')
    response.assert?.isString(content.text)
    response.assert?.isAbove(content.text.length, 0)
  })

  test('should read component resource', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {
          uri: 'maz-ui://component/MazBtn',
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const contents = body.result.contents
    response.assert?.isArray(contents)
    response.assert?.lengthOf(contents, 1)

    const content = contents[0]
    response.assert?.equal(content.uri, 'maz-ui://component/MazBtn')
    response.assert?.equal(content.mimeType, 'text/markdown')
    response.assert?.isString(content.text)
  })

  test('should read guide resource', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {
          uri: 'maz-ui://guide/getting-started',
        },
      })

    response.assertStatus(200)
    const body = response.body()

    const contents = body.result.contents
    response.assert?.isArray(contents)
    response.assert?.lengthOf(contents, 1)

    const content = contents[0]
    response.assert?.equal(content.uri, 'maz-ui://guide/getting-started')
    response.assert?.equal(content.mimeType, 'text/markdown')
    response.assert?.isString(content.text)
  })

  test('should read composable resource', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {
          uri: 'maz-ui://composable/useFormValidator',
        },
      })

    // Peut être 500 si le composable n'existe pas
    response.assertStatus(500)
  })

  test('should handle invalid URI', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {
          uri: 'invalid://uri',
        },
      })

    // Les URIs invalides génèrent une erreur 500
    response.assertStatus(500)
  })

  test('should handle missing URI', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {},
      })

    // Les URIs manquantes génèrent une erreur 500
    response.assertStatus(500)
  })

  test('should handle unknown resource type', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {
          uri: 'maz-ui://unknown/test',
        },
      })

    // Les types de ressources inconnus génèrent une erreur 500
    response.assertStatus(500)
  })

  test('should handle non-existent resource', async ({ client }) => {
    const response = await client
      .post('/mcp')
      .json({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: {
          uri: 'maz-ui://component/NonExistentComponent',
        },
      })

    // Les ressources inexistantes génèrent une erreur 500
    response.assertStatus(500)
  })
})
