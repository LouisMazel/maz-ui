import type { Knowledge } from '../knowledge/load.ts'
import type { FileReview } from './files.ts'
import type { Finding, Framework } from './types.ts'

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { dependsOnPackages, isIgnoredPath, REVIEWABLE_EXTENSIONS, reviewFiles } from './files.ts'
import { formatFindings } from './index.ts'

/** Input of a Claude Code hook, on stdin */
export interface HookInput {
  hook_event_name?: string
  session_id?: string
  /** `true` when the agent already continues because of a `Stop` hook: it is not blocked twice */
  stop_hook_active?: boolean
  tool_input?: { file_path?: string }
  cwd?: string
}

export interface HookReviewOptions {
  knowledge: Knowledge
  cwd: string
  framework?: Framework
  /**
   * Docs of the maz-ui installed in a project folder (`knowledge` by default): in a monorepo, the session starts at the
   * root and pnpm installs maz-ui in the apps only, each file is reviewed with the version of its app
   */
  knowledgeFor?: (projectDirectory: string) => Knowledge
}

/** Packages whose projects the hook reviews: the review is about the maz-ui components */
const HOOK_PACKAGES = ['maz-ui', '@maz-ui/nuxt']
const STOP_EVENTS = ['Stop', 'SubagentStop']
/** A task that changed more files is reviewed with `review_code` or the CLI, not at each stop */
const MAX_STOP_FILES = 50

const FOOTER = 'Fix these maz-ui issues now: each one gives the import to use (the maz-ui MCP tools give the details). When one is intended, add a `maz-ui-review-ignore <rule> -- <reason>` comment above the line.'

/** The closest folder of a file where maz-ui is installed, `undefined` without one */
export function mazUiProjectOf(file: string): string | undefined {
  for (let directory = dirname(file); ; directory = dirname(directory)) {
    if (existsSync(join(directory, 'node_modules/maz-ui/package.json')))
      return directory

    if (dirname(directory) === directory)
      return undefined
  }
}

/** The reviews of the files, each one with the docs of the maz-ui of its project */
async function reviewByProject(files: string[], { knowledge, knowledgeFor, cwd, framework }: HookReviewOptions): Promise<FileReview[]> {
  const byProject = new Map<string | undefined, string[]>()

  for (const file of files) {
    const project = knowledgeFor && mazUiProjectOf(file)

    byProject.set(project, [...(byProject.get(project) ?? []), file])
  }

  const reviews = await Promise.all([...byProject].map(([project, group]) => reviewFiles(group, {
    knowledge: project && knowledgeFor
      ? knowledgeFor(project)
      : knowledge,
    cwd,
    framework,
    minSeverity: 'warning',
  })))

  return reviews.flatMap(review => review.reviews)
}

function isReviewable(file: string): boolean {
  return REVIEWABLE_EXTENSIONS.includes(file.split('.').pop() ?? '') && !isIgnoredPath(file) && dependsOnPackages(dirname(file), HOOK_PACKAGES)
}

/** Files created or modified in the git repository of a directory (staged, unstaged and untracked), deleted ones excluded */
export function changedFiles(directory: string): string[] {
  try {
    // eslint-disable-next-line sonarjs/no-os-command-from-path -- the git of the user, run in its own project
    const git = (args: string[]): string => execFileSync('git', args, { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    const root = git(['rev-parse', '--show-toplevel']).trim()
    const entries = git(['status', '--porcelain', '-z', '--untracked-files=all']).split('\0')
    const files: string[] = []

    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index]
      const status = entry.slice(0, 2)

      // a rename is followed by its former path
      if (status.includes('R') || status.includes('C'))
        index++

      if (entry.length > 3 && !status.includes('D'))
        files.push(join(root, entry.slice(3)))
    }

    return files
  }
  catch {
    return []
  }
}

/** Findings already sent to the agent in the session: a stop does not send them again */
class ReportedFindings {
  private readonly file: string | undefined
  private readonly keys: Set<string>

  constructor(sessionId: string | undefined) {
    this.file = sessionId && /^[\w-]+$/.test(sessionId)
      ? join(tmpdir(), 'maz-ui-mcp-hooks', `${sessionId}.json`)
      : undefined
    this.keys = new Set(this.file && existsSync(this.file)
      ? JSON.parse(readFileSync(this.file, 'utf8')) as string[]
      : [])
  }

  static key(file: string, finding: Finding): string {
    return `${file}|${finding.rule}|${finding.message}`
  }

  has(key: string): boolean {
    return this.keys.has(key)
  }

  save(keys: string[]): void {
    if (!this.file)
      return

    for (const key of keys) this.keys.add(key)
    mkdirSync(dirname(this.file), { recursive: true })
    writeFileSync(this.file, JSON.stringify([...this.keys]))
  }
}

/**
 * Claude Code hook: after an edit (`PostToolUse`), reviews the edited file; at the end of a task (`Stop`,
 * `SubagentStop`), reviews the files changed in git, written by `Edit` or another way (a heredoc in Bash), and only
 * sends the findings not sent yet in the session. Returns the message for the agent, `undefined` when there is
 * nothing to fix.
 */
export async function reviewHook(input: HookInput, options: HookReviewOptions): Promise<string | undefined> {
  // git gives the real paths (`/private/var` on macOS): the findings of an edit and of a stop share their keys
  const directory = realpathSync(input.cwd ?? options.cwd)
  const isStop = STOP_EVENTS.includes(input.hook_event_name ?? '')

  if (isStop && input.stop_hook_active)
    return undefined

  const file = input.tool_input?.file_path
  const files = (isStop
    ? changedFiles(directory)
    : file
      ? [resolve(directory, file)]
      : []).filter(path => existsSync(path) && isReviewable(path)).map(path => realpathSync(path)).slice(0, MAX_STOP_FILES)

  if (files.length === 0)
    return undefined

  const reported = new ReportedFindings(input.session_id)
  const reviews = await reviewByProject(files, { ...options, cwd: directory })
  const fresh = reviews
    .map(review => ({
      ...review,
      findings: review.findings.filter(finding => !isStop || !reported.has(ReportedFindings.key(review.file, finding))),
    }))
    .filter(review => review.findings.length > 0)

  reported.save(fresh.flatMap(review => review.findings.map(finding => ReportedFindings.key(review.file, finding))))

  if (fresh.length === 0)
    return undefined

  const intro = isStop
    ? 'maz-ui review of the files changed in this task:\n\n'
    : ''

  return `${intro}${fresh.map(review => formatFindings(review.findings, review.file)).join('\n\n')}\n\n${FOOTER}`
}
