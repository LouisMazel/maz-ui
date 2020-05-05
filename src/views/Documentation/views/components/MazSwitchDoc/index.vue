<template>
  <div class="maz-switch-doc">
    <ComponentContainer :code="codeExample">
      <div class="maz-flex maz-flex-wrap">
        <div
          v-for="type in btnTypes"
          :key="`switch-${type}`"
          class="maz-px-3"
        >
          <p class="maz-mb-3 maz-text-center">
            {{ type }}
          </p>
          <MazSwitch
            v-model="checkboxValue"
            :color="type"
            class="maz-mb-2" />
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
