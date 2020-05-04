<template>
  <div class="maz-picker-doc">
    <MazBtn
      href="#infos"
      color="third"
    >
      More Infos
    </MazBtn>
    <div class="examples my-3">
      <ComponentContainer
        :code="codeExample"
      >
        <h3>
          Date Time Picker
        </h3>
        <h5 class="mb-3">
          Basic
        </h5>

        <p>
          <strong>Options:</strong>
          none
        </p>

        <p>
          <strong>Value</strong>: {{ pickerValue || 'null' }}
        </p>
        <p>
          <strong>Formatted value</strong>: {{ pickerFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue"
          :locale="locale"
          format="DD-MM-YYYY HH:mm"
          @formatted="pickerFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="clearableExample"
      >
        <h3>
          Date Picker
        </h3>
        <h5 class="mb-3">
          Small input size clearable with input value formatted
        </h5>

        <p>
          <strong>Options:</strong>
          no-time - clearable - size="sm" - formatted="ll"
        </p>

        <p>
          <strong>Value</strong>: {{ pickerValue2 || 'null' }}
        </p>
        <p>
          <strong>Formatted value</strong>: {{ pickerFormatted2 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue2"
          clearable
          size="sm"
          no-time
          formatted="ll"
          :locale="locale"
          @formatted="pickerFormatted2 = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="doubleExample"
      >
        <h3>
          Double Date Picker
        </h3>
        <h5 class="mb-3">
          Large input size - french format - custom placeholder
        </h5>

        <p>
          <strong>Options:</strong>
          double - size="lg" - format="DD-MM-YYYY" - label="Select date in big calander" - no-time
        </p>

        <p>
          <strong>Value</strong>: {{ pickerValue3 || 'null' }}
        </p>
        <p>
          <strong>Formatted value</strong>: {{ pickerFormatted3 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue3"
          label="Select date in big calendar"
          format="DD-MM-YYYY"
          no-time
          size="lg"
          double
          :locale="locale"
          @formatted="pickerFormatted3 = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="rangeExample"
      >
        <h3>
          Range Double Date Picker
        </h3>
        <h5 class="mb-3">
          Position forced
        </h5>

        <p>
          <strong>Options:</strong>
          range - double - position="top right" - label="Select period"
        </p>

        <p>
          <strong>Value</strong>: {{ pickerRangeValues || 'null' }}
        </p>
        <p>
          <strong>Formatted value</strong>: {{ pickerRangeValuesFormatted || 'null' }}
        </p>

        <MazPicker
          v-model="pickerRangeValues"
          label="Select period"
          range
          double
          position="top right"
          :locale="locale"
          @formatted="pickerRangeValuesFormatted = $event"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="inlineExample"
      >
        <h3>
          Inline Double Date Time Picker
        </h3>
        <h5 class="mb-3">
          Min & max dates provided & without time picker
        </h5>

        <p>
          <strong>Options:</strong>
          inline - min-date="2020-05-05" - max-date="2020-05-27" - no-time
        </p>

        <p>
          <strong>Value</strong>: {{ pickerValue4 || 'null' }}
        </p>
        <p>
          <strong>Formatted value</strong>: {{ pickerFormatted4 || 'null' }}
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

      <ComponentContainer
        :code="inlineExample"
      >
        <h3>
          Time Picker
        </h3>
        <h5 class="mb-3">
          Min & max dates provided & without time picker
        </h5>

        <p>
          <strong>Options:</strong>
          no-date
        </p>

        <p>
          <strong>Value</strong>: {{ pickerValue5 || 'null' }}
        </p>
        <p>
          <strong>Formatted value</strong>: {{ pickerFormatted5 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue5"
          no-date
          :locale="locale"
        />
      </ComponentContainer>

      <ComponentContainer
        :code="inlineExample"
      >
        <h3 class="mb-3">
          Disabled
        </h3>

        <p>
          Value : {{ pickerValue4 || 'null' }}
        </p>
        <p>
          Formatted value : {{ pickerFormatted4 || 'null' }}
        </p>

        <MazPicker
          v-model="pickerValue4"
          disabled
          :locale="locale"
        />
      </ComponentContainer>
    </div>

    <hr class="border-top border-solid border-color my-3">

    <h2
      id="infos"
      class="mb-3"
    >
      More informations
    </h2>

    <h3 class="mb-2">
      Locales
    </h3>

    <p class="fw-700 mb-3">
      This component is based on <a
        target="_blank"
        href="https://momentjs.com/"
      >MomentJS</a>
    </p>

    <p>
      You can use any locale available in moment package. Locales are dynamically imported.
    </p>

    <div class="flex flex-1 ">
      <MazBtnGroup
        v-model="locale"
        :items="locales"
      />
    </div>

    <hr class="border-top border-solid border-color my-3">

    <h3 class="mb-2">
      Position
    </h3>

    <p class="fw-700 mb-3">
      Vertical (Top or bottom) position is auto calculate
    </p>

    <p>
      You can force the position with "position" props attribute :
    </p>

    <CodeContainer
      language="html"
      :code="positionCodeExample"
    />

    <hr class="border-top border-solid border-color my-3">

    <h3 class="mb-2">
      Keyboard Accessible
    </h3>

    <table class="md shadow-container">
      <tr>
        <th>Key</th>
        <th>Action</th>
      </tr>
      <tr>
        <td>Arrow Right</td>
        <td>Next Day</td>
      </tr>
      <tr>
        <td>Arrow Left</td>
        <td>Previous Day</td>
      </tr>
      <tr>
        <td>Arrow Down</td>
        <td>Same day on next Day</td>
      </tr>
      <tr>
        <td>Arrow Up</td>
        <td>Same day on previous Day</td>
      </tr>
      <tr>
        <td>Page Down</td>
        <td>Same day on previous month</td>
      </tr>
      <tr>
        <td>Page Up</td>
        <td>Same day on next month</td>
      </tr>
      <tr>
        <td>Enter or Space</td>
        <td>Select day</td>
      </tr>
      <tr>
        <td>Escape</td>
        <td>Close component</td>
      </tr>
    </table>

    <hr class="border-top border-solid border-color my-3">

    <h3 class="mb-2">
      Shortcut
    </h3>

    <h5 class="mb-2">
      Only for the range mode
    </h5>

    <p>
      Shortcut types allowed are :
    </p>
    <CodeContainer
      code="['day', '-day', 'isoWeek', '-isoWeek', 'quarter', 'month', '-month', 'year', '-year', 'week', '-week']"
      class="mb-3"
    />
    <p>
      For each shortcut, a key, label and value must be specified.
      The key is a unique key for that specific shortcut.
      Additional values can be passed as a callback function that will be called whenever the user clicks on the shortcut.
      The callback receives an object as first argument with the start and end values, with the shortcut object itself.
      You can use this feature for translate existings shortcuts.
      If the value of shortcut is a number (Integer), this number correspond to number of day (for 5 --> Last 5 days).
    </p>

    <p>
      If the value of shortcut is a function, we'll use it to generate the start and end values.
      This function should return an object with the start & end values. Both values must be a moment object.
      The function is called when the user clicks on the shortcut button.
    </p>

    <CodeContainer
      code="[{
  key: 'customValue',
  label: 'My custom thing',
  value: () => {
    return {
      start: moment(),
      end: moment().add(2, 'days')
    }
  },
  callback: ({ start, end }) => {
    console.log('My shortcut was clicked with values: ', start, end)
  }
}];"
    />
    <hr class="border-top border-solid border-color my-3">

    <h3>
      Behaviour
    </h3>
    <p>
      In order to avoid having too much properties in the component, We're adding a behaviour property that is an object including some annex behaviour values.
    </p>

    <p>The default value for this object is:</p>

    <CodeContainer
      class="mb-2"
      language="javascript"
      code="{
  time: {
    nearestIfDisabled: true
  }
}"
    />

    <p>
      To override those values, pass a new object with the values you want to override:
    </p>

    <CodeContainer
      class="mb-2"
      language="html"
      code="<MazPicker
  :behaviour='{
    time: {
      nearest-if-disabled: false
    }
  }'
/>"
    />

    <p>
      If true, it will select the nearest available hour in the timepicker, if the current selected hour is disabled.
      Per example, if the hour is 12 but all the hours have been disabled until 14, then the 14 will be selected by default.
      Set false to disable this behaviour; the current hour will remain selected even if it has been disabled. The user cannot re-select it.
    </p>
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
    label="Select date in big calendar"
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
    inline
    double
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
    label="Select period"
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
