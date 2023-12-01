<template>
  <button
    ref="ButtonElement"
    type="button"
    name="maz-dropzone"
    class="maz-dropzone"
    :style="[dropzoneStyle]"
  >
    <template v-if="dropzoneReady">
      <slot :options="dropzoneOptions">
        <div class="dz-message">
          <slot name="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="2em"
              width="2em"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="maz-dropzone__main-icon maz-text-normal"
              aria-hidden="true"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z"
              />
            </svg>
          </slot>
          <p class="maz-my-2 maz-text-normal">
            {{ dropzoneOptions?.dictDefaultMessage }}
          </p>
          <p class="maz-my-0 maz-text-muted">
            {{ dropzoneOptions?.dictFilesDescriptions }}
          </p>
        </div>
      </slot>
    </template>
    <MazSpinner v-else />
  </button>
</template>

<script lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    type PropType,
    ref,
    defineAsyncComponent,
  } from 'vue'
  import { type DropzoneOptions, type DropzoneFile } from 'dropzone'

  function dropzoneFix<T>(component: T): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (component as any).default ?? component
  }

  const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

  export interface MazDropzoneOptions extends DropzoneOptions {
    dictFilesDescriptions?: string
    autoRemoveOnError?: boolean
  }

  export interface MazDropzoneFile extends DropzoneFile {
    manuallyAdded?: boolean
  }

  export interface IMazDropzone extends Dropzone {
    options: MazDropzoneOptions
  }

  export interface MazDropzoneInstance extends ComponentPublicInstance {
    manuallyAddFile: (file: DropzoneFile, fileUrl: string) => void
    setOption: (option: string, value: unknown) => IMazDropzone['options']
    processQueue: IMazDropzone['processQueue']
    removeFile: IMazDropzone['removeFile']
    removeAllFiles: IMazDropzone['removeAllFiles']
    destroy: IMazDropzone['destroy']
    disable: IMazDropzone['disable']
    enable: IMazDropzone['enable']
    accept: IMazDropzone['accept']
    addFile: IMazDropzone['addFile']
    resizeImage: IMazDropzone['resizeImage']
    cancelUpload: IMazDropzone['cancelUpload']
    getAcceptedFiles: () => MazDropzoneFile[]
    getRejectedFiles: () => MazDropzoneFile[]
    getFilesWithStatus: IMazDropzone['getFilesWithStatus']
    getQueuedFiles: IMazDropzone['getQueuedFiles']
    getUploadingFiles: IMazDropzone['getUploadingFiles']
    getAddedFiles: IMazDropzone['getAddedFiles']
    getActiveFiles: IMazDropzone['getActiveFiles']
  }

  const previewTemplate = `<div class="dz-preview dz-file-preview maz-flex-1">
  <div class="dz-image">
      <div data-dz-thumbnail-bg></div>
  </div>
  <div class="dz-details">
      <div class="dz-filename"><span data-dz-name></span></div>
      <div class="dz-size"><span data-dz-size></span></div>
  </div>
  <div class="dz-progress">
    <span class="dz-upload" data-dz-uploadprogress></span>
  </div>
  <div class="dz-success-mark">
    <svg class="material-icons" xmlns="http://www.w3.org/2000/svg" height="6rem" viewBox="0 0 24 24" width="6rem" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
  </div>
  <div class="dz-error-mark">
    <svg class="material-icons" xmlns="http://www.w3.org/2000/svg" height="6rem" viewBox="0 0 24 24" width="6rem" fill="currentColor"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
  </div>
</div>`

  export default defineComponent({
    name: 'MazDropzone',
    components: { MazSpinner },
    props: {
      options: { type: Object as PropType<MazDropzoneOptions>, required: true },
      height: {
        type: [Number, String] as PropType<number | string>,
        default: '245px',
      },
      width: {
        type: [Number, String] as PropType<number | string>,
        default: '100%',
      },
      noDestroyOnUnmount: { type: Boolean, default: false },
    },
    emits: [
      'thumbnail',
      'error',
      'drop',
      'dragstart',
      'dragend',
      'dragenter',
      'dragover',
      'dragleave',
      'paste',
      'addedfile',
      'addedfiles',
      'removedfile',
      'success',
      'processing',
      'processingmultiple',
      'uploadprogress',
      'totaluploadprogress',
      'sending',
      'sendingmultiple',
      'canceled',
      'canceledmultiple',
      'complete',
      'completemultiple',
      'maxfilesexceeded',
      'maxfilesreached',
      'queuecomplete',
      'reset',
    ],
    setup(props, { emit }) {
      const ButtonElement = ref<HTMLButtonElement>()
      const dropzoneReady = ref(false)
      let dropzone: IMazDropzone
      const dropzoneOptions = ref<MazDropzoneOptions>()

      const dropzoneStyle = computed(() => ({
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      }))

      const thumbnail: DropzoneOptions['thumbnail'] = (file: MazDropzoneFile, dataUrl) => {
        emit('thumbnail', { file, dataUrl })
        let thumbnailElement: HTMLImageElement
        file.previewElement.classList.remove('dz-file-preview')
        const ref = file.previewElement.querySelectorAll('[data-dz-thumbnail-bg]')

        ref.forEach((r: Element) => {
          thumbnailElement = r as HTMLImageElement
          thumbnailElement.alt = file.name
          thumbnailElement.style.backgroundImage = `url('${dataUrl}')`
        })

        if (file.status === 'success') dropzone.emit('complete', file)
      }

      const error: DropzoneOptions['error'] = (file, message, xhr) => {
        emit('error', { file, message, xhr })
        if (dropzone.options.autoRemoveOnError) {
          setTimeout(() => dropzone.removeFile(file), 3000)
        }
      }

      const errorMultiple: DropzoneOptions['errormultiple'] = (files, message, xhr) => {
        emit('error', { files, message, xhr })
        if (dropzone.options.autoRemoveOnError)
          setTimeout(() => {
            for (const file of files) dropzone.removeFile(file)
          }, 3000)
      }

      onMounted(async () => {
        const defaultOptions: MazDropzoneOptions = {
          parallelUploads: props.options.maxFiles,
          previewTemplate,
          addRemoveLinks: true,
        }

        if (ButtonElement.value) {
          const { default: DropzoneJs } = await import('dropzone')

          const Constructor = dropzoneFix(DropzoneJs)

          dropzone = new Constructor(ButtonElement.value, {
            ...defaultOptions,
            ...props.options,
          })

          if (dropzone) {
            dropzoneOptions.value = dropzone.options as MazDropzoneOptions

            dropzoneReady.value = true

            /**
             * Dropzone Events
             */

            dropzone.on('thumbnail', thumbnail)
            dropzone.on('error', error)
            dropzone.on('errormultiple', errorMultiple)
            dropzone.on('drop', (e: DragEvent) => emit('drop', e))
            dropzone.on('dragstart', (e: DragEvent) => emit('dragstart', e))
            dropzone.on('dragend', (e: DragEvent) => emit('dragend', e))
            dropzone.on('dragenter', (e: DragEvent) => emit('dragenter', e))
            dropzone.on('dragover', (e: DragEvent) => emit('dragover', e))
            dropzone.on('dragleave', (e: DragEvent) => emit('dragleave', e))
            dropzone.on('paste', (e: DragEvent) => emit('paste', e))
            dropzone.on('addedfile', (file: DropzoneFile) => emit('addedfile', file))
            dropzone.on('addedfiles', (files: DropzoneFile[]) => emit('addedfiles', files))
            dropzone.on('removedfile', (file: DropzoneFile) => emit('removedfile', file))
            dropzone.on(
              'success',
              (file: DropzoneFile, response: Record<string, unknown> | string) =>
                emit('success', { file, response }),
            )
            dropzone.on('successmultiple', (files: DropzoneFile[], responseText: string) =>
              emit('success', { files, responseText }),
            )
            dropzone.on('processing', (file: DropzoneFile) => emit('processing', file))
            dropzone.on('processingmultiple', (files: DropzoneFile[]) =>
              emit('processingmultiple', files),
            )
            dropzone.on(
              'uploadprogress',
              (file: DropzoneFile, progress: number, bytesSent: number) =>
                emit('uploadprogress', { file, progress, bytesSent }),
            )
            dropzone.on(
              'totaluploadprogress',
              (totalProgress: number, totalBytes: number, totalBytesSent: number) =>
                emit('totaluploadprogress', {
                  totalProgress,
                  totalBytes,
                  totalBytesSent,
                }),
            )
            dropzone.on('sending', (file: DropzoneFile, xhr: XMLHttpRequest, formData: FormData) =>
              emit('sending', { file, xhr, formData }),
            )
            dropzone.on(
              'sendingmultiple',
              (files: DropzoneFile[], xhr: XMLHttpRequest, formData: FormData) =>
                emit('sendingmultiple', { files, xhr, formData }),
            )
            dropzone.on('canceled', (file: DropzoneFile) => emit('canceled', file))
            dropzone.on('canceledmultiple', (files: DropzoneFile[]) =>
              emit('canceledmultiple', files),
            )
            dropzone.on('complete', (file: DropzoneFile) => emit('complete', file))
            dropzone.on('completemultiple', (files: DropzoneFile[]) =>
              emit('completemultiple', files),
            )
            dropzone.on('maxfilesexceeded', (file: DropzoneFile) => emit('maxfilesexceeded', file))
            dropzone.on('maxfilesreached', (files: DropzoneFile[]) =>
              emit('maxfilesreached', files),
            )
            dropzone.on('queuecomplete', () => {
              if (getAcceptedFiles().every((file) => file.manuallyAdded)) return
              emit('queuecomplete')
            })
            dropzone.on('reset', () => emit('reset'))
          }
        }
      })

      const setOption = (option: string, value: unknown): MazDropzoneOptions => {
        dropzone.options = {
          ...dropzone.options,
          [option]: value,
        }
        return dropzone.options
      }
      const manuallyAddFile: MazDropzoneInstance['manuallyAddFile'] = (file, fileUrl) => {
        dropzone.emit('addedfile', file)
        dropzone.emit('thumbnail', file, fileUrl)
        dropzone.files.push(file)
      }
      const removeAllFiles: MazDropzoneInstance['removeAllFiles'] = (shouldRemoveAllFiles) =>
        dropzone.removeAllFiles(shouldRemoveAllFiles)
      const processQueue: MazDropzoneInstance['processQueue'] = () => dropzone.processQueue()
      const destroy: MazDropzoneInstance['destroy'] = () => dropzone.destroy()
      const disable: MazDropzoneInstance['disable'] = () => dropzone.disable()
      const enable: MazDropzoneInstance['enable'] = () => dropzone.enable()
      const accept: MazDropzoneInstance['accept'] = (file, done) => dropzone.accept(file, done)
      const addFile: MazDropzoneInstance['addFile'] = (file) => dropzone.addFile(file)
      const resizeImage: MazDropzoneInstance['resizeImage'] = (
        file,
        width,
        height,
        resizeMethod,
        callback,
      ) => dropzone.resizeImage(file, width, height, resizeMethod, callback)
      const cancelUpload: MazDropzoneInstance['cancelUpload'] = (file) =>
        dropzone.cancelUpload(file)
      const getAcceptedFiles: MazDropzoneInstance['getAcceptedFiles'] = () =>
        dropzone.getAcceptedFiles() as MazDropzoneFile[]
      const getRejectedFiles: MazDropzoneInstance['getRejectedFiles'] = () =>
        dropzone.getRejectedFiles() as MazDropzoneFile[]
      const getFilesWithStatus: MazDropzoneInstance['getFilesWithStatus'] = () =>
        dropzone.getFilesWithStatus(status)
      const getQueuedFiles: MazDropzoneInstance['getQueuedFiles'] = () => dropzone.getQueuedFiles()
      const getUploadingFiles: MazDropzoneInstance['getUploadingFiles'] = () =>
        dropzone.getUploadingFiles()
      const getAddedFiles: MazDropzoneInstance['getAddedFiles'] = () => dropzone.getAddedFiles()
      const getActiveFiles: MazDropzoneInstance['getActiveFiles'] = () => dropzone.getActiveFiles()

      onBeforeUnmount(() => {
        if (!props.noDestroyOnUnmount) dropzone.destroy()
      })

      return {
        ButtonElement,
        dropzoneReady,
        dropzoneOptions,
        dropzoneStyle,
        setOption,
        manuallyAddFile,
        removeAllFiles,
        processQueue,
        destroy,
        disable,
        enable,
        accept,
        addFile,
        resizeImage,
        cancelUpload,
        getAcceptedFiles,
        getRejectedFiles,
        getFilesWithStatus,
        getQueuedFiles,
        getUploadingFiles,
        getAddedFiles,
        getActiveFiles,
      }
    },
  })
