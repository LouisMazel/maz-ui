import { cleanTempDirs, createContextFor, createTempDir, getContext, writeFile } from '../../__tests__/helpers'
import { reviewCodeTool } from '../review-code'
import { ToolInputError } from '../types'

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

      const output = await reviewCodeTool(createContextFor(project), { paths: ['src'] })

      expect(output).toContain('Reviewed 2 files: 0 errors, 1 warnings, 0 info.')
      expect(output).toContain('src/A.vue: 1 warning')
      expect(output).not.toContain('src/b.ts')
    })

    it('then a single file is reviewed', async () => {
      const project = createTempDir()
      writeFile(project, 'a.ts', 'export const a = 1')

      expect(await reviewCodeTool(createContextFor(project), { paths: ['a.ts'] })).toContain('Reviewed 1 file:')
    })

    it('then it throws when nothing matches', async () => {
      const project = createTempDir()

      await expect(reviewCodeTool(createContextFor(project), { paths: ['src/**/*.vue'] })).rejects.toThrow('No .vue, .ts, .js or .css file matches src/**/*.vue')
    })
  })

  describe('when both code and paths are given', () => {
    it('then both are reviewed', async () => {
      const project = createTempDir()
      writeFile(project, 'a.css', '.a { color: #fff; }')

      const output = await reviewCodeTool(createContextFor(project), { code: 'const a = 1', filename: 'x.ts', paths: ['a.css'] })

      expect(output).toContain('x.ts: no issue found.')
      expect(output).toContain('a.css: 1 warning')
    })
  })
})
