import { changelog } from '../changelog'

vi.mock('consola')
vi.mock('@maz-ui/node')
vi.mock('../../config')
vi.mock('../../core/monorepo')
vi.mock('../../core/version')
vi.mock('../../core/changelog')

describe('changelog command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('root changelog generation', () => {
    it('generates root changelog with commit content', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog, writeChangelogToFile } = await import('../../core/changelog')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        changelog: { rootChangelog: true },
        monorepo: { filterCommits: false },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([
        { type: 'feat', subject: 'new feature', hash: 'abc' },
        { type: 'fix', subject: 'bug fix', hash: 'def' },
      ])

      const changelogContent = `# Changelog

## v1.1.0

### Features
- feat: new feature

### Bug Fixes
- fix: bug fix
`

      vi.mocked(generateChangelog).mockResolvedValueOnce(changelogContent)
      vi.mocked(writeChangelogToFile).mockImplementation(() => {})

      await changelog({ rootChangelog: true })

      expect(vi.mocked(generateChangelog)).toHaveBeenCalled()
      expect(vi.mocked(writeChangelogToFile)).toHaveBeenCalledWith(
        expect.objectContaining({
          changelog: changelogContent,
        }),
      )
    })

    it('skips root changelog when disabled', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        changelog: { rootChangelog: false },
        monorepo: { filterCommits: false },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(generateChangelog).mockClear()

      await changelog({ rootChangelog: false })

      expect(vi.mocked(generateChangelog)).not.toHaveBeenCalled()
    })
  })

  describe('package changelogs', () => {
    it('generates per-package changelogs when filterCommits enabled', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getPackages, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog, writeChangelogToFile } = await import('../../core/changelog')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        changelog: { rootChangelog: false },
        monorepo: { filterCommits: true, packages: ['packages/*'] },
      } as any)

      vi.mocked(getPackages).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.1.0' },
        { name: '@test/pkg-b', path: '/test/packages/pkg-b', version: '1.1.0' },
      ])

      vi.mocked(getPackageCommits).mockResolvedValue([
        { type: 'feat', subject: 'pkg feature', hash: 'abc' },
      ])

      vi.mocked(generateChangelog).mockResolvedValue(`# Changelog\n\n## v1.1.0\n- feat: pkg feature`)
      vi.mocked(writeChangelogToFile).mockImplementation(() => {})

      await changelog()

      expect(vi.mocked(generateChangelog).mock.calls.length).toBeGreaterThanOrEqual(2)
      expect(vi.mocked(writeChangelogToFile).mock.calls.length).toBeGreaterThanOrEqual(2)
    })

    it('skips packages without commits', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getPackages, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog, writeChangelogToFile } = await import('../../core/changelog')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        changelog: { rootChangelog: false },
        monorepo: { filterCommits: true, packages: ['packages/*'] },
      } as any)

      vi.mocked(getPackages).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.1.0' },
      ])

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce(null)
      vi.mocked(writeChangelogToFile).mockClear()

      await changelog()

      expect(vi.mocked(writeChangelogToFile)).not.toHaveBeenCalled()
    })
  })

  describe('format command', () => {
    it('runs format command when configured and not dry-run', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage } = await import('../../core/monorepo')
      const { generateChangelog, writeChangelogToFile } = await import('../../core/changelog')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        changelog: {
          rootChangelog: true,
          formatCmd: 'prettier --write CHANGELOG.md',
        },
        monorepo: { filterCommits: false },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')
      vi.mocked(writeChangelogToFile).mockImplementation(() => {})
      vi.mocked(execPromise).mockClear()
      vi.mocked(execPromise).mockResolvedValue({ stdout: '', stderr: '' })

      await changelog()

      const formatCalls = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('prettier'),
      )
      expect(formatCalls.length).toBeGreaterThan(0)
    })

    it('skips format command in dry-run mode', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage } = await import('../../core/monorepo')
      const { generateChangelog, writeChangelogToFile } = await import('../../core/changelog')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        changelog: {
          rootChangelog: true,
          formatCmd: 'prettier --write CHANGELOG.md',
        },
        monorepo: { filterCommits: false },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')
      vi.mocked(writeChangelogToFile).mockImplementation(() => {})
      vi.mocked(execPromise).mockClear()

      await changelog({ dryRun: true })

      const formatCalls = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('prettier'),
      )
      expect(formatCalls).toHaveLength(0)
    })

    it('continues even if format command fails', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage } = await import('../../core/monorepo')
      const { generateChangelog, writeChangelogToFile } = await import('../../core/changelog')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        changelog: {
          rootChangelog: true,
          formatCmd: 'bad-formatter',
        },
        monorepo: { filterCommits: false },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')
      vi.mocked(writeChangelogToFile).mockImplementation(() => {})
      vi.mocked(execPromise).mockRejectedValueOnce(new Error('Command not found'))

      await expect(changelog()).resolves.not.toThrow()
    })
  })

  describe('custom ranges', () => {
    it('uses custom from tag when provided', async () => {
      const { loadMonorepoConfig } = await import('../../config')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v0.9.0',
        to: 'HEAD',
        changelog: { rootChangelog: false },
        monorepo: { filterCommits: false },
      } as any)

      await changelog({ from: 'v0.9.0' })

      expect(vi.mocked(loadMonorepoConfig)).toHaveBeenCalledWith({
        overrides: expect.objectContaining({
          from: 'v0.9.0',
        }),
      })
    })

    it('uses custom to tag when provided', async () => {
      const { loadMonorepoConfig } = await import('../../config')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'develop',
        changelog: { rootChangelog: false },
        monorepo: { filterCommits: false },
      } as any)

      await changelog({ to: 'develop' })

      expect(vi.mocked(loadMonorepoConfig)).toHaveBeenCalledWith({
        overrides: expect.objectContaining({
          to: 'develop',
        }),
      })
    })
  })
})