</script>

<style lang="postcss">
  @keyframes passing-through {
    0% {
      opacity: 0;
      transform: translateY(40px);
    }

    30%,
    70% {
      opacity: 1;
      transform: translateY(0);
    }

    100% {
      opacity: 0;
      transform: translateY(-40px);
    }
  }

  @keyframes slide-in {
    0% {
      opacity: 0;
      transform: translateY(40px);
    }

    30% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    10% {
      transform: scale(1.1);
    }

    20% {
      transform: scale(1);
    }
  }

  .maz-dropzone {
    @apply maz-m-0 maz-inline-flex maz-items-center maz-justify-center maz-overflow-auto
      maz-rounded maz-border maz-border-dashed maz-border-color-light maz-bg-color
      maz-p-4 maz-text-center maz-outline-none
      maz-transition-all maz-duration-200 maz-ease-out;

    min-height: 245px;

    &:not(.dz-clickable) {
      @apply maz-bg-color-light;
    }

    &.dz-clickable,
    &.dz-clickable.dz-message,
    &.dz-clickable.dz-message * {
      @apply maz-cursor-pointer;
    }

    & .dz-message {
      @apply maz-flex maz-flex-col maz-items-center maz-justify-center maz-text-center;
    }

    &.dz-clickable {
      &:hover,
      &:focus {
        @apply maz-border-color-lighter maz-bg-color-light;

        & .maz-dropzone__main-icon {
          @apply maz-text-primary maz-transition-all maz-duration-200 maz-ease-out;
        }
      }
    }

    &.dz-started .dz-message {
      @apply maz-hidden;
    }

    &.dz-drag-hover {
      @apply maz-border-solid;

      & .dz-message {
        @apply maz-opacity-50;
      }
    }

    & .dz-message .dz-button {
      @apply maz-cursor-pointer maz-border-none maz-bg-transparent maz-p-0;
    }

    & .dz-details {
      @apply maz-absolute maz-inset-0 maz-z-20 maz-flex maz-flex-col maz-items-center
        maz-justify-center maz-rounded maz-px-4 maz-py-8 maz-text-center maz-leading-10 maz-text-white maz-opacity-0;

      background-color: var(--maz-color-primary-alpha);
      transition: opacity 0.2s linear;

      & .dz-size {
        & span {
          @apply maz-text-base maz-text-white;
        }
      }

      & .dz-filename {
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        span {
          color: white;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    & .dz-image {
      overflow: hidden;
      position: relative;
      display: block;
      z-index: 10;
      width: 100%;
      height: 100%;
      margin: 0 auto;

      @apply maz-rounded maz-border-color-lighter;

      & img {
        display: block;
      }

      & > div[data-dz-thumbnail-bg] {
        width: inherit;
        height: inherit;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    }

    & .dz-preview {
      position: relative;
      display: inline-block;
      vertical-align: top;
      margin: 0;
      min-height: auto;
      height: 100%;
      background: transparent;
      max-width: 200px;
      overflow: hidden;

      &:not(:last-child) {
        margin-right: 0.5rem;
      }

      &.dz-file-preview {
        & .dz-image {
          border-radius: 20px;
          background: #999;
          background: linear-gradient(to bottom, #eee, #ddd);
        }

        & .dz-details {
          opacity: 1;
        }
      }

      &.dz-image-preview {
        background-color: transparent;

        & .dz-details {
          transition: opacity 0.2s linear;
        }
      }

      & .dz-remove {
        text-align: center;
        display: block;
        cursor: pointer;
        position: absolute;
        z-index: 30;
        color: white;
        top: inherit;
        left: 5px;
        right: 5px;
        bottom: 5px;
        padding: 10px 5px;
        border: 2px white solid;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        opacity: 0;
        transition: all 300ms ease-in-out;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        @apply maz-rounded;

        &:hover {
          @apply maz-bg-white maz-text-primary;
        }
      }

      &:hover {
        z-index: 1000;

        & .dz-details,
        & .dz-remove {
          opacity: 1;
        }

        & .dz-image img {
          transform: scale(1.05, 1.05);
          filter: blur(8px);
        }
      }

      & .dz-error-message {
        pointer-events: none;
        z-index: 1000;
        position: absolute;
        display: block;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 8px;
        top: 130px;
        background: #be2626;
        background: linear-gradient(to bottom, #be2626, #a92222);
        padding: 0.5em 1.2em;
        color: white;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        width: 100%;
        text-align: center;
      }

      & .dz-success-mark,
      & .dz-error-mark {
        pointer-events: none;
        opacity: 0;
        z-index: 500;
        position: absolute;
        display: block;
        margin-left: auto;
        margin-top: auto;
        width: 100%;
        top: 30%;
        left: 0;

        @apply maz-flex maz-flex-col maz-items-center maz-justify-center;

        & .material-icons {
          background-color: var(--maz-color-success-alpha);
          border-radius: 50%;
          color: white;
          font-size: 70px;
        }
      }

      & .dz-error-mark {
        & .material-icons {
          background-color: var(--maz-color-danger-alpha);
        }
      }

      &.dz-success .dz-success-mark {
        animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1);
      }

      &.dz-error {
        & .dz-error-message {
          display: block;
        }

        & .dz-error-mark {
          opacity: 1;
          animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1);
        }

        & .dz-details {
          background-color: var(--maz-color-danger-alpha);
        }

        &:hover .dz-error-message {
          opacity: 1;
          pointer-events: auto;
        }

        & .dz-remove:hover {
          @apply maz-text-danger;
        }
      }

      & .dz-progress {
        opacity: 1;
        z-index: 1000;
        pointer-events: none;
        position: absolute;
        height: 1rem;
        top: 50%;
        margin-top: -0.5rem;
        transform: scale(1);
        overflow: visible;
        width: 50%;
        left: 25%;

        @apply maz-rounded-full maz-bg-gray-100;

        & .dz-upload {
          position: absolute;
          transition: width 300ms ease-in-out;

          @apply maz-absolute maz-inset-0 maz-w-0 maz-rounded-full maz-bg-success;
        }

        & .progress-title {
          display: inline-block;
          position: relative;
          top: -30px;
        }
      }

      &.dz-processing .dz-progress {
        opacity: 1;
        transition: all 0.2s linear;
      }

      &.dz-complete .dz-progress {
        opacity: 0;
        transition: opacity 0.4s ease-in;
      }

      &:not(.dz-processing) .dz-progress {
        animation: pulse 6s ease infinite;
      }
    }
  }
</style>
