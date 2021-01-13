<template>
  <div class="maz-carousel-doc">
    <ComponentContainer
      code="<template>
  <MazCarousel>
    <MazCard
      v-for=&quot;(item, i) in Array(8)&quot;
      :key=&quot;i&quot;
      :images=&quot;[
        'https://www.stevensegallery.com/650/750'
      ]&quot;
    >
      <template #title>
        <h4>
          Steven Seagal
        </h4>
      </template>
      <template #content>
        <p class=&quot;maz-text-muted&quot;>
          You're awesome! You're awesome! You're awesome! You're awesome! You're awesome!
        </p>
      </template>
    </MazCard>
  </MazCarousel>
</template>"
    >
      <MazCarousel>
        <template #title>
          <h4>
            Steven Seagal Carousel
          </h4>
        </template>
        <MazCard
          v-for="(item, i) in Array(8)"
          :key="i"
          :images="[
            'https://www.stevensegallery.com/650/750'
          ]"
        >
          <template #title>
            <h5>
              Steven Seagal
            </h5>
          </template>
          <template #content>
            <p class="maz-text-muted">
              You're awesome! You're awesome! You're awesome! You're awesome! You're awesome!
            </p>
          </template>
        </MazCard>
      </MazCarousel>
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
  <MazCarousel>
    ...
    <YOUR_ITEMS>
    ...
  </MazCarousel>
</template>

<script>
  import { MazCarousel } from 'maz-ui'
  export default {
    components: { MazCarousel }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazCarouselDoc'
}
</script>
