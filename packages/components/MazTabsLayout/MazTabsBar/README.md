# MazTabsBar

## Props

<!-- @vuese:MazTabsBar:props:start -->

| Name        | Description                                                                             | Type      | Required | Default |
| ----------- | --------------------------------------------------------------------------------------- | --------- | -------- | ------- |
| items       | tabs objects - ex: `[ { label: 'First Tab' }, { label: 'Second Tab', disabled: true }]` | `Array`   | `true`   | -       |
| value       | current tab active                                                                      | `Number`  | `false`  | -       |
| dark        | set the dark theme                                                                      | `Boolean` | `false`  | -       |
| alignLeft   | the tabs bar will be align on left                                                      | `Boolean` | `false`  | -       |
| noUseAnchor | you should use the history mode with VueRouter && do not use `v-model` value            | `Boolean` | `false`  | -       |

<!-- @vuese:MazTabsBar:props:end -->

## Events

<!-- @vuese:MazTabsBar:events:start -->

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| input      | -           | -          |

<!-- @vuese:MazTabsBar:events:end -->
