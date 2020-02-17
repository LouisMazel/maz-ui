# MazInput

> Beautiful input UI with loading & error manager

## Props

<!-- @vuese:MazInput:props:start -->

| Name             | Description                                                            | Type      | Required | Default    |
| ---------------- | ---------------------------------------------------------------------- | --------- | -------- | ---------- |
| value            | value of the input                                                     | —         | `true`   | -          |
| id               | input id                                                               | `String`  | `false`  | -          |
| label            | value of the input                                                     | `String`  | `false`  | Enter text |
| hint             | replace the label if is present                                        | `String`  | `false`  | -          |
| color            | applyt the color (in hex format)                                       | `String`  | `false`  | dodgerblue |
| size             | input size (`'lg'` / `'sm'`)                                           | `String`  | `false`  | -          |
| type             | is the input size (`text` or `number`)                                 | `String`  | `false`  | text       |
| leftIconName     | should be a [material icon](https://material.io/resources/icons/) name | `String`  | `false`  | -          |
| rightIconName    | should be a [material icon](https://material.io/resources/icons/) name | `String`  | `false`  | -          |
| error            | When is `true` the input has the error style (red)                     | `Boolean` | `false`  | -          |
| disabled         | When is `true` the input is disable                                    | `Boolean` | `false`  | -          |
| dark             | When is `true` the input has the dark theme                            | `Boolean` | `false`  | -          |
| readonly         | When is `true` the input is on readonly mode                           | `Boolean` | `false`  | -          |
| valid            | When is `true` the input has the valid style (green)                   | `Boolean` | `false`  | -          |
| required         | When is `true` the input become required & has the `*` symbol          | `Boolean` | `false`  | -          |
| textarea         | When is `true` the input is a textarea                                 | `Boolean` | `false`  | -          |
| loading          | When is `true` the input is a textarea                                 | `Boolean` | `false`  | -          |
| clearable        | When is `true` the input can be clear with a button on the right       | `Boolean` | `false`  | -          |
| noLabel          | When is `true` the input has not label                                 | `Boolean` | `false`  | -          |
| noRequiredSymbol | When is `true` and is `required`, the `*` symbol is not showing        | `Boolean` | `false`  | -          |

<!-- @vuese:MazInput:props:end -->

## Events

<!-- @vuese:MazInput:events:start -->

| Event Name | Description                                       | Parameters |
| ---------- | ------------------------------------------------- | ---------- |
| input      | return the input value (in `@input` or `v-model`) | input      |
| focus      | send the focus event                              | event      |
| blur       | send the blur event                               | event      |
| clear      | sended when the input is clear                    | -          |
| keyup      | send the keyup event                              | event      |
| keydown    | send the keydown event                            | event      |

<!-- @vuese:MazInput:events:end -->

## Slots

<!-- @vuese:MazInput:slots:start -->

| Name                     | Description                                        | Default Slot Content |
| ------------------------ | -------------------------------------------------- | -------------------- |
| `input-icon-${position}` | Icon slot (`input-icon-left` / `input-icon-right`) | -                    |

<!-- @vuese:MazInput:slots:end -->

## MixIns

<!-- @vuese:MazInput:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazInput:mixIns:end -->
