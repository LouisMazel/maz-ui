# MazInputTags

> UI Input tags

## Props

<!-- @vuese:MazInputTags:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|value|Input value, can be a `Array` of `String` or `null`|—|`true`|-|
|id|input id|`String`|`false`|null|
|placeholder|input placeholder|`String`|`false`|Add tags|
|disabled|When is `true` the input is disable|`Boolean`|`false`|false|
|dark|When is `true` the input has the dark theme|`Boolean`|`false`|false|
|readonly|When is `true` the input is on readonly mode|`Boolean`|`false`|false|
|error|When is `true` the input has the error style (red)|`Boolean`|`false`|false|
|success|When is `true` the input has the valid style (green)|`Boolean`|`false`|false|
|required|When is `true` the input become required & has the `*` symbol|`Boolean`|`false`|false|
|loading|When is `true` the input is a textarea|`Boolean`|`false`|false|
|clearable|When is `true` the input can be clear with a button on the right|`Boolean`|`false`|false|
|size|input size (`'lg'` / `'sm'`)|`String`|`false`|null|
|color|color option|`String`|`false`|primary|

<!-- @vuese:MazInputTags:props:end -->


## Events

<!-- @vuese:MazInputTags:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|input|return the list of current tags|`Array` or `null`|

<!-- @vuese:MazInputTags:events:end -->


## MixIns

<!-- @vuese:MazInputTags:mixIns:start -->
|MixIn|
|---|
|uniqueId|

<!-- @vuese:MazInputTags:mixIns:end -->


