import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

export function directoryExists(filePath: string) {
  return existsSync(filePath)
}
export function getOutDirectoryPath(outDirectory: string) {
  return resolve(process.cwd(), outDirectory)
}
export function getCurrentDirectoryPath() {
  return resolve(process.cwd())
}
