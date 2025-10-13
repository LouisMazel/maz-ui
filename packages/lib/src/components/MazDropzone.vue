<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazSpinnerProps } from './MazSpinner.vue'
import type { MazColor } from './types'
import { MazArchiveBox, MazArrowUpOnSquare, MazCheckCircle, MazCodeBracket, MazCog, MazCommandLine, MazDocumentIcon, MazDocumentText, MazFilm, MazLogoAndroid, MazLogoApple, MazLogoCsv, MazLogoHtml, MazLogoJs, MazLogoJson, MazLogoMarkdown, MazLogoProperties, MazLogoReact, MazLogoTxt, MazLogoTypescript, MazLogoVue, MazLogoXliff, MazLogoXls, MazLogoXml, MazPaintBrush, MazPencilSquare, MazPhoto, MazPresentationChartBar, MazSpeakerWave, MazTrash, MazXCircle } from '@maz-ui/icons'
import { useTranslations } from '@maz-ui/translations'
import { sleep } from '@maz-ui/utils/helpers/sleep'
import { computed, defineAsyncComponent, onBeforeMount, ref } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { useDropzone } from './../composables/useDropzone'
import MazBtn from './MazBtn.vue'
import MazIcon from './MazIcon.vue'
import MazLink from './MazLink.vue'

const {
  id,
  multiple = false,
  dataTypes,
  preventDefaultForUnhandled = true,
  allowDuplicates = false,
  disabled = false,
  maxFiles,
  maxFileSize,
  preview = true,
  translations,
  removeFileBtnProps = {},
  color = 'primary',
  spinnerProps = {},
  autoUpload = false,
  url,
  requestOptions,
  transformBody,
  minFileSize,
  maxConcurrentUploads = 5,
} = defineProps<MazDropzoneProps>()

const emits = defineEmits<{
  /**
   * Event emitted when files are dropped in the dropzone
   * @property {{ files: File[] | null, event: DragEvent }} values - The dropped files and the drag event
   */
  'drop': [values: { files: File[] | null, event: DragEvent }]
  /**
   * Event emitted when dragged files enter the dropzone
   * @property {{ files: File[] | null, event: DragEvent }} values - The dragged files and the drag event
   */
  'enter': [values: { files: File[] | null, event: DragEvent }]
  /**
   * Event emitted when dragged files leave the dropzone
   * @property {{ files: File[] | null, event: DragEvent }} values - The dragged files and the drag event
   */
  'leave': [values: { files: File[] | null, event: DragEvent }]
  /**
   * Event emitted when dragged files are over the dropzone
   * @property {{ files: File[] | null, event: DragEvent }} values - The dragged files and the drag event
   */
  'over': [values: { files: File[] | null, event: DragEvent }]
  /**
   * Event emitted when a file is added to the dropzone
   * @property {File} value - The added file
   */
  'add': [value: File]
  /**
   * Event emitted when a file is removed from the dropzone
   * @property {File} value - The removed file
   */
  'remove': [value: File]
  /**
   * Event emitted when an error occurs
   * @property {{ files: File[] | null, event: DragEvent | null, code: MazDropzoneErrorCode }} values - The files, event and error code
   */
  'error': [values: { files: File[] | null, event: DragEvent | null, code: MazDropzoneErrorCode }]
  /**
   * Event emitted when an error occurs during file upload
   * @property {{ file: File, code: MazDropzoneErrorCode, error: unknown }} values - The file, error code and error details
   */
  'upload-error': [values: { file: File, code: MazDropzoneErrorCode, error: unknown }]
  /**
   * Event emitted when an error occurs during multiple files upload
   * @property {{ files: File[], code: MazDropzoneErrorCode, error: unknown }} values - The files, error code and error details
   */
  'upload-error-multiple': [values: { files: File[], code: MazDropzoneErrorCode, error: unknown }]
  /**
   * Event emitted when a file is successfully uploaded
   * @property {{ file: File, response?: Response }} values - The uploaded file and the response
   */
  'upload-success': [values: { file: File, response?: Response }]
  /**
   * Event emitted when multiple files are successfully uploaded
   * @property {{ files: File[], response?: Response }} values - The uploaded files and the response
   */
  'upload-success-multiple': [values: { files: File[], response?: Response }]
}>()

const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

