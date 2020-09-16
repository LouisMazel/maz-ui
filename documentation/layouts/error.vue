<template>
  <div class="maz-container maz-flex maz-flex-center maz-flex-1 maz-direction-column">
    <div v-if="error.statusCode === 404">
      <h1>
        Page not found
      </h1>
      <p class="maz-mt-2">
        {{ error.message }}
      </p>
    </div>
    <div
      v-else
      class="maz-flex maz-flex-center maz-direction-column"
    >
      <h1>An error occurred</h1>
      <h2
        v-if="error && error.statusCode"
        class="maz-text-danger maz-my-4"
      >
        {{ error.statusCode }}
      </h2>
      <code
        v-if="error"
        class="maz-text-center"
      >
        {{ error.message }}
      </code>
    </div>
    <MazBtn
      :to="{ name: 'index' }"
      class="maz-mt-4"
      color="secondary"
    >
      Back to home
    </MazBtn>
    <MazBtn
      class="maz-mt-4"
      color="third"
      @click="reload"
    >
      Reload
    </MazBtn>
  </div>
</template>

<script>
export default {
  props: {
    error: { type: [Number, Object, String], default: null }
  },
  layout: 'default', // If you prefers you can set a custom layout for the error page
  methods: {
    reload () {
      window.location.reload(true)
    }
  }
}
</script>