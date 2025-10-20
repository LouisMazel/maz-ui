import { github } from '../github'

vi.mock('consola')
vi.mock('changelogen')
vi.mock('../../config')
vi.mock('../../core/monorepo')
vi.mock('../../core/version')
vi.mock('../../core/changelog')

describe('github command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('release creation', () => {
    it('creates GitHub release with changelog for stable version', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')
      const { isPrerelease } = await import('../../core/version')
      const { createGithubRelease } = await import('changelogen')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([
        { type: 'feat', subject: 'new feature', hash: 'abc' },
      ])

      vi.mocked(generateChangelog).mockResolvedValueOnce(`# Changelog

## v1.1.0

### Features
- feat: new feature
`)

      vi.mocked(isPrerelease).mockReturnValue(false)
      vi.mocked(createGithubRelease).mockResolvedValueOnce({ id: 123 })

      await github()

      expect(vi.mocked(createGithubRelease)).toHaveBeenCalled()

      const call = vi.mocked(createGithubRelease).mock.calls[0]
      expect(call[1].tag_name).toBe('v1.1.0')
      expect(call[1].body).toContain('new feature')
      expect(call[1].prerelease).toBe(false)
    })

    it('marks prerelease releases correctly', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')
      const { isPrerelease } = await import('../../core/version')
      const { createGithubRelease } = await import('changelogen')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0-beta.1',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])

      vi.mocked(generateChangelog).mockResolvedValueOnce(`# Changelog

## v1.1.0-beta.1

### Features
- feat: beta feature
`)

      vi.mocked(isPrerelease).mockReturnValue(true)
      vi.mocked(createGithubRelease).mockResolvedValueOnce({ id: 124 })

      await github()

      const call = vi.mocked(createGithubRelease).mock.calls[0]
      expect(call[1].prerelease).toBe(true)
    })
  })

  describe('error handling', () => {
    it('throws error when no changelog generated', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce(null)

      await expect(github()).rejects.toThrow('No changelog found')
    })

    it('throws error when no token provided and not dry-run', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: undefined },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')

      const originalToken = process.env.GITHUB_TOKEN
      delete process.env.GITHUB_TOKEN
      delete process.env.GH_TOKEN

      try {
        await expect(github()).rejects.toThrow('No GitHub token specified')
      }
      finally {
        if (originalToken)
          process.env.GITHUB_TOKEN = originalToken
      }
    })
  })

  describe('dry-run mode', () => {
    it('does not create release in dry-run mode', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')
      const { createGithubRelease } = await import('changelogen')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')
      vi.mocked(createGithubRelease).mockClear()

      await github({ dryRun: true })

      expect(vi.mocked(createGithubRelease)).not.toHaveBeenCalled()
    })
  })
})
