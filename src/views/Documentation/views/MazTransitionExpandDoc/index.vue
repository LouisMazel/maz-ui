<template>
  <div class="maz-transition-expand-doc">
    <ComponentContainer class="flex flex-direction-column">
      <div class="flex justify-content-center">
        <MazBtn @click="isShown = !isShown">
          Toggle Expand
        </MazBtn>
      </div>
      <br>
      <div class="flex flex-1 flex-start">
        <ComponentContainer
          class="maz-expand-container flex-1 mr-4"
        >
          <h3 class="mb-2">
            Expand component 1
          </h3>
          <MazTransitionExpand class="example shadow-container br-8 text-center">
            <div
              v-show="!isShown"
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
        </ComponentContainer>
        <ComponentContainer
          class="maz-expand-container flex-1"
        >
          <h3 class="mb-2">
            Expand component 2
          </h3>
          <MazTransitionExpand class="example shadow-container br-8 text-center">
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
        </ComponentContainer>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazTransitionExpandDoc',
    data () {
      return {
        isShown: false
      }
    }
  }
</script>
