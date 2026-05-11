import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from '../no-arbitrary-px'

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.describe = describe

const ruleTester = new RuleTester()

ruleTester.run('tailwind-no-arbitrary-px', rule as never, {
  valid: [
    // No bracket / no px → fine.
    { code: 'const a = "w-4 h-full text-sm"' },
    { code: 'const a = "p-[1rem] m-[0.5rem]"' },
    // English text in brackets with spaces → not a Tailwind class.
    { code: 'const a = "Width can be up to 100px wide"' },
    // px outside brackets → not a Tailwind arbitrary value (ignored).
    { code: 'const a = "border: 1px solid red"' },
    // calc with already-rem values.
    { code: 'const a = "w-[calc(100%-1rem)]"' },
    // Bracket without a digit-px (eg. data attribute selector).
    { code: 'const a = "data-[active]:bg-blue"' },
    // Non-string literals must be ignored.
    { code: 'const n = 16' },
    { code: 'const b = true' },
    { code: 'const nope = null' },
    // Vue SFC static attribute without px → no report.
    {
      code: '<template><div class="w-4 h-full"></div></template>',
      filename: 'static-clean.vue',
      languageOptions: { parser: vueParser },
    },
  ],

  invalid: [
    // Simple positive integer.
    {
      code: 'const a = "w-[16px]"',
      output: 'const a = "w-[1rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Negative value (the user-reported `m-[-16px]` shape).
    {
      code: 'const a = "m-[-16px]"',
      output: 'const a = "m-[-1rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Decimal value.
    {
      code: 'const a = "tracking-[1.5px]"',
      output: 'const a = "tracking-[0.09375rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Bare decimal (.5px).
    {
      code: 'const a = "tracking-[.5px]"',
      output: 'const a = "tracking-[0.03125rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Multiple px values inside the same bracket (Tailwind uses `_` for spaces).
    {
      code: 'const a = "p-[16px_8px]"',
      output: 'const a = "p-[1rem_0.5rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Multiple Tailwind classes in one string, each with px.
    {
      code: 'const a = "w-[16px] h-[24px]"',
      output: 'const a = "w-[1rem] h-[1.5rem]"',
      errors: [
        { messageId: 'preferRelativeUnit' },
        { messageId: 'preferRelativeUnit' },
      ],
    },
    // Variant prefix.
    {
      code: 'const a = "md:hover:w-[16px]"',
      output: 'const a = "md:hover:w-[1rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Arbitrary property syntax.
    {
      code: 'const a = "[gap:16px]"',
      output: 'const a = "[gap:1rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // calc() with px.
    {
      code: 'const a = "w-[calc(100%-16px)]"',
      output: 'const a = "w-[calc(100%-1rem)]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Template literal.
    {
      code: 'const a = `w-[16px]`',
      output: 'const a = `w-[1rem]`',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Custom baseFontSize option.
    {
      code: 'const a = "w-[10px]"',
      options: [{ baseFontSize: 10 }],
      output: 'const a = "w-[1rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Custom unit option.
    {
      code: 'const a = "w-[16px]"',
      options: [{ unit: 'em' }],
      output: 'const a = "w-[1em]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Uppercase PX still flagged.
    {
      code: 'const a = "w-[16PX]"',
      output: 'const a = "w-[1rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Non-divisible value preserves precision (15/16 = 0.9375).
    {
      code: 'const a = "w-[15px]"',
      output: 'const a = "w-[0.9375rem]"',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
    // Vue SFC static class attribute (parsed via vue-eslint-parser).
    {
      code: '<template><div class="w-[16px]"></div></template>',
      filename: 'static-px.vue',
      languageOptions: { parser: vueParser },
      output: '<template><div class="w-[1rem]"></div></template>',
      errors: [{ messageId: 'preferRelativeUnit' }],
    },
  ],
})
