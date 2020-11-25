# MazSearch

> UI search input component. The search component extends MazInput, so all props/options of [MazInput](/documentation/maz-input) are available here.

## Props

<!-- @vuese:MazSearch:props:start -->

| Name            | Description                                                       | Type      | Required | Default |
| --------------- | ----------------------------------------------------------------- | --------- | -------- | ------- |
| value           | Is the value return when you select an item                       | `String`  | `false`  | null    |
| items           | Array of your results request                                     | `Array`   | `false`  | null    |
| itemValue       | It's a key name of your result object to be returned in the model | `String`  | `false`  | null    |
| itemText        | It's a key name of your result object to be shown in the list     | `String`  | `false`  | null    |
| dark            | Enable or disable the `dark-mode`                                 | `Boolean` | `false`  | false   |
| noData          | to show `no-data` slot (when you request has no results)          | `Boolean` | `false`  | false   |
| color           | Choose your color                                                 | `String`  | `false`  | primary |
| open            | To open the list                                                  | `Boolean` | `false`  | false   |
| loading         | Add loading effect to input                                       | `Boolean` | `false`  | false   |
| replaceOnSelect | Replace the query typed by the "item text" selected in list       | `Boolean` | `false`  | false   |
| clearOnSelect   | Clear query typed on select                                       | `Boolean` | `false`  | false   |
| debounce        | remove debounce before send request                               | `Boolean` | `false`  | true    |
| size            | input size                                                        | `String`  | `false`  | md      |

<!-- @vuese:MazSearch:props:end -->

## Events

<!-- @vuese:MazSearch:events:start -->

| Event Name | Description                                           | Parameters                                                         |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| focus      | -                                                     | -                                                                  |
| input      | event sent when user select an item in the items list | The argument is a the item or an item[key] if you use `item-value` |
| request    | -                                                     | -                                                                  |
| keydown    | -                                                     | -                                                                  |
| keyup      | -                                                     | -                                                                  |
| change     | -                                                     | -                                                                  |
| clear      | -                                                     | -                                                                  |
| blur       | -                                                     | -                                                                  |
| paste      | -                                                     | -                                                                  |
| click      | -                                                     | -                                                                  |

<!-- @vuese:MazSearch:events:end -->

## Slots

<!-- @vuese:MazSearch:slots:start -->

| Name       | Description       | Default Slot Content                                       |
| ---------- | ----------------- | ---------------------------------------------------------- |
| icon-left  | Custom left icon  | -                                                          |
| icon-right | Custom right icon | -                                                          |
| default    | Item template     | `<p>{{ item value }}</p>`                                  |
| no-data    | No data template  | `<i class="material-icons maz-text-danger">search_off</i>` |

<!-- @vuese:MazSearch:slots:end -->
