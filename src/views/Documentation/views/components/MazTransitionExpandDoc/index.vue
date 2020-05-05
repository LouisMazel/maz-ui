<template>
  <div class="maz-transition-expand-doc">
    <ComponentContainer
      class="flex direction-column"
      :code="code">
      <div class="flex justify-center">
        <MazBtn @click="isShown = !isShown">
          Toggle Expand
        </MazBtn>
      </div>
      <br />
      <div class="flex flex--wrap space-between">
        <div class="flex-1">
          <h3 class="mb-2">
            Expand component 1
          </h3>
          <ComponentContainer class="maz-expand-container flex-1">
            <MazTransitionExpand
              class="example border-radius text-center"
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
        <div class="flex-1">
          <h3 class="mb-2">
            Expand component 2
          </h3>
          <ComponentContainer class="maz-expand-container flex-1">
            <MazTransitionExpand
              class="example border-radius text-center"
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
