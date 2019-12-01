<template>
  <div class="maz-btn-doc">
    <ComponentContainer
      :code="codeExample"
      language="html"
      class="btn-container"
    >
      <h3 class="mb-3">
        Example
      </h3>
      <MazBtn>
        Primary default
      </MazBtn>
      <MazBtn
        rounded
      >
        Primary default
      </MazBtn>
      <MazBtn
        outline
      >
        Primary default
      </MazBtn>
      <MazBtn
        loader
      >
        Primary default
      </MazBtn>
      <MazBtn
        disabled
      >
        Primary default
      </MazBtn>
    </ComponentContainer>
    <ComponentContainer>
      <h3 class="mb-3">
        Basic
      </h3>
      <div
        v-for="type in btnTypes"
        :key="`normal-${type}`"
        class="btn-container"
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
    <ComponentContainer>
      <h3 class="mb-3">
        Outline
      </h3>
      <div
        v-for="type in btnTypes"
        :key="`ountline-${type}`"
        class="btn-container"
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
    <ComponentContainer>
      <h3 class="mb-3">
        Rounded
      </h3>
      <div
        v-for="type in btnTypes"
        :key="`rounded-${type}`"
        class="btn-container"
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
      </div>
    </ComponentContainer>
    <ComponentContainer>
      <h3 class="mb-3">
        Loader
      </h3>
      <div
        class="btn-container"
      >
        <MazBtn
          v-for="size in btnSizes"
          :key="`loader-${size}`"
          :size="size"
          loader
        >
          Loader {{ size }}
        </MazBtn>
      </div>
    </ComponentContainer>
    <ComponentContainer>
      <h3 class="mb-3">
        Disabled
      </h3>
      <div
        class="btn-container"
      >
        <MazBtn
          v-for="size in btnSizes"
          :key="`loader-${size}`"
          :size="size"
          disabled
          outline
        >
          Disabled {{ size }}
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
        ],
        btnSizes: [
          '', 'md', 'sm', 'mini'
        ],
        codeExample: `<template>
  <MazBtn>
    Primary default
  </MazBtn>

  <MazBtn
    rounded
  >
    Primary default
  </MazBtn>

  <MazBtn
    outline
  >
    Primary default
  </MazBtn>

  <MazBtn
    loader
  >
    Primary default
  </MazBtn>

  <MazBtn
    disabled
  >
    Primary default
  </MazBtn>
</template>`
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
