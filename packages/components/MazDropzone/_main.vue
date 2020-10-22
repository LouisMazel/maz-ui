<template>
  <VueDropzone
    :id="id"
    ref="mazDropzone"
    tabindex="0"
    :options="dropzoneOptions"
    class="maz-base-component maz-dropzone maz-w-100 maz-h-100 maz-flex maz-flex-center"
    :class="{ 'maz-is-dark': dark }"
    @vdropzone-file-added="fileAdded"
    @vdropzone-success="fileSended"
    @vdropzone-thumbnail="thumbnail"
    @vdropzone-error="fileError"
    @vdropzone-removed-file="fileRemoved"
    @vdropzone-sending="sending"
    @keydown.native="keyDown"
  />
</template>

<script>
import VueDropzone from 'vue2-dropzone'

/**
 * @module component - mazDropzone
 * @param {string} url
 * @param {string} acceptedFiles
 * @param {string} paramName
 * @param {object} headers
 * @param {object} translations
 * @param {number} maxFiles
 * @param {number} maxFilesize
 * @emits file-upload-success
 * @emits file-upload-error
 */

export default {
  name: 'MazDropzone',
  components: { VueDropzone },
  props: {
    // URL to upload files
    url: { type: String, required: true },
    // Id of component
    id: { type: String, default: 'MazDropzone' },
    // File type accepted
    acceptedFiles: { type: String, default: 'image/*' },
    // File name uploaded
    paramName: { type: String, default: 'file-name' },
    // Set request headers with your own (token, jwt)
    headers: { type: Object, required: true },
    // Messages translations (error, success)
    translations: { type: Object, default: null },
    // Max files number
    maxFiles: { type: Number, default: 1 },
    // Max files size
    maxFilesize: { type: Number, default: 2 },
    // User can remove files with a button
    addRemoveLinks: { type: Boolean, default: true },
    // Set dark theme
    dark: { type: Boolean, default: false },
    // If error remove all files in area
    removeFilesOnError: { type: Boolean, default: false },
    // Not upload immediatly the files
    autoProcessQueue: { type: Boolean, default: true }
  },
  computed: {
    t () {
      const defaultTranslation = {
        chooseOrDropAFile: 'Choose or drop a file',
        filesDescriptions: `(PNG or JPG under ${this.maxFilesize}MB)`,
        browserIsNotSupported: 'Your browser is not supported',
        fileIsTooBig: `File(s) too big (max: ${this.maxFilesize} MB)`,
        invalidFileType: `Invalid file(s) (PNG or JPG under ${this.maxFilesize}MB)`,
        dictRemoveFile: 'Remove',
        dictCancelUpload: 'Cancel upload',
        dictMaxFilesExceeded: `You can not upload any more files. (max: ${this.maxFiles} files)`
      }
      return {
        ...defaultTranslation,
        ...this.translations
      }
    },
    dropzoneOptions () {
      return {
        url: this.url,
        acceptedFiles: this.acceptedFiles,
        maxFilesize: this.maxFilesize,
        maxFiles: this.maxFiles,
        autoProcessQueue: this.autoProcessQueue,
        dictDefaultMessage: `
            <i class="material-icons" aria-hidden="true">cloud_upload</i>
            <br />
            <span>${this.t.chooseOrDropAFile}</span>
            <br />
            <span class="fs-12">${this.t.filesDescriptions}</span>
          `,
        dictFallbackMessage: this.t.browserIsNotSupported,
        dictFileTooBig: this.t.fileIsTooBig,
        dictInvalidFileType: this.t.invalidFileType,
        dictRemoveFile: this.t.dictRemoveFile,
        dictCancelUpload: this.t.dictCancelUpload,
        dictMaxFilesExceeded: this.t.dictMaxFilesExceeded,
        addRemoveLinks: this.addRemoveLinks,
        previewTemplate: `
            <div class="dz-preview dz-file-preview maz-flex-1">
              <div class="dz-image">
                  <div data-dz-thumbnail-bg></div>
              </div>
              <div class="dz-details maz-flex maz-direction-column maz-align-center maz-justify-center">
                  <div class="dz-filename"><span data-dz-name></span></div>
                  <div class="dz-size"><span data-dz-size></span></div>
              </div>
              <div class="dz-progress">
                <span class="dz-upload" data-dz-uploadprogress></span>
              </div>
              <div class="dz-success-mark maz-text-center">
                <i class="material-icons" aria-hidden="true">done</i>
              </div>
              <div class="dz-error-mark maz-text-center">
                <i class="material-icons" aria-hidden="true">error_outline</i>
              </div>
            </div>
          `,
        headers: this.headers,
        paramName: this.paramName
      }
    }
  },
  watch: {
    url (val) {
      this.$refs.mazDropzone.setOption('url', val)
    }
  },
  mounted () {
    this.$refs.mazDropzone.setOption('url', this.url)
  },
  methods: {
    async keyDown (e) {
      await this.$nextTick()
      if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault()
        this.$refs.mazDropzone.$el.click()
      }
    },
    thumbnail (file, dataUrl) {
      let j
      let len
      let ref
      let thumbnailElement
      if (file.previewElement) {
        file.previewElement.classList.remove('dz-file-preview')
        ref = file.previewElement.querySelectorAll('[data-dz-thumbnail-bg]')
        for (j = 0, len = ref.length; j < len; j++) {
          thumbnailElement = ref[j]
          thumbnailElement.alt = file.name
          thumbnailElement.style.backgroundImage = `url('${dataUrl}')`
        }
        return setTimeout(((() => {
          return () => {
            return file.previewElement.classList.add('dz-image-preview')
          }
        })(this)), 1)
      }
    },
    /**
     * Called whenever a new file is dropped in the zone.
     * @function fileAdded
     */
    fileAdded (file) {
      this.$emit('file-added', file)
    },
    /**
     * Called when the file is successfully sent.
     * @function fileSended
     */
    fileSended (file, response) {
      setTimeout(() => {
        this.$emit('file-upload-success', response)
      }, 2000)
    },
    /**
     * Called when an error occured while uploading the file.
     * @function fileError
     */
    fileError (file, error) {
      this.$emit('file-upload-error', error)
      if (this.removeFilesOnError) this.removeAllFiles()
    },
    removeAllFiles () {
      this.$refs.mazDropzone.removeAllFiles()
    },
    processQueue () {
      this.$refs.mazDropzone.processQueue()
    },
    removeFile (file) {
      this.$refs.mazDropzone.removeFile(file)
    },
    fileRemoved (e) {
      this.$emit('file-removed', e)
    },
    sending (file, xhr, formData) {
      this.$emit('file-sending', file, xhr, formData)
    }
  }
}
</script>
