import { replaceInFile } from 'replace-in-file'

export function replaceStringInFile({
  files,
  search,
  replaceBy,
}: {
  files: Parameters<typeof replaceInFile>[0]['files']
  search: string
  replaceBy: string
}) {
  return replaceInFile({
    files,
    from: new RegExp(search, 'g'),
    to: replaceBy,
  })
}
