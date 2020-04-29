<template>
  <div class="maz-picker-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazPicker
        id="mazPicker"
        v-model="pickerValue"
        locale="en"
      />

      <!-- <MazPicker
        id="mazPicker2"
        v-model="pickerValue"
        dark
      /> -->

      <br>

      <p class="mb-2">
        Value : {{ pickerValue || null }}
      </p>
      <p class="mb-2">
        Formatted value : {{ pickerFormatted || null }}
      </p>

      <MazPickerNew
        v-model="pickerValue"
        label="Select date"
        formatted="ll"
        locale="en"
        clearable
        size="lg"
        @formatted="pickerFormatted = $event"
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazPickerDoc',
    data () {
      return {
        pickerValue: '2020-02-14',
        pickerFormatted: null,
        codeExample: `<template>
</template>`
      }
    }
  }
</script>