export type MazDropzoneErrorCode = 'FILE_SIZE_EXCEEDED' | 'MAX_FILES_EXCEEDED' | 'FILE_TYPE_NOT_ALLOWED' | 'FILE_DUPLICATED' | 'FILE_UPLOAD_ERROR' | 'NO_FILES_TO_UPLOAD' | 'FILE_UPLOAD_ERROR_MULTIPLE' | 'NO_URL' | 'FILE_SIZE_TOO_SMALL'

// eslint-disable-next-line ts/consistent-type-definitions
export type MazDropzoneProps = {
  /**
   * The id of the dropzone
   */
  id?: string
  /**
   * Allow multiple files to be uploaded.
   * @default false
   */
  multiple?: boolean
  /**
   * Allowed data types/MIME types for files (e.g. ['application/json'])
   * @default ['*\/*']
   */
  dataTypes?: string[]
  /**
   * Prevent default behavior for unhandled drag & drop events.
   * @default true
   */
  preventDefaultForUnhandled?: boolean
  /**
   * Maximum file size in MB.
   */
  maxFileSize?: number
  /**
   * Maximum number of files allowed.
   */
  maxFiles?: number
  /**
   * Disable the dropzone
   */
  disabled?: boolean
  /**
   * Show file preview
   */
  preview?: boolean
  /**
   * Minimum file size in MB
   */
  minFileSize?: number
  /**
   * Allow duplicates
   * @default false
   */
  allowDuplicates?: boolean
  /**
   * Translations
   * @description Custom translations for the component
   * @type {Partial<MazUiTranslationsNestedSchema['dropzone']>}
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['dropzone']>
  /**
   * Main color of the component
   * @default 'primary'
   */
  color?: MazColor
  /**
   * MazBtn props [MazBtn props](/components/maz-btn#props)
   * @default {}
   */
  removeFileBtnProps?: MazBtnProps
  /**
   * MazSpinner props [MazSpinner props](/components/maz-spinner#props)
   * @default {}
   */
  spinnerProps?: MazSpinnerProps
  /**
   * Auto upload files
   * @description If set to `multiple`, all files will be uploaded at once in a single request. If set to `single`, files will be uploaded one by one in separate requests. If set to `false`, no upload will be done automatically.
   * @default false
   */
  autoUpload?: 'multiple' | 'single' | false
  /**
   * Upload URL
   * @description If set, files will be uploaded to the given URL.
   */
  url?: string
  /**
   * Request options
   * @description Request options to be used for the upload (using fetch) [Request options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
   * @example `{ mode: 'no-cors', headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer 1234567890' } }`
   */
  requestOptions?: RequestInit
  /**
   * Transform the body of the request
   */
  transformBody?: (formData: FormData) => RequestInit['body']
  /**
   * Maximum number of concurrent uploads
   * @description Limit the number of files uploaded simultaneously to avoid overwhelming the server
   * @default 5
   */
  maxConcurrentUploads?: number
}

/**
 * The files data
 * @type {MazDropzoneFileData[]}
 * @model
 * @default []
 */
const filesData = defineModel<MazDropzoneFileData[]>({
  default: () => [],
})

onBeforeMount(async () => {
  if (filesData.value.length) {
    filesData.value = await Promise.all(filesData.value.map(fileData => getFileData(fileData.file)))
  }
})

export interface MazDropzoneFileData {
  file: File
  name?: string
  size?: number
  type?: string
  lastModified?: number
  sizeInMb?: string
  thumbnail?: string | undefined
  lastModifiedDate?: Date
  uploading?: boolean
  success?: boolean
  error?: boolean
  url?: string
}

const dropZoneRef = ref<HTMLLabelElement>()

const isUploading = ref(false)

const hasMultiple = computed(() => multiple || (maxFiles ? maxFiles > 1 : false) || autoUpload === 'multiple')

const instanceId = useInstanceUniqId({
  componentName: 'MazDropzone',
  providedId: id,
})

function uploadFile(formData: FormData) {
  if (!url) {
    emits('error', {
      files: null,
      event: null,
      code: 'NO_URL',
    })
    throw new Error('NO_URL')
  }

  try {
    const body = transformBody?.(formData) ?? formData

    return fetch(url, {
      method: 'POST',
      body,
      ...requestOptions,
    })
  }
  catch {
    emits('error', {
      files: null,
      event: null,
      code: 'FILE_UPLOAD_ERROR',
    })
  }
}

