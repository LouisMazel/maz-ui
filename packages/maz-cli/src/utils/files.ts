import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export function directoryExists(filePath: string) {
  return existsSync(filePath)
}
export function getOutDirectoryPath(outDirectory: string) {
  return resolve(process.cwd(), outDirectory)
}
export function getCurrentDirectoryPath() {
  return resolve(process.cwd())
}
