import type { GitCommit } from 'changelogen'
import type { ReleaseType } from 'semver'
import type { BumpConfig } from '../../types'
import type { ResolvedChangelogMonorepoConfig } from '../config'
import { logger } from '@maz-ui/node'
import { getDefaultConfig } from '../config'
import { bumpPackageVersion, determineReleaseType } from '../version'

logger.setLevel('error')

function createMockConfig(bump: Partial<BumpConfig> & { type: ReleaseType }) {
  const defaultConfig = getDefaultConfig()

  return {
    ...defaultConfig,
    cwd: '/test',
    from: 'v1.0.0',
    to: 'HEAD',
    monorepo: {
      versionMode: 'selective',
      packages: ['packages/*'],
    },
    bump: {
      ...defaultConfig.bump,
      ...bump,
    },
  } as ResolvedChangelogMonorepoConfig
}

function createMockCommit(type: string, message: string): GitCommit {
  return {
    shortHash: 'abc1234',
    author: { name: 'Test', email: 'test@example.com' },
    message,
    body: '',
    type,
    scope: '',
    references: [],
    description: message,
    isBreaking: false,
    authors: [],
  } as GitCommit
}

describe('Given bumpPackageVersion function', () => {
  describe('When bumping with stable release types', () => {
    it('Then bumps patch version from stable', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.0.1')
    })

    it('Then bumps minor version from stable', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'minor',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.1.0')
    })

    it('Then bumps major version from stable', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'major',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('2.0.0')
    })

    it('Then bumps patch version from complex version', () => {
      const result = bumpPackageVersion({
        currentVersion: '2.5.8',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('2.5.9')
    })

    it('Then bumps minor version and resets patch', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.2.3',
        releaseType: 'minor',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.3.0')
    })

    it('Then bumps major version and resets minor and patch', () => {
      const result = bumpPackageVersion({
        currentVersion: '3.7.9',
        releaseType: 'major',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('4.0.0')
    })

    it('Then graduates from prerelease to patch', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-beta.0',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.0.0')
    })

    it('Then graduates from prerelease to minor', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-alpha.5',
        releaseType: 'minor',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.0.0')
    })

    it('Then graduates from prerelease to major', () => {
      const result = bumpPackageVersion({
        currentVersion: '2.5.0-rc.1',
        releaseType: 'major',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('3.0.0')
    })
  })

  describe('When bumping with prerelease types without suffix', () => {
    it('Then bumps prepatch version from stable', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'prepatch',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toBe('1.0.1-alpha.0')
    })

    it('Then bumps preminor version from stable', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'preminor',
        preid: 'beta',
        suffix: undefined,
      })

      expect(result).toBe('1.1.0-beta.0')
    })

    it('Then bumps premajor version from stable', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'premajor',
        preid: 'rc',
        suffix: undefined,
      })

      expect(result).toBe('2.0.0-rc.0')
    })

    it('Then bumps prerelease version from existing prerelease', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-alpha.0',
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toBe('1.0.0-alpha.1')
    })

    it('Then bumps prerelease version multiple times', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-beta.5',
        releaseType: 'prerelease',
        preid: 'beta',
        suffix: undefined,
      })

      expect(result).toBe('1.0.0-beta.6')
    })

    it('Then bumps prepatch with different preid', () => {
      const result = bumpPackageVersion({
        currentVersion: '2.3.4',
        releaseType: 'prepatch',
        preid: 'rc',
        suffix: undefined,
      })

      expect(result).toBe('2.3.5-rc.0')
    })

    it('Then bumps preminor with alpha preid', () => {
      const result = bumpPackageVersion({
        currentVersion: '5.2.1',
        releaseType: 'preminor',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toBe('5.3.0-alpha.0')
    })

    it('Then bumps premajor from version with patch', () => {
      const result = bumpPackageVersion({
        currentVersion: '3.7.2',
        releaseType: 'premajor',
        preid: 'beta',
        suffix: undefined,
      })

      expect(result).toBe('4.0.0-beta.0')
    })
  })

  describe('When bumping with prerelease types with suffix', () => {
    it('Then bumps prepatch version with custom suffix', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'prepatch',
        preid: 'alpha',
        suffix: '1234',
      })

      expect(result).toBe('1.0.1-alpha.1234')
    })

    it('Then bumps preminor version with custom suffix', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'preminor',
        preid: 'beta',
        suffix: '5678',
      })

      expect(result).toBe('1.1.0-beta.5678')
    })

    it('Then bumps premajor version with custom suffix', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'premajor',
        preid: 'rc',
        suffix: 'abc',
      })

      expect(result).toBe('2.0.0-rc.abc')
    })

    it('Then bumps prerelease version with custom suffix', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-alpha.0',
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: '999',
      })

      expect(result).toBe('1.0.0-alpha.999')
    })

    it('Then replaces existing prerelease number with suffix', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-beta.5',
        releaseType: 'prerelease',
        preid: 'beta',
        suffix: 'xyz',
      })

      expect(result).toBe('1.0.0-beta.xyz')
    })

    it('Then bumps with numeric suffix', () => {
      const result = bumpPackageVersion({
        currentVersion: '2.1.0',
        releaseType: 'prepatch',
        preid: 'alpha',
        suffix: '42',
      })

      expect(result).toBe('2.1.1-alpha.42')
    })

    it('Then bumps with alphanumeric suffix', () => {
      const result = bumpPackageVersion({
        currentVersion: '3.0.0',
        releaseType: 'preminor',
        preid: 'beta',
        suffix: 'build123',
      })

      expect(result).toBe('3.1.0-beta.build123')
    })
  })

  describe('When bumping from initial versions', () => {
    it('Then bumps from 0.0.0 to patch', () => {
      const result = bumpPackageVersion({
        currentVersion: '0.0.0',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('0.0.1')
    })

    it('Then bumps from 0.0.0 to minor', () => {
      const result = bumpPackageVersion({
        currentVersion: '0.0.0',
        releaseType: 'minor',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('0.1.0')
    })

    it('Then bumps from 0.0.0 to major', () => {
      const result = bumpPackageVersion({
        currentVersion: '0.0.0',
        releaseType: 'major',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.0.0')
    })

    it('Then bumps from 0.1.0 to prepatch', () => {
      const result = bumpPackageVersion({
        currentVersion: '0.1.0',
        releaseType: 'prepatch',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toBe('0.1.1-alpha.0')
    })

    it('Then bumps from 0.0.1 to preminor', () => {
      const result = bumpPackageVersion({
        currentVersion: '0.0.1',
        releaseType: 'preminor',
        preid: 'beta',
        suffix: undefined,
      })

      expect(result).toBe('0.1.0-beta.0')
    })
  })

  describe('When bumping with different preids', () => {
    it('Then changes preid from alpha to beta with prerelease', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-alpha.0',
        releaseType: 'prerelease',
        preid: 'beta',
        suffix: undefined,
      })

      expect(result).toBe('1.0.0-beta.0')
    })

    it('Then changes preid from beta to rc with prerelease', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-beta.3',
        releaseType: 'prerelease',
        preid: 'rc',
        suffix: undefined,
      })

      expect(result).toBe('1.0.0-rc.0')
    })

    it('Then changes preid from rc to alpha with prerelease', () => {
      const result = () => bumpPackageVersion({
        currentVersion: '2.0.0-rc.1',
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toThrowError('Unable to bump version "2.0.0-rc.1" to "2.0.0-alpha.0", new version is not greater than current version')
    })
  })

  describe('When suffix is ignored for stable releases', () => {
    it('Then ignores suffix for patch release', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'patch',
        preid: undefined,
        suffix: '1234',
      })

      expect(result).toBe('1.0.1')
    })

    it('Then ignores suffix for minor release', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'minor',
        preid: undefined,
        suffix: 'abc',
      })

      expect(result).toBe('1.1.0')
    })

    it('Then ignores suffix for major release', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'major',
        preid: undefined,
        suffix: 'xyz',
      })

      expect(result).toBe('2.0.0')
    })
  })

  describe('When encountering invalid scenarios', () => {
    it('Then throws error when downgrading preid from beta to alpha', () => {
      const result = () => bumpPackageVersion({
        currentVersion: '1.0.0-beta.0',
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toThrowError('Unable to bump version "1.0.0-beta.0" to "1.0.0-alpha.0", new version is not greater than current version')
    })

    it('Then throws error when downgrading preid from rc to beta', () => {
      const result = () => bumpPackageVersion({
        currentVersion: '1.0.0-rc.5',
        releaseType: 'prerelease',
        preid: 'beta',
        suffix: undefined,
      })

      expect(result).toThrowError('Unable to bump version "1.0.0-rc.5" to "1.0.0-beta.0", new version is not greater than current version')
    })

    it('Then throws error when downgrading preid from rc to alpha', () => {
      const result = () => bumpPackageVersion({
        currentVersion: '2.0.0-rc.0',
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toThrowError('Unable to bump version "2.0.0-rc.0" to "2.0.0-alpha.0", new version is not greater than current version')
    })
  })

  describe('When bumping complex prerelease scenarios', () => {
    it('Then bumps from stable to prepatch then prerelease', () => {
      const firstBump = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'prepatch',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(firstBump).toBe('1.0.1-alpha.0')

      const secondBump = bumpPackageVersion({
        currentVersion: firstBump,
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(secondBump).toBe('1.0.1-alpha.1')
    })

    it('Then bumps from preminor to prerelease multiple times', () => {
      const firstBump = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'preminor',
        preid: 'beta',
        suffix: undefined,
      })

      expect(firstBump).toBe('1.1.0-beta.0')

      const secondBump = bumpPackageVersion({
        currentVersion: firstBump,
        releaseType: 'prerelease',
        preid: 'beta',
        suffix: undefined,
      })

      expect(secondBump).toBe('1.1.0-beta.1')

      const thirdBump = bumpPackageVersion({
        currentVersion: secondBump,
        releaseType: 'prerelease',
        preid: 'beta',
        suffix: undefined,
      })

      expect(thirdBump).toBe('1.1.0-beta.2')
    })

    it('Then bumps with suffix then without suffix', () => {
      const firstBump = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'prepatch',
        preid: 'alpha',
        suffix: 'build1',
      })

      expect(firstBump).toBe('1.0.1-alpha.build1')

      const secondBump = () => bumpPackageVersion({
        currentVersion: firstBump,
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(secondBump).toThrowError('Unable to bump version "1.0.1-alpha.build1" to "1.0.1-alpha.0", new version is not greater than current version')

      const thirdBump = bumpPackageVersion({
        currentVersion: firstBump,
        releaseType: 'prerelease',
        preid: 'beta',
        suffix: undefined,
      })

      expect(thirdBump).toBe('1.0.1-beta.0')
    })
  })

  describe('When graduating from prerelease to stable', () => {
    it('Then graduates alpha prerelease to patch', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.2.3-alpha.5',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.2.3')
    })

    it('Then graduates beta prerelease to minor', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.2.3-beta.2',
        releaseType: 'minor',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.3.0')
    })

    it('Then graduates rc prerelease to major', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.2.3-rc.1',
        releaseType: 'major',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('2.0.0')
    })

    it('Then graduates prepatch prerelease directly', () => {
      const result = bumpPackageVersion({
        currentVersion: '2.0.1-alpha.0',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('2.0.1')
    })

    it('Then graduates preminor prerelease directly', () => {
      const result = bumpPackageVersion({
        currentVersion: '2.1.0-beta.0',
        releaseType: 'minor',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('2.1.0')
    })

    it('Then graduates premajor prerelease directly', () => {
      const result = bumpPackageVersion({
        currentVersion: '3.0.0-rc.0',
        releaseType: 'major',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('3.0.0')
    })
  })

  describe('When handling edge cases with versions', () => {
    it('Then bumps high version numbers', () => {
      const result = bumpPackageVersion({
        currentVersion: '99.99.99',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('99.99.100')
    })

    it('Then bumps from high minor to next', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.999.0',
        releaseType: 'minor',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('1.1000.0')
    })

    it('Then bumps version with multiple digit numbers', () => {
      const result = bumpPackageVersion({
        currentVersion: '10.20.30',
        releaseType: 'patch',
        preid: undefined,
        suffix: undefined,
      })

      expect(result).toBe('10.20.31')
    })

    it('Then bumps prerelease with high number', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-alpha.99',
        releaseType: 'prerelease',
        preid: 'alpha',
        suffix: undefined,
      })

      expect(result).toBe('1.0.0-alpha.100')
    })
  })

  describe('When using different preid values', () => {
    it('Then creates prepatch with custom preid', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'prepatch',
        preid: 'snapshot',
        suffix: undefined,
      })

      expect(result).toBe('1.0.1-snapshot.0')
    })

    it('Then creates preminor with custom preid', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'preminor',
        preid: 'dev',
        suffix: undefined,
      })

      expect(result).toBe('1.1.0-dev.0')
    })

    it('Then creates premajor with custom preid', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0',
        releaseType: 'premajor',
        preid: 'next',
        suffix: undefined,
      })

      expect(result).toBe('2.0.0-next.0')
    })

    it('Then bumps prerelease with custom preid', () => {
      const result = bumpPackageVersion({
        currentVersion: '1.0.0-canary.0',
        releaseType: 'prerelease',
        preid: 'canary',
        suffix: undefined,
      })

      expect(result).toBe('1.0.0-canary.1')
    })
  })
})

