<template>
  <div class="maz-picker-doc">
    <p class="maz-fw-700 maz-mb-3">
      This component is based on
      <a
        target="_blank"
        href="https://momentjs.com/">MomentJS</a>
    </p>

    <br />
    <p class="maz-mb-3">
      You can use any locale available in moment package. Locales are
      dynamically imported.
    </p>

    <!-- <p class="fw-700 mb-3">
      This component is based on
      <a
        target="_blank"
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat"
      >
        native Intl.DateTimeFormat
      </a>
    </p>

    <p>
      The locale of the picker is automatically set with the browser locale
    </p>

    <p>
      You can use any locale supported by Intl.DateTimeFormat.
      Check
      <a
        target="_blank"
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/supportedLocalesOf"
      >
        here
      </a>
    </p>-->

    <div class="maz-flex maz-flex-1">
      <MazBtnGroup
        v-model="locale"
        :items="locales" />
    </div>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3" />

    <p class="maz-fw-700 maz-mb-3">Top or bottom position of pickers is calculate</p>

    <p class="maz-mb-3">
      You can set the position with "position" props attribute :
    </p>

    <CodeContainer
      language="html"
      :code="positionCodeExample" />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3" />

    <div class="examples maz-my-3">
      <ComponentContainer :code="codeExample">
        <h3>Date Time Picker</h3>
        <h5 class="maz-mb-3">Basic</h5>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          none
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue"
          :locale="locale"
          format="DD-MM-YYYY HH:mm"
          @formatted="pickerFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="clearableExample">
        <h3>Date Picker</h3>
        <h5 class="maz-mb-3">
          Small input size clearable with input value formatted
        </h5>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          no-time - clearable - size="sm" - formatted="ll" - placeholder="Select
          date"
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue2 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted2 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue2"
          clearable
          placeholder="Select date"
          size="sm"
          no-time
          formatted="ll"
          :locale="locale"
          @formatted="pickerFormatted2 = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="doubleExample">
        <h3>Double Date Picker</h3>
        <h5 class="maz-mb-3">
          Large input size - french format - custom placeholder
        </h5>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          double - size="lg" - format="DD-MM-YYYY" - placeholder="Select date in
          big calander" - no-time
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue3 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted3 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue3"
          placeholder="Select date in big calendar"
          format="DD-MM-YYYY"
          no-time
          size="lg"
          double
          :locale="locale"
          @formatted="pickerFormatted3 = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="rangeExample">
        <h3>Range Double Date Picker</h3>
        <h5 class="maz-mb-3">Position forced</h5>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          range - double - position="top right" - placeholder="Select period"
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerRangeValues || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          :
          {{ pickerRangeValuesFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerRangeValues"
          placeholder="Select period"
          range
          double
          position="top right"
          :locale="locale"
          @formatted="pickerRangeValuesFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="inlineExample">
        <h3>Inline Double Date Time Picker</h3>
        <h5 class="maz-mb-3">Min & max dates provided & without time picker</h5>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          inline - min-date="2020-05-05" - max-date="2020-05-27" - no-time
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue4 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted4 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue4"
          inline
          no-time
          double
          min-date="2020-05-05"
          max-date="2020-06-22"
          :locale="locale"
          @formatted="pickerFormatted4 = $event"
        />
      </ComponentContainer>

      <ComponentContainer :code="inlineExample">
        <h3>Time Picker</h3>
        <h5 class="maz-mb-3">Min & max dates provided & without time picker</h5>

        <p class="maz-mb-3">
          <strong>Options:</strong>
          no-date - placeholder="Select time"
        </p>

        <p>
          <strong>Value</strong>
          : {{ pickerValue5 || 'null' }}
        </p>
        <p class="maz-mb-2">
          <strong>Formatted value</strong>
          : {{ pickerFormatted5 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue5"
          placeholder="Select time"
          no-date
          :locale="locale"
        />
      </ComponentContainer>

      <ComponentContainer :code="inlineExample">
        <h3 class="maz-mb-3">Disabled</h3>

        <p>Value : {{ pickerValue4 || 'null' }}</p>
        <p class="maz-mb-2">Formatted value : {{ pickerFormatted4 || 'null' }}</p>

        <MazPicker
          v-model="pickerValue4"
          disabled
          :locale="locale" />
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
const getDefaultLocale = () => {
  if (typeof window === 'undefined') return null

  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').substr(0, 2)
  return locale
}

export default {
  name: 'MazPickerDoc',
  data () {
    return {
      locale: getDefaultLocale(),
      locales: [
        { label: 'English', value: 'en' },
        { label: 'French', value: 'fr' },
        { label: 'Italian', value: 'it' },
        { label: 'Spanish', value: 'es' },
        { label: 'Russian', value: 'ru' }
      ],
      pickerValue: '22-03-2020 01:13',
      pickerFormatted: null,
      codeExample: `<template>
  <MazPicker
    v-model="pickerValue"
    @formatted="pickerFormatted = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue: null,
      pickerFormatted: null
    }
  }
}`,
      pickerValue2: '2020-02-03',
      pickerFormatted2: null,
      clearableExample: `<template>
  <MazPicker
    v-model="pickerValue2"
    clearable
    size="sm"
    placeholder="Select date"
    formatted="ll"
    @formatted="pickerFormatted2 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue2: '2020-02-03',
      pickerFormatted2: null
    }
  }
}`,
      pickerValue3: '03-02-2020',
      pickerFormatted3: null,
      doubleExample: `<template>
  <MazPicker
    v-model="pickerValue3"
    placeholder="Select date in big calendar"
    format="DD-MM-YYYY"
    clearable
    size="lg"
    double
    @formatted="pickerFormatted3 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerFormatted2: null,
      pickerValue3: '03-02-2020'
    }
  }
}`,
      pickerValue4: '2020-05-15',
      pickerFormatted4: null,
      inlineExample: `<template>
  <MazPicker
    v-model="pickerValue4"
    placeholder="Select time"
    no-date
    @formatted="pickerFormatted4 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue4: null,
      pickerFormatted4: null
    }
  }
}`,
      pickerValue5: null,
      pickerFormatted5: null,
      timeExample: `<template>
  <MazPicker
    v-model="pickerValue4"
    no-time
    @formatted="pickerFormatted4 = $event"
  />
</template>

export default {
  data () {
    return {
      pickerValue4: null,
      pickerFormatted4: null
    }
  }
}`,
      pickerRangeValues: null,
      pickerRangeValuesFormatted: null,
      rangeExample: `<template>
  <MazPicker
    v-model="pickerRangeValues"
    placeholder="Select period"
    range
    double
    position="bottom right"
    :locale="locale"
    @formatted="pickerRangeValuesFormatted = $event"
  />
</template>

export default {
  data () {
    return {
      pickerFormatted3: null,
      pickerValue4: null
    }
  }
}`,
      positionCodeExample: `<MazPicker
  v-model="pickerValue"
  position="top right"
  @formatted="pickerFormatted = $event"
/>`
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-picker-doc {
    .examples {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
      align-items: start;

      @media screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: repeat(1, 1fr);
      }

      > div {
        margin: 0;
      }
    }
  }
</style>
