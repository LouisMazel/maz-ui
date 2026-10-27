import type { ComponentApi } from '../../knowledge/schema'
import type { Finding, Framework } from '../index'

import { getKnowledge } from '../../__tests__/helpers'
import { reviewCode } from '../index'
import { propSuggestions } from '../template'

function review(code: string, filename = 'Test.vue', framework?: Framework): Finding[] {
  return reviewCode(code, { knowledge: getKnowledge(), filename, framework })
}

function rulesOf(code: string, filename = 'Test.vue', framework?: Framework): string[] {
  return review(code, filename, framework).map(finding => finding.rule)
}

function template(markup: string): string {
  return `<template>\n${markup}\n</template>\n`
}

describe('given the unknown-component rule', () => {
  describe('when a Maz tag is neither a component nor an icon', () => {
    it('then it reports it with suggestions', () => {
      const [finding] = review(template('<MazButon />'))

      expect(finding.rule).toBe('unknown-component')
      expect(finding.severity).toBe('error')
      expect(finding.suggestion).toContain('`MazBtn`')
    })

    it('then it suggests searching when nothing is close', () => {
      expect(review(template('<MazQwxzvQwxzvQwxzv />'))[0].suggestion).toContain('search_docs')
    })
  })

  describe('when the tag is a component, an icon, a kebab-case or a lazy Nuxt component', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazBtn>x</MazBtn><maz-btn>x</maz-btn><LazyMazBtn>x</LazyMazBtn><MazTrash class="size-5" />'))).toEqual([])
    })
  })

  describe('when the SFC imports the tag under another name', () => {
    it('then the tag is checked as the imported maz-ui component or icon', () => {
      const sfc = (script: string, markup: string): string => `<script setup lang="ts">\n${script}\n</script>\n${template(markup)}`

      expect(rulesOf(sfc('import { MazComputerDesktop as MazScreenIcon } from \'@maz-ui/icons/static/MazComputerDesktop\'', '<MazScreenIcon class="size-5" />'))).toEqual([])
      expect(rulesOf(sfc('import MazFancy from \'./MazFancy.vue\'\nimport type { Foo } from \'./types\'', '<MazFancy :anything="1" />'))).toEqual([])
      expect(rulesOf(sfc('import Btn, { type MazBtnProps } from \'maz-ui/components/MazBtn\'', '<Btn colour="primary">x</Btn>'))).toEqual(['unknown-prop'])
      expect(rulesOf(sfc('import { MazBtn as Action } from \'maz-ui/components\'', '<Action colour="primary">x</Action><button>x</button>'))).toEqual(['unknown-prop', 'prefer-maz-component'])
    })
  })

  describe('when a script imports an unknown component path', () => {
    it('then it reports it', () => {
      expect(rulesOf('import MazButon from \'maz-ui/components/MazButon\'', 'a.ts')).toEqual(['unknown-component'])
      expect(review('import MazQwxzvQwxzv from \'maz-ui/components/MazQwxzvQwxzv\'', 'a.ts')[0].suggestion).toContain('search_docs')
    })
  })
})

describe('given propSuggestions', () => {
  const component = { name: 'MazFake', props: [{ name: 'iconPosition' }, { name: 'leftIcon' }, { name: 'modelValue' }] } as ComponentApi

  describe('when several props contain the words of the unknown name', () => {
    it('then the shortest come first', () => {
      expect(propSuggestions('icon', component)).toEqual(['leftIcon', 'iconPosition'])
    })
  })

  describe('when props containing the words are not wanted', () => {
    it('then only the synonyms and the typos are suggested', () => {
      expect(propSuggestions('icon', component, { containing: false })).toEqual([])
      expect(propSuggestions('value', component, { containing: false })).toEqual(['modelValue'])
    })
  })
})

