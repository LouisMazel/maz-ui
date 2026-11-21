import type { ServerContext } from './context.ts'

import { describeSource } from './tools/list-docs.ts'

/** Claude Code truncates server instructions to 4096 characters */
export const MAX_INSTRUCTIONS_LENGTH = 4096

export function buildInstructions(context: ServerContext): string {
  return `maz-ui ${context.knowledge.version}: docs, component APIs, icons, Tailwind theme tokens and code review for the maz-ui ecosystem (Vue 3 and Nuxt UI library: components, composables, directives, plugins, @maz-ui/themes, @maz-ui/icons, @maz-ui/utils, @maz-ui/translations, @maz-ui/nuxt; tooling: @maz-ui/node, @maz-ui/eslint-config, @maz-ui/stylelint-config, @maz-ui/upgrade). ${describeSource(context)}

Use these tools whenever you write, refactor or review Vue/Nuxt UI code, styles or helpers in a project that uses maz-ui. Most UI elements, helpers and icons already exist: reuse them instead of re-implementing them.

Workflow:
0. get_project_info() once in a project you do not know: Vue or Nuxt, versions, plugins installed (useToast, useDialog and useWait need theirs), icons by name or imported, the Maz* components it already uses.
1. search_docs("<the need in plain words>") BEFORE creating a component, composable, helper, icon or style ("confirm before delete", "phone input", "debounce search", "dark mode toggle").
2. get_component_api(["MazBtn", ...]) BEFORE writing a template with Maz* components (compact: true for the ones you know): use only documented props, values, events and slots. It lists the example sections: get_doc({ id, sections }) reads one.
3. find_icons("<meaning>") for icons: never inline SVG nor another icon library.
4. get_theme_tokens() BEFORE styling: it reads the project theme (preset, @theme tokens, variants, utilities), shows its effective colors (every step in light and dark, with contrasts: pick a step that works in both modes) and lists the maz-ui classes. Theme colors only (bg-surface, text-foreground, text-muted, border-divider, bg-primary text-primary-foreground, bg-container...), radius, shadow-elevation, breakpoints mob-*/tab-*/lap-*.
5. review_code({ paths: [...] }) on the files you changed, fix every error and warning (not only the errors), and run it again until none is left.
Other tools: get_doc (pages and guides: guide/tailwind, ecosystem/themes, ecosystem/translations, ecosystem/nuxt, guide/vue, guide/migration-v5...), list_docs (catalog), get_setup_guide (install in Vue or Nuxt).

Rules:
- Maz* components instead of native or hand-made elements (MazBtn, MazInput, MazSelect, MazDialog, MazDialogConfirm, MazCard, MazTable, MazAvatar, MazBadge, MazAlert, MazSkeleton, MazDatePicker, MazDropzone...). useToast for notifications, useDialog for confirmations.
- @maz-ui/utils and maz-ui composables instead of lodash, VueUse or custom code. Before a state shared between components (loading: useWait), a timer (debounce, useTimer), a browser API call, an event listener, an observer or a formatter (formatCurrency, formatDate): read the "ecosystem by need" list of the maz-ui rule (.claude/rules/maz-ui.md, AGENTS.md) when the project has it, else search_docs the need.
- Tailwind: never the default palette (bg-blue-500, text-gray-600, bg-white) nor hard-coded colors; theme colors already handle dark mode (no dark: color overrides); never the internal \`maz:\` prefix. Custom CSS uses var(--maz-*).
- Theme through a @maz-ui/themes preset and useTheme() (toggleDarkMode, setColorMode), never by hand.
- Deep imports (maz-ui/components/MazBtn, maz-ui/composables/useToast, @maz-ui/utils/helpers/debounce); the maz-ui root only exports types. Icons: by name in icon props (start-icon="trash") with MazUi() of @maz-ui/vite-plugin or @maz-ui/nuxt, else @maz-ui/icons/raw/MazTrash; /static/ in templates, /lazy/ only when not visible at first render. With @maz-ui/nuxt, components and composables are auto-imported.`
}
