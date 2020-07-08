# MazBtn

> Simple button component

## Props

<!-- @vuese:MazBtn:props:start -->

| Name          | Description                                                                                                                                               | Type      | Required | Default |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ------- |
| id            | is the id of the button                                                                                                                                   | `String`  | `false`  | null    |
| color         | is color type (`primary` / `secondary` / `third` / `success` / `danger` / `grey` / `info` / `warning` / `light` / `dark` / `default` / `white` / `black`) | `String`  | `false`  | primary |
| type          | is the button type (button, submit or something else)                                                                                                     | `String`  | `false`  | button  |
| size          | button size (`xl`, `lg` / `md` / `sm` / `mini`)                                                                                                           | `String`  | `false`  | md      |
| loading       | is a `boolean` to show the loader & disable it                                                                                                            | `Boolean` | `false`  | false   |
| disabled      | is a `boolean` to disable the button                                                                                                                      | `Boolean` | `false`  | false   |
| outline       | apply the outline style                                                                                                                                   | `Boolean` | `false`  | false   |
| rounded       | apply the rounded style                                                                                                                                   | `Boolean` | `false`  | false   |
| fab           | apply the fab style                                                                                                                                       | `Boolean` | `false`  | false   |
| active        | apply the focus style                                                                                                                                     | `Boolean` | `false`  | false   |
| block         | take 100% of the width                                                                                                                                    | `Boolean` | `false`  | false   |
| noShadow      | remove shadow/elevation                                                                                                                                   | `Boolean` | `false`  | false   |
| leftIconName  | should be a [material icon](https://material.io/resources/icons/) name                                                                                    | `String`  | `false`  | null    |
| rightIconName | should be a [material icon](https://material.io/resources/icons/) name                                                                                    | `String`  | `false`  | null    |
| justifyStart  | add space between text and icons                                                                                                                          | `Boolean` | `false`  | false   |

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

| Name         | Description              | Default Slot Content |
| ------------ | ------------------------ | -------------------- |
| `icon-left`  | Icon slot (`icon-left`)  | none                 |
| default      | -                        | -                    |
| `icon-right` | Icon slot (`icon-right`) | none                 |

<!-- @vuese:MazBtn:slots:end -->

## MixIns

<!-- @vuese:MazBtn:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazBtn:mixIns:end -->
