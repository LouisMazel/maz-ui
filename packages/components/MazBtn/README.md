# MazBtn

> Simple button component

## Props

<!-- @vuese:MazBtn:props:start -->

| Name     | Description                                                                                                                                                                         | Type      | Required | Default |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ------- |
| id       | is the id of the button                                                                                                                                                             | `String`  | `false`  | -       |
| color    | is color type (`'primary'` / `'secondary'` / `'third'` / `'success'` / `'danger'` / `'grey'` / `'info'` / `'warning'` / `'light'` / `'dark'` / `'default'` / `'white'` / `'black'`) | `String`  | `false`  | primary |
| type     | is the button type (button, submit or something else)                                                                                                                               | `String`  | `false`  | button  |
| size     | button size (`'lg'` / `'md'` / `'mini'` / `'fab'`)                                                                                                                                  | `String`  | `false`  | -       |
| loading  | is a `boolean` to show the loader & disable it                                                                                                                                      | `Boolean` | `false`  | -       |
| disabled | is a `boolean` to disable the button                                                                                                                                                | `Boolean` | `false`  | -       |
| outline  | apply the outline style                                                                                                                                                             | `Boolean` | `false`  | -       |
| rounded  | apply the rounded style                                                                                                                                                             | `Boolean` | `false`  | -       |
| fab      | apply the fab style                                                                                                                                                                 | `Boolean` | `false`  | -       |
| active   | apply the focus style                                                                                                                                                               | `Boolean` | `false`  | -       |
| block    | take 100% of the width                                                                                                                                                              | `Boolean` | `false`  | -       |
| noShadow | remove shadow/elevation                                                                                                                                                             | `Boolean` | `false`  | -       |
| icon     | material icon name                                                                                                                                                                  | `Boolean` | `false`  | -       |

<!-- @vuese:MazBtn:props:end -->

## Events

<!-- @vuese:MazBtn:events:start -->

| Event Name | Description             | Parameters |
| ---------- | ----------------------- | ---------- |
| click      | return click event      | -          |
| mouseenter | return mouseenter event | -          |
| mouseleave | return mouseleave event | -          |

<!-- @vuese:MazBtn:events:end -->

## Slots

<!-- @vuese:MazBtn:slots:start -->

| Name    | Description               | Default Slot Content |
| ------- | ------------------------- | -------------------- |
| default | Add your button text here | -                    |

<!-- @vuese:MazBtn:slots:end -->

## MixIns

<!-- @vuese:MazBtn:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazBtn:mixIns:end -->
