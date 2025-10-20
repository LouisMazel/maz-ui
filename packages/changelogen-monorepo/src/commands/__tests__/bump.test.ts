import type { GitCommit, RawGitCommit, ResolvedChangelogConfig } from 'changelogen'
import { getGitDiff, parseCommits } from 'changelogen'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadMonorepoConfig } from '../../config'
import { expandPackagesToBumpWithDependents } from '../../core/dependencies'
import { getPackageCommits, getPackages, getPackageToBump, getRootPackage } from '../../core/monorepo'
import {
  bumpPackageIndependently,
  bumpPackageVersion,
  determineReleaseType,
  getLastTag,
  isGraduating,
  isPrerelease,
  updateLernaVersion,
  writeVersion,
} from '../../core/version'
import { bump } from '../bump'

// Mock all external dependencies
vi.mock('consola')
vi.mock('changelogen')
vi.mock('../../config')
vi.mock('../../core/monorepo')
vi.mock('../../core/version')
vi.mock('../../core/dependencies')

describe('bump command', () => {
  const mockConfig: ResolvedChangelogConfig & {
    monorepo: any
    bump: any
    publish: any
    changelog: any
    release: any
  } = {
    cwd: '/test',
    from: 'v1.0.0',
    to: 'HEAD',
    types: {
      feat: { title: 'Features', semver: 'minor' },
      fix: { title: 'Bug Fixes', semver: 'patch' },
      docs: { title: 'Documentation' },
    },
    scopeMap: {},
    output: 'CHANGELOG.md',
    noAuthors: false,
    excludeAuthors: [],
    signTags: false,
    publish: {
      args: [],
      tag: 'latest',
      private: false,
    },
    templates: {
      commitMessage: 'chore(release): v{{newVersion}}',
      tagMessage: 'v{{newVersion}}',
      tagBody: 'v{{newVersion}}',
    },
    tokens: {},
    repo: {
      provider: 'github',
      domain: 'github.com',
      repo: 'test/repo',
    },
    monorepo: {
      versionMode: 'unified' as const,
      packages: ['packages/*'],
      ignorePackageNames: [],
      filterCommits: true,
    },
    bump: { type: undefined, preid: '' },
    changelog: { rootChangelog: true },
    release: { push: true, publish: true, release: true, noVerify: false },
  }

  const mockRootPackage = {
    name: 'root',
    path: '/test',
    version: '1.0.0',
  }

  const mockPackages = [
    { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0' },
    { name: '@test/pkg-b', path: '/test/packages/pkg-b', version: '1.0.0' },
  ]

  const createMockRawCommit = (message: string, body = ''): RawGitCommit => ({
    message,
    body,
    shortHash: 'abc123',
    author: { name: 'Test Author', email: 'test@example.com' },
  })

  const createMockGitCommit = (type: string, description: string, isBreaking = false): GitCommit => ({
    message: `${type}: ${description}`,
    body: '',
    shortHash: 'abc123',
    author: { name: 'Test Author', email: 'test@example.com' },
    description,
    type,
    scope: '',
    references: [],
    authors: [{ name: 'Test Author', email: 'test@example.com' }],
    isBreaking,
  })

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    vi.mocked(loadMonorepoConfig).mockResolvedValue(mockConfig as any)
    vi.mocked(getRootPackage).mockReturnValue(mockRootPackage)
    vi.mocked(getPackages).mockReturnValue(mockPackages)
    vi.mocked(writeVersion).mockImplementation(() => {})
    vi.mocked(updateLernaVersion).mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('unified mode', () => {
    it('should bump all packages from 1.0.0 to 1.1.0 with minor commits', async () => {
      // Setup
      const rawCommits = [createMockRawCommit('feat: new feature')]
      const commits = [createMockGitCommit('feat', 'new feature')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('minor')
      vi.mocked(bumpPackageVersion).mockReturnValue('1.1.0')

      // Execute
      const result = await bump()

      // Verify
      expect(result.newVersion).toBe('1.1.0')
      expect(result.bumpedPackages).toHaveLength(2)
      expect(result.bumpedPackages[0].version).toBe('1.1.0')
      expect(result.bumpedPackages[1].version).toBe('1.1.0')

      // Verify function calls
      expect(getGitDiff).toHaveBeenCalledWith('v1.0.0', 'HEAD', '/test')
      expect(parseCommits).toHaveBeenCalledWith(rawCommits, mockConfig)
      expect(determineReleaseType).toHaveBeenCalledWith(commits, mockConfig, expect.objectContaining({ type: undefined }))
      expect(bumpPackageVersion).toHaveBeenCalledWith('1.0.0', 'minor', '')

      // Verify all packages were written
      expect(writeVersion).toHaveBeenCalledTimes(3) // root + 2 packages
      expect(updateLernaVersion).toHaveBeenCalledWith('/test', '1.1.0', false)
    })

    it('should bump all packages from 1.0.0 to 2.0.0 with major commits', async () => {
      const rawCommits = [createMockRawCommit('feat: breaking change', 'BREAKING CHANGE: major change')]
      const commits = [createMockGitCommit('feat', 'breaking change', true)]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('major')
      vi.mocked(bumpPackageVersion).mockReturnValue('2.0.0')

      const result = await bump()

      expect(result.newVersion).toBe('2.0.0')
      expect(bumpPackageVersion).toHaveBeenCalledWith('1.0.0', 'major', '')
    })

    it('should bump all packages from 1.0.0 to 1.0.1 with patch commits', async () => {
      const rawCommits = [createMockRawCommit('fix: bug fix')]
      const commits = [createMockGitCommit('fix', 'bug fix')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('patch')
      vi.mocked(bumpPackageVersion).mockReturnValue('1.0.1')

      const result = await bump()

      expect(result.newVersion).toBe('1.0.1')
      expect(bumpPackageVersion).toHaveBeenCalledWith('1.0.0', 'patch', '')
    })

    it('should return empty result when no commits require bump', async () => {
      const rawCommits = [createMockRawCommit('docs: update readme')]
      const commits = [createMockGitCommit('docs', 'update readme')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue(null)

      const result = await bump()

      expect(result.newVersion).toBeUndefined()
      expect(result.bumpedPackages).toHaveLength(0)
      expect(writeVersion).not.toHaveBeenCalled()
      expect(updateLernaVersion).not.toHaveBeenCalled()
    })

    it('should create prerelease version with preid', async () => {
      const rawCommits = [createMockRawCommit('feat: new feature')]
      const commits = [createMockGitCommit('feat', 'new feature')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('prerelease')
      vi.mocked(bumpPackageVersion).mockReturnValue('1.1.0-alpha.0')

      const result = await bump({ preid: 'alpha' })

      expect(result.newVersion).toBe('1.1.0-alpha.0')
      expect(bumpPackageVersion).toHaveBeenCalledWith('1.0.0', 'prerelease', 'alpha')
    })

    it('should respect dryRun option', async () => {
      const rawCommits = [createMockRawCommit('feat: new feature')]
      const commits = [createMockGitCommit('feat', 'new feature')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('minor')
      vi.mocked(bumpPackageVersion).mockReturnValue('1.1.0')

      await bump({ dryRun: true })

      // Verify dryRun was passed to writeVersion calls
      const writeVersionCalls = vi.mocked(writeVersion).mock.calls
      writeVersionCalls.forEach((call) => {
        expect(call[2]).toBe(true) // dryRun parameter
      })

      expect(updateLernaVersion).toHaveBeenCalledWith('/test', '1.1.0', true)
    })
  })

  describe('independent mode', () => {
    beforeEach(() => {
      vi.mocked(loadMonorepoConfig).mockResolvedValue({
        ...mockConfig,
        monorepo: { ...mockConfig.monorepo, versionMode: 'independent' },
      } as any)
    })

    it('should bump packages independently based on their commits', async () => {
      const pkg1 = { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0' }
      const pkg2 = { name: '@test/pkg-b', path: '/test/packages/pkg-b', version: '1.0.0' }

      vi.mocked(getPackages).mockReturnValue([pkg1, pkg2])
      vi.mocked(getPackageCommits)
        .mockResolvedValueOnce([createMockGitCommit('feat', 'feature')]) // pkg1 has commits
        .mockResolvedValueOnce([]) // pkg2 has no commits

      vi.mocked(expandPackagesToBumpWithDependents).mockReturnValue([
        { ...pkg1, reason: 'commits' as const },
      ])

      vi.mocked(bumpPackageIndependently)
        .mockResolvedValueOnce({ bumped: true, newVersion: '1.1.0' }) // pkg1
        .mockResolvedValueOnce({ bumped: true, newVersion: '1.0.1' }) // root

      const result = await bump()

      expect(result.newVersion).toBe('1.0.1') // root version
      expect(result.bumpedPackages).toHaveLength(1)
      expect(result.bumpedPackages[0].name).toBe('@test/pkg-a')
      expect(result.bumpedPackages[0].version).toBe('1.1.0')
    })

    it('should handle graduating from prerelease to stable', async () => {
      const prereleaseRoot = { ...mockRootPackage, version: '1.0.0-alpha.5' }
      vi.mocked(getRootPackage).mockReturnValue(prereleaseRoot)
      vi.mocked(isPrerelease).mockReturnValue(true)
      vi.mocked(getLastTag).mockResolvedValue('v0.9.0')

      vi.mocked(getPackageCommits).mockResolvedValue([])
      vi.mocked(expandPackagesToBumpWithDependents).mockReturnValue([])
      vi.mocked(bumpPackageIndependently).mockResolvedValue({ bumped: true, newVersion: '1.0.0' })

      const result = await bump({ type: 'patch' })

      expect(getLastTag).toHaveBeenCalledWith('1.0.0-alpha.5', true)
      expect(result.newVersion).toBe('1.0.0')
    })
  })

  describe('selective mode', () => {
    beforeEach(() => {
      vi.mocked(loadMonorepoConfig).mockResolvedValue({
        ...mockConfig,
        monorepo: { ...mockConfig.monorepo, versionMode: 'selective' },
      } as any)
    })

    it('should bump only packages with commits', async () => {
      const packagesWithCommits = [
        { name: '@test/pkg-a', path: '/test/packages/pkg-a', version: '1.0.0', reason: 'commits' as const },
      ]

      const rawCommits = [createMockRawCommit('feat: new feature')]
      const commits = [createMockGitCommit('feat', 'new feature')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('minor')
      vi.mocked(bumpPackageVersion).mockReturnValue('1.1.0')
      vi.mocked(getPackageToBump).mockResolvedValue(packagesWithCommits)

      const result = await bump()

      expect(result.newVersion).toBe('1.1.0')
      expect(result.bumpedPackages).toHaveLength(1)
      expect(result.bumpedPackages[0].name).toBe('@test/pkg-a')
    })

    it('should handle graduation in selective mode', async () => {
      const prereleaseRoot = { ...mockRootPackage, version: '1.0.0-beta.1' }
      vi.mocked(getRootPackage).mockReturnValue(prereleaseRoot)
      vi.mocked(isGraduating).mockReturnValue(true)
      vi.mocked(getLastTag).mockResolvedValue('v0.9.0')

      const rawCommits1 = [createMockRawCommit('feat: beta feature')]
      const rawCommits2 = [
        createMockRawCommit('feat: stable feature'),
        createMockRawCommit('feat: beta feature'),
      ]

      vi.mocked(getGitDiff)
        .mockResolvedValueOnce(rawCommits1) // first call
        .mockResolvedValueOnce(rawCommits2) // second call after graduation

      const commits1 = [createMockGitCommit('feat', 'beta feature')]
      const commits2 = [
        createMockGitCommit('feat', 'stable feature'),
        createMockGitCommit('feat', 'beta feature'),
      ]

      vi.mocked(parseCommits)
        .mockReturnValueOnce(commits1)
        .mockReturnValueOnce(commits2)

      vi.mocked(determineReleaseType).mockReturnValue('minor')
      vi.mocked(bumpPackageVersion).mockReturnValue('1.0.0')
      vi.mocked(getPackageToBump).mockResolvedValue([])

      const result = await bump({ type: 'minor' })

      expect(getLastTag).toHaveBeenCalledWith('1.0.0-beta.1', true)
      expect(getGitDiff).toHaveBeenCalledTimes(2)
      expect(result.newVersion).toBe('1.0.0')
    })
  })

  describe('error handling', () => {
    it('should throw error when loadMonorepoConfig fails', async () => {
      vi.mocked(loadMonorepoConfig).mockRejectedValue(new Error('Config not found'))

      await expect(bump()).rejects.toThrow('Config not found')
    })

    it('should throw error when git operations fail', async () => {
      vi.mocked(getGitDiff).mockRejectedValue(new Error('Git error'))

      await expect(bump()).rejects.toThrow('Git error')
    })

    it('should throw error when version operations fail', async () => {
      const rawCommits = [createMockRawCommit('feat: new feature')]
      const commits = [createMockGitCommit('feat', 'new feature')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('minor')
      vi.mocked(bumpPackageVersion).mockImplementation(() => {
        throw new Error('Version bump failed')
      })

      await expect(bump()).rejects.toThrow('Version bump failed')
    })
  })

  describe('options handling', () => {
    it('should use provided type option over config', async () => {
      const rawCommits = [createMockRawCommit('feat: new feature')]
      const commits = [createMockGitCommit('feat', 'new feature')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('major')
      vi.mocked(bumpPackageVersion).mockReturnValue('2.0.0')

      await bump({ type: 'major' })

      expect(determineReleaseType).toHaveBeenCalledWith(
        expect.any(Array),
        mockConfig,
        expect.objectContaining({ type: 'major' }),
      )
    })

    it('should use provided preid option', async () => {
      const rawCommits = [createMockRawCommit('feat: new feature')]
      const commits = [createMockGitCommit('feat', 'new feature')]

      vi.mocked(getGitDiff).mockResolvedValue(rawCommits)
      vi.mocked(parseCommits).mockReturnValue(commits)
      vi.mocked(determineReleaseType).mockReturnValue('prerelease')
      vi.mocked(bumpPackageVersion).mockReturnValue('1.1.0-beta.0')

      await bump({ preid: 'beta' })

      expect(bumpPackageVersion).toHaveBeenCalledWith('1.0.0', 'prerelease', 'beta')
    })
  })
})