function getFormData(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return formData
}

function getFormDataMultiple() {
  const formData = new FormData()
  filesData.value.forEach(fileData => formData.append('files', fileData.file))
  return formData
}

async function uploadFilesMultiple() {
  if (!filesData.value.length) {
    emits('error', {
      files: filesData.value.map(f => f.file),
      event: null,
      code: 'NO_FILES_TO_UPLOAD',
    })
    return
  }

  try {
    isUploading.value = true
    filesData.value = filesData.value.map(f => ({ ...f, uploading: true, success: false, error: false }))
    const formData = getFormDataMultiple()
    const response = await uploadFile(formData)
    filesData.value = filesData.value.map(f => ({ ...f, uploading: false, success: true, error: false }))
    emits('upload-success-multiple', { files: filesData.value.map(f => f.file), response })
  }
  catch (error) {
    filesData.value = filesData.value.map(f => ({ ...f, uploading: false, success: false, error: true }))
    emits('upload-error-multiple', { files: filesData.value.map(f => f.file), code: 'FILE_UPLOAD_ERROR_MULTIPLE', error })
  }
  finally {
    isUploading.value = false
    await sleep(1000)
    filesData.value = filesData.value.filter(f => f.error)
  }
}

async function uploadFiles() {
  if (!filesData.value.length) {
    emits('error', {
      files: filesData.value.map(f => f.file),
      event: null,
      code: 'NO_FILES_TO_UPLOAD',
    })
    throw new Error('NO_FILES_TO_UPLOAD')
  }

  try {
    isUploading.value = true

    const queue = [...filesData.value]
    const activeUploads: Promise<void>[] = []

    async function uploadFileData(fileData: MazDropzoneFileData) {
      const formData = getFormData(fileData.file)

      try {
        fileData.error = false
        fileData.uploading = true
        const response = await uploadFile(formData)
        emits('upload-success', { file: fileData.file, response })
        fileData.success = true
      }
      catch (error) {
        fileData.error = true
        emits('upload-error', {
          file: fileData.file,
          code: 'FILE_UPLOAD_ERROR',
          error,
        })
      }
      finally {
        fileData.uploading = false
      }
    }

    async function processQueue() {
      while (queue.length > 0) {
        const fileData = queue.shift()
        if (fileData) {
          await uploadFileData(fileData)
        }
      }
    }

    for (let i = 0; i < Math.min(maxConcurrentUploads, filesData.value.length); i++) {
      activeUploads.push(processQueue())
    }

    await Promise.allSettled(activeUploads)
  }
  finally {
    isUploading.value = false
    await sleep(1000)
    filesData.value = filesData.value.filter(f => f.error)
  }
}

async function getFileData(file: File): Promise<MazDropzoneFileData> {
  const fileData: MazDropzoneFileData = {
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    sizeInMb: (file.size / 1024 / 1024).toFixed(2),
    lastModifiedDate: new Date(file.lastModified),
    url: URL.createObjectURL(file),
    thumbnail: undefined,
    uploading: false,
    success: false,
    error: false,
  }

  if (file.type.startsWith('image/')) {
    await new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const thumbnail = event.target?.result
        fileData.thumbnail = thumbnail ? thumbnail as string : undefined

        resolve(null)
      }

      reader.readAsDataURL(file)
    })
  }

  if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
    emits('error', {
      files: [file],
      event: null,
      code: 'FILE_SIZE_EXCEEDED',
    })
  }

  if (minFileSize && file.size < minFileSize * 1024 * 1024) {
    emits('error', {
      files: [file],
      event: null,
      code: 'FILE_SIZE_TOO_SMALL',
    })
  }

  return fileData
}

