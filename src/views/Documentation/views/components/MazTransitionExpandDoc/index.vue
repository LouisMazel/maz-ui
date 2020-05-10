<template>
  <div class="maz-transition-expand-doc">
    <ComponentContainer
      class="maz-flex maz-direction-column"
      :code="code"
    >
      <div class="maz-flex maz-justify-center">
        <MazBtn @click="isShown = !isShown">
          Toggle Expand
        </MazBtn>
      </div>
      <br />
      <div class="maz-flex maz-flex-wrap maz-space-between">
        <div class="maz-flex-1">
          <h3 class="maz-mb-2">
            Expand component 1
          </h3>
          <ComponentContainer class="maz-expand-container maz-flex-1">
            <MazTransitionExpand
              class="example maz-border-radius maz-text-center"
            >
              <div v-show="!isShown">
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
              </div>
            </MazTransitionExpand>
          </ComponentContainer>
        </div>
        <div class="maz-flex-1">
          <h3 class="maz-mb-2">
            Expand component 2
          </h3>
          <ComponentContainer class="maz-expand-container maz-flex-1">
            <MazTransitionExpand
              class="example maz-border-radius maz-text-center"
            >
              <div v-show="isShown">
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
                <p>Content expand</p>
              </div>
            </MazTransitionExpand>
          </ComponentContainer>
        </div>
      </div>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazTransitionExpand>
    <div
      v-show=&quot;isShown&quot;
    >
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
    </div>
  </MazTransitionExpand>
</template>

<script>
  import { MazTransitionExpand } from 'maz-ui'
  export default {
    components: { MazTransitionExpand },
    data () {
      return {
        isShow: false
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazTransitionExpandDoc',
  data () {
    return {
      isShown: false,
      code: `<template>
  <MazTransitionExpand>
    <div
      v-show="isShown"
    >
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
      <p>Content expand</p>
    </div>
  </MazTransitionExpand>
</template>

export default {
  data () {
    return {
      isShown: false
    }
  }
}`
    }
  }
}
</script>
