import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

export function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Writes a temporary file then renames it: a concurrent reader (several Nuxt
 * apps of a monorepo starting together) sees the old or the new file, never a
 * truncated one.
 */
export function writeFileAtomic(path: string, content: string): void {
  const temporary = join(dirname(path), `.${basename(path)}.${process.pid}.${Date.now()}.tmp`)

  mkdirSync(dirname(path), { recursive: true })

  try {
    writeFileSync(temporary, content)
    renameSync(temporary, path)
  }
  catch (error) {
    rmSync(temporary, { force: true })
    throw error
  }
}

function parseVersion(version: string): { core: number[], prerelease: string[] } {
  const [core, ...prerelease] = version.replace(/^v/, '').split('+')[0].split('-')

  return {
    core: core.split('.').map(part => Number.parseInt(part, 10) || 0),
    prerelease: prerelease.join('-').split('.').filter(Boolean),
  }
}

/** Semver order of prerelease identifiers: numeric ones are compared as numbers and come before the others */
function comparePrereleaseIdentifiers(a: string, b: string): number {
  const isNumeric = (value: string): boolean => /^\d+$/.test(value)

  if (isNumeric(a) !== isNumeric(b)) {
    return isNumeric(a)
      ? -1
      : 1
  }

  return isNumeric(a)
    ? Number(a) - Number(b)
    : a.localeCompare(b)
}

/** Compares two semver versions: negative when `a < b`, positive when `a > b`, `0` when equal */
export function compareVersions(a: string, b: string): number {
  const left = parseVersion(a)
  const right = parseVersion(b)

  for (let index = 0; index < 3; index++) {
    const difference = (left.core[index] ?? 0) - (right.core[index] ?? 0)

    if (difference !== 0)
      return difference
  }

  if (left.prerelease.length === 0 || right.prerelease.length === 0)
    return right.prerelease.length - left.prerelease.length

  for (let index = 0; index < Math.min(left.prerelease.length, right.prerelease.length); index++) {
    const difference = comparePrereleaseIdentifiers(left.prerelease[index], right.prerelease[index])

    if (difference !== 0)
      return difference
  }

  return left.prerelease.length - right.prerelease.length
}
