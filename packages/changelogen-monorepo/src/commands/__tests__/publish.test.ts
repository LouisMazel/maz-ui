import { publish } from '../publish'

vi.mock('consola')
vi.mock('@maz-ui/node')
vi.mock('../../config')
vi.mock('../../core/monorepo')
vi.mock('../../core/version')
vi.mock('../../core/dependencies')
vi.mock('node:fs')
vi.mock('node:path')

describe('publish command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('unified mode', () => {
    it('publishes all packages with latest tag for stable version', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getPackages, getRootPackage } = await import('../../core/monorepo')
      const { getPackagesWithDependencies, topologicalSort } = await import('../../core/dependencies')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        monorepo: { versionMode: 'unified', packages: ['packages/*'] },
        publish: { registry: 'https://registry.npmjs.org/' },
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

      vi.mocked(getPackagesWithDependencies).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
        { name: '@test/pkg-b', path: '/test/packages/pkg-b', dependencies: {} },
      ] as any)

      vi.mocked(topologicalSort).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
        { name: '@test/pkg-b', path: '/test/packages/pkg-b', dependencies: {} },
      ] as any)

      vi.mocked(execPromise).mockResolvedValue({ stdout: 'published', stderr: '' })

      const result = await publish()

      expect(result?.packagesToPublish).toContain('@test/pkg-a')
      expect(result?.packagesToPublish).toContain('@test/pkg-b')
      expect(vi.mocked(execPromise).mock.calls.length).toBeGreaterThan(0)

      const publishCommands = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('npm publish'),
      )
      publishCommands.forEach((call) => {
        expect(String(call[0])).toContain('--tag latest')
      })
    })

    it('publishes packages with next tag for prerelease version', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getPackages, getRootPackage } = await import('../../core/monorepo')
      const { getPackagesWithDependencies, topologicalSort } = await import('../../core/dependencies')
      const { isPrerelease } = await import('../../core/version')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        monorepo: { versionMode: 'unified' },
        publish: { registry: 'https://registry.npmjs.org/' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0-beta.1' },
      ])

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0-beta.1',
      })

      vi.mocked(getPackagesWithDependencies).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(topologicalSort).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(isPrerelease).mockReturnValue(true)
      vi.mocked(execPromise).mockResolvedValue({ stdout: 'published', stderr: '' })

      const result = await publish()

      expect(result?.packagesToPublish).toContain('@test/pkg-a')

      const publishCommands = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('npm publish'),
      )
      publishCommands.forEach((call) => {
        expect(String(call[0])).toContain('--tag next')
      })
    })
  })

  describe('dry-run mode', () => {
    it('does not execute npm publish in dry-run mode', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getPackages, getRootPackage } = await import('../../core/monorepo')
      const { getPackagesWithDependencies, topologicalSort } = await import('../../core/dependencies')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        monorepo: { versionMode: 'unified' },
        publish: {},
      } as any)

      vi.mocked(getPackages).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0' },
      ])

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(getPackagesWithDependencies).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(topologicalSort).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(execPromise).mockClear()

      await publish({ dryRun: true })

      const npmPublishCalls = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('npm publish'),
      )
      expect(npmPublishCalls).toHaveLength(0)
    })
  })

  describe('npm configuration', () => {
    it('applies custom registry when provided', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getPackages, getRootPackage } = await import('../../core/monorepo')
      const { getPackagesWithDependencies, topologicalSort } = await import('../../core/dependencies')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        monorepo: { versionMode: 'unified' },
        publish: { registry: 'https://registry.npmjs.org/' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0' },
      ])

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(getPackagesWithDependencies).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(topologicalSort).mockReturnValue([
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(execPromise).mockResolvedValue({ stdout: 'published', stderr: '' })

      await publish({ registry: 'https://custom-registry.com' })

      const publishCommands = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('npm publish'),
      )
      publishCommands.forEach((call) => {
        expect(String(call[0])).toContain('--registry https://custom-registry.com')
      })
    })

    it('applies access control when provided', async () => {
      const { loadMonorepoConfig } = await import('../../config')
      const { getPackages, getRootPackage } = await import('../../core/monorepo')
      const { getPackagesWithDependencies, topologicalSort } = await import('../../core/dependencies')
      const { execPromise } = await import('@maz-ui/node')

      vi.mocked(loadMonorepoConfig).mockResolvedValueOnce({
        cwd: '/test',
        monorepo: { versionMode: 'unified' },
        publish: { access: 'public' },
      } as any)

      vi.mocked(getPackages).mockReturnValue([
        { name: '@scoped/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0' },
      ])

      vi.mocked(getRootPackage).mockReturnValue({
        name: 'root',
        path: '/test',
        version: '1.0.0',
      })

      vi.mocked(getPackagesWithDependencies).mockReturnValue([
        { name: '@scoped/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(topologicalSort).mockReturnValue([
        { name: '@scoped/pkg-a', path: '/test/packages/pkg-a', dependencies: {} },
      ] as any)

      vi.mocked(execPromise).mockResolvedValue({ stdout: 'published', stderr: '' })

      await publish({ access: 'restricted' })

      const publishCommands = vi.mocked(execPromise).mock.calls.filter(
        call => String(call[0]).includes('npm publish'),
      )
      publishCommands.forEach((call) => {
        expect(String(call[0])).toContain('--access restricted')
      })
    })
  })
})
