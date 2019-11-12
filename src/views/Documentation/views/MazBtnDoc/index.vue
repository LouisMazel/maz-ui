<template>
  <div class="maz-btn-doc">
    <h2 class="text-center">
      MazBtn
    </h2>
    <ComponentContainer class="flex flex-direction-column p-4 m-4">
      <div
        v-for="type in btnTypes"
        :key="type"
        class="btn-container flex mb-3"
      >
        <MazBtn
          size="sm"
          :type="type"
        >
          {{ type }} sm
        </MazBtn>
        <MazBtn :type="type">
          {{ type }}
        </MazBtn>
        <MazBtn
          size="lg"
          :type="type"
        >
          {{ type }} lg
        </MazBtn>
        <MazBtn
          :type="type"
          outline
        >
          {{ type }} lg
        </MazBtn>
        <MazBtn
          :type="type"
          loader
        >
          {{ type }} lg
        </MazBtn>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazBtnDoc',
    data () {
      return {
        btnTypes: [
          'primary', 'secondary', 'success', 'danger', 'warning', 'grey', 'info', 'light', 'dark', 'default', 'white', 'black'
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn-container {
    * {
      margin-right: 10px;
    }
  }
</style>
