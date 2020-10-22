<template>
  <div class="maz-dropzone-doc">
    <ComponentContainer
      code="<template>
  <MazDropzone
    ref=&quot;mazDropzone&quot;
    :url=&quot;url&quot;
    :headers=&quot;headers&quot;
    :max-filesize=&quot;maxFilesize&quot;
    @file-upload-error=&quot;error&quot;
    @file-upload-success=&quot;success&quot;
    @file-removed=&quot;successMessage = null&quot;
  />
  <div
    v-if=&quot;errorMessage&quot;
    class=&quot;dropzone-error maz-flex maz-justify-center maz-text-success mt-2&quot;
  >
    <span class=&quot;text-danger&quot;>
      \{\{ errorMessage }}
    </span>
  </div>
  <div
    v-if=&quot;successMessage&quot;
    class=&quot;dropzone-success maz-flex maz-justify-center maz-text-success mt-2&quot;
  >
    <span class=&quot;text-success&quot;>
      \{\{ successMessage }}
    </span>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        url: 'https://httpbin.org/post',
        headers: { 'My-Awesome-Header': 'header value' },
        maxFilesize: 3,
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
  }
</script>"
      class="maz-flex maz-direction-column"
    >
      <client-only>
        <MazDropzone
          ref="mazDropzone"
          :url="url"
          :headers="headers"
          :max-files="3"
          :max-filesize="maxFilesize"
          @file-upload-error="error"
          @file-upload-success="success"
          @file-removed="successMessage = null"
        />
      </client-only>
      <div
        v-if="errorMessage"
        class="dropzone-error maz-flex maz-justify-center maz-text-danger maz-mt-2"
      >
        <span class="text-danger">
          {{ errorMessage }}
        </span>
      </div>
      <div
        v-else-if="successMessage"
        class="dropzone-success maz-flex maz-justify-center maz-text-success maz-mt-2"
      >
        <span class="text-success">
          {{ successMessage }}
        </span>
      </div>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h4>
      How to use it ?
    </h4>

    <CodeContainer
      language="html"
      code="<template>
  <MazDropzone
    :url=&quot;url&quot;
    :headers=&quot;headers&quot;
  />
</template>

<script>
  import { MazDropzone } from 'maz-ui'
  export default {
    components: { MazDropzone }
    data () {
      return {
        url: 'https://httpbin.org/post',
        headers: { 'My-Awesome-Header': 'header value' },
      }
    }
  }
</script>"
    />
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
      successMessage: null
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
