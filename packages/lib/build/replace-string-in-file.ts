import { replaceInFile } from 'replace-in-file'

export function replaceStringInFile({
  filePath,
  search,
  replaceBy,
}: {
  filePath: string
  search: string
  replaceBy: string
}) {
  return replaceInFile({
    files: filePath,
    from: new RegExp(search, 'g'),
    to: replaceBy,
  })
}
