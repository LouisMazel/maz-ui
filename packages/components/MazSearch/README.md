# MazSearch

> UI search input component. The search component extends MazInput, so all props/options of [MazInput](/documentation/maz-input) are available here.

## Props

<!-- @vuese:MazSearch:props:start -->

| Name      | Description                                                       | Type      | Required | Default |
| --------- | ----------------------------------------------------------------- | --------- | -------- | ------- |
| value     | Is the value return when you select an item                       | —         | `true`   | -       |
| items     | Array of your results request                                     | `Array`   | `false`  | null    |
| itemValue | It's a key name of your result object to be returned in the model | `String`  | `false`  | null    |
| itemText  | It's a key name of your result object to be shown in the list     | `String`  | `false`  | null    |
| dark      | Enable or disable the `dark-mode`                                 | `Boolean` | `false`  | false   |
| noData    | to show `no-data` slot (when you request has no results)          | `Boolean` | `false`  | false   |
| color     | Choose your color                                                 | `String`  | `false`  | primary |

<!-- @vuese:MazSearch:props:end -->

## Events

<!-- @vuese:MazSearch:events:start -->

| Event Name | Description                                                              | Parameters                                                             |
| ---------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| input      | event sent when user select an item in the items list                    | The argument is a the item or an item[key] if you use `item-value`     |
| request    | event sent after debounce --> you must start the request with this event | The argument is a string value representing the query the user entered |
| keyup      | -                                                                        | -                                                                      |
| change     | -                                                                        | -                                                                      |

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
