import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createLibraryTestFile({
  filename,
  filenameKebab,
}: {
  filename: string
  filenameKebab: string
}): Promise<void> {
  const testComponentTemplate = `import { shallowMount, type VueWrapper } from '@vue/test-utils'
import ${filename} from '@components/${filename}.vue'

describe('${filename}', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = shallowMount(${filename})
  })
})
`

  try {
    const TEST_FILE_OUTPUT = path.resolve(
      _dirname,
      `../../../../lib/tests/specs/components/${filenameKebab}.spec.ts`,
    )

    await writeFile(TEST_FILE_OUTPUT, testComponentTemplate)
  } catch (error) {
    console.error(`Error: Failed to create file "${filename}".`, error)
    exit(1)
  }
}