describe('given the unknown-prop rule', () => {
  describe('when a prop is close to a real one', () => {
    it('then it suggests the real prop', () => {
      const [finding] = review(template('<MazBtn colour="primary">x</MazBtn>'))

      expect(finding.rule).toBe('unknown-prop')
      expect(finding.suggestion).toContain('`color`')
    })
  })

  describe('when a prop name comes from another library', () => {
    it.each([
      ['<MazSelect items="[]" />', '`options`'],
      ['<MazBtn rounded>x</MazBtn>', '`rounded-size`'],
      ['<MazCheckbox checked />', '`v-model`'],
      ['<MazBtn is-loading>x</MazBtn>', '`loading`'],
      ['<MazInput left-icon="x" />', '`start-icon`'],
    ])('then %s suggests %s', (markup, suggestion) => {
      const [finding] = review(template(markup))

      expect(finding.rule).toBe('unknown-prop')
      expect(finding.suggestion).toContain(suggestion)
    })
  })

  describe('when a bound prop does not exist', () => {
    it('then it reports it', () => {
      expect(rulesOf(template('<MazBtn :qwxzv="true">x</MazBtn>'))).toEqual(['unknown-prop'])
    })
  })

  describe('when attributes are HTML passthrough attributes', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazBtn id="a" data-test="x" aria-label="y" title="t" class="flex" style="margin: 0" :key="1" :class="x" v-bind="attrs">x</MazBtn>'))).toEqual([])
    })
  })

  describe('when the prop exists in kebab-case or camelCase', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazBtn text-color="primary" :textColor="color">x</MazBtn>'))).toEqual([])
    })
  })
})

describe('given the invalid-prop-value rule', () => {
  describe('when a static value is not accepted', () => {
    it('then it lists the accepted values and the closest one', () => {
      const [finding] = review(template('<MazBtn color="primay">x</MazBtn>'))

      expect(finding.rule).toBe('invalid-prop-value')
      expect(finding.suggestion).toContain('"primary"')
      expect(finding.suggestion).toContain('Did you mean "primary"?')
    })
  })

  describe('when a bound string literal is not accepted', () => {
    it('then it is reported', () => {
      expect(rulesOf(template('<MazBtn :color="\'red\'">x</MazBtn>'))).toEqual(['invalid-prop-value'])
    })
  })

  describe('when the value is accepted or dynamic', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazBtn color="secondary" :size="size">x</MazBtn>'))).toEqual([])
    })
  })
})

describe('given the boolean-prop-string rule', () => {
  describe('when a boolean prop receives "false"', () => {
    it('then it is an error', () => {
      const [finding] = review(template('<MazBtn disabled="false">x</MazBtn>'))

      expect(finding.rule).toBe('boolean-prop-string')
      expect(finding.severity).toBe('error')
    })
  })

  describe('when a boolean prop receives "true"', () => {
    it('then it is an info', () => {
      expect(review(template('<MazBtn disabled="true">x</MazBtn>'))[0].severity).toBe('info')
    })
  })

  describe('when a boolean prop is set alone or bound', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazBtn disabled :loading="false">x</MazBtn>'))).toEqual([])
    })
  })
})

describe('given the unknown-model rule', () => {
  describe('when the v-model argument does not exist', () => {
    it('then it lists the available models', () => {
      const [finding] = review(template('<MazSelect v-model:qwxzv="x" />'))

      expect(finding.rule).toBe('unknown-model')
      expect(finding.suggestion).toContain('`v-model`')
    })
  })

  describe('when the component has no model', () => {
    it('then it says so', () => {
      expect(review(template('<MazAvatar v-model="x" />'))[0].suggestion).toBe('MazAvatar has no v-model.')
    })
  })

  describe('when the model exists', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazSelect v-model="x" v-model:open="o" :options="[]" />'))).toEqual([])
    })
  })
})

describe('given the unknown-event rule', () => {
  describe('when an event is a typo of a declared or native event', () => {
    it('then it is an error with a suggestion', () => {
      const [finding] = review(template('<MazBtn @clik="go">x</MazBtn>'))

      expect(finding.rule).toBe('unknown-event')
      expect(finding.severity).toBe('error')
      expect(finding.suggestion).toBe('Did you mean `@click`?')
    })
  })

  describe('when an event is unrelated to any event', () => {
    it('then it is a warning listing the events', () => {
      const [finding] = review(template('<MazDialog @qwxzvqwxzv="go" />'))

      expect(finding.severity).toBe('warning')
      expect(finding.suggestion).toContain('`@open`')
    })

    it('then it explains that DOM events still work when the component declares none', () => {
      expect(review(template('<MazBtn @qwxzvqwxzv="go">x</MazBtn>'))[0].suggestion).toContain('none (DOM events like @click still work)')
    })
  })

  describe('when update:x targets a missing prop', () => {
    it('then it is an error', () => {
      expect(rulesOf(template('<MazDialog @update:qwxzv="go" />'))).toEqual(['unknown-event'])
      expect(review(template('<MazBtn @update:qwxzv="go">x</MazBtn>'))[0].suggestion).toBe('Events: none.')
    })
  })

  describe('when the event is declared, native, an update of a prop or dynamic', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazDialog @open="a" @click="b" @keyup.enter="c" @update:model-value="d" @update:title="e" @[name]="f" />'))).toEqual([])
    })
  })
})

