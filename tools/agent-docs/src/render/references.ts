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

function table(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell => cell.replaceAll('|', String.raw`\|`)).join(' | ')} |`),
  ].join('\n')
}

export function renderTailwindReference(tokens: TailwindManifest, version: string): string {
  const colors = tokens.colors.filter(color => color.name !== 'elevation')
  const scaleRange = (scale: string[]): string => (scale.length > 0 ? `\`-${scale[0]}\` to \`-${scale.at(-1)}\`` : '-')

  return `# Tailwind CSS theme reference

> Every Tailwind utility, variant and CSS variable provided by the maz-ui ${version} theme. Generated from the \`maz-ui/tailwindcss/*.css\` sources: it is always in sync with the installed version.

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
  ['Color', 'Utilities', 'Foreground', 'Scale', 'CSS variable', 'Use for'],
  colors.map(color => [
    `\`${color.name}\``,
    colorUtilities(color.name).map(utility => `\`${utility}\``).join(' '),
    color.foreground ? `\`text-${color.name}-foreground\`` : '-',
    scaleRange(color.scale),
    color.variable ? `\`${color.variable}\`` : '-',
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

Mobile-first \`min-width\` variants, added on top of the Tailwind defaults (\`sm:\` to \`2xl:\` still work). Prefix them with \`max-\` for max-width queries (\`max-tab-m:hidden\`).

${table(['Variant', 'Min width'], tokens.breakpoints.map(token => [`\`${token.name}\``, token.value]))}

In TypeScript: \`import { screens } from 'maz-ui/tailwindcss'\`, or the \`useBreakpoints\` composable.

## Typography and motion

${table(['Utility', 'Value'], [...tokens.fonts, ...tokens.durations, ...tokens.easings].map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

- The default border width and the default transition duration and easing also follow the preset.
- Durations are theme variables, use them with the arbitrary syntax: \`transition-colors duration-(--duration-fast)\`.

## z-index

${table(['Utility', 'Value'], tokens.zIndex.map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

## Custom utilities

From \`maz-ui/tailwindcss/utilities.css\`:

${table(['Utility', 'CSS'], tokens.utilities.map(utility => [`\`${utility.name}\``, `\`${utility.css}\``]))}

## Variants

${table(['Variant', 'Selector'], tokens.variants.map(variant => [`\`${variant.name}:\``, `\`${variant.value}\``]))}

\`dark:\` matches the \`.dark\` class toggled by \`useTheme()\` (\`darkModeStrategy: 'class'\`, the default). Theme colors already adapt to dark mode: keep \`dark:\` for real layout or content differences.

## Layout variables

Override them in your CSS (\`:root { --maz-container-max-width: 1024px; }\`), they drive the \`padded-container\` utilities:

${table(['Variable', 'Default'], tokens.containerVariables.map(token => [`\`${token.name}\``, `\`${token.value}\``]))}

## Vue transitions

Transition names shipped in \`maz-ui/style.css\`, usable with \`<Transition name="...">\`: ${tokens.transitions.map(name => `\`${name}\``).join(', ')}.

## CSS variables in custom CSS

In \`<style>\` blocks or plain CSS, use the runtime variables instead of literal values: \`var(--maz-primary)\`, \`var(--maz-surface)\`, \`var(--maz-foreground)\`, \`var(--maz-divider)\`, \`var(--maz-rounded-md)\`, \`var(--maz-shadow-style-elevation)\`, \`calc(var(--maz-space) * 4)\`, \`var(--maz-font-family)\`, \`var(--maz-easing-out)\`. With Tailwind, prefer \`@apply\` after \`@reference "<your tailwind entry>"\` in Vue SFC style blocks.
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
