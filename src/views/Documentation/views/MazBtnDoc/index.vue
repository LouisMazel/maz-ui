<template>
  <div class="maz-btn-doc">
    <h2>
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
    <div class="flex flex-wrap justify-content-around">
      <ComponentContainer class="flex flex-direction-column">
        <h3 class="mb-3">
          Basic
        </h3>
        <div
          v-for="type in btnTypes"
          :key="`normal-${type}`"
          class="btn-container flex mb-3 flex-wrap"
        >
          <MazBtn
            v-for="size in btnSizes"
            :key="`normal-${type}-${size}`"
            :size="size"
            :type="type"
          >
            {{ type }} {{ size }}
          </MazBtn>
        </div>
      </ComponentContainer>
      <ComponentContainer class="flex flex-direction-column">
        <h3 class="mb-3">
          Outline
        </h3>
        <div
          v-for="type in btnTypes"
          :key="`ountline-${type}`"
          class="btn-container flex mb-3 flex-wrap"
        >
          <MazBtn
            v-for="size in btnSizes"
            :key="`outline-${type}-${size}`"
            :size="size"
            :type="type"
            outline
          >
            {{ type }} {{ size }}
          </MazBtn>
        </div>
      </ComponentContainer>
      <ComponentContainer class="flex flex-direction-column">
        <h3 class="mb-3">
          Rounded
        </h3>
        <div
          v-for="type in btnTypes"
          :key="`rounded-${type}`"
          class="btn-container flex mb-3 flex-wrap"
        >
          <MazBtn
            v-for="size in btnSizes"
            :key="`rounded-${type}-${size}`"
            :size="size"
            :type="type"
            rounded
          >
            {{ type }} {{ size }}
          </MazBtn>
          <MazBtn
            v-for="size in btnSizes"
            :key="`rounded-outline-${type}-${size}`"
            :size="size"
            :type="type"
            outline
            rounded
          >
            {{ type }} {{ size }}
          </MazBtn>
        </div>
      </ComponentContainer>
      <ComponentContainer class="flex flex-direction-column">
        <h3 class="mb-3">
          Loader
        </h3>
        <div
          class="btn-container flex mb-3 flex-wrap"
        >
          <MazBtn
            v-for="size in btnSizes"
            :key="`loader-${size}`"
            :size="size"
            loader
          >
            Loader {{ size }}
          </MazBtn>
          <MazBtn
            v-for="size in btnSizes"
            :key="`loader-rounded-${size}`"
            :size="size"
            loader
            rounded
          >
            Loader {{ size }}
          </MazBtn>
        </div>
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazBtnDoc',
    data () {
      return {
        btnTypes: [
          'primary', 'secondary', 'success', 'danger', 'warning', 'grey', 'info', 'light', 'dark', 'default', 'white', 'black'
        ],
        btnSizes: [
          'sm', '', 'lg'
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn-container {
    * {
      margin: 5px;
    }
  }
</style>