describe('Given determineReleaseType function', () => {
  describe('When type is release with stable version', () => {
    it('Then auto-detects minor from feat commits', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toBe('minor')
    })

    it('Then auto-detects patch from fix commits', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('patch')
    })

    it('Then auto-detects minor from mixed feat and fix commits', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [
          createMockCommit('feat', 'add feature'),
          createMockCommit('fix', 'fix bug'),
        ],
        config,
        force: false,
      })

      expect(result).toBe('minor')
    })

    it('Then returns null when no commits and force is false', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toBeNull()
    })

    it('Then returns null when commits undefined and force is false', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: undefined,
        config,
        force: false,
      })

      expect(result).toBeNull()
    })

    it('Then returns release when force is true with no commits', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('release')
    })

    it('Then returns release when force is true with commits', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: true,
      })

      expect(result).toBe('release')
    })
  })

  describe('When type is release with prerelease version', () => {
    it('Then returns release when version is prerelease', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-alpha.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toBe('release')
    })

    it('Then returns release when version is prerelease with no commits', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-beta.5',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toBe('release')
    })
  })

  describe('When type is release with preid', () => {
    it('Then throws error when preid is provided', () => {
      const config = createMockConfig({ type: 'release', preid: 'alpha' })
      const result = () => determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toThrowError('You cannot use a "release" type with a "preid", to use a preid you must use a "prerelease" type')
    })

    it('Then throws error when preid is provided with prerelease version', () => {
      const config = createMockConfig({ type: 'release', preid: 'beta' })
      const result = () => determineReleaseType({
        currentVersion: '1.0.0-alpha.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toThrowError('You cannot use a "release" type with a "preid", to use a preid you must use a "prerelease" type')
    })

    it('Then throws error when preid is provided with force', () => {
      const config = createMockConfig({ type: 'release', preid: 'rc' })
      const result = () => determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toThrowError('You cannot use a "release" type with a "preid", to use a preid you must use a "prerelease" type')
    })
  })

  describe('When type is prerelease with stable version', () => {
    it('Then auto-detects preminor from feat commits', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      // 1.0.1-alpha
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })
      // 1.1.0-alpha

      expect(result).toBe('preminor')
    })

    it('Then auto-detects prepatch from fix commits', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'beta' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('prepatch')
    })

    it('Then returns null when no commits and force is false', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toBeNull()
    })

    it('Then returns prerelease when force is true', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'rc' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('prerelease')
    })
  })

  describe('When type is prerelease with prerelease version same preid', () => {
    it('Then returns prerelease with same preid', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-alpha.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toBe('prerelease')
    })

    it('Then returns prerelease with same preid and fix commits', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'beta' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-beta.5',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('prerelease')
    })

    it('Then returns prerelease with same preid and no commits when force', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'rc' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-rc.2',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('prerelease')
    })

    it('Then returns null with same preid and no commits without force', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-alpha.3',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toBeNull()
    })
  })

  describe('When type is prerelease with prerelease version different preid upgrading', () => {
    it('Then returns preminor when changing from alpha to beta with feat', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'beta' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-alpha.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toBe('preminor')
    })

    it('Then returns prepatch when changing from alpha to beta with fix', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'beta' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-alpha.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('prepatch')
    })

    it('Then returns prepatch when changing from beta to rc with no commits detected', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'rc' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-beta.5',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('chore', 'update deps')],
        config,
        force: false,
      })

      expect(result).toBe('prepatch')
    })

    it('Then returns prerelease when changing preid with force', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'rc' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-beta.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('prerelease')
    })
  })

  describe('When type is prerelease with prerelease version different preid downgrading', () => {
    it('Then throws error when downgrading from beta to alpha', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      const result = () => determineReleaseType({
        currentVersion: '1.0.0-beta.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toThrowError('Unable to graduate from 1.0.0-beta.0 to 1.0.0-alpha.0, it\'s not a valid prerelease')
    })

    it('Then throws error when downgrading from rc to beta', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'beta' })
      const result = () => determineReleaseType({
        currentVersion: '1.0.0-rc.3',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toThrowError('Unable to graduate from 1.0.0-rc.3 to 1.0.0-beta.0, it\'s not a valid prerelease')
    })

    it('Then throws error when downgrading from rc to alpha', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      const result = () => determineReleaseType({
        currentVersion: '2.0.0-rc.1',
        from: 'v2.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toThrowError('Unable to graduate from 2.0.0-rc.1 to 2.0.0-alpha.0, it\'s not a valid prerelease')
    })

    it('Then throws error when downgrading with force', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      const result = () => determineReleaseType({
        currentVersion: '1.0.0-beta.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toThrowError('Unable to graduate from 1.0.0-beta.0 to 1.0.0-alpha.0, it\'s not a valid prerelease')
    })
  })

  describe('When type is explicit stable release type', () => {
    it('Then returns patch regardless of commits', () => {
      const config = createMockConfig({ type: 'patch' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toBe('patch')
    })

    it('Then returns minor regardless of commits', () => {
      const config = createMockConfig({ type: 'minor' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('minor')
    })

    it('Then returns major regardless of commits', () => {
      const config = createMockConfig({ type: 'major' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('major')
    })

    it('Then returns patch with no commits', () => {
      const config = createMockConfig({ type: 'patch' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toBe('patch')
    })

    it('Then returns minor when force is true', () => {
      const config = createMockConfig({ type: 'minor' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('minor')
    })
  })

  describe('When type is explicit prerelease type', () => {
    it('Then returns prepatch regardless of commits', () => {
      const config = createMockConfig({ type: 'prepatch', preid: 'alpha' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toBe('prepatch')
    })

    it('Then returns preminor regardless of commits', () => {
      const config = createMockConfig({ type: 'preminor', preid: 'beta' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('preminor')
    })

    it('Then returns premajor regardless of commits', () => {
      const config = createMockConfig({ type: 'premajor', preid: 'rc' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('chore', 'update')],
        config,
        force: false,
      })

      expect(result).toBe('premajor')
    })

    it('Then returns prepatch with no commits', () => {
      const config = createMockConfig({ type: 'prepatch', preid: 'alpha' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toBe('prepatch')
    })

    it('Then returns preminor when force is true', () => {
      const config = createMockConfig({ type: 'preminor', preid: 'beta' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('preminor')
    })
  })

  describe('When graduating from prerelease to stable', () => {
    it('Then returns patch when graduating from prerelease', () => {
      const config = createMockConfig({ type: 'patch' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-alpha.5',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'add feature')],
        config,
        force: false,
      })

      expect(result).toBe('patch')
    })

    it('Then returns minor when graduating from prerelease', () => {
      const config = createMockConfig({ type: 'minor' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-beta.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('minor')
    })

    it('Then returns major when graduating from prerelease', () => {
      const config = createMockConfig({ type: 'major' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-rc.2',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: false,
      })

      expect(result).toBe('major')
    })

    it('Then returns patch with force when graduating', () => {
      const config = createMockConfig({ type: 'patch' })
      const result = determineReleaseType({
        currentVersion: '2.0.0-alpha.1',
        from: 'v2.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('patch')
    })
  })

  describe('When force flag overrides behavior', () => {
    it('Then overrides release type detection with force', () => {
      const config = createMockConfig({ type: 'patch' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'major feature')],
        config,
        force: true,
      })

      expect(result).toBe('patch')
    })

    it('Then returns configured type when force with no commits', () => {
      const config = createMockConfig({ type: 'minor' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('minor')
    })

    it('Then overrides null result with force', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('release')
    })

    it('Then returns prerelease with force and no commits', () => {
      const config = createMockConfig({ type: 'prerelease', preid: 'alpha' })
      const result = determineReleaseType({
        currentVersion: '1.0.0-alpha.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [],
        config,
        force: true,
      })

      expect(result).toBe('prerelease')
    })
  })

  describe('When handling edge cases', () => {
    it('Then handles version 0.0.0 with release type', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '0.0.0',
        from: 'v0.0.0',
        to: 'HEAD',
        commits: [createMockCommit('feat', 'initial feature')],
        config,
        force: false,
      })

      expect(result).toBe('minor')
    })

    it('Then handles high version numbers', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '99.99.99',
        from: 'v99.99.99',
        to: 'HEAD',
        commits: [createMockCommit('fix', 'fix bug')],
        config,
        force: false,
      })

      expect(result).toBe('patch')
    })

    it('Then handles commits with no conventional type', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('chore', 'update deps')],
        config,
        force: false,
      })

      expect(result).toBeNull()
    })

    it('Then handles multiple commit types', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [
          createMockCommit('chore', 'update deps'),
          createMockCommit('docs', 'update docs'),
          createMockCommit('fix', 'fix bug'),
        ],
        config,
        force: false,
      })

      expect(result).toBe('patch')
    })

    it('Then handles empty commit messages', () => {
      const config = createMockConfig({ type: 'release' })
      const result = determineReleaseType({
        currentVersion: '1.0.0',
        from: 'v1.0.0',
        to: 'HEAD',
        commits: [createMockCommit('', '')],
        config,
        force: false,
      })

      expect(result).toBeNull()
    })
  })
})
