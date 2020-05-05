<template>
  <div class="maz-switch-doc">
    <ComponentContainer :code="codeExample">
      <div class="flex flex--wrap">
        <div
          v-for="type in btnTypes"
          :key="`switch-${type}`"
          class="px-3"
        >
          <p class="mb-3 text-center">
            {{ type }}
          </p>
          <MazSwitch
            v-model="checkboxValue"
            :color="type"
            class="mb-2" />
        </div>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
export default {
  name: 'MazSwitchDoc',
  data () {
    return {
      btnTypes: [
        'primary',
        'secondary',
        'third',
        'success',
        'danger',
        'warning',
        'grey',
        'info',
        'light',
        'dark',
        'default',
        'white',
        'black'
      ],
      checkboxValue: true,
      codeExample: `<template>
  <MazSwitch
    v-model="checkboxValue"
  />
</template>

export default {
  data () {
    return {
      checkboxValue: true
    }
  }
}`
    }
  }
}
</script>
