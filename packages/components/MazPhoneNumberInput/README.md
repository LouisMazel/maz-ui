# MazPhoneNumberInput

## Props

<!-- @vuese:MazPhoneNumberInput:props:start -->

| Name               | Description                                                                                                                                                                        | Type      | Required | Default     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ----------- | ------- | ---- |
| value              | -                                                                                                                                                                                  | —         | `false`  | null        |
| id                 | -                                                                                                                                                                                  | `String`  | `false`  | null        |
| disabled           | -                                                                                                                                                                                  | `Boolean` | `false`  | false       |
| defaultPhoneNumber | set default phone number (Ex: `default-phone-number="0658585858"`)                                                                                                                 | `String`  | `false`  | null        |
| defaultCountryCode | set default country code (Ex: `default-country-code="FR"`)                                                                                                                         | `String`  | `false`  | null        |
| size               | Same as MazInput (options: `sm                                                                                                                                                     | md        | lg`)     | `String`    | `false` | null |
| preferredCountries | Countries selected will be at the top of the list - Ex : `preferred-countries="['FR', 'BE', 'DE']`                                                                                 | `Array`   | `false`  | null        |
| onlyCountries      | Only countries selected are in list - Ex : `only-countries="['FR', 'BE', 'DE']`                                                                                                    | `Array`   | `false`  | null        |
| ignoredCountries   | Countries seleted are remove from the list - Ex : `ignored-countries="['FR', 'BE', 'DE']`                                                                                          | `Array`   | `false`  | Array       |
| translations       | Translate text in component - By default `{ countrySelectorLabel: 'Country code', countrySelectorError: 'Choose country', phoneNumberLabel: 'Phone number', example: 'Example:' }` | `Object`  | `false`  | null        |
| noValidation       | Remove the validation UI state (success border color)                                                                                                                              | `Boolean` | `false`  | false       |
| noFlags            | Remove flags in country selector                                                                                                                                                   | `Boolean` | `false`  | false       |
| noExample          | Remove the number example from the label input                                                                                                                                     | `Boolean` | `false`  | false       |
| noSearch           | Remove the search countries functionality                                                                                                                                          | `Boolean` | `false`  | false       |
| countriesHeight    | Change the height of country item in list                                                                                                                                          | `Number`  | `false`  | 30          |
| noUseBrowserLocale | Disable use of browser locale to init the country selector (usefull for Nuxt.JS)                                                                                                   | `Boolean` | `false`  | false       |
| fetchCountry       | Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)                                                                     | `Boolean` | `false`  | false       |
| noCountrySelector  | The country selector is not shown, you can validate your phone number with the country code set                                                                                    | `Boolean` | `false`  | false       |
| showCodeOnList     | Show the country phone code in the list                                                                                                                                            | `Boolean` | `false`  | false       |
| dark               | Enable the dark mode                                                                                                                                                               | `Boolean` | `false`  | false       |
| color              | Use color                                                                                                                                                                          | `String`  | `false`  | primary     |
| placeholder        | Set placholder of phone number input                                                                                                                                               | `String`  | `false`  | null        |
| hint               | hint message shown on phone number text field                                                                                                                                      | `String`  | `false`  | null        |
| position           | set the position of countries list (ex: `top`, `top right`, `bottom right`)                                                                                                        | `String`  | `false`  | left bottom |

<!-- @vuese:MazPhoneNumberInput:props:end -->

## Events

<!-- @vuese:MazPhoneNumberInput:events:start -->

| Event Name | Description             | Parameters                                                         |
| ---------- | ----------------------- | ------------------------------------------------------------------ |
| update     | sent when the user tape | Object with all parsed values                                      |
| input      | sent when the user tape | Phone number value formatted in e164 format (international format) |
| blur       | -                       | -                                                                  |
| focus      | -                       | -                                                                  |
| change     | -                       | -                                                                  |
| clear      | -                       | -                                                                  |

<!-- @vuese:MazPhoneNumberInput:events:end -->

## Slots

<!-- @vuese:MazPhoneNumberInput:slots:start -->

| Name       | Description       | Default Slot Content |
| ---------- | ----------------- | -------------------- |
| icon-left  | Custom left icon  | -                    |
| icon-right | Custom right icon | -                    |

<!-- @vuese:MazPhoneNumberInput:slots:end -->

## MixIns

<!-- @vuese:MazPhoneNumberInput:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazPhoneNumberInput:mixIns:end -->
