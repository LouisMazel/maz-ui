# MazPhoneNumberInput

## Props

<!-- @vuese:MazPhoneNumberInput:props:start -->

| Name               | Description                                                                                                                                                                        | Type      | Required | Default |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ------- |
| value              | -                                                                                                                                                                                  | —         | `false`  | -       |
| id                 | -                                                                                                                                                                                  | `String`  | `false`  | -       |
| disabled           | -                                                                                                                                                                                  | `Boolean` | `false`  | -       |
| defaultCountryCode | set default country code (Ex: `default-country-code="FR"`)                                                                                                                         | `String`  | `false`  | -       |
| size               | Same as MazInput (options: `sm|md|lg`)                                                                                                                                             | `String`  | `false`  | -       |
| preferredCountries | Countries selected will be at the top of the list - Ex : `preferred-countries="['FR', 'BE', 'DE']`                                                                                 | `Array`   | `false`  | -       |
| onlyCountries      | Only countries selected are in list - Ex : `only-countries="['FR', 'BE', 'DE']`                                                                                                    | `Array`   | `false`  | -       |
| ignoredCountries   | Countries seleted are remove from the list - Ex : `ignored-countries="['FR', 'BE', 'DE']`                                                                                          | `Array`   | `false`  | -       |
| translations       | Translate text in component - By default `{ countrySelectorLabel: 'Country code', countrySelectorError: 'Choose country', phoneNumberLabel: 'Phone number', example: 'Example:' }` | `Object`  | `false`  | -       |
| noValidation       | Remove the validation UI state (success border color)                                                                                                                              | `Boolean` | `false`  | -       |
| noFlags            | Remove flags in country selector                                                                                                                                                   | `Boolean` | `false`  | -       |
| noExample          | Remove the number example from the label input                                                                                                                                     | `Boolean` | `false`  | -       |
| countriesHeight    | Change the height of country item in list                                                                                                                                          | `Number`  | `false`  | 30      |
| noUseBrowserLocale | Disable use of browser locale to init the country selector (usefull for Nuxt.JS)                                                                                                   | `Boolean` | `false`  | -       |
| fetchCountry       | Fetch country code via https://ip2c.org/s - Network needed - (Do not use it with default-country-code options)                                                                     | `Boolean` | `false`  | -       |
| noCountrySelector  | The country selector is not shown, you can validate your phone number with the country code set                                                                                    | `Boolean` | `false`  | -       |
| showCodeOnList     | Show the country phone code in the list                                                                                                                                            | `Boolean` | `false`  | -       |
| dark               | Enable the dark mode                                                                                                                                                               | `Boolean` | `false`  | -       |
| color              | Use color                                                                                                                                                                          | `String`  | `false`  | primary |

<!-- @vuese:MazPhoneNumberInput:props:end -->

## Events

<!-- @vuese:MazPhoneNumberInput:events:start -->

| Event Name | Description             | Parameters                                                         |
| ---------- | ----------------------- | ------------------------------------------------------------------ |
| update     | sent when the user tape | Object with all paser values                                       |
| input      | sent when the user tape | Phone number value formatted in e164 format (international format) |
| focus      | -                       | -                                                                  |
| blur       | -                       | -                                                                  |
| change     | -                       | -                                                                  |

<!-- @vuese:MazPhoneNumberInput:events:end -->

## Slots

<!-- @vuese:MazPhoneNumberInput:slots:start -->

| Name  | Description                       | Default Slot Content |
| ----- | --------------------------------- | -------------------- |
| arrow | slot arrow: change the arrow icon | `<ArrowIcon />`      |

<!-- @vuese:MazPhoneNumberInput:slots:end -->

## MixIns

<!-- @vuese:MazPhoneNumberInput:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazPhoneNumberInput:mixIns:end -->
