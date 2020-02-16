# MazSidebar

Generic component used to show a togglable sidebar (left or right) in the layout

## Props

<!-- @vuese:MazSidebar:props:start -->

| Name       | Description | Type      | Required | Default |
| ---------- | ----------- | --------- | -------- | ------- |
| value      | -           | `Boolean` | `true`   | -       |
| id         | -           | `String`  | `false`  | -       |
| width      | -           | `Number`  | `false`  | 300     |
| loader     | -           | `Boolean` | `false`  | -       |
| noCloseBtn | -           | `Boolean` | `false`  | -       |
| noShadow   | -           | `Boolean` | `false`  | -       |
| absolute   | -           | `Boolean` | `false`  | -       |
| right      | -           | `Boolean` | `false`  | -       |
| dark       | -           | `Boolean` | `false`  | -       |
| layer      | -           | `Boolean` | `false`  | -       |

<!-- @vuese:MazSidebar:props:end -->

## Events

<!-- @vuese:MazSidebar:events:start -->

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| input      | -           | -          |

<!-- @vuese:MazSidebar:events:end -->

## Slots

<!-- @vuese:MazSidebar:slots:start -->

| Name           | Description | Default Slot Content |
| -------------- | ----------- | -------------------- |
| default        | -           | -                    |
| button-icon    | -           | -                    |
| content-loader | -           | -                    |

<!-- @vuese:MazSidebar:slots:end -->

## MixIns

<!-- @vuese:MazSidebar:mixIns:start -->

| MixIn    |
| -------- |
| uniqueId |

<!-- @vuese:MazSidebar:mixIns:end -->
