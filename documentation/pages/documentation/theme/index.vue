<template>
  <div class="theme">
    <div class="theme__header maz-flex maz-space-between maz-align-center">
      <h2>
        Theme
      </h2>
      <MazBtn
        v-scroll-to="{
          el: '#all_vars',
          container: '.documentation__container'
        }"
        href="#all_vars"
      >
        All default SCSS variables
      </MazBtn>
    </div>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      How to change components colors and text style ?
    </h3>

    <p>
      To use your own colors and text style you have to override Maz-UI SCSS variables
    </p>

    <h4 class="maz-mt-6">
      Use SCSS style files instead CSS style files
    </h4>

    <p>
      Use this configuration of <strong>babel-plugin-component</strong>
    </p>

    <CodeContainer
      code="// .babelrc

{
  plugins: [
    [
      'component', {
        libraryName: 'maz-ui',
        styleLibraryName: 'scss',
        ext: '.scss'
      }
    ]
  ]
}"
    />

    <p>
      At the top of your main CSS file, place your own variables. Follow this example:
    </p>

    <i class="maz-text-muted">
      To avoid mistakes, the <strong>main.css</strong> should be import in the <strong>main.js</strong>
    </i>

    <CodeContainer
      code="// main.scss

$primary-color:     red;
$secondary-color:   blue;
$third-color:       yellow;
$border-radius:     4px;
$base-font-size:    14px;
$base-font-family:  'Roboto';

// Your own CSS"
      language="scss"
    />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      How to use your SCSS variables & Maz-UI SCSS variables globally in your app ?
    </h3>

    <p>
      With <strong>sass-loader</strong> you can do it. Load your variables file at first and then load the maz-ui SCSS variables file:
    </p>

    <CodeContainer
      code="// vue.config.js

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import './src/scss/my-own-variables.scss';
          @import 'maz-ui/scss/variables.scss';
        `
      }
    }
  }
}"
    />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      How to override CSS of maz-ui components ?
    </h3>

    <p>
      To avoid adding <strong>!important`</strong> to your CSS property, the best solution is to load your file which overloads the CSS with <strong>sass-loader</strong>:
    </p>

    <CodeContainer
      code="// vue.config.js

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import './src/scss/maz-ui/scss/your-own-css-file.scss';
        `
      }
    }
  }
}"
    />

    <hr
      id="all_vars"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

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
$bg-color-light:          #F2F2F2 !default;
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
$bg-color-dark-light:         #303144 !default;
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
$border-width: 1.5px !default;"
      language="scss"
    />
  </div>
</template>

<script>
export default {
  name: 'Theme'
}
</script>
