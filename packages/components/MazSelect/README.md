# MazSelect

> Beautiful select input

## Props

<!-- @vuese:MazSelect:props:start -->

| Name       | Description                                  | Type      | Required | Default |
| ---------- | -------------------------------------------- | --------- | -------- | ------- |
| value      | is the value of the input                    | —         | `true`   | -       |
| options    | list of the options                          | `Array`   | `true`   | -       |
| dark       | When is `true` the select has the dark style | `Boolean` | `false`  | -       |
| itemHeight | Item in list height in pixel                 | `Number`  | `false`  | 35      |
| listHeight | List height in pixel                         | `Number`  | `false`  | 210     |

<!-- @vuese:MazSelect:props:end -->

## Events

<!-- @vuese:MazSelect:events:start -->

| Event Name | Description                 | Parameters |
| ---------- | --------------------------- | ---------- |
| open       | sent when the list is open  | -          |
| close      | sent when the list is close | -          |
| input      | -                           | -          |

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
