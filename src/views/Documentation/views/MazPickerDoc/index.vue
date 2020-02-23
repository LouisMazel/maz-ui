<template>
  <div class="maz-picker-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazPicker
        id="mazPicker"
        v-model="pickerValue"
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazPickerDoc',
    data () {
      return {
        pickerValue: null,
        codeExample: `<template>
</template>`
      }
    }
  }
</script>