// eslint-disable-next-line sonarjs/cognitive-complexity
async function handleFiles(files: File[] | FileList | null) {
  if (disabled || !files)
    return null

  for await (const file of files) {
    if (!isFileTypeAllowed(file)) {
      emits('error', {
        files: [file],
        event: null,
        code: 'FILE_TYPE_NOT_ALLOWED',
      })
      continue
    }

    if (!hasMultiple.value && filesData.value.length >= 1) {
      emits('error', {
        files: [file],
        event: null,
        code: 'MAX_FILES_EXCEEDED',
      })
      continue
    }

    if (maxFiles && filesData.value.length >= maxFiles) {
      emits('error', {
        files: [file],
        event: null,
        code: 'MAX_FILES_EXCEEDED',
      })
      continue
    }

    if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
      emits('error', {
        files: [file],
        event: null,
        code: 'FILE_SIZE_EXCEEDED',
      })
      continue
    }

    if (minFileSize && file.size < minFileSize * 1024 * 1024) {
      emits('error', {
        files: [file],
        event: null,
        code: 'FILE_SIZE_TOO_SMALL',
      })
      continue
    }

    if (!allowDuplicates && filesData.value.find(f => f.name === file.name && f.size === file.size && f.type === file.type)) {
      emits('error', {
        files: [file],
        event: null,
        code: 'FILE_DUPLICATED',
      })
      continue
    }

    const fileData = await getFileData(file)

    filesData.value = [...filesData.value, fileData]
    emits('add', fileData.file)
  }

  if (autoUpload === 'single')
    uploadFiles()
  else if (autoUpload === 'multiple')
    uploadFilesMultiple()

  return filesData.value
}

async function onDrop(files: File[] | null, event: DragEvent) {
  await handleFiles(files)

  emits('drop', {
    files,
    event,
  })
}

function onError(files: File[] | null, event: DragEvent) {
  emits('error', {
    files,
    event,
    code: 'FILE_TYPE_NOT_ALLOWED',
  })
}

function onEnter(files: File[] | null, event: DragEvent) {
  emits('enter', { files, event })
}

function onLeave(files: File[] | null, event: DragEvent) {
  emits('leave', { files, event })
}

function onOver(files: File[] | null, event: DragEvent) {
  emits('over', { files, event })
}

const { isOverDropZone, isOverError } = useDropzone(dropZoneRef, { dataTypes, onDrop, preventDefaultForUnhandled, multiple: hasMultiple.value, onError, onEnter, onLeave, onOver })

const fileInput = ref<HTMLInputElement>()

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input?.files
  if (files) {
    handleFiles(files)
  }
  setTimeout(() => {
    input.value = ''
  }, 3000)
}

const extensionIconMap = (() => {
  const map = new Map<string, IconComponent>()
  const groups = [
    [MazLogoJs, ['js', 'mjs', 'cjs']],
    [MazLogoTypescript, ['ts', 'tsx', 'mts', 'cts']],
    [MazLogoVue, ['vue']],
    [MazLogoReact, ['jsx']],
    [MazLogoJson, ['json', 'jsonc', 'json5']],
    [MazLogoXml, ['xml']],
    [MazLogoHtml, ['html', 'htm']],
    [MazLogoMarkdown, ['md', 'markdown', 'mdx']],
    [MazLogoProperties, ['properties']],
    [MazLogoTxt, ['txt']],
    [MazLogoCsv, ['csv']],
    [MazLogoXls, ['xls', 'xlsx']],
    [MazLogoXliff, ['xliff', 'xlf']],
    [MazLogoApple, ['strings', 'stringsdict', 'xcstrings']],
    [MazLogoAndroid, ['apk']],
    [MazPhoto, ['jpeg', 'jpg', 'png', 'tiff', 'bmp', 'webp', 'svg', 'ico', 'gif', 'heic', 'heif', 'avif']],
    [MazFilm, ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'm4v', 'mpeg', 'mpg', '3gp', 'ogv']],
    [MazSpeakerWave, ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg', 'oga', 'opus', 'wma', 'alac', 'aiff']],
    [MazArchiveBox, ['zip', 'rar', 'tar', 'gz', '7z', 'bz2', 'xz']],
    [MazCommandLine, ['exe', 'dll', 'so', 'dylib', 'dmg', 'deb', 'rpm', 'app', 'bat', 'cmd']],
    [MazCodeBracket, ['css', 'scss', 'sass', 'less', 'py', 'java', 'cpp', 'c', 'h', 'hpp', 'go', 'rs', 'rust', 'php', 'rb', 'swift', 'kt', 'kotlin', 'sql', 'sh', 'bash', 'zsh', 'yaml', 'yml', 'toml', 'ini']],
    [MazCog, ['conf', 'config', 'env', 'cfg']],
    [MazPresentationChartBar, ['ppt', 'pptx', 'key', 'odp']],
    [MazDocumentText, ['rtf', 'odt']],
    [MazPencilSquare, ['ttf', 'otf', 'woff', 'woff2', 'eot']],
    [MazPaintBrush, ['ai', 'psd', 'sketch', 'fig', 'xd', 'eps']],
    [MazDocumentIcon, ['pdf', 'doc', 'docx', 'tsv', 'document']],
  ] as const

  for (const [icon, extensions] of groups) {
    for (const ext of extensions) {
      map.set(ext, icon)
    }
  }

  return map
})()

