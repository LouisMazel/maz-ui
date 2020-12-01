<template>
  <div class="maz-phone-number-doc">
    <h4>
      Informations
    </h4>

    <p>
      This component uses <router-link :to="{name: 'documentation-maz-input'}">
        MazInput
      </router-link> and therefore inherits all these options
    </p>

    <p>
      <strong>
        Important:
      </strong>
      Since 1.4.x, for a better compatibility with all differents countries, use <code>default-phone-number</code> prop to set and update the phone number.
      Updating the phone number is no longer available when you change the value (v-model)
    </p>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h4>
      Features list
    </h4>

    <ul>
      <li>
        <strong>Auto-detect</strong> country calling code with phone number provided
      </li>
      <li>
        You can set <strong>preferred-countries</strong>, <strong>ignored-countries</strong> or have <strong>only-countries</strong>
      </li>
      <li>
        Validation UI state: input becomes green ($success-color) when the phone number is valid (can be disabled by <strong>no-validation</strong> attr)
      </li>
      <li>
        <strong>Multi options to getting country code</strong> : By default the component get the country code via the browser (disable it with no-use-browser-locale)
        or you can use fetch-country to get the country code via https://ip2c.org/s (network needed) - you can use default-country-code option instead to set one
      </li>
      <li>
        Phone number formatting while typing
      </li>
      <li>
        You can search your country in list (open countries list & type your country name)
      </li>
      <li>
        Keyboard accessibility (Arrow down, Arrow up: Countries list navigation - Escape: Close countries list)
      </li>
      <li>
        Phone number example for each country in placeholder/label
      </li>
      <li>
        Auto focus phone number input after selecting country
      </li>
      <li>
        You can disable the flags - no-flags props
      </li>
      <li>
        Set your translations
      </li>
    </ul>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h4>
      Translations
    </h4>

    <p>
      You can translate the component with the <strong>translations</strong> attribute option like this:
    </p>

    <CodeContainer
      language="javascript"
      code=":translations=&quot;{
  countrySelectorLabel: 'Code pays',
  countrySelectorError: 'Choisir un pays',
  phoneNumberLabel: 'Numéro de téléphone',
  example: 'Exemple :'
}&quot;"
    />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h4>
      Keyboard accessibility
    </h4>
    <table class="maz-md">
      <tbody>
        <tr>
          <th>
            Entries
          </th>
          <th>
            Actions
          </th>
        </tr>
        <tr>
          <td>
            ArrowDown
          </td>
          <td>
            Navigation down in countries list
          </td>
        </tr>
        <tr>
          <td>
            ArrowUp
          </td>
          <td>
            Navigation up in countries list
          </td>
        </tr>
        <tr>
          <td>
            Escape
          </td>
          <td>
            Close countries list
          </td>
        </tr>
        <tr>
          <td>
            All letters characters
          </td>
          <td>
            Searching country name in countries list (should be open)
          </td>
        </tr>
      </tbody>
    </table>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h4>
      Examples
    </h4>

    <div class="examples">
      <ComponentContainer :code="codeExample">
        <h5>
          Basic
        </h5>

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <MazPhoneNumberInput
          ref="Phone"
          v-model="phoneNumber"
          @update="results = getJson($event)"
        />

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <p>
          <strong>Value:</strong> {{ phoneNumber || 'null' }}
        </p>

        <br>

        <strong>Results sent on @update event:</strong>
        <CodeContainer
          :code="results || 'null'"
          language="json"
        />
      </ComponentContainer>
      <ComponentContainer
        :code="example2"
      >
        <h5 class="maz-mb-2">
          Advanced settings
        </h5>
        <h6>
          With default value & preferred countries & default country code & no flags & show code on list
        </h6>

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <MazPhoneNumberInput
          v-model="phoneNumberExample"
          show-code-on-list
          default-country-code="FR"
          no-flags
          :preferred-countries="['FR', 'BE', 'DE']"
          size="lg"
          @update="resultsExample = getJson($event)"
        />
        <!-- no-use-browser-locale -->

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-3">

        <p>
          <strong>Value:</strong> {{ phoneNumberExample || 'null' }}
        </p>

        <br>

        <strong>Results sent on @update event:</strong>
        <CodeContainer
          :code="resultsExample || 'null'"
          language="json"
        />
      </ComponentContainer>
    </div>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h4>
      How to use it ?
    </h4>

    <CodeContainer
      language="html"
      code="<template>
  <MazPhoneNumberInput
    v-model=&quot;phoneNumber&quot;
  />
</template>

<script>
  import { MazPhoneNumberInput } from 'maz-ui'
  export default {
    components: { MazPhoneNumberInput }
    data () {
      return {
        phoneNumber: null
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazPhoneNumberInputDoc',
  data () {
    return {
      phoneNumber: null,
      results: null,
      phoneNumberExample: '0656565656',
      resultsExample: null,
      codeExample: `<template>
  <p>
    <strong>Value:</strong> {{ phoneNumber || 'null' }}
  </p>
  <p>
    <strong>Results:</strong> {{ results || 'null' }}
  </p>
  <MazPhoneNumberInput
    v-model="phoneNumber"
    @update="results = JSON.stringify($event)"
  />
</template>

export default {
  data () {
    return {
      phoneNumber: '',
      results: null
    }
  }
}`,
      example2: `<template>
  <p>
    <strong>Value:</strong> {{ phoneNumberExample || 'null' }}
  </p>
  <p>
    <strong>Results:</strong> {{ resultsExample || 'null' }}
  </p>
  <MazPhoneNumberInput
    v-model="phoneNumberExample"
    default-country-code="FR"
    show-code-on-list
    size="lg"
    :preferred-countries="['FR', 'BE', 'DE']"
    @update="resultsExample = getJson($event)"
  />
</template>

export default {
  data () {
    return {
      phoneNumberExample: '065656565',
      resultsExample: null
    }
  }
}`
    }
  },
  methods: {
    getJson (e) {
      return JSON.stringify(e).replace(/,/g, ',\n').replace(/{/g, '{\n').replace(/}/g, '\n}')
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-phone-number-doc {
    .examples {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
      align-items: start;

      @media screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: repeat(1, 1fr);
      }
    }

    ul li {
      margin-bottom: 8px;
    }

    code {
      background-color: var(--bg-color-dark);
      border-radius: var(--border-radius);
      color: white;
      padding: 2px 5px;
    }
  }
</style>