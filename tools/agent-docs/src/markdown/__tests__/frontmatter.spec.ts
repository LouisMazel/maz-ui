import { parseFrontmatter, stringifyFrontmatter } from '../frontmatter'

describe('given parseFrontmatter', () => {
  describe('when the source starts with a YAML frontmatter', () => {
    it('then returns the data and the body', () => {
      const result = parseFrontmatter('---\ntitle: MazBtn\ndescription: A button\nhead:\n  - - meta\n---\n\n# Body')

      expect(result.frontmatter).toEqual({ title: 'MazBtn', description: 'A button', head: [['meta']] })
      expect(result.body).toBe('\n# Body')
    })
  })

  describe('when the source uses CRLF line endings', () => {
    it('then parses the frontmatter', () => {
      expect(parseFrontmatter('---\r\ntitle: Win\r\n---\r\nBody')).toEqual({ frontmatter: { title: 'Win' }, body: 'Body' })
    })
  })

  describe('when the source has no frontmatter', () => {
    it('then returns the whole source as body', () => {
      expect(parseFrontmatter('# Title')).toEqual({ frontmatter: {}, body: '# Title' })
    })
  })

  describe('when the frontmatter is empty', () => {
    it('then returns empty data', () => {
      expect(parseFrontmatter('---\n\n---\nBody')).toEqual({ frontmatter: {}, body: 'Body' })
    })
  })

  describe('when the frontmatter is a scalar', () => {
    it('then returns empty data', () => {
      expect(parseFrontmatter('---\njust text\n---').frontmatter).toEqual({})
    })
  })
})

describe('given stringifyFrontmatter', () => {
  describe('when values are strings, arrays and undefined', () => {
    it('then quotes strings, lists arrays and skips undefined values', () => {
      expect(stringifyFrontmatter({ title: 'It\'s "maz"', paths: ['**/*.vue', 'src/*.ts'], url: undefined })).toBe([
        '---',
        'title: "It\'s \\"maz\\""',
        'paths:',
        '  - "**/*.vue"',
        '  - "src/*.ts"',
        '---',
      ].join('\n'))
    })
  })

  describe('when the output is parsed back', () => {
    it('then gives the same data', () => {
      const data = { title: 'Title: with colon', description: 'A # B' }

      expect(parseFrontmatter(`${stringifyFrontmatter(data)}\nBody`).frontmatter).toEqual(data)
    })
  })
})