function getIconComponent(fileData: MazDropzoneFileData) {
  const type = fileData.file.type.split('/')?.[1]?.split('+')?.[0]?.toLowerCase()
  const extension = fileData.file.name.split('.').pop()?.toLowerCase()
  return extensionIconMap.get(type) || (extension && extensionIconMap.get(extension)) || extensionIconMap.get('document')
}

function handleFileInputClick() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileRemove(fileData: MazDropzoneFileData) {
  if (fileData.url) {
    URL.revokeObjectURL(fileData.url)
  }
  filesData.value = filesData.value.filter(f => f.file !== fileData.file)
  emits('remove', fileData.file)
}

const selectAreaCanBeDisplayed = ref(true)

const dataTypesString = computed(() => dataTypes?.map(formatReadable).join(', '))

const allFileIsAccepted = computed<boolean>(() => dataTypes?.length === 1 && dataTypes[0] === '*/*')

const { t } = useTranslations()

const messages = computed(() => {
  const customTranslations = translations || {}

  return {
    dragAndDrop: customTranslations.dragAndDrop ?? t('dropzone.dragAndDrop'),
    fileMaxCount: maxFiles ? (customTranslations.fileMaxCount ?? t('dropzone.fileMaxCount', { count: maxFiles })) : undefined,
    fileMaxSize: maxFileSize ? (customTranslations.fileMaxSize ?? t('dropzone.fileMaxSize', { size: maxFileSize })) : undefined,
    fileTypes: dataTypesString.value ? (customTranslations.fileTypes ?? t('dropzone.fileTypes', { types: dataTypesString.value })) : undefined,
    selectFile: customTranslations.selectFile ?? t('dropzone.selectFile'),
    divider: customTranslations.divider ?? t('dropzone.divider'),
  } satisfies MazDropzoneProps['translations']
})

function formatReadable(fmt: string): string {
  if (fmt.startsWith('.')) {
    return fmt
  }

  if (fmt.includes('/')) {
    const [type, subtype] = fmt.split('/')

    if (subtype === '*') {
      const customTypes = translations?.types || {}
      switch (type) {
        case 'image': return customTypes.image ?? t('dropzone.types.image')
        case 'video': return customTypes.video ?? t('dropzone.types.video')
        case 'audio': return customTypes.audio ?? t('dropzone.types.audio')
        case 'text': return customTypes.text ?? t('dropzone.types.text')
        default: return fmt
      }
    }

    return subtype
  }

  return fmt
}

function reset() {
  filesData.value.forEach((fileData) => {
    if (fileData.url) {
      URL.revokeObjectURL(fileData.url)
    }
  })
  filesData.value = []
}

function addFile(file: File) {
  handleFiles([file])
}

function removeFile(file: File) {
  filesData.value = filesData.value.filter(f => f.file !== file)
}

function isFileTypeAllowed(file: File): boolean {
  if (!dataTypes || dataTypes.includes('*/*'))
    return true

  return dataTypes.some((type) => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1))
    }
    return file.type === type
  })
}

defineExpose({
  /**
   * Upload files
   * @description With this method, the files are uploaded one by one (a request for each file)
   * @usage `mazDropzoneInstance.value?.uploadFiles()`
   */
  uploadFiles,
  /**
   * Upload multiple files
   * @description With this method, the files are uploaded all at once in a single request
   * @usage `mazDropzoneInstance.value?.uploadFilesMultiple()`
   */
  uploadFilesMultiple,
  /**
   * Get form data
   * @description Get the form data of one file
   * @usage `const formData = mazDropzoneInstance.value?.getFormData(file)`
   */
  getFormData,
  /**
   * Get form data multiple
   * @description Get the form data of all files
   * @usage `const formData = mazDropzoneInstance.value?.getFormDataMultiple()`
   */
  getFormDataMultiple,
  /**
   * Reset the files
   * @description Remove all files from the dropzone
   * @usage `mazDropzoneInstance.value?.reset()`
   */
  reset,
  /**
   * Check if the files are uploading
   * @type boolean
   * @description Check if the files are uploading
   * @usage `const isUploading = mazDropzoneInstance.value?.isUploading`
   */
  isUploading,
  /**
   * Add a file to the dropzone
   * @description Add a file manually to the dropzone
   * @usage `mazDropzoneInstance.value?.addFile(file)`
   */
  addFile,
  /**
   * Remove a file from the dropzone
   * @description Remove a file manually from the dropzone
   * @usage `mazDropzoneInstance.value?.removeFile(file)`
   */
  removeFile,
})
</script>

