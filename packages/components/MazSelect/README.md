# MazSelect

> Beautiful select input

## Props

<!-- @vuese:MazSelect:props:start -->

| Name        | Description                                  | Type      | Required | Default       |
| ----------- | -------------------------------------------- | --------- | -------- | ------------- |
| value       | is the value of the input                    | —         | `true`   | -             |
| options     | list of the options                          | `Array`   | `true`   | -             |
| disabled    | When is `true` the select is disabled        | `Boolean` | `false`  | -             |
| dark        | When is `true` the select has the dark style | `Boolean` | `false`  | -             |
| itemHeight  | Item in list height in pixel                 | `Number`  | `false`  | 35            |
| listHeight  | List height in pixel                         | `Number`  | `false`  | 210           |
| placeholder | The input label                              | `String`  | `false`  | Select option |

<!-- @vuese:MazSelect:props:end -->

## Events

<!-- @vuese:MazSelect:events:start -->

| Event Name | Description                 | Parameters |
| ---------- | --------------------------- | ---------- |
| open       | sent when the list is open  | -          |
| close      | sent when the list is close | -          |
| input      | -                           | -          |
| keyup      | -                           | -          |
| change     | -                           | -          |

<!-- @vuese:MazSelect:events:end -->

## Slots

<!-- @vuese:MazSelect:slots:start -->

| Name  | Description    | Default Slot Content |
| ----- | -------------- | -------------------- |
| arrow | The arrow icon | the arrow svg        |

<!-- @vuese:MazSelect:slots:end -->

## MixIns

<!-- @vuese:MazSelect:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazSelect:mixIns:end -->
