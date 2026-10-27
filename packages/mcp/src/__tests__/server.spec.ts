import type { ToolDefinition } from '../tools/types'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { version } from '../../package.json' with { type: 'json' }
import { buildInstructions, MAX_INSTRUCTIONS_LENGTH } from '../instructions'
import { createMazUiMcpServer, runTool, TOOLS } from '../server'
import { ToolInputError } from '../tools/types'
import { getContext, getEmptyCwd, getKnowledge } from './helpers'

async function connect(): Promise<Client> {
  const { server } = createMazUiMcpServer({ knowledge: getKnowledge(), cwd: getEmptyCwd() })
  const [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair()
  const client = new Client({ name: 'test', version: '1.0.0' })

  await server.connect(serverTransport)
  await client.connect(clientTransport)

  return client
}

function textOf(result: unknown): string {
  return (result as { content: Array<{ text: string }> }).content[0].text
}

describe('given the maz-ui MCP server', () => {
  let client: Client

  beforeAll(async () => {
    client = await connect()
  })

  afterAll(async () => {
    await client.close()
  })

  describe('when a client connects', () => {
    it('then it receives the server info and instructions', () => {
      expect(client.getServerVersion()).toEqual(expect.objectContaining({ name: 'maz-ui', version }))
      expect(client.getInstructions()).toContain('search_docs')
      expect(client.getInstructions()!.length).toBeLessThan(MAX_INSTRUCTIONS_LENGTH)
    })
  })

  describe('when the tools are listed', () => {
    it('then they keep the TOOLS order with read-only annotations', async () => {
      const { tools } = await client.listTools()

      expect(tools.map(tool => tool.name)).toEqual(TOOLS.map(tool => tool.name))
      for (const tool of tools) {
        expect(tool.annotations).toEqual(expect.objectContaining({ readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }))
        expect(tool.description!.length).toBeGreaterThan(50)
      }
    })
  })

  describe('when each tool is called with valid arguments', () => {
    it.each([
      ['search_docs', { query: 'phone number input' }, 'MazInputPhoneNumber'],
      ['get_component_api', { names: ['MazBtn'] }, '## MazBtn API'],
      ['find_icons', { query: 'delete' }, 'MazTrash'],
      ['get_theme_tokens', { topics: ['colors'] }, '## Colors'],
      ['get_doc', { id: 'useToast', sections: ['Usage'] }, '## Usage'],
      ['list_docs', { category: 'plugin' }, '## Plugins'],
      ['get_setup_guide', { framework: 'vue', tailwind: false }, 'Vue app'],
      ['review_code', { code: '<MazBtn color="red" />' }, 'invalid-prop-value'],
    ])('then %s answers', async (name, args, expected) => {
      const result = await client.callTool({ name, arguments: args })

      expect(result.isError).toBeFalsy()
      expect(textOf(result)).toContain(expected)
    })
  })

  describe('when a tool receives arguments the agent can fix', () => {
    it('then it returns an error result with an actionable message', async () => {
      const result = await client.callTool({ name: 'get_doc', arguments: { id: 'qwxzv-qwxzv' } })

      expect(result.isError).toBe(true)
      expect(textOf(result)).toContain('No maz-ui doc matches')
    })
  })

  describe('when the prompts are listed', () => {
    it('then build, audit and setup are available', async () => {
      const { prompts } = await client.listPrompts()

      expect(prompts.map(prompt => prompt.name)).toEqual(['build', 'audit', 'setup'])
    })
  })

  describe('when a prompt is requested', () => {
    it.each([
      ['build', { task: 'a login form' }, 'a login form'],
      ['audit', { paths: 'src/components' }, 'src/components'],
      ['setup', { framework: 'nuxt' }, 'nuxt project'],
      ['setup', { framework: 'vue' }, 'main.ts'],
    ])('then %s returns a user message with the argument', async (name, args, expected) => {
      const { messages } = await client.getPrompt({ name, arguments: args })

      expect(messages[0].role).toBe('user')
      expect((messages[0].content as { text: string }).text).toContain(expected)
    })
  })
})

describe('given runTool', () => {
  function tool(run: ToolDefinition['run']): ToolDefinition {
    return { name: 'fake', title: 'Fake', description: 'Fake tool', inputSchema: {}, run }
  }

  describe('when the tool throws an input error', () => {
    it('then the message is returned as an error', async () => {
      const result = await runTool(getContext(), tool(() => {
        throw new ToolInputError('Fix the args')
      }), {})

      expect(result).toEqual({ content: [{ type: 'text', text: 'Fix the args' }], isError: true })
    })
  })

  describe('when the tool fails unexpectedly', () => {
    it('then a generic error with the cause is returned', async () => {
      const result = await runTool(getContext(), tool(() => {
        throw new Error('boom')
      }), {})

      expect(result.isError).toBe(true)
      expect(textOf(result)).toContain('Unexpected error in fake: boom')
    })
  })

  describe('when the tool succeeds asynchronously', () => {
    it('then its text is returned', async () => {
      expect(await runTool(getContext(), tool(() => Promise.resolve('ok')), {})).toEqual({ content: [{ type: 'text', text: 'ok' }] })
    })
  })
})

describe('given buildInstructions', () => {
  describe('when they are built for the real bundle', () => {
    it('then they mention the version, the workflow and stay under the limit', () => {
      const instructions = buildInstructions(getContext())

      expect(instructions).toContain(`maz-ui ${getKnowledge().version}`)
      expect(instructions).toContain('review_code')
      expect(instructions).toContain('maz:')
      expect(instructions.length).toBeLessThan(MAX_INSTRUCTIONS_LENGTH)
    })
  })
})
