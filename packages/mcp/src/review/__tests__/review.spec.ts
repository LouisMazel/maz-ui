import type { Finding } from '../index'

import { join } from 'node:path'
import { cleanTempDirs, createTempDir, getKnowledge, writeFile } from '../../__tests__/helpers'
import { detectFramework, expandPaths, MAX_REVIEWED_FILES, reviewFiles } from '../files'
import { countBySeverity, detectKind, filterBySeverity, formatFindings, reviewCode } from '../index'

function review(code: string, filename?: string): Finding[] {
  return reviewCode(code, { knowledge: getKnowledge(), filename })
}

describe('given detectKind', () => {
  describe('when a filename is given', () => {
    it.each([
      ['A.vue', 'vue'],
      ['a.ts', 'script'],
      ['a.tsx', 'script'],
      ['a.mjs', 'script'],
      ['a.css', 'style'],
      ['a.scss', 'style'],
      ['a.html', 'template'],
    ])('then %s is %s', (filename, kind) => {
      expect(detectKind('', filename)).toBe(kind)
    })
  })

  describe('when no filename is given', () => {
    it.each([
      ['<template><div /></template>', 'vue'],
      ['<script setup>\n</script>', 'vue'],
      ['<MazBtn />', 'template'],
      ['.a { color: red; }', 'style'],
      ['@import "tailwindcss";', 'style'],
      ['const a = 1', 'script'],
      ['export const a = { b: 1 }', 'script'],
    ])('then "%s" is %s', (code, kind) => {
      expect(detectKind(code)).toBe(kind)
    })
  })
})

describe('given reviewCode', () => {
  describe('when a template snippet without SFC blocks is reviewed', () => {
    it('then it is reviewed as a template', () => {
      expect(review('<MazBtn color="red">x</MazBtn>').map(finding => finding.rule)).toEqual(['invalid-prop-value'])
    })
  })

  describe('when a SFC has template, script and style blocks', () => {
    it('then the positions point to the original file', () => {
      const code = '<script setup lang="ts">\nimport { debounce } from \'lodash\'\n</script>\n\n<template>\n  <div class="text-gray-600" />\n</template>\n\n<style>\n.a { color: #fff; }\n</style>\n'
      const findings = review(code, 'A.vue')

      expect(findings.map(({ rule, line, column }) => ({ rule, line, column }))).toEqual([
        { rule: 'prefer-utils', line: 2, column: 1 },
        { rule: 'theme-colors', line: 6, column: 15 },
        { rule: 'hardcoded-color', line: 10, column: 6 },
      ])
    })
  })

  describe('when a SFC block is empty', () => {
    it('then it is skipped', () => {
      expect(review('<template></template>\n<script></script>\n<style></style>', 'A.vue')).toEqual([])
    })
  })

  describe('when the same issue is found twice at the same position', () => {
    it('then it is reported once', () => {
      const findings = review('<template><div class="bg-red-500" :class="\'bg-red-500\'" /></template>', 'A.vue')

      expect(findings).toHaveLength(2)
    })
  })

  describe('when findings are on several lines', () => {
    it('then they are sorted by position', () => {
      const findings = review('<template>\n  <button>b</button>\n  <div class="bg-white" />\n</template>', 'A.vue')

      expect(findings.map(finding => finding.line)).toEqual([2, 3])
    })
  })
})

describe('given ignore comments', () => {
  describe('when a comment is alone on the line above', () => {
    it('then the next line is ignored', () => {
      expect(review('<template>\n  <!-- maz-ui-review-ignore -->\n  <button>b</button>\n</template>', 'A.vue')).toEqual([])
    })
  })

  describe('when a comment ends the line', () => {
    it('then this line is ignored', () => {
      expect(review('const c = \'bg-red-500\' // maz-ui-review-ignore', 'a.ts')).toEqual([])
    })
  })

  describe('when a comment lists rules', () => {
    it('then only these rules are ignored', () => {
      const code = '<template>\n  <!-- maz-ui-review-ignore theme-colors -->\n  <button class="bg-red-500">b</button>\n</template>'

      expect(review(code, 'A.vue').map(finding => finding.rule)).toEqual(['prefer-maz-component'])
    })
  })

  describe('when a whole file is ignored', () => {
    it('then nothing is reported, or only the rules not listed', () => {
      expect(review('// maz-ui-review-ignore-file\nconst c = \'bg-red-500\'', 'a.ts')).toEqual([])
      expect(review('/* maz-ui-review-ignore-file theme-colors */\nconst c = \'bg-red-500 maz:flex\'', 'a.ts').map(finding => finding.rule)).toEqual(['internal-prefix'])
    })
  })
})

