import { gitlab } from '../gitlab'

vi.mock('consola')
vi.mock('@maz-ui/node')
vi.mock('../../config')
vi.mock('../../core/monorepo')
vi.mock('../../core/version')
vi.mock('../../core/changelog')
vi.mock('../../utils/gitlab')

describe('gitlab command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('release creation', () => {
    it('creates GitLab release with changelog', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')
      const { createGitlabRelease } = await import('../../utils/gitlab')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { gitlab: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([
        { type: 'feat', subject: 'feature', hash: 'abc' },
      ])

      vi.mocked(generateChangelog).mockResolvedValueOnce(`# Changelog

## v1.1.0

### Features
- feat: feature
`)

      vi.mocked(execPromise).mockResolvedValue({ stdout: 'main', stderr: '' })
      vi.mocked(createGitlabRelease).mockResolvedValueOnce({ id: 123 })

      await gitlab()

      expect(vi.mocked(createGitlabRelease)).toHaveBeenCalled()

      const call = vi.mocked(createGitlabRelease).mock.calls[0]
      expect(call[0].tag_name).toBe('v1.1.0')
      expect(call[0].description).toContain('feature')
      expect(call[0].ref).toBe('main')
    })

    it('gets current git branch for release', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')
      const { createGitlabRelease } = await import('../../utils/gitlab')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { gitlab: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')
      vi.mocked(execPromise).mockResolvedValue({ stdout: 'develop', stderr: '' })
      vi.mocked(createGitlabRelease).mockResolvedValueOnce({ id: 124 })

      await gitlab()

      const call = vi.mocked(createGitlabRelease).mock.calls[0]
      expect(call[0].ref).toBe('develop')
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
        tokens: { gitlab: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce(null)

      await expect(gitlab()).rejects.toThrow('No changelog found')
    })

    it('throws error when no token provided and not dry-run', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { gitlab: undefined },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')

      const originalToken = process.env.GITLAB_TOKEN
      delete process.env.GITLAB_TOKEN

      try {
        await expect(gitlab()).rejects.toThrow('No GitLab token specified')
      }
      finally {
        if (originalToken)
          process.env.GITLAB_TOKEN = originalToken
      }
    })
  })

  describe('dry-run mode', () => {
    it('does not create release in dry-run mode', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackageCommits } = await import('../../core/monorepo')
      const { generateChangelog } = await import('../../core/changelog')
      const { createGitlabRelease } = await import('../../utils/gitlab')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { gitlab: 'test-token' },
      } as any)

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.1.0',
      })

      vi.mocked(getPackageCommits).mockResolvedValueOnce([])
      vi.mocked(generateChangelog).mockResolvedValueOnce('# Changelog')
      vi.mocked(createGitlabRelease).mockClear()

      const { execPromise } = await import('@maz-ui/node')
      vi.mocked(execPromise).mockResolvedValue({ stdout: 'main', stderr: '' })

      await gitlab({ dryRun: true })

      expect(vi.mocked(createGitlabRelease)).not.toHaveBeenCalled()
    })
  })
})
