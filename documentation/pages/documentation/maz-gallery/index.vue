<template>
  <div class="maz-dropzone-doc">
    <ComponentContainer
      code="<template>"
      class="maz-flex maz-direction-column"
    >
      <MazGallery
        :images="[
          'https://via.placeholder.com/500',
          'https://via.placeholder.com/600',
          'https://via.placeholder.com/700',
          'https://via.placeholder.com/800',
          'https://via.placeholder.com/900',
          'https://via.placeholder.com/1000'
        ]"
        :height="400"
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
    :images=&quot;images&quot;
  />
</template>

<script>
  import { MazGallery } from 'maz-ui'
  export default {
    components: { MazGallery }
    data () {
      return {
        images: [
          'https://via.placeholder.com/500',
          'https://via.placeholder.com/600',
          'https://via.placeholder.com/700',
          'https://via.placeholder.com/800',
          'https://via.placeholder.com/900',
          'https://via.placeholder.com/1000'
        ]
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

