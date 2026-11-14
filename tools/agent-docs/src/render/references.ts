import type { IconGroup } from '../sources/icons'
import type { TailwindManifest } from '../types'

const COLOR_UTILITIES = 'bg-, text-, border-, ring-, outline-, fill-, stroke-, divide-, from-, via-, to-, decoration-, placeholder-, accent-, caret-, shadow-'

function colorUtilities(name: string): string[] {
  if (name === 'shadow')
    return ['shadow-shadow/20', 'bg-shadow']
  if (name === 'overlay')
    return ['bg-overlay', 'bg-overlay/60']
  if (name === 'container' || name === 'input')
    return [`bg-${name}`]

  return [`bg-${name}`, `text-${name}`, `border-${name}`]
}

const BREAKPOINT_TARGETS: Record<string, string> = {
  'mob-s': 'small phones',
  'mob-m': 'phones',
  'mob-l': 'large phones',
  'tab-s': 'small tablets (Tailwind `sm`)',
  'tab-m': 'tablets portrait (Tailwind `md`)',
  'tab-l': 'tablets landscape',
  'lap-s': 'small laptops (Tailwind `lg`)',
  'lap-m': 'laptops (Tailwind `xl`)',
  'lap-l': 'laptops',
  'lap-xl': 'desktops (Tailwind `2xl`)',
  'lap-2xl': 'large desktops',
  'lap-3xl': 'full HD and wider',
}

const CSS_VARIABLES: string[][] = [
  ['`--maz-<color>`, `--maz-<color>-foreground`', 'Colors of the preset: `--maz-primary`, `--maz-surface`, `--maz-foreground`, `--maz-muted`, `--maz-divider`...'],
  ['`--color-<color>-<step>`', 'The `50` to `950` steps in your project (`var(--color-primary-100)`)'],
  ['`--maz-container-bg`, `--maz-input-bg`', 'Backgrounds of the containers and inputs (fall back to `--maz-surface`)'],
  ['`--maz-rounded-{xs..3xl}`', 'Radius scale'],
  ['`--maz-shadow-style-{sm,md,lg,xl,elevation}`', 'Shadow scale'],
  ['`--maz-space`', 'Spacing unit: `calc(var(--maz-space) * 4)`'],
  ['`--maz-base-font-size`, `--maz-border-width`', 'Root font size, default border width'],
  ['`--maz-font-family`, `--maz-font-display-stack`, `--maz-font-mono-stack`', 'Font stacks'],
  ['`--maz-typography-<level>-{font,size,weight,leading,tracking}`', 'Type scale levels set by the preset (see Type scale)'],
  ['`--maz-motion-{fast,normal,slow}`, `--maz-easing-{out,in,in-out}`', 'Durations and easings'],
  ['`--maz-disabled-opacity`, `--maz-disabled-cursor`', 'Disabled look'],
  ['`--maz-btn-font-weight`, `--maz-input-top-label-font-weight`, `--maz-dialog-max-width`, `--maz-dialog-min-width`', 'Component tokens of the preset'],
  ['`--maz-container-max-width`, `--maz-container-padding-{mobile,tablet,desktop}`', 'Layout (see Layout)'],
  ['`--maz-rich-text-size`, `--maz-rich-text-scale`, `--maz-rich-text-max-width`', 'Rich text'],
]

/** Default value of a `--maz-typography-<level>-<key>` declaration of a type scale utility */
function declarationDefault(css: string, key: string): string {
  return new RegExp(String.raw`var\(--maz-typography-[\w-]+-${key}, (.*?)\);`).exec(css)?.[1] ?? '-'
}

function table(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell => cell.replaceAll('|', String.raw`\|`)).join(' | ')} |`),
  ].join('\n')
}

export function renderTailwindReference(tokens: TailwindManifest): string {
  const colors = tokens.colors.filter(color => color.name !== 'elevation')
  const typeScale = tokens.utilities.filter(utility => utility.name.startsWith('text-'))
  const typeStyles = tokens.utilities.filter(utility => utility.name.startsWith('type-'))
  const richText = tokens.utilities.filter(utility => utility.name.startsWith('rich-text'))
  const others = tokens.utilities.filter(utility => !typeScale.includes(utility) && !typeStyles.includes(utility) && !richText.includes(utility))
  const scaleRange = (scale: string[]): string => (scale.length > 0
    ? `\`-${scale[0]}\` to \`-${scale.at(-1)}\``
    : '-')

  return `# Tailwind CSS theme reference

> Every Tailwind utility, variant and CSS variable provided by the maz-ui theme. Generated from the \`maz-ui/tailwindcss/*.css\` sources: it is always in sync with the installed version.

## Setup

\`\`\`css
/* your Tailwind entry, e.g. app/assets/css/main.css */
@import 'tailwindcss';
@import 'maz-ui/tailwindcss/theme.css';
@import 'maz-ui/tailwindcss/utilities.css';
\`\`\`

- Use the classes **without prefix**: \`bg-primary\`, \`rounded-md\`, \`tab-m:flex\`. The \`maz:\` prefix you may see in the library sources is internal to maz-ui and does not exist in your project.
- Every value is a runtime CSS variable driven by the active \`@maz-ui/themes\` preset: switching preset or color mode restyles every utility without rebuild.
- See \`guide/tailwind.md\` to extend the theme (custom colors, fonts, animations, variants).

### Entry points

${table(['Import', 'Content'], tokens.entries.map(entry => [`\`${entry.path}\``, entry.description]))}

