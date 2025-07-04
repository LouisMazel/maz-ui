import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))
const INPUT_COMPONENT_DIR = resolve(_dirname, '../../lib/src/components')

export async function getComponentList(inputComponentDir: string = INPUT_COMPONENT_DIR) {
  try {
    const fileList = await readdir(inputComponentDir, { withFileTypes: true })

    const componentList = fileList
      .filter(
        dirent =>
          dirent.isFile()
          && dirent.name.startsWith('Maz')
          && !dirent.name.endsWith('.cjs')
          && !dirent.name.endsWith('.map')
          && !dirent.name.endsWith('.d.ts')
          && !dirent.name.endsWith('.css'),
      )
      .map(({ name }) => ({
        name: name.split('.')[0],
        fullName: `${name}`,
        path: `${inputComponentDir}/${name}`,
      }))

    return componentList
  }
  catch (error) {
    throw new Error(
      `[getComponentList] 🔴 Error occurred while getting component list ${error}`,
    )
  }
}
