import { cleanTempDirs, createContextFor, createTempDir, getContext, writeFile } from '../../__tests__/helpers.ts'
import { reviewCodeTool } from '../review-code.ts'
import { ToolInputError } from '../types.ts'

describe('given the review_code tool', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when neither paths nor code are given', () => {
    it('then it throws an input error', async () => {
      await expect(reviewCodeTool(getContext(), {})).rejects.toBeInstanceOf(ToolInputError)
    })
  })

  describe('when code is given', () => {
    it('then it reviews the code with its filename', async () => {
      const output = await reviewCodeTool(getContext(), { code: '<template><MazBtn color="red">x</MazBtn></template>', filename: 'A.vue' })

      expect(output).toContain('A.vue: 1 error')
      expect(output).toContain('[invalid-prop-value]')
      expect(output).toContain('maz-ui-review-ignore')
    })

    it('then the icon names are the ones of the project', async () => {
      const project = createTempDir()
      writeFile(project, 'package.json', '{}')
      writeFile(project, 'vite.config.ts', 'MazUi()')
      writeFile(project, 'src/icons/hero.svg', '<svg />')

      const output = await reviewCodeTool(createContextFor(project), { code: '<template><MazIcon icon="hero" /></template>', filename: 'A.vue' })

      expect(output).toContain('A.vue: no issue found.')
    })

    it('then the maz: prefix is allowed in the maz-ui repository only', async () => {
      const docs = createTempDir()
      writeFile(docs, 'package.json', JSON.stringify({ devDependencies: { 'maz-ui': 'workspace:^' } }))
      const app = createTempDir()
      writeFile(app, 'package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))
      const code = '<template><div class="maz:flex" /></template>'

      expect(await reviewCodeTool(createContextFor(docs), { code, filename: 'A.vue' })).toContain('A.vue: no issue found.')
      expect(await reviewCodeTool(createContextFor(app), { code, filename: 'A.vue' })).toContain('[internal-prefix]')
    })

    it('then it labels anonymous code and applies the minimum severity', async () => {
      const output = await reviewCodeTool(getContext(), { code: '<table></table>', minSeverity: 'warning', framework: 'vue' })

      expect(output).toContain('code: no issue found.')
    })
  })

  describe('when paths are given', () => {
    it('then it reviews the files and lists only the files with issues', async () => {
      const project = createTempDir()
      writeFile(project, 'src/A.vue', '<template><button>b</button></template>')
      writeFile(project, 'src/b.ts', 'export const a = 1')

      const output = await reviewCodeTool(createContextFor(project), {
        paths: ['src'],
      })

      expect(output).toContain('Reviewed 2 files: 0 errors, 1 warnings, 0 info.')
      expect(output).toContain('src/A.vue: 1 warning')
      expect(output).not.toContain('src/b.ts')
    })

    it('then a single file is reviewed', async () => {
      const project = createTempDir()
      writeFile(project, 'a.ts', 'export const a = 1')

      expect(await reviewCodeTool(createContextFor(project), {
        paths: ['a.ts'],
      })).toContain('Reviewed 1 file:')
    })

    it('then it throws when nothing matches', async () => {
      const project = createTempDir()

      await expect(reviewCodeTool(createContextFor(project), {
        paths: ['src/**/*.vue'],
      })).rejects.toThrow('No .vue, .ts, .js or .css file matches src/**/*.vue')
    })
  })

  describe('when the paths are relative to an app of a monorepo', () => {
    function createMonorepo(): string {
      const root = createTempDir()
      writeFile(root, 'package.json', JSON.stringify({ private: true }))
      writeFile(root, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n')
      writeFile(root, 'apps/desktop/package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))
      writeFile(root, 'apps/desktop/src/Card.vue', '<template><MazBtn color="red">x</MazBtn></template>\n')
      writeFile(root, 'apps/api/package.json', JSON.stringify({ dependencies: { express: '^5.0.0' } }))
      writeFile(root, 'apps/api/src/Card.vue', '<template><div /></template>\n')

      return root
    }

    it.each([['src/Card.vue'], ['src'], ['src/**/*.vue']])('then %s is found in the apps that use maz-ui', async (path) => {
      const output = await reviewCodeTool(createContextFor(createMonorepo()), { paths: [path] })

      expect(output).toContain('Reviewed 1 file:')
      expect(output).toContain('apps/desktop/src/Card.vue')
    })

    it('then a path from the root still works', async () => {
      expect(await reviewCodeTool(createContextFor(createMonorepo()), { paths: ['apps/desktop/src/Card.vue'] })).toContain('Reviewed 1 file:')
    })

    it('then the error lists the apps when nothing matches', async () => {
      await expect(reviewCodeTool(createContextFor(createMonorepo()), { paths: ['src/Missing.vue'] }))
        .rejects
        .toThrow('nor from its apps that use maz-ui (`apps/desktop`). Pass the paths relative to one of them, or absolute.')
    })
  })

  describe('when both code and paths are given', () => {
    it('then both are reviewed', async () => {
      const project = createTempDir()
      writeFile(project, 'a.css', '.a { color: #1d90ff; }')

      const output = await reviewCodeTool(createContextFor(project), {
        code: 'const a = 1',
        filename: 'x.ts',
        paths: ['a.css'],
      })

      expect(output).toContain('x.ts: no issue found.')
      expect(output).toContain('a.css: 1 warning')
    })
  })
})
