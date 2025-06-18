---
title: MazDropzone
description: MazDropzone is a powerful and flexible file upload component with drag & drop support, progress tracking, and customizable UI. Perfect for handling single or multiple file uploads in your Vue applications.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/translated-component.md-->

## Key Features

- 🎯 Drag & drop support
- 📁 Single or multiple file uploads
- 🖼️ Image preview thumbnails
- 🚀 Auto upload support
- ⚡ Async file processing
- 🎨 Fully customizable UI
- 🌐 Support for various file types
- ⚙️ Extensive configuration options
- 🔒 File validation (size, type, count)
- 🌍 Internationalization support

## Error codes

| Error Code                   | Description                              | Trigger                                                                                  |
| ---------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `FILE_SIZE_EXCEEDED`         | File size exceeds the allowed limit      | When a file is larger than `maxFileSize` (in MB)                                         |
| `FILE_SIZE_TOO_SMALL`        | File size is below the minimum limit     | When a file is smaller than `minFileSize` (in MB)                                        |
| `MAX_FILES_EXCEEDED`         | Maximum number of allowed files exceeded | When trying to add more files than `maxFiles` or more than 1 file if `multiple=false`    |
| `FILE_TYPE_NOT_ALLOWED`      | File type is not allowed                 | When the file's MIME type doesn't match the specified `dataTypes`                        |
| `FILE_DUPLICATED`            | An identical file already exists         | When `allowDuplicates=false` and a file with the same name, size and type already exists |
| `NO_FILES_TO_UPLOAD`         | No files to upload                       | When starting upload but there are no files in the dropzone                              |
| `FILE_UPLOAD_ERROR`          | Error during individual file upload      | When uploading a specific file fails (`single` mode)                                     |
| `FILE_UPLOAD_ERROR_MULTIPLE` | Error during batch upload                | When uploading multiple files fails (`multiple` mode)                                    |
| `NO_URL`                     | No upload URL configured                 | When attempting auto-upload without defining the `url` prop                              |

### Error handling example

::: details View code

```vue
<script setup>
function handleError({ code, files }) {
  switch (code) {
    case 'FILE_SIZE_EXCEEDED':
      console.log('File too large:', files[0].name)
      break
    case 'FILE_TYPE_NOT_ALLOWED':
      console.log('File type not allowed:', files[0].type)
      break
    case 'MAX_FILES_EXCEEDED':
      console.log('Too many files selected')
      break
      // ...
  }
}
</script>

<template>
  <MazDropzone
    :max-file-size="5"
    :max-files="3"
    :data-types="['image/*', 'application/pdf']"
    :allow-duplicates="false"
    @error="handleError"
  />
</template>
```

:::

## Basic Usage

<ComponentDemo expanded>
  <MazDropzone
    ref="dropzone"
    v-model="files"
    :max-file-size="3"
    :max-files="5"
    @upload-success="onUploadSuccess"
    @upload-error="onUploadError"
    @error="onError"
    url="https://httpbin.org/post"
    :request-options="{
      headers: { 'My-Awesome-Header': 'header value' },
    }"
  />

  <br />
  <div class="maz-text-center">
    <MazBtn @click="dropzone?.uploadFiles()" :loading="dropzone?.isUploading">
      Upload Files
    </MazBtn>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { useToast } from 'maz-ui'
import { ref } from 'vue'

const toast = useToast()

const files = ref<File[]>([])
const dropzone = ref<InstanceType<typeof MazDropzone>>()

function onUploadSuccess({ file, response }) {
  console.log('Upload success:', file, response)
  toast.success(`File ${file.name} uploaded successfully`)
}

function onUploadError({ file, code, error }) {
  console.error('Upload failed:', file, code, error)
  toast.error(`File ${file.name} upload failed: ${code} - ${error}`)
}

function onError({ files, event, code }) {
  console.error('Error:', files, event, code)
  toast.error(`${files?.length} files upload failed: ${code} - ${files?.map(file => file.name).join(', ')}`)
}
</script>

<template>
  <MazDropzone
    v-model="files"
    :data-types="['image/*']"
    :max-file-size="3"
    :max-files="5"
    url="https://httpbin.org/post"
    :request-options="{
      headers: { 'My-Awesome-Header': 'header value' },
    }"
    @upload-success="onUploadSuccess"
    @upload-error="onUploadError"
    @error="onError"
  />

  <MazBtn :loading="dropzone?.isUploading" @click="dropzone?.uploadFiles()">
    Upload Files
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## File Type Restrictions

You can restrict allowed file types using the `data-types` prop:

<ComponentDemo>
  <MazDropzone
    v-model="files"
    :data-types="['image/jpeg', 'image/png']"
    :max-file-size="5"
    @error="onError"
  />

<template #code>

```html
<MazDropzone v-model="files" :data-types="['image/jpeg', 'image/png']" :max-file-size="5" @error="onError" />
```

  </template>
</ComponentDemo>

## Auto Upload

Enable automatic file upload using the `auto-upload` prop. Files can be uploaded individually (`single`) in separate requests or all at once (`multiple`) in a single request:

<ComponentDemo>
  <MazDropzone
    v-model="files"
    auto-upload="single"
    url="https://your-upload-endpoint.com/upload"
    @upload-success="onUploadSuccess"
    @upload-error="onUploadError"
    @error="onError"
  />

<template #code>

