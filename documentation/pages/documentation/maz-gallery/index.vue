<template>
  <div class="maz-gallery-doc">
    <ComponentContainer
      code="<template>
  <MazGallery
    :images=&quot;[
      'https://www.stevensegallery.com/640/500',
      { slug: 'https://www.stevensegallery.com/640/600', alt: 'image description' },
      { slug: 'https://www.stevensegallery.com/640/700', alt: 'image description' },
      'https://www.stevensegallery.com/640/800',
      'https://www.stevensegallery.com/640/1000',
      'https://www.stevensegallery.com/800/800'
    ]&quot;
    :height=&quot;400&quot;
  />
<template>"
    >
      <MazGallery
        :images="[
          'https://www.stevensegallery.com/640/500',
          { slug: 'https://www.stevensegallery.com/640/600', alt: 'image description' },
          { slug: 'https://www.stevensegallery.com/640/700', alt: 'image description' },
          'https://www.stevensegallery.com/640/800',
          'https://www.stevensegallery.com/640/1000',
          'https://www.stevensegallery.com/800/800'
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
    components: { MazGallery },
    data () {
      return {
        images: [
          'https://www.stevensegallery.com/640/500',
          { slug: 'https://www.stevensegallery.com/640/600', alt: 'image description' },
          { slug: 'https://www.stevensegallery.com/640/700', alt: 'image description' },
          'https://www.stevensegallery.com/640/800',
          'https://www.stevensegallery.com/640/1000',
          'https://www.stevensegallery.com/800/800'
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