## Colors

Each color works with every color utility (${COLOR_UTILITIES}) and with opacity modifiers (\`bg-primary/50\`). Colors are light/dark aware (\`light-dark()\`): **do not add \`dark:\` overrides for theme colors**.

${table(
  [
    'Color',
    'Utilities',
    'Foreground',
    'Scale',
    'CSS variable',
    'Use for',
  ],
  colors.map(color => [
    `\`${color.name}\``,
    colorUtilities(color.name).map(utility => `\`${utility}\``).join(' '),
    color.foreground
      ? `\`text-${color.name}-foreground\``
      : '-',
    scaleRange(color.scale),
    color.variable
      ? `\`${color.variable}\``
      : '-',
    color.usage,
  ]),
)}

- \`-foreground\` is the readable text color on top of the base color: \`bg-primary text-primary-foreground\`.
- Scales go from light (\`-50\`) to dark (\`-950\`), \`-500\` is the base color. They are derived from the base color in OKLCh, so they follow the preset.
- Never use the Tailwind default palette (\`bg-blue-500\`, \`text-gray-600\`, \`bg-white\`, \`text-black\`) nor hard-coded colors (\`#fff\`, \`rgb()\`): pick the matching theme color (\`bg-surface\`, \`text-foreground\`, \`text-muted\`, \`border-divider\`, \`bg-primary\`...).

## Border radius

${table(['Utility', 'Value'], tokens.radius.map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

\`rounded-full\` and \`rounded-none\` keep their Tailwind values.

## Shadows

${table(['Utility', 'Value'], tokens.shadows.map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

Use \`shadow-elevation\` for raised surfaces (cards, popovers, menus).

## Spacing

\`--spacing\` is \`${tokens.spacing[0]?.value ?? 'var(--maz-space)'}\` (\`0.25rem\` by default): every spacing utility (\`p-4\`, \`gap-2\`, \`mt-6\`, \`w-10\`, \`inset-1\`...) is a multiple of the preset \`space\` token. Use the scale, avoid arbitrary values like \`p-[13px]\`.

## Breakpoints

Mobile-first \`min-width\` variants of the **viewport**, added on top of the Tailwind defaults (\`sm:\` to \`2xl:\` still work). Prefix them with \`max-\` for max-width queries (\`max-tab-m:hidden\`), combine them for a range (\`tab-m:max-lap-s:grid-cols-2\`).

${table(['Variant', 'Min width', 'Typical target'], tokens.breakpoints.map(token => [`\`${token.name}\``, token.value, BREAKPOINT_TARGETS[token.name.replace(/:$/, '')] ?? '-']))}

\`\`\`html
<div class="grid gap-4 tab-m:grid-cols-2 lap-m:grid-cols-3">...</div>
<aside class="hidden lap-s:block">...</aside>
<MazBtn class="w-full tab-s:w-auto">Save</MazBtn>
\`\`\`

Prefer them to \`sm:\`/\`md:\`/\`lg:\` in a maz-ui project: the components and \`useBreakpoints\` use the same scale. In TypeScript: \`import { screens } from 'maz-ui/tailwindcss'\`, or the \`useBreakpoints\` composable.

## Container queries

The breakpoint names also exist as container sizes (\`maz-ui/tailwindcss/theme-containers.css\`): mark a parent with the Tailwind \`@container\` class, then \`@<name>:\` applies from the width of **that parent**, whatever the viewport. Use them for components that live in places of different widths (cards in a sidebar and in the main column, dashboards, split views).

${table(['Variant', 'Min container width'], tokens.containers.map(token => [`\`${token.name}\``, token.value]))}

