# MazInput

> Beautiful input UI with loading & error manager

## Props

<!-- @vuese:MazInput:props:start -->

| Name             | Description                                                                      | Type      | Required | Default    |
| ---------------- | -------------------------------------------------------------------------------- | --------- | -------- | ---------- |
| value            | value of the input                                                               | —         | `false`  | null       |
| id               | input id                                                                         | `String`  | `false`  | null       |
| placeholder      | value of the input                                                               | `String`  | `false`  | Enter text |
| hint             | replace the label if is present                                                  | `String`  | `false`  | null       |
| size             | input size (`'lg'` / `'sm'`)                                                     | `String`  | `false`  | null       |
| type             | is the input size (`text` or `number`)                                           | `String`  | `false`  | text       |
| leftIconName     | should be a [material icon](https://material.io/resources/icons/) name           | `String`  | `false`  | null       |
| rightIconName    | should be a [material icon](https://material.io/resources/icons/) name           | `String`  | `false`  | null       |
| error            | When is `true` the input has the error style (\$danger-color)                    | `Boolean` | `false`  | false      |
| warning          | When is `true` the input has the warning style (\$warning-color)                 | `Boolean` | `false`  | false      |
| disabled         | When is `true` the input is disable                                              | `Boolean` | `false`  | false      |
| dark             | When is `true` the input has the dark theme                                      | `Boolean` | `false`  | false      |
| readonly         | When is `true` the input is on readonly mode                                     | `Boolean` | `false`  | false      |
| success          | When is `true` the input has the valid style (\$success-color)                   | `Boolean` | `false`  | false      |
| required         | When is `true` the input become required & has the `*` symbol                    | `Boolean` | `false`  | false      |
| textarea         | When is `true` the input is a textarea                                           | `Boolean` | `false`  | false      |
| loading          | When is `true` the input is a textarea                                           | `Boolean` | `false`  | false      |
| clearable        | When is `true` the input can be clear with a button on the right                 | `Boolean` | `false`  | false      |
| noLabel          | When is `true` the input has not label (top placeholder when value is not empty) | `Boolean` | `false`  | false      |
| noRequiredSymbol | When is `true` and is `required`, the `*` symbol is not showing                  | `Boolean` | `false`  | false      |
| focus            | force focus style input                                                          | `Boolean` | `false`  | false      |
| color            | color name in basic colors                                                       | `String`  | `false`  | primary    |

<!-- @vuese:MazInput:props:end -->

## Events

<!-- @vuese:MazInput:events:start -->

| Event Name | Description                                       | Parameters |
| ---------- | ------------------------------------------------- | ---------- |
| input      | return the input value (in `@input` or `v-model`) | input      |
| focus      | sent the focus event                              | event      |
| blur       | sent the blur event                               | event      |
| paste      | sent when text is past in the textfield           | event      |
| change     | sent on input change                              | event      |
| clear      | sent when the input is clear                      | -          |
| keyup      | sent the keyup event                              | event      |
| keydown    | sent the keydown event                            | event      |
| click      | -                                                 | -          |

<!-- @vuese:MazInput:events:end -->

## Slots

<!-- @vuese:MazInput:slots:start -->

| Name         | Description              | Default Slot Content |
| ------------ | ------------------------ | -------------------- |
| `icon-left`  | Icon slot (`icon-left`)  | none                 |
| `icon-right` | Icon slot (`icon-right`) | none                 |

<!-- @vuese:MazInput:slots:end -->

## MixIns

<!-- @vuese:MazInput:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazInput:mixIns:end -->
