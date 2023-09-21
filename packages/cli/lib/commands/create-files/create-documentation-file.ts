import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'

export async function createDocumentFile({
  filename,
  filenameKebab,
}: {
  filename: string
  filenameKebab: string
}): Promise<void> {
  const DOCS_FILE_OUTPUT = resolve(
    __dirname,
    `../../../../docs/docs/components/${filenameKebab}.md`,
  )

  const documentationFileTemplate = `---
title: ${filename}
description: ${filename} is a standalone component
---

<!-- markdownlint-disable MD033 -->

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<${filename} />

\`\`\`vue
<template>
  <${filename} />
</template>

<script lang="ts" setup>
  import ${filename} from 'maz-ui/components/${filename}'
</script>
\`\`\`

<!--@include: ./../.vitepress/generated-docs/${filenameKebab}.doc.md-->
`
  try {
    await writeFile(DOCS_FILE_OUTPUT, documentationFileTemplate)
  } catch (error) {
    console.error(`Error: Failed to create file "${filename}".`, error)
    exit(1)
  }
}
