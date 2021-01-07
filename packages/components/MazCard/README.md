# MazCard

## Props

<!-- @vuese:MazCard:props:start -->

| Name            | Description                                                                         | Type                | Required | Default |
| --------------- | ----------------------------------------------------------------------------------- | ------------------- | -------- | ------- |
| images          | Images displayed                                                                    | `Array`             | `false`  | null    |
| variant         | Card variant: Must be `column | row | row-reverse | column-reverse`                 | `String`            | `false`  | column  |
| href            | Make card a link (footer area excluded)                                             | `String`            | `false`  | null    |
| hrefTarget      | Target option of link: Muse be one of `_blank | _self | _parent | _top | framename` | `String`            | `false`  | \_self  |
| width           | Card width                                                                          | `String` / `Number` | `false`  | null    |
| maxWidth        | Card max-width                                                                      | `String` / `Number` | `false`  | 400     |
| footerAlign     | Footer text alignment: `right | left`                                               | `String`            | `false`  | right   |
| galleryWidth    | Gallery image width                                                                 | `String` / `Number` | `false`  | 200     |
| galleryHeight   | Gallery image height                                                                | `String` / `Number` | `false`  | 150     |
| zoom            | Enable "zoom" image on click (can't be used when the card has a link)               | `Boolean`           | `false`  | false   |
| elevation       | Set elevation to card (box-shadow)                                                  | `Boolean`           | `false`  | true    |
| radius          | Set radius to card (box-shadow)                                                     | `Boolean`           | `false`  | true    |
| bordered        | Set border to card                                                                  | `Boolean`           | `false`  | false   |
| imagesShowCount | Number of images shown in the gallery                                               | `Number`            | `false`  | 3       |
| noRemaining     | Remove transparent layer with the remain count (ex: +2)                             | `Boolean`           | `false`  | true    |
| scale           | scale animation on hover (only linked cards)                                        | `Boolean`           | `false`  | true    |

<!-- @vuese:MazCard:props:end -->

## Slots

<!-- @vuese:MazCard:slots:start -->

| Name     | Description            | Default Slot Content |
| -------- | ---------------------- | -------------------- |
| default  | -                      | -                    |
| title    | -                      | -                    |
| subtitle | -                      | -                    |
| content  | -                      | -                    |
| footer   | -                      | -                    |
| actions  | Slot above the gallery | -                    |

<!-- @vuese:MazCard:slots:end -->
