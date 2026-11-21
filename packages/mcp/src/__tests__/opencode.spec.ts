import type { OpenCodeClient, OpenCodeConfig, OpenCodeHooks } from '../opencode.ts'

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import plugin, { completeConfig, editedFiles, editorAgent, MazUiOpenCodePlugin, mcpServerConfig, sessionRules } from '../opencode.ts'
import { cleanTempDirs, createTempDir, writeFile } from './helpers.ts'

const NATIVE_BUTTON = '<template><button>b</button></template>'

function createProject(): string {
  const directory = createTempDir()

  execFileSync('git', ['init', '-q'], { cwd: directory, stdio: 'ignore' })
  writeFile(directory, 'package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))

  return directory
}

function installMazUi(directory: string): void {
  writeFile(directory, 'node_modules/maz-ui/package.json', JSON.stringify({ name: 'maz-ui', version: '5.9.0' }))
  writeFile(directory, 'node_modules/maz-ui/agent-docs/agents/session-context.md', '# maz-ui\n\nReuse the ecosystem.\n')
}

function createClient(parentID?: string) {
  const promptAsync = vi.fn(() => Promise.resolve({}))
  const client: OpenCodeClient = {
    session: {
      get: vi.fn(() => Promise.resolve({ data: { parentID } })),
      promptAsync,
    },
  }

  return { client, promptAsync }
}

function hooksFor(directory: string, client = createClient().client): Promise<OpenCodeHooks> {
  return MazUiOpenCodePlugin({ directory, client })
}

afterEach(() => {
  cleanTempDirs()
})

describe('given the OpenCode plugin module', () => {
  describe('when OpenCode loads it', () => {
    it('then it exposes its id and its server plugin', () => {
      expect(plugin).toEqual({ id: 'maz-ui', server: MazUiOpenCodePlugin })
    })
  })
})

describe('given the config hook of the OpenCode plugin', () => {
  describe('when the config starts no maz-ui MCP server', () => {
    it('then it adds the server of the plugin, started in the project', async () => {
      const directory = createProject()
      const config: { mcp?: Record<string, { command?: string[] }> } = {}

      const hooks = await hooksFor(directory)
      hooks.config(config)

      expect(config.mcp?.['maz-ui']?.command?.slice(-2)).toEqual(['--cwd', directory])
    })
  })

  describe('when the config already starts it under another name', () => {
    it('then it adds nothing', async () => {
      const config = { mcp: { ui: { type: 'local', command: ['npx', '-y', '@maz-ui/mcp'] } } }

      const hooks = await hooksFor(createProject())
      hooks.config(config)

      expect(Object.keys(config.mcp)).toEqual(['ui'])
    })
  })

  describe('when the config cannot be changed', () => {
    it('then the error is swallowed', async () => {
      const hooks = await hooksFor(createProject())

      expect(() => hooks.config(Object.freeze({}))).not.toThrow()
    })
  })

  describe('when the project installs @maz-ui/mcp', () => {
    it('then the server is the one of the project', () => {
      const directory = createProject()
      const bin = writeFile(directory, 'node_modules/@maz-ui/mcp/bin/maz-ui-mcp.mjs', '')

      expect(mcpServerConfig(directory).command).toEqual(['node', bin, '--cwd', directory])
    })
  })
})

describe('given the skills and the subagent of the plugin', () => {
  const EDITOR = '---\nname: maz-ui-editor\ndescription: Writes UI code with maz-ui.\nskills:\n  - maz-ui\n---\n\nYou write UI code.\n'

  function createPluginDir(editor = EDITOR): string {
    const directory = createTempDir()
    writeFile(directory, 'skills/maz-ui/SKILL.md', '---\nname: maz-ui\ndescription: maz-ui rules\n---\n')
    writeFile(directory, 'agents/maz-ui-editor.md', editor)

    return directory
  }

  describe('when OpenCode loads the plugin', () => {
    it('then the config gets the skills and the subagent of the maz-ui plugin', async () => {
      const config: OpenCodeConfig = {}
      const hooks = await hooksFor(createProject())

      hooks.config(config)

      expect(existsSync(join(config.skills?.paths?.[0] ?? '', 'maz-ui-upgrade/SKILL.md'))).toBe(true)
      expect(config.agent?.['maz-ui-editor']).toEqual(expect.objectContaining({ mode: 'subagent', description: expect.stringContaining('maz-ui') }))
    })
  })

  describe('when the config has other skill paths', () => {
    it('then the skills of the plugin are added once, after them', () => {
      const pluginDir = createPluginDir()
      const config: OpenCodeConfig = { skills: { paths: ['./team-skills'], urls: ['https://example.com/skills/'] } }

      completeConfig(config, createProject(), pluginDir)
      completeConfig(config, createProject(), pluginDir)

      expect(config.skills).toEqual({ paths: ['./team-skills', join(pluginDir, 'skills')], urls: ['https://example.com/skills/'] })
    })
  })

  describe('when the config has no maz-ui-editor agent', () => {
    it('then it adds the subagent with the prompt of its markdown file', () => {
      const config: OpenCodeConfig = {}

      completeConfig(config, createProject(), createPluginDir())

      expect(config.agent).toEqual({ 'maz-ui-editor': { description: 'Writes UI code with maz-ui.', mode: 'subagent', prompt: 'You write UI code.' } })
    })
  })

  describe('when the config already defines maz-ui-editor', () => {
    it('then it is kept', () => {
      const config: OpenCodeConfig = { agent: { 'maz-ui-editor': { description: 'Mine', mode: 'primary' } } }

      completeConfig(config, createProject(), createPluginDir())

      expect(config.agent).toEqual({ 'maz-ui-editor': { description: 'Mine', mode: 'primary' } })
    })
  })

  describe('when the package ships no plugin folder', () => {
    it('then only the MCP server is added', () => {
      const config: OpenCodeConfig = {}

      completeConfig(config, createProject(), undefined)

      expect(Object.keys(config)).toEqual(['mcp'])
    })
  })

  describe('when the markdown file of the subagent has no frontmatter or no description', () => {
    it('then there is no subagent', () => {
      expect(editorAgent(createPluginDir('You write UI code.\n'))).toBeUndefined()
      expect(editorAgent(createPluginDir('---\nname: maz-ui-editor\n---\nYou write UI code.\n'))).toBeUndefined()
      expect(editorAgent(createTempDir())).toBeUndefined()
    })
  })
})

describe('given the files of an OpenCode edit', () => {
  describe('when edit or write writes a file', () => {
    it('then it is the file path of the arguments', () => {
      expect(editedFiles('write', { filePath: '/app/src/App.vue' }, { title: '', output: '' })).toEqual(['/app/src/App.vue'])
    })
  })

  describe('when apply_patch adds, moves and deletes files', () => {
    it('then they are the files it writes', () => {
      const files = [
        { filePath: '/app/a.vue', type: 'add' },
        { filePath: '/app/b.vue', movePath: '/app/c.vue', type: 'move' },
        { filePath: '/app/d.vue', type: 'delete' },
      ]

      expect(editedFiles('apply_patch', {}, { title: '', output: '', metadata: { files } })).toEqual(['/app/a.vue', '/app/c.vue'])
    })
  })

  describe('when apply_patch gives no metadata', () => {
    it('then there is no file', () => {
      expect(editedFiles('apply_patch', {}, { title: '', output: '' })).toEqual([])
    })
  })

  describe('when another tool runs', () => {
    it('then there is no file', () => {
      expect(editedFiles('read', { filePath: '/app/src/App.vue' }, { title: '', output: '' })).toEqual([])
    })
  })
})

describe('given the review of the OpenCode edits', () => {
  describe('when the agent writes a file with maz-ui issues', () => {
    it('then the findings are added to the result of the edit', async () => {
      const directory = createProject()
      const file = writeFile(directory, 'src/App.vue', NATIVE_BUTTON)
      const output = { title: 'src/App.vue', output: 'Wrote file successfully.' }

      await (await hooksFor(directory))['tool.execute.after']({ tool: 'write', sessionID: 'ses_edit', args: { filePath: file } }, output)

      expect(output.output).toContain('Wrote file successfully.\n\n')
      expect(output.output).toContain('[prefer-maz-component]')
    })
  })

  describe('when the edited file is clean', () => {
    it('then the result is left as it is', async () => {
      const directory = createProject()
      const file = writeFile(directory, 'src/App.vue', '<template><MazBtn>b</MazBtn></template>')
      const output = { title: 'src/App.vue', output: 'Wrote file successfully.' }

      await (await hooksFor(directory))['tool.execute.after']({ tool: 'write', sessionID: 'ses_clean', args: { filePath: file } }, output)

      expect(output.output).toBe('Wrote file successfully.')
    })
  })

  describe('when the agent runs a tool that edits nothing', () => {
    it('then the result is left as it is', async () => {
      const output = { title: 'src/App.vue', output: '<template></template>' }

      await (await hooksFor(createProject()))['tool.execute.after']({ tool: 'read', sessionID: 'ses_read', args: { filePath: 'src/App.vue' } }, output)

      expect(output.output).toBe('<template></template>')
    })
  })

  describe('when the result of the edit cannot be changed', () => {
    it('then the error is swallowed', async () => {
      const directory = createProject()
      const file = writeFile(directory, 'src/App.vue', NATIVE_BUTTON)
      const output = Object.freeze({ title: 'src/App.vue', output: 'Wrote file successfully.' })

      await expect((await hooksFor(directory))['tool.execute.after']({ tool: 'write', sessionID: 'ses_frozen', args: { filePath: file } }, output)).resolves.toBeUndefined()
    })
  })

  describe('when a session becomes idle with a changed file', () => {
    it('then the findings are sent back to the session', async () => {
      const directory = createProject()
      writeFile(directory, 'src/Bash.vue', NATIVE_BUTTON)
      const { client, promptAsync } = createClient()
      const sessionID = `ses_idle_${Date.now()}`

      await (await hooksFor(directory, client)).event({ event: { type: 'session.idle', properties: { sessionID } } })

      expect(promptAsync).toHaveBeenCalledWith({ path: { id: sessionID }, body: { parts: [{ type: 'text', text: expect.stringContaining('maz-ui review of the files changed in this task') }] } })
    })
  })

  describe('when a session becomes idle without a changed file', () => {
    it('then nothing is sent', async () => {
      const { client, promptAsync } = createClient()

      await (await hooksFor(createProject(), client)).event({ event: { type: 'session.idle', properties: { sessionID: 'ses_clean_idle' } } })

      expect(promptAsync).not.toHaveBeenCalled()
    })
  })

  describe('when a session becomes idle twice before its review ends', () => {
    it('then it is reviewed once', async () => {
      const directory = createProject()
      writeFile(directory, 'src/Bash.vue', NATIVE_BUTTON)
      const { client, promptAsync } = createClient()
      const hooks = await hooksFor(directory, client)
      const event = { event: { type: 'session.idle', properties: { sessionID: `ses_twice_${Date.now()}` } } }

      await Promise.all([hooks.event(event), hooks.event(event)])

      expect(promptAsync).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the session cannot be read', () => {
    it('then the error is swallowed', async () => {
      const { client, promptAsync } = createClient()
      vi.mocked(client.session.get).mockRejectedValueOnce(new Error('offline'))

      await expect((await hooksFor(createProject(), client)).event({ event: { type: 'session.idle', properties: { sessionID: 'ses_offline' } } })).resolves.toBeUndefined()
      expect(promptAsync).not.toHaveBeenCalled()
    })
  })

  describe('when a subagent session becomes idle', () => {
    it('then nothing is sent', async () => {
      const directory = createProject()
      writeFile(directory, 'src/Bash.vue', NATIVE_BUTTON)
      const { client, promptAsync } = createClient('ses_parent')

      await (await hooksFor(directory, client)).event({ event: { type: 'session.idle', properties: { sessionID: 'ses_child' } } })

      expect(promptAsync).not.toHaveBeenCalled()
    })
  })

  describe('when another event is published', () => {
    it('then nothing is reviewed', async () => {
      const { client, promptAsync } = createClient()

      await (await hooksFor(createProject(), client)).event({ event: { type: 'session.updated', properties: { sessionID: 'ses_other' } } })

      expect(client.session.get).not.toHaveBeenCalled()
      expect(promptAsync).not.toHaveBeenCalled()
    })
  })
})

describe('given the system prompt of OpenCode', () => {
  describe('when the project installs maz-ui', () => {
    it('then the rules of the installed version are added', async () => {
      const directory = createProject()
      installMazUi(directory)
      const output = { system: [] as string[] }

      const hooks = await hooksFor(directory)
      hooks['experimental.chat.system.transform']({}, output)

      expect(output.system).toEqual(['maz-ui 5.9.0 is installed in this project. Its rules, from its docs (maz-ui OpenCode plugin):\n\n# maz-ui\n\nReuse the ecosystem.\n'])
    })
  })

  describe('when the system prompt is built again', () => {
    it('then the rules are read once', async () => {
      const directory = createProject()
      installMazUi(directory)
      const hooks = await hooksFor(directory)
      const first = { system: [] as string[] }
      const second = { system: [] as string[] }

      hooks['experimental.chat.system.transform']({}, first)
      writeFile(directory, 'AGENTS.md', '<!-- BEGIN:maz-ui -->\n<!-- END:maz-ui -->\n')
      hooks['experimental.chat.system.transform']({}, second)

      expect(second.system).toEqual(first.system)
    })
  })

  describe('when the system prompt cannot be changed', () => {
    it('then the error is swallowed', async () => {
      const directory = createProject()
      installMazUi(directory)
      const hooks = await hooksFor(directory)

      expect(() => hooks['experimental.chat.system.transform']({}, { system: Object.freeze([]) as unknown as string[] })).not.toThrow()
    })
  })

  describe('when AGENTS.md already has the maz-ui section', () => {
    it('then nothing is added', () => {
      const directory = createProject()
      installMazUi(directory)
      writeFile(directory, 'AGENTS.md', '<!-- BEGIN:maz-ui -->\n## maz-ui\n<!-- END:maz-ui -->\n')

      expect(sessionRules(directory)).toBeUndefined()
    })
  })

  describe('when the project does not install maz-ui', () => {
    it('then the system prompt is left as it is', async () => {
      const output = { system: ['base'] }
      const hooks = await hooksFor(createProject())

      hooks['experimental.chat.system.transform']({}, output)

      expect(output.system).toEqual(['base'])
    })

    it('then nothing is added', () => {
      expect(sessionRules(join(createTempDir(), 'empty'))).toBeUndefined()
    })
  })
})
