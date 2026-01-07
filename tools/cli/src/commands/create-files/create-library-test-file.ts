import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'
import { logger } from '@maz-ui/node'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createLibraryTestFile({
  filename,
}: {
  filename: string
}): Promise<void> {
  const testComponentTemplate = `import { shallowMount, type VueWrapper } from '@vue/test-utils'
import ${filename} from '@components/${filename}.vue'

describe('${filename}', () => {
  let wrapper: VueWrapper<InstanceType<typeof ${filename}>>

  beforeEach(() => {
    wrapper = shallowMount(${filename})
  })
})
`

  try {
    const TEST_FILE_OUTPUT = resolve(
      _dirname,
      `../../../../../packages/lib/tests/specs/components/${filename}.spec.ts`,
    )

    await writeFile(TEST_FILE_OUTPUT, testComponentTemplate)
  }
  catch (error) {
    logger.error(`Error: Failed to create file "${filename}".`, error)
    exit(1)
  }
}
