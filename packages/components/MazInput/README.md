# MazInput

> Beautiful input UI with loading & error manager

## Props

<!-- @vuese:MazInput:props:start -->

| Name             | Description                                                                      | Type      | Required | Default    |
| ---------------- | -------------------------------------------------------------------------------- | --------- | -------- | ---------- |
| value            | value of the input                                                               | —         | `true`   | -          |
| id               | input id                                                                         | `String`  | `false`  | -          |
| placeholder      | value of the input                                                               | `String`  | `false`  | Enter text |
| hint             | replace the label if is present                                                  | `String`  | `false`  | -          |
| size             | input size (`'lg'` / `'sm'`)                                                     | `String`  | `false`  | -          |
| type             | is the input size (`text` or `number`)                                           | `String`  | `false`  | text       |
| leftIconName     | should be a [material icon](https://material.io/resources/icons/) name           | `String`  | `false`  | -          |
| rightIconName    | should be a [material icon](https://material.io/resources/icons/) name           | `String`  | `false`  | -          |
| error            | When is `true` the input has the error style (red)                               | `Boolean` | `false`  | -          |
| disabled         | When is `true` the input is disable                                              | `Boolean` | `false`  | -          |
| dark             | When is `true` the input has the dark theme                                      | `Boolean` | `false`  | -          |
| readonly         | When is `true` the input is on readonly mode                                     | `Boolean` | `false`  | -          |
| valid            | When is `true` the input has the valid style (green)                             | `Boolean` | `false`  | -          |
| required         | When is `true` the input become required & has the `*` symbol                    | `Boolean` | `false`  | -          |
| textarea         | When is `true` the input is a textarea                                           | `Boolean` | `false`  | -          |
| loading          | When is `true` the input is a textarea                                           | `Boolean` | `false`  | -          |
| clearable        | When is `true` the input can be clear with a button on the right                 | `Boolean` | `false`  | -          |
| noLabel          | When is `true` the input has not label (top placeholder when value is not empty) | `Boolean` | `false`  | -          |
| noRequiredSymbol | When is `true` and is `required`, the `*` symbol is not showing                  | `Boolean` | `false`  | -          |
| focus            | force focus style input                                                          | `Boolean` | `false`  | -          |

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
