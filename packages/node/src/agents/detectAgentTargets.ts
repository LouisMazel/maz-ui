import type { AgentTarget } from './types'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { AGENT_TARGETS } from './types'

export const CLAUDE_MEMORY_FILES = ['CLAUDE.md', '.claude/CLAUDE.md', 'CLAUDE.local.md']

/** Files or folders of a project (relative to its root) that show it uses an agent */
const AGENT_MARKERS: Record<AgentTarget, string[]> = {
  'claude': [
    '.claude',
    'CLAUDE.md',
    'CLAUDE.local.md',
    '.mcp.json',
  ],
  // The agents that only read AGENTS.md: Codex, Cline, Zed, Antigravity...
  'agents-md': [
    'AGENTS.md',
    '.agents',
    '.agent',
    '.codex',
    '.cline',
    '.clinerules',
    '.zed',
    '.rules',
  ],
  'cursor': ['.cursor', '.cursorrules'],
  'vscode': ['.vscode/mcp.json', '.github/copilot-instructions.md', '.github/instructions'],
  'gemini': ['.gemini', 'GEMINI.md'],
  'opencode': ['opencode.json', 'opencode.jsonc', '.opencode'],
  'junie': ['.junie'],
  'windsurf': ['.windsurf', '.windsurfrules', '.devin'],
  'warp': ['.warp', 'WARP.md'],
  'kiro': ['.kiro'],
  'roo': ['.roo', '.roorules'],
}

/**
 * Detects the AI agents of a project from its files, never from the home folder nor the environment: every
 * developer and the CI get the same result. `agents-md` is added as soon as an agent other than Claude Code is
 * detected, since they read their rules from `AGENTS.md`.
 */
export function detectAgentTargets(rootDir: string): AgentTarget[] {
  const detected = AGENT_TARGETS.filter(target => AGENT_MARKERS[target].some(path => existsSync(join(rootDir, path))))

  return detected.some(target => target !== 'claude')
    ? AGENT_TARGETS.filter(target => target === 'agents-md' || detected.includes(target))
    : detected
}