<template>
  <label
    ref="dropZoneRef"
    role="button"
    tabindex="0"
    :for="`input-file-uploader-${instanceId}`"
    class="m-dropzone m-reset-css"
    :class="{
      'm-dropzone--disabled': disabled,
      'm-dropzone--is-over-drop-zone': isOverDropZone && !isOverError,
      'm-dropzone--is-over-error': isOverError,
    }"
    :style="{
      '--active-color': `hsl(var(--maz-${color}))`,
    }"
  >
    <!--
      @slot files-area - Slot to customize the files area
      @binding {MazDropzoneFileData[]} files-data - The files data
    -->
    <slot name="files-area" :files-data="filesData">
      <TransitionGroup name="file-scale" tag="div" class="m-dropzone__files-container" @before-enter="selectAreaCanBeDisplayed = false" @after-leave="selectAreaCanBeDisplayed = filesData.length === 0">

        <div v-for="(file) in filesData" :key="`${file.name}-${file.size}-${file}`" class="m-dropzone__file-item group" @click.prevent="">
          <!--
            @slot file-item - Slot to customize the file item
            @binding {MazDropzoneFileData} file - The drop file data
          -->
          <slot name="file-item" :file="file">
            <template v-if="file.thumbnail && preview">
              <div :style="{ backgroundImage: `url(${file.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }" class="m-dropzone__thumbnail" />
              <div class="m-dropzone__overlay" />
            </template>

            <div class="m-dropzone__icon-container">
              <Transition name="icon-scale">
                <MazSpinner v-if="file.uploading" :color class="m-dropzone__spinner" v-bind="spinnerProps" />
                <MazCheckCircle v-else-if="file.success" class="m-dropzone__success-icon" />
                <MazXCircle v-else-if="file.error" class="m-dropzone__error-icon" />
                <div v-else class="m-dropzone__file-icon-wrapper">
                  <MazIcon :icon="getIconComponent(file)" size="lg" class="m-dropzone__file-icon" />
                </div>
              </Transition>
            </div>

            <div class="m-dropzone__description">
              <div class="m-dropzone__file-info">
                <span class="m-dropzone__file-name">{{ file.name }}</span>
                <span class="m-dropzone__file-size">{{ file.sizeInMb }} MB</span>
              </div>
              <MazBtn
                v-if="!file.uploading && !file.success"
                size="xs"
                :icon="MazTrash"
                :disabled
                color="destructive"
                pastel
                v-bind="removeFileBtnProps"
                @click.prevent="handleFileRemove(file)"
              />
            </div>
          </slot>
        </div>
      </TransitionGroup>
    </slot>

    <template v-if="filesData.length === 0 && selectAreaCanBeDisplayed">
      <!--
        @slot no-files-area - Slot to customize the no files area
        @binding {Function} select-file - The function to select the file
      -->
      <slot name="no-files-area" :select-file="handleFileInputClick">
        <div class="m-dropzone__content">
          <!--
            @slot upload-icon - Slot to customize the upload icon
          -->
          <slot name="upload-icon">
            <MazArrowUpOnSquare class="m-dropzone__upload-icon" />
          </slot>

          <span class="m-dropzone__upload-text">
            {{ messages.dragAndDrop }} {{ messages.divider }} <MazLink color="inherit" underline @click.prevent="!disabled && handleFileInputClick()">
              {{ messages.selectFile }}
            </MazLink>
          </span>
        </div>

        <p v-if="!allFileIsAccepted && (messages.fileMaxCount || messages.fileMaxSize || messages.fileTypes)" class="m-dropzone__info-text">
          <span v-if="messages.fileMaxCount">
            {{ messages.fileMaxCount }}
          </span>
          <span v-if="messages.fileMaxSize">
            {{ messages.fileMaxSize }}
          </span>
          <span v-if="messages.fileTypes">
            {{ messages.fileTypes }}
          </span>
        </p>
      </slot>
    </template>

    <input
      :id="`input-file-uploader-${instanceId}`"
      ref="fileInput"
      :multiple="hasMultiple"
      type="file"
      :accept="dataTypes?.join(',')"
      tabindex="-1"
      :disabled
      class="m-dropzone__file-input"
      @change="handleFileUpload"
    >
  </label>
