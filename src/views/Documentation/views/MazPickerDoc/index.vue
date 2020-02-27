<template>
  <div class="maz-picker-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazPicker
        id="mazPicker"
        v-model="pickerValue"
        dark
      />

      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>

      <!-- <MazPicker
        id="mazPicker2"
        v-model="pickerValue"
        dark
      /> -->

      <br>

      <MazPickerNew
        id="mazPickerNew"
        v-model="pickerValue"
        label="Select date"
        dark
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazPickerDoc',
    data () {
      return {
        pickerValue: '2020-02-03',
        codeExample: `<template>
</template>`
      }
    }
  }
</script>