\`\`\`html
<section class="@container">
  <div class="grid gap-4 @tab-m:grid-cols-2 @lap-s:grid-cols-3">...</div>
</section>
\`\`\`

- \`@max-tab-m:\` for max-width, \`@container/sidebar\` with \`@tab-m/sidebar:\` for a named container. The Tailwind sizes (\`@md:\`, \`@3xl:\`) keep working.
- The same sizes give width utilities: \`max-w-tab-m\`, \`w-lap-s\`.

## Layout

\`padded-container\` is the page gutter of maz-ui: put it on every full-width band of a page (header, sections, footer) instead of \`container mx-auto px-4\`. It keeps the band full width (backgrounds go edge to edge), adds a responsive side padding and centers the content within \`--maz-container-max-width\`.

\`\`\`html
<header class="padded-container border-b border-divider py-4">...</header>
<main class="padded-container py-12">
  <h1 class="text-title-1">Projects</h1>
</main>
<section class="padded-container-no-p">full-bleed carousel, centered on the same column</section>
\`\`\`

- The padding is mobile (\`1rem\`), tablet from \`mob-l\` (\`2rem\`), desktop from \`lap-s\` (\`2.5rem\`) of the viewport. Inside an \`@container\` ancestor, it follows the width of that container instead: a layout with a sidebar keeps the right gutter.
- Override the variables below in your CSS (\`:root { --maz-container-max-width: 1200px; }\`): the utilities follow, no media query to update.

${table(['Variable', 'Default'], tokens.containerVariables
  .filter(token => token.name !== '--maz-container-width' && token.name !== '--maz-container-padding')
  .map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

### Layout patterns

- **Page header**: \`<div class="flex flex-wrap items-center justify-between gap-4">\` with an \`<h1 class="text-title-1">\` (and a \`text-caption\` or \`text-muted\` subtitle) on one side, the actions on the other.
- **Section**: \`<section class="flex flex-col gap-4">\` with an \`<h2 class="text-title-2">\`; space the sections with \`gap-8\`/\`gap-12\` on their parent rather than margins.
- **Form row** (field + button): \`<div class="flex items-end gap-2"><MazInput block class="flex-1" /><MazBtn class="shrink-0">Add</MazBtn></div>\`: without \`shrink-0\` the block input squeezes the button.
- **Empty state**: \`<div class="flex flex-col items-center gap-3 py-12 text-center">\` with an icon (\`size-10 text-muted\`), a \`text-title-3\`, a \`text-body-sm text-muted\` explanation and one primary \`MazBtn\`.
- **Actions bar** (dialog, form footer): \`<div class="flex flex-wrap justify-end gap-2">\` with the cancel action first (\`MazBtn color="contrast" outlined\` or a \`MazLink\`), the primary action last.
- **Cards grid**: \`<div class="grid gap-4 tab-m:grid-cols-2 lap-m:grid-cols-3">\` of \`MazCard\`, or \`@container\` + \`@tab-m:grid-cols-2\` when the grid is not full width.

### Action hierarchy

- One solid \`color="primary"\` \`MazBtn\` per view or group of actions: the main action. The other actions are \`outlined\`, \`pastel\` or \`color="contrast" outlined\`.
- Cancel, back and "learn more" are low emphasis: a \`MazLink\` or an outlined \`MazBtn\`, placed before the primary action.
- Destructive actions use \`color="destructive"\` and a confirmation (\`useDialog\`, \`MazDialogConfirm\`).
- Neighbouring buttons share the same \`size\`.

## Typography and motion

${table(['Utility', 'Value'], [
  ...tokens.fonts,
  ...tokens.durations,
  ...tokens.easings,
].map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

- The default border width and the default transition duration and easing also follow the preset.
- Durations are theme variables, use them with the arbitrary syntax: \`transition-colors duration-(--duration-fast)\`.

## Type scale

One class per text role: it sets the font, size, weight, line height and letter spacing together, so the text of every screen stays consistent. Use it instead of combining \`text-2xl font-semibold\`, \`text-xs text-muted\` or arbitrary sizes. The visual level is independent of the tag (\`<h2 class="text-title-3">\`); add a color class when needed (\`text-title-2 text-primary\`). The Tailwind sizes (\`text-xs\` to \`text-9xl\`) keep working.

${table([
  'Utility',
  'Use for',
  'Size',
  'Weight',
  'Line height',
], typeScale.map(utility => [
  `\`${utility.name}\``,
  utility.description ?? '-',
  `\`${declarationDefault(utility.css, 'size')}\``,
  `\`${declarationDefault(utility.css, 'weight')}\``,
  `\`${declarationDefault(utility.css, 'leading')}\``,
]))}