</template>

<style lang="postcss" scoped>
.m-dropzone {
  @apply maz-flex maz-w-full maz-flex-col maz-gap-2 maz-overflow-hidden maz-rounded maz-border maz-border-dashed maz-border-divider maz-p-6 maz-transition-colors maz-duration-200 maz-ease-in-out maz-flex-center maz-bg-surface hover:maz-bg-surface-600/50 dark:hover:maz-bg-surface-400/50 maz-cursor-pointer;

  &--disabled {
    @apply maz-cursor-not-allowed maz-opacity-50;
  }

  &--is-over-drop-zone {
    @apply maz-bg-primary-400/20 hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400;

    border-color: var(--active-color);

    .maz-dropzone__upload-icon {
      color: var(--active-color);
    }
  }

  &--is-over-error {
    @apply maz-border-destructive maz-bg-destructive-50 hover:maz-bg-destructive-50;

    .maz-dropzone__upload-icon {
      @apply maz-text-destructive;
    }
  }

  &__divider {
    @apply maz-text-muted maz-text-sm;
  }

  &__content {
    @apply maz-flex maz-flex-col maz-gap-1 maz-flex-center;
  }

  &__files-container {
    @apply maz-flex maz-flex-wrap maz-items-center maz-justify-center maz-gap-4;

    position: relative;
  }

  &__file-item {
    @apply maz-relative maz-flex maz-size-40 maz-cursor-auto maz-flex-col maz-items-center maz-overflow-hidden maz-rounded maz-bg-surface-600 dark:maz-bg-surface-400;

    transition: all 300ms ease-in-out;
  }

  &__thumbnail {
    @apply maz-absolute maz-inset-0;
  }

  &__overlay {
    @apply maz-absolute maz-inset-0 maz-backdrop-blur-[0.125rem] maz-bg-surface/40 maz-rounded;
  }

  &__icon-container {
    @apply maz-z-2 maz-flex maz-flex-1 maz-p-2 maz-flex-center;
  }

  &__spinner {
    @apply maz-text-lg;
  }

  &__success-icon {
    @apply maz-text-4xl maz-text-success;
  }

  &__error-icon {
    @apply maz-text-4xl maz-text-destructive;
  }

  &__file-icon-wrapper {
    @apply maz-p-1 maz-rounded maz-bg-surface maz-text-foreground;
  }

  &__description {
    @apply maz-z-2 maz-flex maz-w-full maz-flex-col maz-gap-1 maz-truncate maz-p-2;
  }

  &__file-info {
    @apply maz-flex maz-flex-col maz-gap-0.5 maz-text-center maz-text-sm maz-font-semibold;
  }

  &__file-name {
    @apply maz-truncate;
  }

  &__file-size {
    @apply maz-truncate;
  }

  &__upload-icon {
    @apply maz-text-3xl;
  }

  &__upload-text {
    @apply maz-text-center;
  }

  &__info-text {
    @apply maz-mt-4 maz-text-center maz-text-sm maz-text-muted maz-max-w-full maz-flex maz-flex-col;
  }

  &__file-input {
    @apply maz-hidden;
  }

  .icon-scale-enter-active,
  .icon-scale-leave-active {
    transition: transform 300ms ease-in-out;
  }

  .icon-scale-enter-from {
    opacity: 0;
    position: absolute;
    transform: scale(0);
  }

  .icon-scale-leave-to {
    display: none;
  }

  .file-scale-enter-active {
    transition: all 300ms ease-in-out;
  }

  .file-scale-leave-active {
    transition: all 300ms ease-in-out;
  }

  .file-scale-enter-from {
    opacity: 0;
    transform: scale(0.3);
  }

  .file-scale-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }

  .file-scale-move {
    transition: transform 300ms ease-in-out;
  }
}
</style>
