<template>
  <div class="maz-card-doc">
    <ComponentContainer
      code="<template>
  <MazCard
    href=&quot;https://www.fillmurray.com/640/500&quot;
  >
  </MazCard>
<template>"
      class="maz-card-doc__demo"
    >
      <h3 class="maz-mb-4">
        Basic
      </h3>
      <MazCard
        variant="column"
        :images="[
          'https://www.fillmurray.com/640/500'
        ]"
      >
        <template #title>
          <h4>
            Bill Murray
          </h4>
        </template>
        <template #subtitle>
          <h5>
            Actor
          </h5>
        </template>
        <template #content>
          <p class="maz-text-muted">
            You're awesome! You're awesome! You're awesome! You're awesome! You're awesome!
          </p>
        </template>
        <template #actions>
          <MazBtn
            size="sm"
            icon-name="delete"
            fab
            color="danger"
          />
          <MazBtn
            size="sm"
            left-icon-name="star"
            color="white"
          >
            <strong>5</strong>
          </MazBtn>
        </template>
      </MazCard>
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazCard
    href=&quot;https://www.fillmurray.com/640/500&quot;
    href-target=&quot;_blank&quot;
    :max-width=&quot;500&quot;
    variant=&quot;row&quot;
    :images=&quot;[
      'https://www.fillmurray.com/640/500',
      'https://www.fillmurray.com/740/600'
    ]&quot;
  >
    <template #title>
      <h4>
        Bill Murray
      </h4>
    </template>
    <template #content>
      <p class=&quot;maz-text-muted&quot;>
        You're awesome! You're awesome! You're awesome! You're awesome! You're awesome!
      </p>
    </template>
    <template #footer>
      <MazBtn
        size=&quot;sm&quot;
      >
        Action 1
      </MazBtn>
      <MazBtn
        color=&quot;secondary&quot;
        size=&quot;sm&quot;
      >
        Action 2
      </MazBtn>
    </template>
  </MazCard>
</template>"
    >
      <h3 class="maz-mb-4">
        Linked - row variant - footer
      </h3>
      <MazCard
        href="https://www.fillmurray.com/640/500"
        href-target="_blank"
        :max-width="500"
        variant="row"
        :images="[
          'https://www.fillmurray.com/640/500',
          'https://www.fillmurray.com/740/600'
        ]"
      >
        <template #title>
          <h4>
            Bill Murray
          </h4>
        </template>
        <template #content>
          <p class="maz-text-muted">
            You're awesome! You're awesome! You're awesome! You're awesome! You're awesome!
          </p>
        </template>
        <template #footer>
          <MazBtn
            size="sm"
          >
            Action 1
          </MazBtn>
          <MazBtn
            color="secondary"
            size="sm"
          >
            Action 2
          </MazBtn>
        </template>
      </MazCard>
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazCard
    :images=&quot;[
      'https://www.fillmurray.com/640/500',
      'https://www.fillmurray.com/740/600'
    ]&quot;
    zoom
  >
    <template #actions>
      <MazBtn
        size=&quot;sm&quot;
        icon-name=&quot;delete&quot;
        fab
        color=&quot;danger&quot;
      />
      <MazBtn
        size=&quot;sm&quot;
        left-icon-name=&quot;star&quot;
        color=&quot;white&quot;
      >
        <strong>5</strong>
      </MazBtn>
    </template>
  </MazCard>
</template>"
    >
      <h3 class="maz-mb-4">
        Zoom - actions
      </h3>
      <MazCard
        :images="[
          'https://www.fillmurray.com/640/500',
          'https://www.fillmurray.com/740/600'
        ]"
        zoom
      >
        <template #actions>
          <MazBtn
            size="sm"
            icon-name="delete"
            fab
            color="danger"
          />
          <MazBtn
            size="sm"
            left-icon-name="star"
            color="white"
          >
            <strong>5</strong>
          </MazBtn>
        </template>
      </MazCard>
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazCarousel>
    <MazCard
      v-for=&quot;(item, i) in Array(8)&quot;
      :key=&quot;i&quot;
      variant=&quot;row&quot;
      :width=&quot;400&quot;
      :images=&quot;[
        'https://www.fillmurray.com/640/500'
      ]&quot;
    >
      <template #title>
        <h4>
          Bill Murray
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
      <h3 class="maz-mb-4">
        In a
        <NuxtLink :to="{ name: 'documentation-maz-carousel' }">
          MazCarousel
        </NuxtLink>
        component
      </h3>
      <hr
        class="maz-border-top maz-border-solid maz-border-color maz-my-5"
      >
      <MazCarousel>
        <template #title>
          <h4>
            Bill Murray Carousel
          </h4>
        </template>
        <MazCard
          v-for="(item, i) in Array(8)"
          :key="i"
          variant="row"
          :width="400"
          :images="[
            'https://www.fillmurray.com/640/500'
          ]"
        >
          <template #title>
            <h5>
              Bill Murray
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
  <MazCard
    :images=&quot;images&quot;
  />
</template>

<script>
  import { MazCard } from 'maz-ui'
  export default {
    components: { MazCard },
    data () {
      return {
        images: [
          'https://www.fillmurray.com/640/500'
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
  name: 'MazCardDoc'
}
</script>
