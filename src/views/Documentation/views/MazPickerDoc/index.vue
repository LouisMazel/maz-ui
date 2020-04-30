<template>
  <div class="maz-picker-doc">
    <p class="fw-700 mb-3">
      This component is based on <a
        target="_blank"
        href="https://momentjs.com/docs/"
      >MomentJS</a>
    </p>
    <p>
      The locale of the picker is automatically set with the browser locale
    </p>

    <br>
    <p>
      You can use any locale available in moment package
    </p>

    <br>
    <div class="flex flex-1 ">
      <MazBtnGroup
        v-model="locale"
        :items="locales"
      />
    </div>

    <ComponentContainer
      :code="codeExample"
    >
      <h4 class="mb-3">
        Basic
      </h4>

      <p>
        Value : {{ pickerValue || null }}
      </p>
      <p class="mb-2">
        Formatted value : {{ pickerFormatted || null }}
      </p>

      <MazPickerNew
        v-model="pickerValue"
        :locale="locale"
        @formatted="pickerFormatted = $event"
      />
    </ComponentContainer>

    <ComponentContainer>
      <h4 class="mb-3">
        Clearable - size="sm" - formatted="ll"
      </h4>

      <p>
        Value : {{ pickerValue2 || null }}
      </p>
      <p class="mb-2">
        Formatted value : {{ pickerFormatted2 || null }}
      </p>

      <MazPickerNew
        v-model="pickerValue2"
        clearable
        size="sm"
        formatted="ll"
        :locale="locale"
        @formatted="pickerFormatted2 = $event"
      />
    </ComponentContainer>

    <ComponentContainer>
      <h4 class="mb-3">
        Double-calendar - size="lg" - format="DD-MM-YYYY" - label="Select date in big calander"
      </h4>

      <p>
        Value : {{ pickerValue3 || null }}
      </p>
      <p class="mb-2">
        Formatted value : {{ pickerFormatted3 || null }}
      </p>

      <MazPickerNew
        v-model="pickerValue3"
        label="Select date in big calendar"
        format="DD-MM-YYYY"
        clearable
        size="lg"
        double-calendar
        :locale="locale"
        @formatted="pickerFormatted3 = $event"
      />
    </ComponentContainer>

    <ComponentContainer>
      <h4 class="mb-3">
        Inline - Double-calendar
      </h4>

      <p>
        Value : {{ pickerRangeValues || null }}
      </p>
      <p class="mb-2">
        Formatted value : {{ pickerRangeValuesFormatted || null }}
      </p>

      <MazPickerNew
        v-model="pickerRangeValues"
        range
        inline
        :locale="locale"
        @formatted="pickerRangeValuesFormatted = $event"
      />
    </componentcontainer>

    <ComponentContainer>
      <h4 class="mb-3">
        Range
      </h4>

      <p>
        Value : {{ pickerRangeValues || null }}
      </p>
      <p class="mb-2">
        Formatted value : {{ pickerRangeValuesFormatted || null }}
      </p>

      <MazPickerNew
        v-model="pickerRangeValues"
        label="Select period"
        range
        inline
        :locale="locale"
        @formatted="pickerRangeValuesFormatted = $event"
      />
    </componentcontainer>
  </div>
</template>

<script>
  export default {
    name: 'MazPickerDoc',
    data () {
      return {
        locale: null,
        locales: [
          { label: 'English', value: 'en' },
          { label: 'French', value: 'fr' },
          { label: 'Italian', value: 'it' },
          { label: 'Spanish', value: 'es' },
          { label: 'Russian', value: 'ru' }
        ],
        pickerValue: null,
        pickerValue2: '2020-02-03',
        pickerValue3: '03-02-2020',
        pickerFormatted: null,
        pickerFormatted2: null,
        pickerFormatted3: null,
        pickerRangeValues: null,
        pickerRangeValuesFormatted: null,
        codeExample: `<template>
</template>`
      }
    }
  }
</script>
