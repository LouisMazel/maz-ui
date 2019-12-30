<template>
  <VueDropzone
    id="MazDropzone"
    ref="mazDropzone"
    :options="dropzoneOptions"
    class="w-100 h-100 flex align-center justify-center"
    :class="{ 'is-dark': dark }"
    @vdropzone-file-added="reset"
    @vdropzone-success="fileSended"
    @vdropzone-thumbnail="thumbnail"
    @vdropzone-error="fileError"
    @vdropzone-removed-file="removeFile"
    @vdropzone-sending="sending"
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
      url: { type: String, required: true },
      acceptedFiles: { type: String, default: 'image/*' },
      paramName: { type: String, default: 'file-name' },
      headers: { type: Object, required: true },
      translations: { type: Object, default: null },
      maxFiles: { type: Number, default: 1 },
      maxFilesize: { type: Number, default: 2 },
      addRemoveLinks: { type: Boolean, default: true },
      dark: { type: Boolean, default: false }
    },
    computed: {
      t () {
        const defaultTranslation = {
          chooseOrDropAFile: 'Choose or drop a file',
          filesDescriptions: `(PNG or JPG under ${this.maxFilesize}MB)`,
          browserIsNotSupported: 'Your browser is not supported',
          fileIsTooBig: `The file is too big (maximum: ${this.maxFilesize} MB)`,
          invalidFileType: `Invalid file (PNG or JPG under ${this.maxFilesize}MB)`,
          dictRemoveFile: 'Remove',
          dictCancelUpload: 'Cancel upload'
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
          addRemoveLinks: this.addRemoveLinks,
          previewTemplate: `
            <div class="dz-preview dz-file-preview">
              <div class="dz-image">
                  <div data-dz-thumbnail-bg></div>
              </div>
              <div class="dz-details flex direction-column align-center justify-center">
                  <div class="dz-filename"><span data-dz-name></span></div>
                  <div class="dz-size"><span data-dz-size></span></div>
              </div>
              <div class="dz-progress m-0">
                <span class="dz-upload" data-dz-uploadprogress></span>
              </div>
              <div class="dz-success-mark text-center">
                <i class="material-icons" aria-hidden="true">done</i>
              </div>
              <div class="dz-error-mark">
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
       * Called whenever a new file is dropped in the zone. Should reset
       * the error messages.
       * @function reset
       */
      reset () {
        this.$emit('file-upload-error', null)
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
        this.removeAllFiles()
      },
      removeAllFiles () {
        this.$refs.mazDropzone.removeAllFiles()
      },
      removeFile (e) {
        this.$emit('file-removed', e)
      },
      sending (e) {
        this.$emit('file-sending', e)
      }
    }
  }
</script>
