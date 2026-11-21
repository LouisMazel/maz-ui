import type { Finding } from '../index.ts'

import { join } from 'node:path'
import { cleanTempDirs, createTempDir, getKnowledge, writeFile } from '../../__tests__/helpers.ts'
import { detectFramework, displayPath, expandPaths, findProjectRoot, MAX_REVIEWED_FILES, projectIconNames, reviewFiles } from '../files.ts'
import { countBySeverity, detectKind, filterBySeverity, formatFindings, reviewCode } from '../index.ts'

function review(code: string, filename?: string): Finding[] {
  return reviewCode(code, {
    knowledge: getKnowledge(),
    filename,
  })
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
      ['<MazCard>\n  <template #title>x</template>\n</MazCard>', 'template'],
      ['<!-- demo -->\n<template>\n  <div />\n</template>', 'vue'],
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

describe('given a file that cannot be parsed', () => {
  describe('when the template is malformed', () => {
    it('then it reports a parse error at its position instead of throwing', () => {
      const findings = review('<template>\n  <div>\n    <MazBtn a"b="c" />\n</template>', 'A.vue')

      expect(findings[0]).toMatchObject({ rule: 'parse-error', severity: 'error', line: 3 })
      expect(findings[0].message).toContain('The file cannot be parsed')
      expect(review('<div><span></div>', 'a.html').map(finding => finding.rule)).toEqual(['parse-error'])
    })
  })

  describe('when the review fails for another reason', () => {
    it('then the error is thrown', () => {
      const knowledge = new Proxy(getKnowledge(), {
        get: (target, property) => {
          if (property === 'componentsByName')
            throw new TypeError('broken knowledge')

          return Reflect.get(target, property)
        },
      })

      expect(() => reviewCode('<template><MazBtn /></template>', { knowledge, filename: 'A.vue' })).toThrow('broken knowledge')
    })
  })
})

describe('given ignore comments', () => {
  describe('when a comment is alone on the line above', () => {
    it('then the next line is ignored', () => {
      expect(review('<template>\n  <!-- maz-ui-review-ignore -- native element of the embed -->\n  <button>b</button>\n</template>', 'A.vue')).toEqual([])
    })
  })

  describe('when a comment ends the line', () => {
    it('then this line is ignored', () => {
      expect(review('const c = \'bg-red-500\' // maz-ui-review-ignore -- color of the brand logo', 'a.ts')).toEqual([])
    })
  })

  describe('when a comment lists rules', () => {
    it('then only these rules are ignored', () => {
      const code = '<template>\n  <!-- maz-ui-review-ignore theme-colors -- frame over the video -->\n  <button class="bg-red-500">b</button>\n</template>'

      expect(review(code, 'A.vue').map(finding => finding.rule)).toEqual(['prefer-maz-component'])
    })
  })

  describe('when a comment gives the reason after two dashes', () => {
    it('then the reason is not read as rules', () => {
      const code = '<template>\n  <!-- maz-ui-review-ignore -- frame over the video theme-colors -->\n  <button class="bg-red-500">b</button>\n</template>'

      expect(review(code, 'A.vue')).toEqual([])
    })
  })

  describe('when a comment has no reason', () => {
    it('then it is not applied and reported as an error', () => {
      const findings = review('<template>\n  <!-- maz-ui-review-ignore theme-colors -->\n  <button class="bg-red-500">b</button>\n</template>', 'A.vue')

      expect(findings.map(finding => finding.rule)).toEqual(['invalid-ignore', 'prefer-maz-component', 'theme-colors'])
      expect(findings[0]).toMatchObject({ line: 2, column: 8, severity: 'error' })
    })

    it.each([
      ['// maz-ui-review-ignore\nconst c = \'bg-red-500\''],
      ['// maz-ui-review-ignore theme-colors --\nconst c = \'bg-red-500\''],
      ['/* maz-ui-review-ignore-file */\nconst c = \'bg-red-500\''],
    ])('then %j keeps the finding', (code) => {
      expect(review(code, 'a.ts').map(finding => finding.rule)).toEqual(['invalid-ignore', 'theme-colors'])
    })
  })

  describe('when a comment ignores an unknown component, prop or import', () => {
    it('then the error stays and the comment is reported', () => {
      const code = '<template>\n  <!-- maz-ui-review-ignore unknown-component, theme-colors -- it works -->\n  <MazNope class="bg-red-500" />\n</template>'
      const findings = review(code, 'A.vue')

      expect(findings.map(finding => finding.rule)).toEqual(['invalid-ignore', 'unknown-component'])
      expect(findings[0].message).toContain('`unknown-component` cannot be ignored')
    })

    it('then an ignore of every rule keeps it too', () => {
      const code = 'import { MazBtn } from \'maz-ui\' // maz-ui-review-ignore -- types only'

      expect(review(code, 'a.ts').map(finding => finding.rule)).toEqual(['root-import'])
    })
  })

  describe('when a string mentions the comment', () => {
    it('then it is not read as an ignore', () => {
      expect(review('const legend = \'add a maz-ui-review-ignore comment\'', 'a.ts')).toEqual([])
    })
  })

  describe('when a whole file is ignored', () => {
    it('then nothing is reported, or only the rules not listed', () => {
      expect(review('// maz-ui-review-ignore-file -- generated file\nconst c = \'bg-red-500\'', 'a.ts')).toEqual([])
      expect(review('/* maz-ui-review-ignore-file theme-colors -- generated file */\nconst c = \'bg-red-500 maz:flex\'', 'a.ts').map(finding => finding.rule)).toEqual(['internal-prefix'])
    })
  })
})

describe('given the finding helpers', () => {
  const findings: Finding[] = [
    {
      rule: 'unknown-prop',
      severity: 'warning',
      message: 'w',
      line: 2,
      column: 1,
      suggestion: 'fix it',
    },
    {
      rule: 'unknown-slot',
      severity: 'error',
      message: 'e',
      line: 1,
      column: 1,
    },
    {
      rule: 'nuxt-auto-import',
      severity: 'info',
      message: 'i',
      line: 3,
      column: 1,
    },
    {
      rule: 'nuxt-auto-import',
      severity: 'info',
      message: 'i2',
      line: 4,
      column: 1,
    },
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

  describe('when loading the icon names of a project', () => {
    it('then the generated types give the names and mean they are registered', () => {
      const project = createTempDir()
      writeFile(project, 'package.json', '{}')
      writeFile(project, 'src/maz-icons.d.ts', 'declare module \'maz-ui\' {\n  interface MazIconNames {\n    \'app:hero\': true\n  }\n}\n')

      const icons = projectIconNames(join(project, 'src'), getKnowledge())

      expect(icons?.registered).toBe(true)
      expect(icons?.names.has('app:hero')).toBe(true)
      expect(icons?.names.has('x-mark')).toBe(true)
    })

    it('then the SVG of the default folder are names, registered by MazUi() in the config', () => {
      const vue = createTempDir()
      writeFile(vue, 'package.json', '{}')
      writeFile(vue, 'vite.config.ts', 'export default { plugins: [MazUi()] }')
      writeFile(vue, 'src/icons/brand/LogoDark.svg', '<svg />')

      const nuxt = createTempDir()
      writeFile(nuxt, 'nuxt.config.ts', 'export default { modules: [\'@maz-ui/nuxt\'] }')
      writeFile(nuxt, 'app/icons/hero.svg', '<svg />')

      expect(projectIconNames(vue, getKnowledge())).toMatchObject({ registered: true })
      expect(projectIconNames(vue, getKnowledge())?.names.has('brand-logo-dark')).toBe(true)
      expect(projectIconNames(nuxt, getKnowledge())).toMatchObject({ registered: true })
      expect(projectIconNames(nuxt, getKnowledge())?.names.has('hero')).toBe(true)
    })

    it('then a project without MazUi() does not register the names, a directory outside of a project has none', () => {
      const project = createTempDir()
      writeFile(project, 'package.json', '{}')

      expect(projectIconNames(project, getKnowledge())?.registered).toBe(false)
      expect(findProjectRoot('/')).toBeUndefined()
      expect(projectIconNames('/', getKnowledge())).toBeUndefined()
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

      const files = await expandPaths([
        'src',
        'styles/*.css',
        join(project, 'src/b.ts'),
        'missing/**/*.vue',
      ], project)

      expect(files).toEqual([
        join(project, 'src/A.vue'),
        join(project, 'src/b.ts'),
        join(project, 'styles/main.css'),
      ])
    })

    it('then the folders outside of the working directory skip node_modules and coverage too', async () => {
      const root = createTempDir()
      writeFile(root, 'app/A.vue', '')
      writeFile(root, 'app/node_modules/pkg/b.ts', '')
      writeFile(root, 'app/coverage/base.css', '')
      writeFile(root, 'cwd/.keep', '')

      expect(await expandPaths(['../app'], join(root, 'cwd'))).toEqual([
        join(root, 'app/A.vue'),
      ])
    })

    it('then the project root itself can be expanded', async () => {
      const project = createTempDir()
      writeFile(project, 'A.vue', '')

      expect(await expandPaths(['.'], project)).toEqual([
        join(project, 'A.vue'),
      ])
    })
  })

  describe('when reviewing files', () => {
    it('then each file gets its findings filtered by severity', async () => {
      const project = createTempDir()
      writeFile(project, 'nuxt.config.ts', '')
      writeFile(project, 'src/A.vue', '<template><button>b</button><table /></template>')
      writeFile(project, 'src/b.ts', 'import MazBtn from \'maz-ui/components/MazBtn\'')

      const { reviews, truncated } = await reviewFiles(['src'], {
        knowledge: getKnowledge(),
        cwd: project,
        minSeverity: 'warning',
      })

      expect(truncated).toBe(false)
      expect(reviews.map(entry => entry.file)).toEqual([
        join('src', 'A.vue'),
        join('src', 'b.ts'),
      ])
      expect(reviews[0].findings.map(finding => finding.rule)).toEqual(['prefer-maz-component'])
      expect(reviews[1].findings).toEqual([])
    })

    it('then the detected framework enables the nuxt rules', async () => {
      const project = createTempDir()
      writeFile(project, 'nuxt.config.ts', '')
      writeFile(project, 'b.ts', 'import MazBtn from \'maz-ui/components/MazBtn\'')

      const { reviews } = await reviewFiles(['b.ts'], {
        knowledge: getKnowledge(),
        cwd: project,
      })

      expect(reviews[0].findings.map(finding => finding.rule)).toEqual(['nuxt-auto-import'])
    })

    it('then the icon names are the ones of the project of each file', async () => {
      const project = createTempDir()
      writeFile(project, 'package.json', '{}')
      writeFile(project, 'src/icons/hero.svg', '<svg />')
      writeFile(project, 'src/A.vue', '<template><MazIcon icon="hero" /><MazIcon icon="heroo" /></template>')

      const { reviews } = await reviewFiles(['src'], {
        knowledge: getKnowledge(),
        cwd: project,
      })

      expect(reviews[0].findings.map(finding => finding.rule)).toEqual(['unregistered-icon-names', 'unknown-icon'])
    })

    it('then it stops after the maximum number of files', async () => {
      const project = createTempDir()

      for (let index = 0; index <= MAX_REVIEWED_FILES; index++) writeFile(project, `src/f${String(index).padStart(3, '0')}.ts`, '')

      const { reviews, truncated } = await reviewFiles(['src'], {
        knowledge: getKnowledge(),
        cwd: project,
      })

      expect(truncated).toBe(true)
      expect(reviews).toHaveLength(MAX_REVIEWED_FILES)
    })
  })
})

describe('given displayPath', () => {
  describe('when the file is inside the working directory', () => {
    it('then the path is relative', () => {
      expect(displayPath('/project', '/project/src/A.vue')).toBe('src/A.vue')
    })
  })

  describe('when the file is outside the working directory or is the directory itself', () => {
    it('then the path is absolute', () => {
      expect(displayPath('/project/apps/web', '/other/A.vue')).toBe('/other/A.vue')
      expect(displayPath('/project', '/project')).toBe('/project')
    })
  })
})
