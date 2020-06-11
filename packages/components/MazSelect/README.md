# MazSelect

> Beautiful select input

## Props

<!-- @vuese:MazSelect:props:start -->

| Name              | Description                                                          | Type      | Required | Default           |
| ----------------- | -------------------------------------------------------------------- | --------- | -------- | ----------------- |
| value             | is the value of the input                                            | —         | `true`   | -                 |
| options           | list of the options                                                  | `Array`   | `true`   | -                 |
| disabled          | When is `true` the select is disabled                                | `Boolean` | `false`  | -                 |
| dark              | When is `true` the select has the dark style                         | `Boolean` | `false`  | -                 |
| itemHeight        | Item in list height in pixel                                         | `Number`  | `false`  | 35                |
| listHeight        | List height in pixel                                                 | `Number`  | `false`  | 260               |
| listWidth         | List width in pixel                                                  | `Number`  | `false`  | -                 |
| placeholder       | The select has no label in the input                                 | `String`  | `false`  | Select option     |
| noLabel           | When is `true` the select you select multiple values                 | `Boolean` | `false`  | -                 |
| multiple          | When is `true` the select you select multiple values                 | `Boolean` | `false`  | -                 |
| search            | When is `true` the select has an input to search in options          | `Boolean` | `false`  | -                 |
| searchPlaceholder | the search input placeholder                                         | `String`  | `false`  | Search in options |
| color             | the search input placeholder                                         | `String`  | `false`  | primary           |
| size              | input size                                                           | `String`  | `false`  | md                |
| open              | When is `true` the option list is open                               | `Boolean` | `false`  | -                 |
| position          | set the position of option list (`top`, `top right`, `bottom right`) | `String`  | `false`  | left bottom       |

<!-- @vuese:MazSelect:props:end -->

## Events

<!-- @vuese:MazSelect:events:start -->

| Event Name | Description                | Parameters                |
| ---------- | -------------------------- | ------------------------- |
| close      | -                          | -                         |
| open       | sent when the list is open | -                         |
| input      | return the select input    | the option value selected |
| keyup      | -                          | -                         |
| change     | -                          | -                         |

<!-- @vuese:MazSelect:events:end -->

## Slots

<!-- @vuese:MazSelect:slots:start -->

| Name       | Description         | Default Slot Content                                       |
| ---------- | ------------------- | ---------------------------------------------------------- |
| icon-left  | custom left icon    | -                                                          |
| arrow      | The arrow icon      | the arrow svg                                              |
| default    | Item template       | `<span>{{ option.label }}</span>`                          |
| no-results | No results template | `<i class="material-icons maz-text-danger">search_off</i>` |

<!-- @vuese:MazSelect:slots:end -->

## MixIns

<!-- @vuese:MazSelect:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazSelect:mixIns:end -->
