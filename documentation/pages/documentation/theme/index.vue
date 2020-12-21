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
      Since <code class="code">v2.0.0</code> Maz-UI use CSS variables to set colors & styles of all components. You have to override these CSS variables with your own file.
    </p>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h4>
      Use "maz-ui" binary command
    </h4>

    <p>
      - First, add the <code class="code">maz-ui.config.js</code> config file in root project folder (See the complete maz-ui.config.js example file <strong><a href="#configexample">below</a></strong>. All declarations are not required)
    </p>

    <p class="no-mb">
      Requires:
    </p>

    <ul>
      <li>
        <strong>output</strong>: is the path where the css file will saved - <i class="maz-text-muted">Ex: "./assets/root-vars.css"</i>
      </li>
      <li>
        <strong>theme</strong>: declaration of colors and others variables
      </li>
    </ul>

    <div class="maz-bg-color-light maz-border-radius maz-p-3">
      <p class="no-mb">
        <strong>Important:</strong> Declared colors must be in HEX format <i>(Ex: #FFFFFF - <strong>not #FFF</strong>)</i> or a CSS color name (Ex: red, blue, dodgerblue, etc)
      </p>
    </div>

    <CodeContainer
      language="javascript"
      code="// maz-ui.config.js

module.exports = {
  output: './assets/root.scss',
  theme: {
    main: {
      primary: '#FF0000',
      secondary: 'blue'
    }
  }
}"
    />

    <p class="no-mb">
      - Then, in your <code class="code">package.json</code> set this script:
    </p>

    <CodeContainer
      language="json"
      code="// package.json

{
  &quot;name&quot;: &quot;YOUR_APP&quot;,
  &quot;scripts&quot;: {
    ...
    &quot;get-theme&quot;: &quot;maz get-theme&quot;
    // option: --config (-c) ./path_to_your/custom.config.js
    ...
  },
}"
    />

    <p class="no-mb">
      - Execute the script
    </p>

    <CodeContainer
      language="bash"
      code="npm run get-theme"
    />

    <p>
      The CSS file is generated where you requested it (output), now import it in your applicaton (must be load after maz-ui CSS/SCSS files)
    </p>

    <p class="no-mb">
      Ex: Into your <code class="code">main.scss</code>
    </p>

    <CodeContainer
      language="scss"
      code="// main.scss
...
@import './root.css';
...
"
    />

    <hr
      id="all_vars"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3 id="configexample">
      Complete maz-ui.config.js example:
    </h3>

    <CodeContainer
      language="javascript"
      code="module.exports = {
  output: './packages/scss/_variables/_root-variables.scss',
  theme: {
    main: {
      primary: 'dodgerblue',
      secondary: '#1CD1A1',
      third: '#C41AF9',
      danger: 'orangered',
      success: 'yellowgreen',
      info: '#17A2B8',
      warning: '#FFA300',
      light: '#EEEEEE',
      dark: '#21222E',
      grey: '#999999',
      default: '#CCCCCC',
      black: 'black',
      white: 'white',
      transparent: '#FFFFFF00',
      disabled: '#F2F2F2'
    },
    typo: {
      'base-font-size': '16px',
      'base-font-family': 'system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'',
      'base-font-weight': '400',
      'base-line-height': '1.5'
    },
    border: {
      'border-width': '2px',
      'border-radius': '8px'
    },
    light: {
      typo: {
        'text-color': '#212121',
        'muted-color': 'rgba(0, 0, 0, .54)',
        'placeholder-color': '#A7A7A7',
        'icon-color': '#DEDEDE'
      },
      layout: {
        'bg-color': 'white',
        'bg-color-light': '#F2F2F2',
        'overlay-color': 'rgba(86, 87, 117, .7)'
      },
      borderColor: {
        'border-color': '#EEEEEE'
      },
      state: {
        'hover-color': '#EEEEEE',
        'disabled-color': '#F2F2F2'
      }
    },
    dark: {
      typo: {
        'text-color': '#EEEEEE',
        'muted-color': 'rgba(255, 255, 255, .54)',
        'placeholder-color': 'rgba(255, 255, 255, .6)',
        'icon-color': '#65678F'
      },
      layout: {
        'bg-color': '#21222E',
        'bg-color-light': '#303144',
        'overlay-color': 'rgba(86, 87, 117, .7)'
      },
      borderColor: {
        'border-color': '#3B3C53'
      },
      state: {
        'hover-color': '#2E2F40',
        'disabled-color': '#CCCCCC'
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
      language="css"
      code=":root {
  --maz-primary: #1e90ff;
  --maz-primary-darken: #1873cc;
  --maz-primary-alpha-05: rgba(30, 144, 255, 0.05);
  --maz-primary-alpha-40: rgba(30, 144, 255, 0.4);
  --maz-primary-alpha-50: rgba(30, 144, 255, 0.5);
  --maz-primary-alpha-60: rgba(30, 144, 255, 0.6);
  --maz-secondary: #1CD1A1;
  --maz-secondary-darken: #16a780;
  --maz-secondary-alpha-05: rgba(28, 209, 161, 0.05);
  --maz-secondary-alpha-40: rgba(28, 209, 161, 0.4);
  --maz-secondary-alpha-50: rgba(28, 209, 161, 0.5);
  --maz-secondary-alpha-60: rgba(28, 209, 161, 0.6);
  --maz-third: #C41AF9;
  --maz-third-darken: #9c14c7;
  --maz-third-alpha-05: rgba(196, 26, 249, 0.05);
  --maz-third-alpha-40: rgba(196, 26, 249, 0.4);
  --maz-third-alpha-50: rgba(196, 26, 249, 0.5);
  --maz-third-alpha-60: rgba(196, 26, 249, 0.6);
  --maz-danger: #ff4500;
  --maz-danger-darken: #cc3700;
  --maz-danger-alpha-05: rgba(255, 69, 0, 0.05);
  --maz-danger-alpha-40: rgba(255, 69, 0, 0.4);
  --maz-danger-alpha-50: rgba(255, 69, 0, 0.5);
  --maz-danger-alpha-60: rgba(255, 69, 0, 0.6);
  --maz-success: #9acd32;
  --maz-success-darken: #7ba428;
  --maz-success-alpha-05: rgba(154, 205, 50, 0.05);
  --maz-success-alpha-40: rgba(154, 205, 50, 0.4);
  --maz-success-alpha-50: rgba(154, 205, 50, 0.5);
  --maz-success-alpha-60: rgba(154, 205, 50, 0.6);
  --maz-info: #17A2B8;
  --maz-info-darken: #128193;
  --maz-info-alpha-05: rgba(23, 162, 184, 0.05);
  --maz-info-alpha-40: rgba(23, 162, 184, 0.4);
  --maz-info-alpha-50: rgba(23, 162, 184, 0.5);
  --maz-info-alpha-60: rgba(23, 162, 184, 0.6);
  --maz-warning: #FFA300;
  --maz-warning-darken: #cc8200;
  --maz-warning-alpha-05: rgba(255, 163, 0, 0.05);
  --maz-warning-alpha-40: rgba(255, 163, 0, 0.4);
  --maz-warning-alpha-50: rgba(255, 163, 0, 0.5);
  --maz-warning-alpha-60: rgba(255, 163, 0, 0.6);
  --maz-light: #EEEEEE;
  --maz-light-darken: #bebebe;
  --maz-light-alpha-05: rgba(238, 238, 238, 0.05);
  --maz-light-alpha-40: rgba(238, 238, 238, 0.4);
  --maz-light-alpha-50: rgba(238, 238, 238, 0.5);
  --maz-light-alpha-60: rgba(238, 238, 238, 0.6);
  --maz-dark: #21222E;
  --maz-dark-darken: #1a1b24;
  --maz-dark-alpha-05: rgba(33, 34, 46, 0.05);
  --maz-dark-alpha-40: rgba(33, 34, 46, 0.4);
  --maz-dark-alpha-50: rgba(33, 34, 46, 0.5);
  --maz-dark-alpha-60: rgba(33, 34, 46, 0.6);
  --maz-grey: #999999;
  --maz-grey-darken: #7a7a7a;
  --maz-grey-alpha-05: rgba(153, 153, 153, 0.05);
  --maz-grey-alpha-40: rgba(153, 153, 153, 0.4);
  --maz-grey-alpha-50: rgba(153, 153, 153, 0.5);
  --maz-grey-alpha-60: rgba(153, 153, 153, 0.6);
  --maz-default: #CCCCCC;
  --maz-default-darken: #a3a3a3;
  --maz-default-alpha-05: rgba(204, 204, 204, 0.05);
  --maz-default-alpha-40: rgba(204, 204, 204, 0.4);
  --maz-default-alpha-50: rgba(204, 204, 204, 0.5);
  --maz-default-alpha-60: rgba(204, 204, 204, 0.6);
  --maz-black: #000000;
  --maz-black-darken: #000000;
  --maz-black-alpha-05: rgba(0, 0, 0, 0.05);
  --maz-black-alpha-40: rgba(0, 0, 0, 0.4);
  --maz-black-alpha-50: rgba(0, 0, 0, 0.5);
  --maz-black-alpha-60: rgba(0, 0, 0, 0.6);
  --maz-white: #ffffff;
  --maz-white-darken: #cccccc;
  --maz-white-alpha-05: rgba(255, 255, 255, 0.05);
  --maz-white-alpha-40: rgba(255, 255, 255, 0.4);
  --maz-white-alpha-50: rgba(255, 255, 255, 0.5);
  --maz-white-alpha-60: rgba(255, 255, 255, 0.6);
  --maz-transparent: #FFFFFF00;
  --maz-transparent-darken: #cccccc;
  --maz-transparent-alpha-05: transparent;
  --maz-transparent-alpha-40: transparent;
  --maz-transparent-alpha-50: transparent;
  --maz-transparent-alpha-60: transparent;
  --maz-disabled: #F2F2F2;
  --maz-disabled-darken: #c1c1c1;
  --maz-disabled-alpha-05: rgba(242, 242, 242, 0.05);
  --maz-disabled-alpha-40: rgba(242, 242, 242, 0.4);
  --maz-disabled-alpha-50: rgba(242, 242, 242, 0.5);
  --maz-disabled-alpha-60: rgba(242, 242, 242, 0.6);
  --maz-base-font-size: 16px;
  --maz-base-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  --maz-base-font-weight: 400;
  --maz-base-line-height: 1.5;
  --maz-border-width: 2px;
  --maz-border-radius: 8px;
  --maz-text-color: #212121;
  --maz-muted-color: rgba(0, 0, 0, .54);
  --maz-placeholder-color: #A7A7A7;
  --maz-icon-color: #DEDEDE;
  --maz-bg-color: white;
  --maz-bg-color-light: #F2F2F2;
  --maz-overlay-color: rgba(86, 87, 117, .7);
  --maz-border-color: #EEEEEE;
  --maz-border-color-darken: #d6d6d6;
  --maz-hover-color: #EEEEEE;
  --maz-hover-color-darken: #d6d6d6;
  --maz-disabled-color: #F2F2F2;
  --maz-disabled-color-darken: #d9d9d9;
}

.maz-is-dark {
  --maz-text-color: #EEEEEE;
  --maz-muted-color: rgba(255, 255, 255, .54);
  --maz-placeholder-color: rgba(255, 255, 255, .6);
  --maz-icon-color: #65678F;
  --maz-bg-color: #21222E;
  --maz-bg-color-light: #303144;
  --maz-overlay-color: rgba(86, 87, 117, .7);
  --maz-border-color: #3B3C53;
  --maz-border-color-darken: #35364a;
  --maz-hover-color: #2E2F40;
  --maz-hover-color-darken: #343649;
  --maz-disabled-color: #CCCCCC;
  --maz-disabled-color-darken: #eaeaea;
}"
    />
  </div>
</template>

<script>
export default {
  name: 'Theme'
}
</script>

<style lang="scss" scoped>
  .theme {
    .no-mb {
      margin-bottom: 0 !important;
    }
  }
</style>