describe('given the finding helpers', () => {
  const findings: Finding[] = [
    { rule: 'unknown-prop', severity: 'warning', message: 'w', line: 2, column: 1, suggestion: 'fix it' },
    { rule: 'unknown-slot', severity: 'error', message: 'e', line: 1, column: 1 },
    { rule: 'nuxt-auto-import', severity: 'info', message: 'i', line: 3, column: 1 },
    { rule: 'nuxt-auto-import', severity: 'info', message: 'i2', line: 4, column: 1 },
  ]

  describe('when counting by severity', () => {
    it('then each severity is counted', () => {
      expect(countBySeverity(findings)).toEqual({ error: 1, warning: 1, info: 2 })
    })
  })

  describe('when filtering by severity', () => {
    it('then lower severities are dropped', () => {
      expect(filterBySeverity(findings, 'warning').map(finding => finding.severity)).toEqual(['warning', 'error'])
      expect(filterBySeverity(findings, 'error')).toHaveLength(1)
      expect(filterBySeverity(findings, 'info')).toHaveLength(4)
    })
  })

  describe('when formatting findings', () => {
    it('then it prints a summary and one line per finding', () => {
      expect(formatFindings(findings, 'A.vue')).toBe([
        'A.vue: 1 error, 1 warning, 2 infos',
        '- L2:1 warning [unknown-prop] w\n  -> fix it',
        '- L1:1 error [unknown-slot] e',
        '- L3:1 info [nuxt-auto-import] i',
        '- L4:1 info [nuxt-auto-import] i2',
      ].join('\n'))
    })

    it('then it says when there is no issue', () => {
      expect(formatFindings([], 'A.vue')).toBe('A.vue: no issue found.')
    })
  })
})

describe('given the file helpers', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when detecting the framework', () => {
    it('then a nuxt.config makes it nuxt, a package.json or the root makes it vue', () => {
      const nuxt = createTempDir()
      writeFile(nuxt, 'nuxt.config.ts', 'export default {}')
      writeFile(nuxt, 'package.json', '{}')
      writeFile(nuxt, 'app/pages/index.vue', '')

      const vue = createTempDir()
      writeFile(vue, 'package.json', '{}')

      expect(detectFramework(join(nuxt, 'app/pages'))).toBe('nuxt')
      expect(detectFramework(vue)).toBe('vue')
      expect(detectFramework('/')).toBe('vue')
    })
  })

  describe('when expanding paths', () => {
    it('then files, folders and globs are expanded without node_modules and unsupported files', async () => {
      const project = createTempDir()
      writeFile(project, 'src/A.vue', '')
      writeFile(project, 'src/b.ts', '')
      writeFile(project, 'src/readme.md', '')
      writeFile(project, 'src/node_modules/c.ts', '')
      writeFile(project, 'styles/main.css', '')

      const files = await expandPaths(['src', 'styles/*.css', join(project, 'src/b.ts'), 'missing/**/*.vue'], project)

      expect(files).toEqual([join(project, 'src/A.vue'), join(project, 'src/b.ts'), join(project, 'styles/main.css')])
    })

    it('then the project root itself can be expanded', async () => {
      const project = createTempDir()
      writeFile(project, 'A.vue', '')

      expect(await expandPaths(['.'], project)).toEqual([join(project, 'A.vue')])
    })
  })

  describe('when reviewing files', () => {
    it('then each file gets its findings filtered by severity', async () => {
      const project = createTempDir()
      writeFile(project, 'nuxt.config.ts', '')
      writeFile(project, 'src/A.vue', '<template><button>b</button><table /></template>')
      writeFile(project, 'src/b.ts', 'import MazBtn from \'maz-ui/components/MazBtn\'')

      const { reviews, truncated } = await reviewFiles(['src'], { knowledge: getKnowledge(), cwd: project, minSeverity: 'warning' })

      expect(truncated).toBe(false)
      expect(reviews.map(entry => entry.file)).toEqual([join('src', 'A.vue'), join('src', 'b.ts')])
      expect(reviews[0].findings.map(finding => finding.rule)).toEqual(['prefer-maz-component'])
      expect(reviews[1].findings).toEqual([])
    })

    it('then the detected framework enables the nuxt rules', async () => {
      const project = createTempDir()
      writeFile(project, 'nuxt.config.ts', '')
      writeFile(project, 'b.ts', 'import MazBtn from \'maz-ui/components/MazBtn\'')

      const { reviews } = await reviewFiles(['b.ts'], { knowledge: getKnowledge(), cwd: project })

      expect(reviews[0].findings.map(finding => finding.rule)).toEqual(['nuxt-auto-import'])
    })

    it('then it stops after the maximum number of files', async () => {
      const project = createTempDir()

      for (let index = 0; index <= MAX_REVIEWED_FILES; index++) writeFile(project, `src/f${String(index).padStart(3, '0')}.ts`, '')

      const { reviews, truncated } = await reviewFiles(['src'], { knowledge: getKnowledge(), cwd: project })

      expect(truncated).toBe(true)
      expect(reviews).toHaveLength(MAX_REVIEWED_FILES)
    })
  })
})
