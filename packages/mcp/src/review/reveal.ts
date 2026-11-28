import type { ReviewContext } from './types.ts'

import { hasReveal } from '../knowledge/features.ts'

/** The `vReveal` effect (`data-maz-reveal`) that looks like an animation of the AOS plugin (`data-maz-aos`) */
export function revealEffectOf(aos: string): string {
  const rules: Array<[RegExp, string]> = [
    [/^(?:fade|slide)-up/, 'slide-up'],
    [/^(?:fade|slide)-down/, 'slide-down'],
    [/^(?:fade|slide)-right$/, 'slide-start'],
    [/^(?:fade|slide)-left$/, 'slide-end'],
    [/^(?:zoom-in|scale-in)/, 'scale'],
    [/^(?:flip|rotate)-left$/, 'curtain-start'],
    [/^(?:flip|rotate)-right$/, 'curtain-end'],
    [/^flip-up$/, 'curtain-up'],
    [/^flip-down$/, 'curtain-down'],
  ]

  return rules.find(([regex]) => regex.test(aos))?.[1] ?? 'fade'
}

const AOS_PATTERNS: Array<{ regex: RegExp, message: string, suggestion: (match: RegExpExecArray) => string }> = [
  {
    regex: /\bdata-maz-aos\s*=\s*["']([\w-]+)["']/g,
    message: '`data-maz-aos` is the deprecated AOS plugin (removed in v6).',
    suggestion: match => `Use \`v-reveal="'${revealEffectOf(match[1]!)}'"\` (\`maz-ui/directives/vReveal\`), or \`data-maz-reveal="${revealEffectOf(match[1]!)}"\` with \`useReveal()\` for static HTML. \`data-maz-aos-delay\` and \`-duration\` become \`delay\` and \`duration\` (\`data-maz-reveal-delay\`), \`-once\` is \`once\` (true by default), \`-anchor\` becomes \`stagger\` on the parent.`,
  },
  {
    regex: /\buseAos\b/g,
    message: '`useAos` is the deprecated AOS plugin (removed in v6).',
    suggestion: () => 'Use `v-reveal` (`maz-ui/directives/vReveal`) in templates, or `useReveal()` (`maz-ui/composables/useReveal`) for HTML you do not control: `scan()` reveals the elements added later.',
  },
  {
    regex: /\bAosPlugin\b/g,
    message: '`AosPlugin` is deprecated (removed in v6).',
    suggestion: () => 'Remove it and use `v-reveal` (`maz-ui/directives/vReveal`): no plugin and no CSS file.',
  },
  {
    regex: /\baos\s*:\s*(?:true\b|\{)/g,
    message: 'The `aos` option is deprecated (removed in v6).',
    suggestion: () => 'Remove `aos` and `import \'maz-ui/aos.css\'`, then use `v-reveal` (`maz-ui/directives/vReveal`). With Nuxt, enable `directives: { vReveal: true }`.',
  },
  {
    regex: /maz-ui\/aos(?:\.css)?['"]/g,
    message: '`maz-ui/aos.css` is the deprecated AOS plugin (removed in v6).',
    suggestion: () => 'Remove the import: `v-reveal` (`maz-ui/directives/vReveal`) loads its own styles.',
  },
]

/** The AOS plugin of maz-ui, replaced by `vReveal` */
export function checkReveal(code: string, context: ReviewContext): void {
  if (context.internalSource || !hasReveal(context.knowledge.docsById))
    return

  for (const { regex, message, suggestion } of AOS_PATTERNS) {
    for (const match of code.matchAll(regex)) {
      context.report({
        rule: 'prefer-reveal',
        severity: 'warning',
        message,
        suggestion: suggestion(match),
      }, match.index ?? 0)
    }
  }
}
