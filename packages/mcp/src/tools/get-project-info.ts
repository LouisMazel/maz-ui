import type { ServerContext } from '../context.ts'

import { defineTool } from './types.ts'

export async function getProjectInfo(context: ServerContext): Promise<string> {
  // The project scan loads on the first call, not when the server starts
  const { readProjectInfo, renderProjectInfo } = await import('../project/info.ts')

  return `# maz-ui in this project\n\n${renderProjectInfo(await readProjectInfo(context.cwd, context.knowledge.componentsByName.keys()))}`
}

export const getProjectInfoTool = defineTool({
  name: 'get_project_info',
  title: 'maz-ui setup of the project',
  description: 'How this project uses maz-ui, in one call: Vue or Nuxt, the installed versions of the ecosystem, the apps of a monorepo, the plugins already installed (useToast, useDialog, useWait need theirs), auto-imports, icons by name or imported, theme presets, and the maz-ui components and helpers the code already uses. Call it once at the start of a task in an unknown project.',
  inputSchema: {},
  run: getProjectInfo,
})
