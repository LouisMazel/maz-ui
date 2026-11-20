---
title: useDropzone
description: Headless composable to turn any element into a drop area for files - drag state, accepted types, single or multiple files and drop errors - for a custom upload zone when MazDropzone does not fit.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
For a ready-made upload zone (file list, previews, upload, validation messages), use [MazDropzone](../components/maz-dropzone). `useDropzone` is the logic behind it.
:::

## Usage

<div
  ref="dropzone"
  class="vp-raw maz:flex maz:flex-col maz:items-center maz:justify-center maz:gap-2 maz:rounded-md maz:border-2 maz:border-dashed maz:p-8 maz:text-center maz:transition-colors"
  :class="isOverError ? 'maz:border-destructive maz:bg-destructive-50' : isOverDropZone ? 'maz:border-primary maz:bg-primary-50' : 'maz:border-divider'"
>
  <span v-if="isOverError">Only images are accepted</span>
  <span v-else-if="isOverDropZone">Drop the images here</span>
  <span v-else>Drag and drop images here</span>
  <ul v-if="files?.length" class="maz:text-muted">
    <li v-for="file in files" :key="file.name">{{ file.name }} ({{ file.type }})</li>
  </ul>
</div>

```vue
<script lang="ts" setup>
import { useDropzone } from 'maz-ui/composables/useDropzone'
import { useTemplateRef } from 'vue'

const dropzone = useTemplateRef('dropzone')

const { files, isOverDropZone, isOverError } = useDropzone(dropzone, {
  dataTypes: ['image/'],
  onDrop: (droppedFiles) => {
    console.log(droppedFiles)
  },
})
</script>

<template>
  <div
    ref="dropzone"
    class="flex flex-col items-center gap-2 rounded-md border-2 border-dashed p-8"
    :class="isOverError ? 'border-destructive bg-destructive-50' : isOverDropZone ? 'border-primary bg-primary-50' : 'border-divider'"
  >
    <span v-if="isOverError">Only images are accepted</span>
    <span v-else-if="isOverDropZone">Drop the images here</span>
    <span v-else>Drag and drop images here</span>

    <ul v-if="files?.length" class="text-muted">
      <li v-for="file in files" :key="file.name">
        {{ file.name }}
      </li>
    </ul>
  </div>
</template>
```

<script lang="ts" setup>
  import { useDropzone } from 'maz-ui/composables/useDropzone'
  import { useTemplateRef } from 'vue'

  const dropzone = useTemplateRef('dropzone')

  const { files, isOverDropZone, isOverError } = useDropzone(dropzone, {
    dataTypes: ['image/'],
  })
</script>

The second argument can also be the `onDrop` callback alone: `useDropzone(target, files => upload(files))`.

## Accepted types

`dataTypes` filters the dragged files by MIME type: a file is accepted when its type contains one of the values (`'image/'` accepts every image, `'application/pdf'` only PDFs). Without `dataTypes`, every file is accepted.

- While dragging, `isOverError` is `true` when a file is not accepted (or when several files are dragged with `multiple: false`).
- On drop, `onDrop` runs with the files when they are accepted, `onError` otherwise: `files` only changes on a valid drop.
- Values starting with a dot (`'.pdf'`) are ignored: the browser does not give the file names while dragging.
- `dataTypes` can be a ref, or a function that receives the MIME types and returns whether they are accepted.

```ts
useDropzone(target, {
  dataTypes: types => types.every(type => type.startsWith('image/') || type === 'application/pdf'),
  onError: () => toast.error('Images and PDF only'),
})
```

## Lifecycle

The listeners follow the target: they move when the ref points to another element, and are removed when the component is unmounted. Nothing runs on the server.

## Options

| Option                       | Type                                                          | Default | Description                                                          |
| ---------------------------- | ------------------------------------------------------------- | ------- | -------------------------------------------------------------------- |
| `dataTypes`                  | `MaybeRef<string[]> \| ((types: readonly string[]) => boolean)` | all     | Accepted MIME types, or a function to check them                     |
| `multiple`                   | `boolean`                                                     | `true`  | Accept several files. With `false`, only the first file is kept      |
| `onDrop`                     | `(files: File[] \| null, event: DragEvent) => unknown`        | -       | Files dropped and accepted                                           |
| `onError`                    | `(files: File[] \| null, event: DragEvent) => unknown`        | -       | Files dropped but not accepted                                       |
| `onEnter`                    | `(files: null, event: DragEvent) => unknown`                  | -       | The drag enters the target                                           |
| `onOver`                     | `(files: null, event: DragEvent) => unknown`                  | -       | The drag moves over the target                                       |
| `onLeave`                    | `(files: null, event: DragEvent) => unknown`                  | -       | The drag leaves the target                                           |
| `preventDefaultForUnhandled` | `boolean`                                                     | `false` | Also call `preventDefault()` before the files are checked            |

## Return

| Property         | Type                     | Description                                                 |
| ---------------- | ------------------------ | ----------------------------------------------------------- |
| `files`          | `Ref<File[] \| null>`    | The files of the last valid drop, `null` before any drop    |
| `isOverDropZone` | `Ref<boolean>`           | Files are dragged over the target                           |
| `isOverError`    | `Ref<boolean>`           | The dragged files are not accepted                          |

## Types

```ts
function useDropzone(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options?: UseDropzoneOptions | UseDropzoneOptions['onDrop'],
): UseDropzoneReturn
```

`UseDropzoneOptions` and `UseDropzoneReturn` are exported by `maz-ui/composables/useDropzone`.