describe('given the unknown-slot rule', () => {
  describe('when a named slot does not exist', () => {
    it('then it suggests the closest slot', () => {
      const [finding] = review(template('<MazAvatar><template #captions>x</template></MazAvatar>'))

      expect(finding.rule).toBe('unknown-slot')
      expect(finding.suggestion).toBe('Did you mean `#caption`?')
    })

    it('then it lists the slots when nothing is close', () => {
      expect(review(template('<MazAvatar v-slot:qwxzvqwxzv>x</MazAvatar>'))[0].suggestion).toContain('`#caption`')
    })
  })

  describe('when the component has no slot', () => {
    it('then the default slot is accepted and a named one lists none', () => {
      expect(rulesOf(template('<MazSidebarSeparator v-slot>x</MazSidebarSeparator>'))).toEqual([])
      expect(review(template('<MazSidebarSeparator><template #title>x</template></MazSidebarSeparator>'))[0].suggestion).toBe('Slots: none.')
    })
  })

  describe('when the slots exist or are dynamic', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<MazAvatar><template #caption>x</template><template #[slotName]>y</template><div>z</div></MazAvatar>'))).toEqual([])
    })
  })

  describe('when a slot of the component has a computed name', () => {
    it('then the names that follow its pattern are accepted', () => {
      expect(rulesOf(template('<MazTable><template #cell-name="{ value }">{{ value }}</template><template #cell-createdAt>x</template></MazTable>'))).toEqual([])
      expect(rulesOf(template('<MazTable><template #cell->x</template></MazTable>'))).toEqual(['unknown-slot'])
    })
  })

  describe('when a component forwards its v-model to an inner component', () => {
    it('then the v-model is accepted', () => {
      expect(rulesOf(template('<MazDrawer v-model="open">x</MazDrawer>'))).toEqual([])
    })
  })
})

describe('given the unknown-icon rule', () => {
  describe('when an imported icon does not exist', () => {
    it('then it is reported with suggestions', () => {
      const [finding] = review('import { MazTrashh, LazyMazXMark } from \'@maz-ui/icons\'', 'a.ts')

      expect(finding.rule).toBe('unknown-icon')
      expect(finding.message).toContain('MazTrashh')
      expect(finding.suggestion).toContain('`MazTrash`')
    })
  })

  describe('when the icon is imported from a static path', () => {
    it('then the path name is checked', () => {
      expect(rulesOf('import { MazQwxzvQwxzvQwxzv } from \'@maz-ui/icons/static/MazQwxzvQwxzvQwxzv\'', 'a.ts')).toEqual(['unknown-icon'])
      expect(review('import { MazQwxzvQwxzvQwxzv } from \'@maz-ui/icons/static/MazQwxzvQwxzvQwxzv\'', 'a.ts')[0].suggestion).toContain('find_icons')
    })
  })

  describe('when the icons exist', () => {
    it('then nothing is reported', () => {
      expect(rulesOf('import { MazTrash } from \'@maz-ui/icons/lazy/MazTrash\'\nimport { iconList } from \'@maz-ui/icons/icon-list\'', 'a.ts')).toEqual([])
    })
  })
})

