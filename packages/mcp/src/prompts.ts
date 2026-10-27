import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { z } from 'zod'

function userMessage(text: string) {
  return { messages: [{ role: 'user' as const, content: { type: 'text' as const, text } }] }
}

export function registerPrompts(server: McpServer): void {
  server.registerPrompt('build', {
    title: 'Build with maz-ui',
    description: 'Implement a feature, page or component with the maz-ui ecosystem instead of re-implementing it',
    argsSchema: {
      task: z.string().describe('What to build'),
    },
  }, ({ task }) => userMessage(`Implement the following with the maz-ui ecosystem: ${task}

1. Split the task into UI elements, behaviors, helpers, icons and styles.
2. For each one, call \`search_docs\` with the need in plain words and pick what maz-ui provides (components, composables, directives, plugins, @maz-ui/utils helpers).
3. Call \`get_component_api\` (batch) for every Maz* component you will use, \`find_icons\` for icons and \`get_theme_tokens\` for the Tailwind classes. Read \`get_doc\` examples when the usage is not obvious.
4. Write the code: Maz* components, theme colors only, deep imports (or Nuxt auto-imports), no new dependency for something maz-ui covers.
5. Run \`review_code\` on the files you changed and fix every error and warning.`))

  server.registerPrompt('audit', {
    title: 'Audit maz-ui usage',
    description: 'Find and fix what re-implements maz-ui in existing code (native elements, other libraries, default Tailwind palette, wrong APIs)',
    argsSchema: {
      paths: z.string().describe('Files, folders or globs to audit, comma separated (e.g. "src/components, src/pages")'),
    },
  }, ({ paths }) => userMessage(`Audit how these files use the maz-ui ecosystem: ${paths}

1. Run \`review_code\` with these paths.
2. For each finding, check the replacement with \`search_docs\`, \`get_component_api\`, \`find_icons\` or \`get_theme_tokens\`, then fix it without changing the behavior.
3. Also look for hand-made code that maz-ui already provides (formatting, debounce, toasts, dialogs, loaders, skeletons, breakpoints, dark mode) and replace it.
4. Run \`review_code\` again until no error or warning remains, and summarize the changes.`))

  server.registerPrompt('setup', {
    title: 'Set up maz-ui',
    description: 'Install and configure maz-ui, its theme, translations and Tailwind integration in this project',
    argsSchema: {
      framework: z.enum(['vue', 'nuxt']).describe('Framework of the project'),
    },
  }, ({ framework }) => userMessage(`Set up maz-ui in this ${framework} project.

1. Read the project (package.json, ${framework === 'nuxt' ? 'nuxt.config' : 'main.ts'}, CSS entry, Tailwind setup) to know what is already there.
2. Call \`get_setup_guide({ framework: "${framework}" })\` and apply it: dependencies, ${framework === 'nuxt' ? 'the @maz-ui/nuxt module options' : 'the MazUi plugin with a theme preset and translations'}, CSS imports and Tailwind theme tokens.
3. Run \`npx @maz-ui/mcp init\` so every AI agent of the project gets the maz-ui rules and this MCP server.
4. Verify that the app builds and that a MazBtn renders with the theme.`))
}
