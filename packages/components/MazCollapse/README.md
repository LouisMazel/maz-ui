# MazCollapse

> MazCollpase is a component to show or not content

## Props

<!-- @vuese:MazCollapse:props:start -->

| Name       | Description                                    | Type      | Required | Default |
| ---------- | ---------------------------------------------- | --------- | -------- | ------- |
| open       | Set `true` to open the component by default    | `Boolean` | `false`  | -       |
| dark       | Set `true` to enable dark mode                 | `Boolean` | `false`  | -       |
| arrowColor | Is the color of the arrow, must be a hex color | `String`  | `false`  | black   |

<!-- @vuese:MazCollapse:props:end -->

## Slots

<!-- @vuese:MazCollapse:slots:start -->

| Name        | Description                                      | Default Slot Content     |
| ----------- | ------------------------------------------------ | ------------------------ |
| header-text | Header slot: replace the text in collapse button | `Default Header`         |
| default     | Content default slot                             | `<p>Default Content</p>` |

<!-- @vuese:MazCollapse:slots:end -->
