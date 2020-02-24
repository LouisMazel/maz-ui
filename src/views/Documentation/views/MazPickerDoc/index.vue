<template>
  <div class="maz-picker-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazPicker
        id="mazPicker"
        v-model="pickerValue"
      />

      <br>

      <MazPickerNew
        id="mazPickerNew"
        v-model="pickerValue"
        label="Select date"
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
