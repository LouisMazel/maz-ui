import path from 'node:path'
import { existsSync } from 'node:fs'

export function directoryExists(filePath: string) {
  return existsSync(filePath)
}
export function getOutDirectoryPath(outDirectory: string) {
  return path.resolve(process.cwd(), outDirectory)
}
export function getCurrentDirectoryPath() {
  return path.resolve(process.cwd())
}
