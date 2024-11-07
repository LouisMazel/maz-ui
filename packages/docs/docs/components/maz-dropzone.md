---
title: MazDropzone
description: MazDropzone is a standalone component to help a user upload different type of files with a beautiful design system. It works with dropzone.js and is not SSR compatible with Nuxt.JS
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

To use this component, you have to install the `dropzone` dependency

<NpmBadge package="dropzone" dist-tag="5" />

```bash
npm install dropzone@^5.9.3
```

## Basic usage

<MazDropzone
  ref="mazDropzoneInstance"
  :options="dropzoneOptions"
  @error="error"
  @success="success"
  @sending="loading = true"
  @complete="loading = false"
  style="margin-bottom: 20px;"
/>

<p v-if="errorMessage" style="color: red; text-align: center; margin: 20px 0;">
  {{ errorMessage }}
</p>

<div class="flex flex-center">
  <MazBtn left-icon="arrow-up-tray" :loading="loading" @click="sendFiles">
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

  <MazBtn left-icon="arrow-up-tray" :loading="loading" @click="sendFiles">
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
    dictInvalidFileType: `File type not supported`,
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

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import ComponentPropDoc from './../.vitepress/theme/components/ComponentPropDoc.vue'

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
    dictInvalidFileType: `File type not supported`,
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

## Props, Events emitted & Methods

<ComponentPropDoc
  component="MazDropzone"
  :component-instance="mazDropzoneInstance"
  :methods="[
    { name: 'setOption' },
    { name: 'manuallyAddFile' },
    { name: 'removeAllFiles' },
    { name: 'processQueue' },
    { name: 'destroy' },
    { name: 'disable' },
    { name: 'enable' },
    { name: 'accept' },
    { name: 'addFile' },
    { name: 'resizeImage' },
    { name: 'cancelUpload' },
    { name: 'getAcceptedFiles' },
    { name: 'getRejectedFiles' },
    { name: 'getFilesWithStatus' },
    { name: 'getQueuedFiles' },
    { name: 'getUploadingFiles' },
    { name: 'getAddedFiles' },
    { name: 'getActiveFiles' },
  ]"
/>

<!--@include: ./../.vitepress/generated-docs/maz-dropzone.doc.md-->