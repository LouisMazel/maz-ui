<template>
  <div class="maz-dropzone-doc">
    <ComponentContainer
      :code="codeExample"
      language="js"
      class="flex direction-column"
    >
      <MazDropzone
        ref="mazDropzone"
        :url="url"
        :headers="headers"
        :max-filesize="maxFilesize"
        :dark="hasDarkTheme"
        @file-upload-error="error"
        @file-upload-success="success"
      />
      <div
        v-if="errorMessage"
        class="dropzone-error flex justify-center mt-2"
      >
        <span class="text-danger">
          {{ errorMessage }}
        </span>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'MazDropzoneDoc',
    data () {
      return {
        url: 'https://httpbin.org/post',
        headers: { 'My-Awesome-Header': 'header value' },
        maxFilesize: 2,
        errorMessage: null,
        codeExample: `<template>
  <MazDropzone
    ref="mazDropzone"
    :url="url"
    :headers="headers"
    :max-filesize="maxFilesize"
    :dark="hasDarkTheme"
    @file-upload-error="error"
    @file-upload-success="success"
  />
  <div
    v-if="errorMessage"
    class="dropzone-error flex justify-center mt-2"
  >
    <span class="text-danger">
      {{ errorMessage }}
    </span>
  </div>
</template>

export default {
  data () {
    return {
      url: 'https://httpbin.org/post',
      headers: { 'My-Awesome-Header': 'header value' },
      maxFilesize: 1,
      errorMessage: null
    }
  },
  methods: {
    error (error) {
      if (error) {
        this.errorMessage = typeof error === 'string' ? error : error.error.title
      } else {
        this.errorMessage = null
      }
    },
    success () {
      setTimeout(() => {
        this.$refs.mazDropzone.removeAllFiles()
      }, 2000)
    }
  }
}`
      }
    },
    computed: {
      ...mapGetters(['hasDarkTheme'])
    },
    methods: {
      error (error) {
        if (error) {
          this.errorMessage = typeof error === 'string' ? error : error.error.title
        } else {
          this.errorMessage = null
        }
      },
      success () {
        setTimeout(() => {
          this.$refs.mazDropzone.removeAllFiles()
        }, 2000)
      }
    }
  }
</script>
