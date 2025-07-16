import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'
import { logger } from '@maz-ui/node/index.ts'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createDocumentFile({
  filename,
  filenameKebab,
}: {
  filename: string
  filenameKebab: string
}): Promise<void> {
  const DOCS_FILE_OUTPUT = resolve(_dirname, `../../../../docs/docs/components/${filenameKebab}.md`)

  const documentationFileTemplate = `---
title: ${filename}
description: ${filename} is a standalone component
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <${filename} />

  <template #code>

  \`\`\`vue
  <template>
    <${filename} />
  </template>

  <script lang="ts" setup>
    import ${filename} from 'maz-ui/components/${filename}'
  </script>
  \`\`\`

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/${filenameKebab}.doc.md-->
`
  try {
    await writeFile(DOCS_FILE_OUTPUT, documentationFileTemplate)
  }
  catch (error) {
    logger.error(`Error: Failed to create file "${filename}".`, error)
    exit(1)
  }
}