describe('given the prefer-maz-component rule', () => {
  describe('when native elements are used', () => {
    it.each([
      ['<button>x</button>', 'MazBtn', 'warning'],
      ['<select></select>', 'MazSelect', 'warning'],
      ['<textarea></textarea>', 'MazTextarea', 'warning'],
      ['<dialog></dialog>', 'MazDialog', 'warning'],
      ['<table></table>', 'MazTable', 'info'],
      ['<progress></progress>', 'MazLoadingBar', 'info'],
      ['<details></details>', 'MazAccordion', 'info'],
      ['<input>', 'MazInput', 'warning'],
      ['<input type="email">', 'MazInput', 'warning'],
      ['<input type="checkbox">', 'MazCheckbox', 'warning'],
      ['<input type="radio">', 'MazRadio', 'warning'],
      ['<input type="range">', 'MazSlider', 'warning'],
      ['<input type="file">', 'MazDropzone', 'info'],
      ['<input type="tel">', 'MazInputPhoneNumber', 'warning'],
      ['<input type="number">', 'MazInputNumber', 'warning'],
      ['<input type="date">', 'MazDatePicker', 'warning'],
    ])('then %s suggests %s', (markup, component, severity) => {
      const [finding] = review(template(markup))

      expect(finding.rule).toBe('prefer-maz-component')
      expect(finding.severity).toBe(severity)
      expect(finding.suggestion).toContain(component)
    })
  })

  describe('when native elements have no maz-ui equivalent', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<div><input type="hidden"><input type="submit"><input type="color"><a href="/">x</a></div>'))).toEqual([])
    })
  })
})

describe('given the inline-svg rule', () => {
  describe('when an svg draws paths', () => {
    it('then it suggests an icon', () => {
      expect(rulesOf(template('<svg viewBox="0 0 24 24"><path d="M0 0" /></svg>'))).toEqual(['inline-svg'])
    })
  })

  describe('when an svg is a drawing, an animation or depends on data', () => {
    it.each([
      ['<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" /></svg>'],
      ['<svg viewBox="0 0 24 24"><line class="animate-pulse" x1="0" y1="0" x2="1" y2="1" /></svg>'],
      ['<svg viewBox="0 0 24 24"><circle stroke-dasharray="26 80" r="4" /></svg>'],
      ['<svg viewBox="0 0 24 24"><animate attributeName="r" /><circle r="4" /></svg>'],
      ['<svg viewBox="0 0 24 24"><line v-if="count > 1" x1="0" y1="0" x2="1" y2="1" /></svg>'],
    ])('then %s is not reported', (markup) => {
      expect(rulesOf(template(markup))).toEqual([])
    })
  })

  describe('when an svg has no drawing child', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<svg><use href="#icon" /></svg>'))).toEqual([])
    })
  })
})

describe('given the internal-prefix rule', () => {
  describe('when a class uses the maz: prefix', () => {
    it('then it is an error with the unprefixed class', () => {
      const [finding] = review(template('<div class="maz:flex hover:maz:bg-primary"></div>'))

      expect(finding.rule).toBe('internal-prefix')
      expect(finding.suggestion).toBe('Use `flex`.')
      expect(review(template('<div class="hover:maz:bg-primary"></div>'))[0].suggestion).toBe('Use `hover:bg-primary`.')
    })
  })

  describe('when classes are unprefixed', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<div class="flex bg-primary"></div>'))).toEqual([])
    })
  })
})

describe('given the theme-colors rule', () => {
  describe('when default palette colors are used', () => {
    it.each([
      ['text-gray-600', '`text-foreground` (body text) or `text-muted` (secondary text)'],
      ['border-slate-200', '`border-divider`'],
      ['bg-zinc-100', '`bg-surface`'],
      ['ring-neutral-300', '`ring-foreground`'],
      ['bg-red-500', '`bg-destructive`'],
      ['text-blue-700', '`text-primary-700` or `text-info-700`'],
      ['hover:bg-green-50/50', '`bg-success-50`'],
    ])('then %s suggests %s', (className, suggestion) => {
      const [finding] = review(template(`<div class="${className}"></div>`))

      expect(finding.rule).toBe('theme-colors')
      expect(finding.suggestion).toContain(suggestion)
    })
  })

  describe('when white or black are used', () => {
    it('then it suggests surface or foreground colors', () => {
      expect(review(template('<div class="bg-white"></div>'))[0].suggestion).toContain('`bg-surface`')
      expect(review(template('<div class="text-black"></div>'))[0].suggestion).toContain('`text-foreground`')
    })
  })

  describe('when white text is on a theme color background', () => {
    it('then it suggests the foreground of that color', () => {
      const [finding] = review(template('<div class="bg-primary text-white"></div>'))

      expect(finding.rule).toBe('theme-colors')
      expect(finding.suggestion).toContain('`text-primary-foreground`')
    })
  })

  describe('when white or black text is on a fixed background', () => {
    it('then only the fixed background color is reported', () => {
      expect(rulesOf(template('<div class="bg-overlay/90 text-white"></div><div class="bg-[url(/a.png)] text-white"></div><div class="bg-linear-to-t from-overlay text-white"></div>'))).toEqual([])
      expect(rulesOf(template('<div class="bg-white text-black"></div>'))).toEqual(['theme-colors'])
    })

    it('then the background of a parent element is taken into account', () => {
      expect(rulesOf(template('<div class="bg-overlay"><p><span class="text-white/70">x</span></p></div>'))).toEqual([])
      expect(review(template('<div class="bg-primary"><span class="text-white">x</span></div>'))[0].suggestion).toContain('`text-primary-foreground`')
    })
  })

  describe('when the classes come from a class binding or a script string', () => {
    it('then they are checked too', () => {
      expect(rulesOf(template('<div :class="[active ? \'bg-blue-500\' : \'bg-surface\', { \'text-red-500\': error }]"></div>'))).toEqual(['theme-colors', 'theme-colors'])
      expect(rulesOf('const classes = \'flex bg-gray-100\'', 'a.ts')).toEqual(['theme-colors'])
    })
  })

  describe('when theme colors are used', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<div class="bg-surface text-foreground border-divider bg-primary/50 text-muted"></div>'))).toEqual([])
    })
  })
})

