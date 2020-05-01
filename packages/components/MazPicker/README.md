# MazPicker

## Props

<!-- @vuese:MazPicker:props:start -->

| Name           | Description                                                                                                              | Type      | Required | Default     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | --------- | -------- | ----------- |
| value          | v-model --> input value must be is the same format like                                                                  | —         | `true`   | -           |
| open           | if is `true`, the picker is open                                                                                         | `Boolean` | `false`  | -           |
| locale         | moment JS locale                                                                                                         | —         | `false`  | -           |
| position       | override the date picker postion (top / bottom / left / right)                                                           | `String`  | `false`  | -           |
| format         | the value in `v-model` will be returned in this format                                                                   | `String`  | `false`  | YYYY-MM-DD  |
| formatted      | the value in `@formatted` event & shown in input will be formatted with this                                             | `String`  | `false`  | LL          |
| minDate        | minimum date the user can set (same format as the model)                                                                 | `String`  | `false`  | -           |
| maxDate        | maximum date the user can set (same format as the model)                                                                 | `String`  | `false`  | -           |
| dark           | set dark mode                                                                                                            | `Boolean` | `false`  | -           |
| persistent     | set dark mode                                                                                                            | `Boolean` | `false`  | -           |
| noHeader       | to remove the picker's header                                                                                            | `Boolean` | `false`  | -           |
| noFooter       | to remove the picker's footer (buttons container)                                                                        | `Boolean` | `false`  | -           |
| noNow          | to remove the `now` button                                                                                               | `Boolean` | `false`  | -           |
| nowTranslation | translation of now of button                                                                                             | `String`  | `false`  | Today       |
| noWeekendsDays | all week-ends days disabled                                                                                              | `Boolean` | `false`  | -           |
| autoClose      | close picker on select date                                                                                              | `Boolean` | `false`  | -           |
| inline         | Inline picker UI (no input, no dialog)                                                                                   | `Boolean` | `false`  | -           |
| disabledDates  | disabled dates `Array of dates (same format as the value/format attribute)`,                                             | `Array`   | `false`  | -           |
| disabledWeekly | Days of the week which are disabled every week, in Array format with day index, Sunday as 0 and Saturday as 6: `[0,4,6]` | `Array`   | `false`  | -           |
| doubleCalendar | show double calendar                                                                                                     | `Boolean` | `false`  | -           |
| range          | Enable range mode to select periode                                                                                      | `Boolean` | `false`  | -           |
| label          | Change placeholder/label of input                                                                                        | `String`  | `false`  | Select date |

<!-- @vuese:MazPicker:props:end -->

## Events

<!-- @vuese:MazPicker:events:start -->

| Event Name | Description                                      | Parameters                          |
| ---------- | ------------------------------------------------ | ----------------------------------- |
| formatted  | -                                                | -                                   |
| input      | return the date value (in `@input` or `v-model`) | date formatted with "format" option |

<!-- @vuese:MazPicker:events:end -->

## Slots

<!-- @vuese:MazPicker:slots:start -->

| Name  | Description    | Default Slot Content              |
| ----- | -------------- | --------------------------------- |
| arrow | The arrow icon | Default arrow svg `<ArrowIcon />` |

<!-- @vuese:MazPicker:slots:end -->

## MixIns

<!-- @vuese:MazPicker:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazPicker:mixIns:end -->
