<template>
  <div class="maz-input-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazInput
        v-model="exampleValue"
        label="Custom label/placeholder text"
      />
    </ComponentContainer>
    <div
      v-for="type in inputTypes"
      :key="type"
      class="flex mt-3 flex--wrap"
    >
      <div class="flex-component flex-1">
        <h3>{{ type | capitalize }}</h3>
        <h4>Light mode</h4>
        <ComponentContainer>
          <MazInput
            v-model="inputValue"
            :error="type === 'error'"
            :valid="type === 'valid'"
            :disabled="type === 'disabled'"
            :clearable="type === 'clearable'"
            :hint="type === 'hint' ? 'Hint value' : null"
            :loader="type === 'loader'"
            :required="type === 'required'"
            :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
          />
        </ComponentContainer>
        <ComponentContainer>
          <MazInput
            v-model="withValue"
            :error="type === 'error'"
            :valid="type === 'valid'"
            :disabled="type === 'disabled'"
            :clearable="type === 'clearable'"
            :hint="type === 'hint' ? 'Hint value' : null"
            :loader="type === 'loader'"
            :required="type === 'required'"
            :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
          />
        </ComponentContainer>
      </div>
      <div class="flex-component flex-1">
        <h3 class="text-white">
          -
        </h3>
        <h4>Dark mode</h4>
        <ComponentContainer dark>
          <MazInput
            v-model="inputValue"
            :error="type === 'error'"
            :valid="type === 'valid'"
            :disabled="type === 'disabled'"
            :clearable="type === 'clearable'"
            :hint="type === 'hint' ? 'Hint value' : null"
            :loader="type === 'loader'"
            :required="type === 'required'"
            :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
            dark
          />
        </ComponentContainer>
        <ComponentContainer dark>
          <MazInput
            v-model="withValue"
            :error="type === 'error'"
            :valid="type === 'valid'"
            :disabled="type === 'disabled'"
            :clearable="type === 'clearable'"
            :hint="type === 'hint' ? 'Hint value' : null"
            :loader="type === 'loader'"
            :required="type === 'required'"
            :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
            dark
          />
        </ComponentContainer>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazInputDoc',
    data () {
      return {
        inputValue: '',
        withValue: 'The value entered',
        disabledValue: '',
        inputTypes: [
          'basic', 'error', 'valid', 'disabled', 'hint', 'clearable', 'sm', 'lg', 'required', 'loader'
        ],
        exampleValue: '',
        codeExample: `<template>
  <MazInput
    v-model="exampleValue"
    label="Custom label/placeholder text"
  />
</template>

export default {
  data () {
    return {
      exampleValue: ''
    }
  }
}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-input-doc {
    .flex {
      &-component {
        margin: 5px;
        min-width: 250px;
      }
    }
  }
</style>
