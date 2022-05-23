---
description: MazDropzone is a stand-alone component to help user upload different type of files with a beautiful design system. It works with dropzone.js and is not SSR compatible with Nuxt.JS
---

# MazDropzone

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

To use this component, you have to install the dependency `dropzone`

<NpmBadge package="dropzone" dist-tag="5" />

<CodeGroup>

  <CodeGroupItem title="NPM" active>

```bash
# install in your project
npm install dropzone@5
```
  </CodeGroupItem>

  <CodeGroupItem title="YARN">

```bash
# install in your project
yarn add dropzone@5
```
  </CodeGroupItem>
</CodeGroup>

## Basic usage

<MazDropzone
  ref="mazDropzoneInstance"
  :options="dropzoneOptions"
  @error="error"
  @success="success"
  @sending="loading = true"
  @complete="loading = false"
/>

<p v-if="errorMessage" style="color: red; text-align: center;">
  {{ errorMessage }}
</p>

<div class="flex flex-center">
  <MazBtn left-icon="Upload" :loading="loading" @click="sendFiles">
    Send Files
  </MazBtn>
</div>

> Set `:options="{ autoProcessQueue: true }"` to upload automatically the files (no button needed)

```vue
<template>
  <ClientOnly>
    <MazDropzone
      ref="mazDropzoneInstance"
      :options="dropzoneOptions"
      @error="error"
      @success="success"
      @sending="loading = true"
      @complete="loading = false"
    />
  </ClientOnly>

  <p v-if="errorMessage" style="color: red; text-align: center;">
    {{ errorMessage }}
  </p>

  <MazBtn left-icon="Upload" :loading="loading" @click="sendFiles">
    Send Files
  </MazBtn>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazDropzone, { MazDropzoneInstance, MazDropzoneOptions } from 'maz-ui/components/MazDropzone'
  import MazBtn from 'maz-ui/components/MazBtn'

  const loading = ref(false)
  const mazDropzoneInstance = ref<MazDropzoneInstance>()
  const errorMessage = ref<string>()

  const error = ({ file, message }) => {
    console.log('dropzone-error', { file, message })
    errorMessage.value = message
  }
  const success = ({ file, response }) => {
    console.log('dropzone-success', { file, response })
  }
  const sendFiles = () => mazDropzoneInstance.value?.processQueue()

  const dropzoneOptionsBase: MazDropzoneOptions = {
    url: 'https://httpbin.org/post',
    headers: { 'My-Awesome-Header': 'header value' },
    acceptedFiles: 'image/jpeg,image/jpg,image/png',
    maxFilesize: 5,
    maxFiles: 5,
    maxThumbnailFilesize: 3,
    autoProcessQueue: false,
    autoRemoveOnError: true,
  }

  const translations: MazDropzoneOptions = {
    dictDefaultMessage: 'Choose or drop a file',
    dictFilesDescriptions: `(PNG or JPG under ${dropzoneOptionsBase.maxFilesize} MB)`,
    dictFallbackMessage: 'Your browser is not supported',
    dictFileTooBig: `File(s) too big (max: ${dropzoneOptionsBase.maxFilesize} MB)`,
    dictInvalidFileType: `File(s) too big (max: ${dropzoneOptionsBase.maxFilesize} MB)`,
    dictRemoveFile: 'Remove',
    dictCancelUpload: 'Cancel upload',
    dictMaxFilesExceeded: `You can not upload any more files. (max: ${dropzoneOptionsBase.maxFiles})`,
    dictUploadCanceled: 'Upload canceled',
  }

  const dropzoneOptions: MazDropzoneOptions = {
    ...dropzoneOptionsBase,
    ...translations
  }
</script>
```

## Props, Events emitted & Methods

<ComponentPropDoc component="MazDropzone" :component-instance="mazDropzoneInstance" />

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'

  const loading = ref(false)
  const mazDropzoneInstance = ref<MazDropzoneInstance>()

  const errorMessage = ref<string>()

  const error = ({ file, message }) => {
    console.log('dropzone-error', { file, message })
    errorMessage.value = message
  }
  const success = ({ file, response }) => {
    console.log('dropzone-success', { file, response })
  }
  const sendFiles = () => mazDropzoneInstance.value?.processQueue()

  const dropzoneOptionsBase: MazDropzoneOptions = {
    url: 'https://httpbin.org/post',
    headers: { 'My-Awesome-Header': 'header value' },
    acceptedFiles: 'image/jpeg,image/jpg,image/png',
    maxFilesize: 5,
    maxFiles: 5,
    maxThumbnailFilesize: 3,
    autoProcessQueue: false,
    autoRemoveOnError: true,
  }

  const translations: MazDropzoneOptions = {
    dictDefaultMessage: 'Choose or drop a file',
    dictFilesDescriptions: `(PNG or JPG under ${dropzoneOptionsBase.maxFilesize} MB)`,
    dictFallbackMessage: 'Your browser is not supported',
    dictFileTooBig: `File(s) too big (max: ${dropzoneOptionsBase.maxFilesize} MB)`,
    dictInvalidFileType: `File(s) too big (max: ${dropzoneOptionsBase.maxFilesize} MB)`,
    dictRemoveFile: 'Remove',
    dictCancelUpload: 'Cancel upload',
    dictMaxFilesExceeded: `You can not upload any more files. (max: ${dropzoneOptionsBase.maxFiles})`,
    dictUploadCanceled: 'Upload canceled',
  }

  const dropzoneOptions: MazDropzoneOptions = {
    ...dropzoneOptionsBase,
    ...translations
  }
</script>