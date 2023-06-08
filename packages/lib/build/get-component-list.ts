import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const INPUT_COMPONENT_DIR = resolve(__dirname, './../components')

export const getComponentList = async () => {
  try {
    const fileList = await readdir(INPUT_COMPONENT_DIR)
    return fileList
      .filter((name) => name.startsWith('Maz') && name.endsWith('.vue'))
      .map((name) => ({
        name: name.split('.')[0],
        fullName: `${name}`,
        path: `${INPUT_COMPONENT_DIR}/${name}`,
      }))
  } catch (error) {
    throw new Error(
      `[get-component-list] 🔴 Error occurred while generating components entry file ${error}`,
    )
  }
}
