import { release } from '../release'

vi.mock('consola')
vi.mock('@maz-ui/node')
vi.mock('changelogen')
vi.mock('../../config')
vi.mock('../../core/monorepo')
vi.mock('../../core/version')
vi.mock('../../core/dependencies')
vi.mock('../../core/changelog')
vi.mock('../../utils/git')

describe('release integration tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('release 1.0.0 -> 1.1.0 (minor bump)', () => {
    it('executes full release workflow: bump -> changelog -> commit -> publish', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')
      const { changelog } = await import('../changelog')
      const { publish } = await import('../publish')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')
      const { execPromise } = await import('@maz-ui/node')
      const { createGithubRelease } = await import('changelogen')

      // Setup config
      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        bump: { type: undefined },
        release: { push: true, publish: true, release: true, noVerify: false },
        publish: {},
        changelog: { rootChangelog: true },
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: 'test-token' },
      } as any)

      // Setup mocks for bump step
      vi.mocked(getPackages).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0' },
      ])

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '1.1.0',
        bumpedPackages: [
          { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.1.0' },
        ],
      })

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v1.1.0'])
      vi.mocked(detectGitProvider).mockReturnValue('github')
      vi.mocked(execPromise).mockResolvedValue({ stdout: '', stderr: '' })
      vi.mocked(publish).mockResolvedValueOnce({
        packagesToPublish: ['@test/pkg-a'],
      })
      vi.mocked(createGithubRelease).mockResolvedValueOnce({ id: 123 })

      await release()

      // Verify bump was called
      expect(vi.mocked(bump)).toHaveBeenCalledWith(
        expect.objectContaining({ type: undefined, dryRun: false }),
      )

      // Verify changelog was called with correct version
      expect(vi.mocked(changelog)).toHaveBeenCalled()

      // Verify commit and tag was called with correct version
      expect(vi.mocked(commitAndTag)).toHaveBeenCalledWith(
        expect.objectContaining({
          newVersion: '1.1.0',
          bumpedPackages: expect.any(Array),
        }),
      )

      // Verify push was called
      const pushCalls = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('push'),
      )
      expect(pushCalls.length).toBeGreaterThan(0)

      // Verify publish was called
      expect(vi.mocked(publish)).toHaveBeenCalled()

      // Verify github release was called
      expect(vi.mocked(createGithubRelease)).toHaveBeenCalled()
    })
  })

  describe('release 1.0.0 -> 2.0.0 (major bump)', () => {
    it('bumps correctly with breaking changes', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')
      const { changelog } = await import('../changelog')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        bump: { type: undefined },
        release: { push: false, publish: false, release: false, noVerify: false },
        changelog: { rootChangelog: false },
        templates: { tagBody: 'v{{newVersion}}' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([])
      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '2.0.0',
        bumpedPackages: [],
      })

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v2.0.0'])
      vi.mocked(detectGitProvider).mockReturnValue('github')

      await release()

      const commitTagCall = vi.mocked(commitAndTag).mock.calls[0]
      expect(commitTagCall[0].newVersion).toBe('2.0.0')
    })
  })

  describe('release 1.0.0 -> 1.0.1 (patch bump)', () => {
    it('bumps correctly with bug fixes', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')
      const { changelog } = await import('../changelog')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        bump: { type: undefined },
        release: { push: false, publish: false, release: false, noVerify: false },
        changelog: { rootChangelog: false },
        templates: { tagBody: 'v{{newVersion}}' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([])
      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '1.0.1',
        bumpedPackages: [],
      })

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v1.0.1'])
      vi.mocked(detectGitProvider).mockReturnValue('github')

      await release()

      const commitTagCall = vi.mocked(commitAndTag).mock.calls[0]
      expect(commitTagCall[0].newVersion).toBe('1.0.1')
    })
  })

  describe('release 1.0.0 -> 1.1.0-alpha.0 (prerelease)', () => {
    it('creates prerelease version correctly', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')
      const { changelog } = await import('../changelog')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')
      const { createGithubRelease } = await import('changelogen')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        bump: { preid: 'alpha' },
        release: { push: false, publish: false, release: true, noVerify: false },
        changelog: { rootChangelog: false },
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: 'test-token' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([])
      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '1.1.0-alpha.0',
        bumpedPackages: [],
      })

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v1.1.0-alpha.0'])
      vi.mocked(detectGitProvider).mockReturnValue('github')
      vi.mocked(createGithubRelease).mockResolvedValueOnce({ id: 124 })

      await release({ preid: 'alpha' })

      const githubCall = vi.mocked(createGithubRelease).mock.calls[0]
      expect(githubCall[1].tag_name).toBe('v1.1.0-alpha.0')
      expect(githubCall[1].prerelease).toBe(true)
    })
  })

  describe('release 1.0.0-alpha.5 -> 1.0.0 (graduating prerelease)', () => {
    it('graduates from prerelease to stable correctly', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')
      const { changelog } = await import('../changelog')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')
      const { createGithubRelease } = await import('changelogen')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0-alpha.5',
        to: 'HEAD',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        bump: { type: 'patch' },
        release: { push: false, publish: false, release: true, noVerify: false },
        changelog: { rootChangelog: false },
        templates: { tagBody: 'v{{newVersion}}' },
        tokens: { github: 'test-token' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([])
      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0-alpha.5',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '1.0.0',
        bumpedPackages: [],
      })

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v1.0.0'])
      vi.mocked(detectGitProvider).mockReturnValue('github')
      vi.mocked(createGithubRelease).mockResolvedValueOnce({ id: 125 })

      await release({ type: 'patch' })

      const commitTagCall = vi.mocked(commitAndTag).mock.calls[0]
      expect(commitTagCall[0].newVersion).toBe('1.0.0')

      const githubCall = vi.mocked(createGithubRelease).mock.calls[0]
      expect(githubCall[1].tag_name).toBe('v1.0.0')
      expect(githubCall[1].prerelease).toBe(false)
    })
  })

  describe('release with options', () => {
    it('respects --no-push flag', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')
      const { changelog } = await import('../changelog')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        bump: {},
        release: { push: false, publish: false, release: false, noVerify: false },
        changelog: { rootChangelog: false },
        templates: { tagBody: 'v{{newVersion}}' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([])
      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '1.1.0',
        bumpedPackages: [],
      })

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v1.1.0'])
      vi.mocked(detectGitProvider).mockReturnValue('github')
      vi.mocked(execPromise).mockClear()

      await release({ push: false })

      const pushCalls = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('push'),
      )
      expect(pushCalls).toHaveLength(0)
    })

    it('respects --dry-run flag', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')
      const { changelog } = await import('../changelog')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')
      const { execPromise } = await import('@maz-ui/node')
      const { publish } = await import('../publish')
      const { createGithubRelease } = await import('changelogen')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        from: 'v1.0.0',
        to: 'HEAD',
        monorepo: { versionMode: 'unified' },
        bump: {},
        release: { push: true, publish: true, release: true, noVerify: false },
        changelog: { rootChangelog: false },
        templates: { tagBody: 'v{{newVersion}}' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([])
      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '1.1.0',
        bumpedPackages: [],
      })

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v1.1.0'])
      vi.mocked(detectGitProvider).mockReturnValue('github')
      vi.mocked(execPromise).mockClear()
      vi.mocked(publish).mockClear()
      vi.mocked(createGithubRelease).mockClear()

      await release({ dryRun: true })

      // In dry-run, push should be skipped
      const pushCalls = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('push'),
      )
      expect(pushCalls).toHaveLength(0)

      // Publish should not be called
      expect(vi.mocked(publish)).not.toHaveBeenCalled()

      // GitHub release should not be created
      expect(vi.mocked(createGithubRelease)).not.toHaveBeenCalled()
    })
  })

  describe('version modes', () => {
    it('handles unified mode release correctly', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getRootPackage, getPackages } = await import('../../core/monorepo')
      const { bump } = await import('../bump')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        bump: {},
        release: { push: false, publish: false, release: false, noVerify: false },
        changelog: { rootChangelog: false },
        templates: { tagBody: 'v{{newVersion}}' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0' },
        { name: '@test/pkg-b', path: '/test/packages/pkg-b', version: '1.0.0' },
      ])

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(bump).mockResolvedValueOnce({
        newVersion: '1.1.0',
        bumpedPackages: [
          { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.1.0' },
          { name: '@test/pkg-b', path: '/test/packages/pkg-b', version: '1.1.0' },
        ],
      })

      const { changelog } = await import('../changelog')
      const { commitAndTag, detectGitProvider } = await import('../../utils/git')

      vi.mocked(changelog).mockResolvedValueOnce(undefined)
      vi.mocked(commitAndTag).mockResolvedValueOnce(['v1.1.0'])
      vi.mocked(detectGitProvider).mockReturnValue('github')

      await release()

      const bumpCall = vi.mocked(bump).mock.calls[0]
      expect(bumpCall[0]?.dryRun).toBe(false)

      const commitCall = vi.mocked(commitAndTag).mock.calls[0]
      expect(commitCall[0].bumpedPackages).toHaveLength(2)
    })
  })
})
