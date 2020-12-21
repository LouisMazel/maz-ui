<template>
  <div class="maz-dropzone-doc">
    <ComponentContainer
      code="<template>"
      class="maz-flex maz-direction-column"
    >
      <MazGallery
        :images="[{
          slug: 'http://placekitten.com/200/300',
        }, {
          slug: 'http://placekitten.com/200/400'
        }]"
        :images-shown-number="2"
      />
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
  <MazGallery
    :images=&quot;[]&quot;
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
  name: 'MazGalleryDoc'
}
</script>

