<template>
  <div class="maz-dropzone-doc">
    <ComponentContainer
      :code="codeExample"
      language="js"
      class="maz-flex maz-direction-column"
    >
      <MazDropzone
        ref="mazDropzone"
        :url="url"
        :headers="headers"
        :max-filesize="maxFilesize"
        @file-upload-error="error"
        @file-upload-success="success"
        @file-removed="successMessage = null"
      />
      <div
        v-if="errorMessage"
        class="dropzone-error maz-flex maz-justify-center maz-text-danger maz-mt-2"
      >
        <span class="text-danger">
          {{ errorMessage }}
        </span>
      </div>
      <div
        v-if="successMessage"
        class="dropzone-success maz-flex maz-justify-center maz-text-success maz-mt-2"
      >
        <span class="text-success">
          {{ successMessage }}
        </span>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
export default {
  name: 'MazDropzoneDoc',
  data () {
    return {
      url: 'https://httpbin.org/post',
      headers: { 'My-Awesome-Header': 'header value' },
      maxFilesize: 2,
      errorMessage: null,
      successMessage: null,
      codeExample: `<template>
  <MazDropzone
    ref="mazDropzone"
    :url="url"
    :headers="headers"
    :max-filesize="maxFilesize"
    @file-upload-error="error"
    @file-upload-success="success"
    @file-removed="successMessage = null"
  />
  <div
    v-if="errorMessage"
    class="dropzone-error maz-flex maz-justify-center maz-text-success mt-2"
  >
    <span class="text-danger">
      {{ errorMessage }}
    </span>
  </div>
  <div
    v-if="successMessage"
    class="dropzone-success maz-flex maz-justify-center maz-text-success mt-2"
  >
    <span class="text-success">
      {{ successMessage }}
    </span>
  </div>
</template>

export default {
  data () {
    return {
      url: 'https://httpbin.org/post',
      headers: { 'My-Awesome-Header': 'header value' },
      maxFilesize: 1,
      errorMessage: null,
      successMessage: null
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
      this.successMessage = 'Files uploaded !'
    }
  }
}`
    }
  },
  methods: {
    error (error) {
      if (error) {
        this.errorMessage =
          typeof error === 'string' ? error : error.error.title
      } else {
        this.errorMessage = null
      }
    },
    success () {
      this.successMessage = 'Files uploaded !'
    }
  }
}
</script>