- Sizes are in \`rem\`: they follow the \`base-font-size\` of the preset. \`text-display\` is fluid.
- Responsive: \`text-title-2 lap-s:text-title-1\`. Numbers in tables and counters: add \`tabular-nums\`.
- The preset sets the levels with its \`typography\` block (\`typography: { 'title-1': { size: '2.25rem', weight: '800' } }\`, keys \`font\`, \`size\`, \`weight\`, \`leading\`, \`tracking\`, and \`color\` for \`caption\`), or in CSS with \`--maz-typography-<level>-<key>\`.
- The components of maz-ui use these levels (dialog, drawer and card titles in \`title-3\`, hints in \`body-sm\`, tabs and list items in \`label\`...): the \`typography\` block of the preset restyles them too.
${typeStyles.length > 0
  ? `- \`type-<level>\` (${typeStyles.map(utility => `\`${utility.name}\``).join(', ')}) applies a level without its font size, for text sized elsewhere (a \`size\` prop, \`text-sm\`): \`type-label text-sm\`.`
  : ''}

## Rich text

${table(['Utility', 'Use for'], richText.map(utility => [`\`${utility.name}\``, utility.description ?? '-']))}

\`rich-text\` styles the HTML you do not write yourself (Markdown, CMS content, the output of a rich text editor) from the theme: headings, paragraphs, links, lists, blockquotes, inline code, \`kbd\`, \`pre\`, tables, \`hr\`, images and figures, in light and dark mode without \`dark:\` variant. It applies the type scale semantically: \`h1\` to \`h4\` follow \`title-1\` to \`title-4\`, \`h5\`/\`h6\` and \`th\`/\`dt\` \`label\`, the text \`body\`, \`blockquote\` the \`body-lg\` size, tables \`body-sm\`, \`code\`/\`kbd\`/\`pre\` \`code\`, \`figcaption\` \`caption\`. \`rich-text-sm\` and \`rich-text-lg\` set \`--maz-rich-text-scale\` (0.875 / 1.125), which multiplies every size. Put \`not-rich-text\` on a block to opt it out (an embedded component), \`max-w-none\` to remove the \`70ch\` reading width. \`MazCodeHighlight\` blocks keep their own style. Variables: \`--maz-rich-text-size\`, \`--maz-rich-text-scale\`, \`--maz-rich-text-max-width\`. Full guide: \`guide/typography.md\`.

\`\`\`html
<article class="rich-text rich-text-lg" v-html="html" />
\`\`\`

## z-index

${table(['Utility', 'Value'], tokens.zIndex.map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

## Custom utilities

From \`maz-ui/tailwindcss/utilities.css\` (the type scale and \`rich-text\` are above):

${table(['Utility', 'Use for', 'CSS'], others.map(utility => [`\`${utility.name}\``, utility.description ?? '-', `\`${utility.css}\``]))}

## Variants

${table(['Variant', 'Selector'], tokens.variants.map(variant => [`\`${variant.name}:\``, `\`${variant.value}\``]))}

\`dark:\` matches the \`.dark\` class toggled by \`useTheme()\` (\`darkModeStrategy: 'class'\`, the default). Theme colors already adapt to dark mode: keep \`dark:\` for real layout or content differences.

## Vue transitions

Transition names shipped in \`maz-ui/style.css\`, usable with \`<Transition name="...">\`: ${tokens.transitions.map(name => `\`${name}\``).join(', ')}.

## CSS variables in custom CSS

In \`<style>\` blocks or plain CSS, use the runtime variables instead of literal values. With Tailwind, prefer \`@apply\` after \`@reference "<your tailwind entry>"\` in Vue SFC style blocks.

${table(['Variables', 'Content'], CSS_VARIABLES)}
`
}

export function renderIconsReference(groups: IconGroup[], total: number): string {
  const sections = groups
    .filter(group => group.names.length > 0)
    .map(group => `## ${group.title} (${group.names.length})\n\n${group.description}\n\n${group.names.join(', ')}`)

  return `# Icons reference

> The ${total} icons of \`@maz-ui/icons\`. Use them instead of inline SVG or another icon library.

## Usage

\`\`\`vue
<script setup lang="ts">
import { MazTrash } from '@maz-ui/icons/static/MazTrash' // one icon, tree-shakable
import { MazXMark } from '@maz-ui/icons/lazy/MazXMark' // lazy-loaded async component
</script>

<template>
  <MazTrash class="size-5 text-destructive" />
  <MazBtn :start-icon="MazTrash" color="destructive">Delete</MazBtn>
</template>
\`\`\`

- Barrel import: \`import { MazTrash, LazyMazTrash } from '@maz-ui/icons'\`. Raw SVG string: \`import { MazTrash } from '@maz-ui/icons/raw/MazTrash'\`.
- Auto-import with unplugin-vue-components: \`import { MazIconsResolver } from '@maz-ui/icons/resolvers'\`.
- maz-ui components accept icons as props (\`start-icon\`, \`end-icon\`, \`icon\`...): pass the component itself, not a string.
- Size and color come from CSS: \`class="size-5 text-primary"\` (icons use \`currentColor\`).

${sections.join('\n\n')}
`
}
