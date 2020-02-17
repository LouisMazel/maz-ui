# MazSearch

## Props

<!-- @vuese:MazSearch:props:start -->

| Name      | Description                                                       | Type      | Required | Default |
| --------- | ----------------------------------------------------------------- | --------- | -------- | ------- |
| items     | Array of your results request                                     | `Array`   | `false`  | -       |
| value     | Is the value return when you select an item                       | —         | `true`   | -       |
| itemValue | It's a key name of your result object to be returned in the model | `String`  | `false`  | -       |
| itemText  | It's a key name of your result object to be shown in the list     | `String`  | `false`  | -       |
| dark      | Enable or disable the darkmode                                    | `Boolean` | `false`  | -       |
| loader    | Is the value return when you select an item                       | `Boolean` | `false`  | -       |
| noData    | to show `no-data` slot (when you request has no results)          | `Boolean` | `false`  | -       |

<!-- @vuese:MazSearch:props:end -->

## Events

<!-- @vuese:MazSearch:events:start -->

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| close      | -           | -          |
| input      | -           | -          |
| request    | -           | -          |
| keydown    | -           | -          |

<!-- @vuese:MazSearch:events:end -->

## Slots

<!-- @vuese:MazSearch:slots:start -->

| Name    | Description      | Default Slot Content |
| ------- | ---------------- | -------------------- |
| default | Item template    | `<p>item value</p>`  |
| no-data | No data template | `<p>No data</p>`     |

<!-- @vuese:MazSearch:slots:end -->