```html
<MazDropzone
  v-model="files"
  auto-upload="single"
  url="https://your-upload-endpoint.com/upload"
  @upload-success="onUploadSuccess"
  @upload-error="onUploadError"
  @error="onError"
/>
```

  </template>
</ComponentDemo>

You can also upload all files at once using `multiple`:

::: tip
Multiple upload is allowed:

- when `max-files` is greater than 1
- when `auto-upload` is set to `multiple`
- when `multiple` prop is set to `true`

[Link to the source code](https://github.com/maz-ui/maz-ui/blob/main/components/MazDropzone.vue#L219)
:::

<ComponentDemo>
  <MazDropzone
    v-model="files"
    auto-upload="multiple"
    url="https://your-upload-endpoint.com/upload"
    @upload-success-multiple="onUploadSuccessMultiple"
    @upload-error-multiple="onUploadErrorMultiple"
    @error="onError"
  />

<template #code>

```html
<template>
  <MazDropzone
    v-model="files"
    auto-upload="multiple"
    url="https://your-upload-endpoint.com/upload"
    @upload-success-multiple="onUploadSuccessMultiple"
    @upload-error-multiple="onUploadErrorMultiple"
    @error="onError"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useToast } from 'maz-ui'

  const files = ref<File[]>([])

  const toast = useToast()

  const onUploadSuccessMultiple = ({ files, response }) => {
    console.log('Upload multiple success:', files, response)
    toast.success(`${files.length} files uploaded successfully`)
  }

  const onUploadErrorMultiple = ({ files, code, error }) => {
    console.error('Upload mulitple failed:', files, code, error)
    toast.error(`${files.length} files upload failed: ${code} - ${error}`)
  }
</script>
```

  </template>
</ComponentDemo>

## Custom Upload Area

Customize the upload area using slots:

<ComponentDemo>
  <MazDropzone v-model="files" @error="onError">
    <template #no-files-area="{ handleFileInputClick }">
      <div class="maz-flex maz-flex-col maz-items-center maz-gap-4">
        <MazIcon name="arrow-up-on-square" class="maz-text-4xl" />
        <p>Drop your files here or click to browse</p>
        <MazBtn @click="handleFileInputClick">
          Select Files
        </MazBtn>
      </div>
    </template>
  </MazDropzone>

<template #code>

```html
<MazDropzone v-model="files" @error="onError">
  <template #no-files-area="{ handleFileInputClick }">
    <div class="maz-flex maz-flex-col maz-items-center maz-gap-4">
      <MazIcon name="arrow-up-on-square" class="maz-text-4xl" />
      <p>Drop your files here or click to browse</p>
      <MazBtn @click="handleFileInputClick"> Select Files </MazBtn>
    </div>
  </template>
</MazDropzone>
```

  </template>
</ComponentDemo>

## Custom Translations

Customize text messages using the `translations` prop:

<ComponentDemo>
  <MazDropzone
    v-model="files"
    :translations="{
      dragAndDrop: 'Drag files here',
      selectFile: 'Browse files',
      fileInfos: 'Accepted files: Images up to 5MB'
    }"
    @error="onError"
  />

<template #code>

```html
<MazDropzone
  v-model="files"
  :translations="{
    dragAndDrop: 'Drag files here',
    selectFile: 'Browse files',
    fileInfos: 'Accepted files: Images up to 5MB'
  }"
  @error="onError"
/>
```

  </template>
</ComponentDemo>

## Custom Upload Request

Customize the upload request using `uploadUrl`, `requestOptions` and `transformBody`:

<ComponentDemo>
  <MazDropzone
    v-model="files"
    url="/api/upload"
    :request-options="{
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token123'
      },
    }"
    :transform-body="(formData, files) => {
      // Add additional data to FormData
      formData.append('userId', '123')
      formData.append('fileCount', files.length.toString())
      return formData
    }"
    @error="onError"
  />

<template #code>

```html
<MazDropzone
  v-model="files"
  url="/api/upload"
  :request-options="{
    method: 'POST',
    headers: {
      'Authorization': 'Bearer token123'
    },
  }"
  :transform-body="(formData, files) => {
    // Add additional data to FormData
    formData.append('userId', '123')
    formData.append('fileCount', files.length.toString())
    return formData
  }"
  @error="onError"
/>
```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-dropzone.doc.md-->

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'maz-ui/src/composables/useToast'

const files = ref<File[]>([])
const dropzone = ref<InstanceType<typeof MazDropzone>>()
const toast = useToast()

const onUploadSuccess = ({ file, response }) => {
  console.log('Upload success:', file, response)
  toast.success(`File ${file.name} uploaded successfully`)
}

const onUploadError = ({ file, code, error }) => {
  console.error('Upload failed:', file, code, error)
  toast.error(`File ${file.name} upload failed: ${code} - ${error}`)
}

const onUploadSuccessMultiple = ({ files, response }) => {
  console.log('Upload multiple success:', files, response)
  toast.success(`${files.length} files uploaded successfully`)
}

const onUploadErrorMultiple = ({ files, code, error }) => {
  console.error('Upload multiple failed:', files, code, error)
  toast.error(`${files.length} files upload failed: ${code} - ${error}`)
}

const onError = ({ files, event, code }) => {
  console.error('Error:', files, event, code)
  toast.error(`${files?.length} files upload failed: ${code} - ${files?.map(file => file.name).join(', ')}`)
}
</script>
