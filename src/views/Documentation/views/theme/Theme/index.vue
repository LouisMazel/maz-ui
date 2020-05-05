<template>
  <div class="theme">
    <h2>
      Theme
    </h2>

    <h3>
      How to use your own colors and text styles
    </h3>

    <p>
      To change globally the colors and text style you have to override Maz-UI
      CSS variables
    </p>

    <p>
      Instead of importing the basic CSS file
      (<strong>'maz-ui/lib/maz-ui.css'</strong>). <br />
      You must import the Maz-UI SCSS at the top of your main CSS file and place
      your own variables just before importing, follow this example:
    </p>

    <CodeContainer
      code="// main.scss

$primary-color:     red;
$default-color:     blue;
$success-color:     yellow;
$border-radius:     4px;
$base-font-size:    16px;
$base-font-family:  'Roboto';
// All available variables are just below

@import 'maz-ui/lib/scss/index.scss';

/*
* Optional: You can override the components CSS after the import
*/

// Your own CSS"
      language="scss"
    />

    <h3>
      All default variables
    </h3>

    <CodeContainer
      code="/*
* FONT BASIC
*/

$base-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !default;
$base-font-size:   16px !default;
$base-font-weight: 400 !default;
$base-line-height: 1.5 !default;

/*
* COLORS BASIC
*/

// MAJORS COLORS

$primary-color:           dodgerblue !default;
$secondary-color:         #1CD1A1 !default;
$third-color:             #C41AF9 !default;
$danger-color:            orangered !default;
$success-color:           yellowgreen !default;
$info-color:              #17A2B8 !default;
$warning-color:           #FFA300 !default;
$light-color:             whitesmoke !default;
$default-color:           #CCC !default;
$text-color:              #212121 !default;
$bg-color:                white !default;
$dark-color:              #24292E !default;
$grey-color:              #999 !default;
$placeholder-color:       #A7A7A7 !default;
$input-icon-color:        #DEDEDE !default;
$text-muted:              rgba(black, .54) !default;
$text-muted-dark:         rgba(white, .54) !default;

// OTHERS COLORS

$black-color:             black !default;
$white-color:             white !default;
$hover-bg-color:          #F2F2F2 !default;
$hover-bg-color-l:        white !default;
$muted-color:             #747474 !default;
$border-color:            #EEE !default;
$disabled-color:          #F2F2F2 !default;
$overlay-color:           rgba(#303144, .7);

/*
* DARK THEME SPECIFIC
*/

$text-color-dark:         #EEE !default;
$bg-color-dark:           #21222E !default;
$bg-color-dark-l:         #303144 !default;
$hover-bg-color-dark:     #2E2F40 !default;
$hover-bg-color-dark-l:   #2E2F40 !default;
$muted-color-dark:        rgba(255, 255, 255, .3) !default;
$disabled-color-dark:     #CCC !default;
$border-color-dark:       #3B3C53 !default;
$placeholder-color-dark:  rgba(255, 255, 255, .6) !default;
$input-icon-color-dark:   #65678F !default;
$overlay-color-dark:      rgba(86, 87, 117, .7);

/*
* BORDERS
*/

$border-radius: 8px !default;
$border-width: 1.5px !default;

/*
* RESPONSIVE BREAKPOINTS
*/

$breakpoint-mobile-s: 320px !default;
$breakpoint-mobile-m: 375px !default;
$breakpoint-mobile-l: 425px !default;
$breakpoint-tablet: 768px !default;
$breakpoint-laptop-s: 1024px !default;
$breakpoint-laptop-l: 1440px !default;
$breakpoint-4k: 1920px !default;"
      language="scss"
    />
  </div>
</template>

<script>
export default {
  name: 'Theme'
}
</script>
