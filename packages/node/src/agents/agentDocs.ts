import type { AgentDocs, AgentsTool, SetupAgentsOptions } from './types'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { findProjectPackage, readPackageVersion } from '../project'
import { MAZ_UI_AGENTS_TOOL } from './tool'

/** Folder of the agent docs of an installed package: `agent-docs`, else `docs` (older maz-ui versions), else undefined */
export function resolveAgentDocsDir(packageDir: string): string | undefined {
  return ['agent-docs', 'docs']
    .map(folder => join(packageDir, folder))
    .find(directory => existsSync(join(directory, 'manifest.json')))
}

/** Reads the agent files shipped in `maz-ui/agent-docs/agents` */
export function readAgentDocs(rootDir: string, docsDir?: string): AgentDocs {
  let directory = docsDir

  if (!directory) {
    const packageDir = findProjectPackage(rootDir, 'maz-ui')

    if (!packageDir)
      throw new Error(`maz-ui is not installed in ${rootDir}: install it first (\`npm install maz-ui\`).`)

    directory = resolveAgentDocsDir(packageDir) ?? join(packageDir, 'agent-docs')
  }

  const manifestFile = join(directory, 'manifest.json')
  const claudeRuleFile = join(directory, 'agents/claude-rule.md')
  const agentsMdFile = join(directory, 'agents/agents-md.md')

  if (!existsSync(manifestFile) || !existsSync(claudeRuleFile) || !existsSync(agentsMdFile)) {
    throw new Error(`The installed maz-ui does not ship the agent docs (no manifest and agent files in ${directory}; older versions ship them in a docs folder): upgrade maz-ui to the latest version.`)
  }

  // The docs are generated before the release bumps the version: the package.json of maz-ui is the source of truth
  const packageVersion = readPackageVersion(dirname(directory))

  return {
    directory,
    version: packageVersion ?? (JSON.parse(readFileSync(manifestFile, 'utf8')) as { version: string }).version,
    claudeRule: readFileSync(claudeRuleFile, 'utf8').trim(),
    agentsMdSection: readFileSync(agentsMdFile, 'utf8').trim(),
  }
}

/** Rules of the tool: the given ones, else the maz-ui agent docs */
export function resolveAgentDocs(options: SetupAgentsOptions, tool: AgentsTool): AgentDocs {
  if (options.agentDocs)
    return options.agentDocs

  if (tool !== MAZ_UI_AGENTS_TOOL)
    throw new Error(`setupAgents needs the rules of ${tool.name}: pass them with the agentDocs option.`)

  return readAgentDocs(options.appDir ?? options.rootDir, options.docsDir)
}
