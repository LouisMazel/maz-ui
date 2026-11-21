import type { ServerContext } from '../context.ts'
import type { Framework, Severity } from '../review/index.ts'

import { relative } from 'node:path'
import { z } from 'zod'
import { defineTool, ToolInputError } from './types.ts'

export interface ReviewCodeArgs {
  paths?: string[]
  code?: string
  filename?: string
  framework?: Framework
  minSeverity?: Severity
}

const LEGEND = 'Fix every error and warning (info are suggestions). If a native element or a rule is intended, add a `maz-ui-review-ignore [rule]` comment on the line above.'

export async function reviewCodeTool(context: ServerContext, { paths, code, filename, framework, minSeverity = 'info' }: ReviewCodeArgs): Promise<string> {
  if (!paths?.length && !code)
    throw new ToolInputError('Pass `paths` (files, folders or globs, relative to the project) or `code` (with `filename` to pick the parser).')

  // The Vue compiler and Babel load on the first review, not when the server starts
  const [{ countBySeverity, filterBySeverity, formatFindings, reviewCode }, { detectFramework, MAX_REVIEWED_FILES, mazUiWorkspaces, projectIconNames, reviewFiles }] = await Promise.all([
    import('../review/index.ts'),
    import('../review/files.ts'),
  ])
  const sections: string[] = []

  if (code) {
    const findings = filterBySeverity(
      reviewCode(code, {
        knowledge: context.knowledge,
        filename,
        framework: framework ?? detectFramework(context.cwd),
        icons: projectIconNames(context.cwd, context.knowledge),
      }),
      minSeverity,
    )
    sections.push(formatFindings(findings, filename ?? 'code'))
  }

  if (paths?.length) {
    const { reviews, truncated } = await reviewFiles(paths, {
      knowledge: context.knowledge,
      cwd: context.cwd,
      framework,
      minSeverity,
    })

    if (reviews.length === 0) {
      const workspaces = mazUiWorkspaces(context.cwd).map(workspace => `\`${relative(context.cwd, workspace)}\``)

      throw new ToolInputError(`No .vue, .ts, .js or .css file matches ${paths.join(', ')}, from ${context.cwd}${workspaces.length > 0
        ? ` nor from its apps that use maz-ui (${workspaces.join(', ')})`
        : ''}. Pass the paths relative to one of them, or absolute.`)
    }

    const withIssues = reviews.filter(review => review.findings.length > 0)
    const totals = countBySeverity(reviews.flatMap(review => review.findings))

    sections.push(`Reviewed ${reviews.length} file${reviews.length > 1
      ? 's'
      : ''}: ${totals.error} errors, ${totals.warning} warnings, ${totals.info} info.${truncated
      ? ` Only the first ${MAX_REVIEWED_FILES} files were reviewed: narrow the paths.`
      : ''}`)
    sections.push(...withIssues.map(review => formatFindings(review.findings, review.file)))
  }

  return `# maz-ui review (maz-ui ${context.knowledge.version})\n\n${sections.join('\n\n')}\n\n${LEGEND}`
}

export const reviewCodeToolDefinition = defineTool({
  name: 'review_code',
  title: 'Review code against maz-ui',
  description: 'Static review of Vue SFCs, TS/JS and CSS against the installed maz-ui: unknown components, props, v-model, events, slots or slot props, missing required props, invalid prop values, unknown icons, unlabeled fields, buttons in links or navigating from @click, native elements or third-party libraries that maz-ui already covers (buttons, inputs, dialogs, toasts, icons, date pickers, lodash debounce, alert/confirm, hand-written currency formatting...), default Tailwind palette and hard-coded colors instead of theme tokens, the internal `maz:` prefix, Tailwind v3 utilities, manual dark mode, wrong imports. Run it on the files you created or changed before finishing.',
  inputSchema: {
    paths: z.array(z.string()).max(50).optional().describe('Files, folders or globs relative to the project root, or to an app of the monorepo: ["src/components/LoginForm.vue", "app/pages/**/*.vue"]'),
    code: z.string().optional().describe('Source to review when it is not on disk'),
    filename: z.string().optional().describe('Name of `code` (e.g. "Card.vue") to select the parser'),
    framework: z.enum(['vue', 'nuxt']).optional().describe('Detected from nuxt.config when omitted'),
    minSeverity: z.enum(['error', 'warning', 'info']).optional().describe('Hide findings below this severity (default info)'),
  },
  run: reviewCodeTool,
})
