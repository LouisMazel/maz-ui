import { readdirSync } from 'node:fs'

/** File names (`MazBtn.vue`) of the public components: the cheap counterpart of `collectComponentApis` */
export function listComponentFiles(componentsDir: string): string[] {
  return readdirSync(componentsDir)
    .filter(file => /^[A-Z]\w*\.vue$/.test(file))
    .sort()
}
