# MazGallery

## Props

<!-- @vuese:MazGallery:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|images|Array of string or object: `['https://via.placeholder.com/500', 'https://via.placeholder.com/600']` or `[{ slug: 'https://via.placeholder.com/500', alt: 'image descripton' }, { slug: 'https://via.placeholder.com/600', alt: 'image descripton' }]`|`Array`|`true`|-|
|imagesShownCount|Images count shown (max: 5)|`Number`|`false`|5|
|noRemaining|Remove transparent layer with the remain count (ex: +2)|`Boolean`|`false`|false|
|height|Height of gallery|`Number` /  `String`|`false`|150|
|noHeight|Remove default height|`Boolean`|`false`|false|
|width|Width of gallery|`Number` /  `String`|`false`|100%|
|noWidth|Remove default width|`Boolean`|`false`|false|
|radius|Add the default border radius to gallery|`Boolean`|`false`|true|
|zoom|Add feature to show the carousel images on click|`Boolean`|`false`|true|
|hasEmptyLayer|Layer with photography icon when no images is provided|`Boolean`|`false`|true|

<!-- @vuese:MazGallery:props:end -->


