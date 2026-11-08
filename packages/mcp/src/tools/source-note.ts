import type { Knowledge } from '../knowledge/load'

/**
 * One line to append to a page that comes from the docs bundled with @maz-ui/mcp when the project does not install
 * the package, or installs another version than the documented one.
 */
export function sourceNote(knowledge: Knowledge, docId: string): string | undefined {
  const loaded = knowledge.fragmentOf(docId)

  if (loaded?.source.kind !== 'bundled')
    return undefined

  const name = loaded.fragment.package
  const { installedVersion } = loaded.source

  if (!installedVersion)
    return `Note: ${name} is not installed in the project: this page documents ${name} ${loaded.version} (bundled with @maz-ui/mcp).`

  return installedVersion === loaded.version
    ? undefined
    : `Note: the project uses ${name} ${installedVersion}, this page documents ${name} ${loaded.version} (bundled with @maz-ui/mcp): double check APIs that may differ.`
}