describe('given the hardcoded-color rule', () => {
  describe('when a class uses an arbitrary color', () => {
    it('then it is reported', () => {
      expect(rulesOf(template('<div class="bg-[#1d90ff] text-[rgb(0,0,0)]"></div>'))).toEqual(['hardcoded-color', 'hardcoded-color'])
    })
  })

  describe('when a style attribute uses a literal color', () => {
    it('then it is reported', () => {
      expect(rulesOf(template('<div style="color: #fff; margin: 0"></div>'))).toEqual(['hardcoded-color'])
    })
  })

  describe('when CSS uses literal colors', () => {
    it('then it is reported once per declaration', () => {
      expect(rulesOf('.a { background: linear-gradient(#fff, #000); border-color: rgb(0 0 0); }', 'a.css')).toEqual(['hardcoded-color', 'hardcoded-color'])
    })
  })

  describe('when the literal color is black or white or is inside @keyframes', () => {
    it('then it is only an info', () => {
      const css = '.a { stroke: #fff; }\n@keyframes lock { from { stroke: #1d90ff; } to { opacity: 1; } }\n.b { color: #1d90ff; }'

      expect(review(css, 'a.css').map(finding => finding.severity)).toEqual(['info', 'info', 'warning'])
    })
  })

  describe('when CSS uses variables, custom properties, theme blocks or comments', () => {
    it('then nothing is reported', () => {
      const css = '/* color: #fff */\n.a { color: var(--maz-primary); --brand: #ff0; width: 10px; border-color: inherit; }\n@theme { --color-brand: #ff0000; }\n.b { background: var(--maz-surface, #fff); }'

      expect(rulesOf(css, 'a.css')).toEqual([])
    })
  })
})

describe('given the tailwind-v3 rule', () => {
  describe('when removed utilities are used', () => {
    it('then the right replacement is suggested', () => {
      expect(review(template('<div class="bg-opacity-50"></div>'))[0].suggestion).toContain('bg-primary/50')
      expect(review(template('<div class="flex-shrink-0"></div>'))[0].suggestion).toContain('shrink-0')
    })
  })

  describe('when v4 utilities are used', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(template('<div class="shrink-0 text-ellipsis"></div>'))).toEqual([])
    })
  })
})

describe('given the import rules', () => {
  describe('when a runtime value is imported from the maz-ui root', () => {
    it('then root-import is reported', () => {
      expect(rulesOf('import { MazBtn } from \'maz-ui\'', 'a.ts')).toEqual(['root-import'])
    })
  })

  describe('when types are imported from the maz-ui root', () => {
    it('then nothing is reported', () => {
      expect(rulesOf('import type { MazColor } from \'maz-ui\'\nimport \'maz-ui/style.css\'', 'a.ts')).toEqual([])
    })
  })

  describe('when internal files are imported', () => {
    it('then internal-import is reported', () => {
      expect(rulesOf('import x from \'maz-ui/src/components/MazBtn.vue\'\nimport y from \'@maz-ui/utils/dist/index.mjs\'', 'a.ts')).toEqual(['internal-import', 'internal-import'])
    })
  })
})

describe('given the prefer-ecosystem and prefer-utils rules', () => {
  describe('when lodash helpers covered by @maz-ui/utils are imported', () => {
    it('then each covered helper is reported', () => {
      const findings = review('import { debounce, groupBy } from \'lodash-es\'\nimport throttle from \'lodash/throttle\'', 'a.ts')

      expect(findings.map(finding => finding.rule)).toEqual(['prefer-utils', 'prefer-utils'])
      expect(findings[0].suggestion).toContain('@maz-ui/utils/helpers/debounce')
    })
  })

  describe('when a whole package duplicates maz-ui', () => {
    it.each([
      ['vue-sonner', 'useToast'],
      ['@heroicons/vue/24/outline', '@maz-ui/icons'],
      ['floating-vue', 'vTooltip'],
      ['@vuepic/vue-datepicker', 'MazDatePicker'],
      ['js-cookie', 'cookie'],
      ['@fortawesome/vue-fontawesome', '@maz-ui/icons'],
    ])('then %s suggests %s', (specifier, replacement) => {
      const [finding] = review(`import x from '${specifier}'`, 'a.ts')

      expect(finding.suggestion).toContain(replacement)
    })
  })

  describe('when VueUse functions with a maz-ui equivalent are imported', () => {
    it('then they are reported as info', () => {
      const findings = review('import { useWindowSize, useFetch } from \'@vueuse/core\'', 'a.ts')

      expect(findings).toHaveLength(1)
      expect(findings[0].severity).toBe('info')
    })
  })

  describe('when the imports are type-only or unrelated', () => {
    it('then nothing is reported', () => {
      expect(rulesOf('import type { DebouncedFunc } from \'lodash-es\'\nimport { ref } from \'vue\'\nimport { groupBy } from \'lodash-es\'', 'a.ts')).toEqual([])
    })
  })
})

describe('given the manual-dark-mode rule', () => {
  describe('when the color mode is handled by hand', () => {
    it('then each pattern is reported', () => {
      const code = 'document.documentElement.classList.toggle(\'dark\')\nlocalStorage.setItem(\'theme\', \'dark\')\nmatchMedia(\'(prefers-color-scheme: dark)\')'

      expect(rulesOf(code, 'a.ts')).toEqual(['manual-dark-mode', 'manual-dark-mode', 'manual-dark-mode'])
    })
  })

  describe('when other classes are toggled', () => {
    it('then nothing is reported', () => {
      expect(rulesOf('el.classList.toggle(\'open\')', 'a.ts')).toEqual([])
    })
  })
})

describe('given the nuxt-auto-import rule', () => {
  const code = 'import MazBtn from \'maz-ui/components/MazBtn\'\nimport { useToast } from \'maz-ui/composables\'\nimport { useTheme } from \'@maz-ui/themes\'\nimport type { MazColor } from \'maz-ui/components\'\nimport { mazUi } from \'@maz-ui/themes\''

  describe('when the framework is nuxt', () => {
    it('then auto-imported imports are reported as info', () => {
      expect(rulesOf(code, 'a.ts', 'nuxt')).toEqual(['nuxt-auto-import', 'nuxt-auto-import', 'nuxt-auto-import'])
    })
  })

  describe('when the framework is vue', () => {
    it('then nothing is reported', () => {
      expect(rulesOf(code, 'a.ts', 'vue')).toEqual([])
    })
  })
})

describe('given the missing-reference rule', () => {
  describe('when a SFC style block uses @apply without @reference', () => {
    it('then it is reported', () => {
      expect(rulesOf('<template><div /></template>\n<style scoped>\n.a { @apply flex; }\n</style>')).toEqual(['missing-reference'])
    })
  })

  describe('when the block has a @reference or the file is plain CSS', () => {
    it('then nothing is reported', () => {
      expect(rulesOf('<style>\n@reference "../main.css";\n.a { @apply flex; }\n</style>')).toEqual([])
      expect(rulesOf('.a { @apply flex; }', 'a.css')).toEqual([])
    })
  })

  describe('when @apply contains wrong classes', () => {
    it('then the classes are checked', () => {
      expect(rulesOf('.a { @apply maz:flex bg-red-500; }', 'a.css')).toEqual(['internal-prefix', 'theme-colors'])
    })
  })
})
