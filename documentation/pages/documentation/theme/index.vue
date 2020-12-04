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

    <p class="no-mb">
      <strong>Important:</strong> Declared colors must be in HEX format <i>(Ex: #FFFFFF - <strong>not #FFF</strong>)</i> or a CSS color name (Ex: red, blue, dodgerblue, etc)
    </p>

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
    &quot;get-theme&quot;: &quot;maz-ui get-theme&quot;
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
  --primary: #1e90ff;
  --primary-darken: #1873cc;
  --primary-alpha-05: rgba(30, 144, 255, 0.05);
  --primary-alpha-40: rgba(30, 144, 255, 0.4);
  --primary-alpha-50: rgba(30, 144, 255, 0.5);
  --primary-alpha-60: rgba(30, 144, 255, 0.6);
  --secondary: #1CD1A1;
  --secondary-darken: #16a780;
  --secondary-alpha-05: rgba(28, 209, 161, 0.05);
  --secondary-alpha-40: rgba(28, 209, 161, 0.4);
  --secondary-alpha-50: rgba(28, 209, 161, 0.5);
  --secondary-alpha-60: rgba(28, 209, 161, 0.6);
  --third: #C41AF9;
  --third-darken: #9c14c7;
  --third-alpha-05: rgba(196, 26, 249, 0.05);
  --third-alpha-40: rgba(196, 26, 249, 0.4);
  --third-alpha-50: rgba(196, 26, 249, 0.5);
  --third-alpha-60: rgba(196, 26, 249, 0.6);
  --danger: #ff4500;
  --danger-darken: #cc3700;
  --danger-alpha-05: rgba(255, 69, 0, 0.05);
  --danger-alpha-40: rgba(255, 69, 0, 0.4);
  --danger-alpha-50: rgba(255, 69, 0, 0.5);
  --danger-alpha-60: rgba(255, 69, 0, 0.6);
  --success: #9acd32;
  --success-darken: #7ba428;
  --success-alpha-05: rgba(154, 205, 50, 0.05);
  --success-alpha-40: rgba(154, 205, 50, 0.4);
  --success-alpha-50: rgba(154, 205, 50, 0.5);
  --success-alpha-60: rgba(154, 205, 50, 0.6);
  --info: #17A2B8;
  --info-darken: #128193;
  --info-alpha-05: rgba(23, 162, 184, 0.05);
  --info-alpha-40: rgba(23, 162, 184, 0.4);
  --info-alpha-50: rgba(23, 162, 184, 0.5);
  --info-alpha-60: rgba(23, 162, 184, 0.6);
  --warning: #FFA300;
  --warning-darken: #cc8200;
  --warning-alpha-05: rgba(255, 163, 0, 0.05);
  --warning-alpha-40: rgba(255, 163, 0, 0.4);
  --warning-alpha-50: rgba(255, 163, 0, 0.5);
  --warning-alpha-60: rgba(255, 163, 0, 0.6);
  --light: #EEEEEE;
  --light-darken: #bebebe;
  --light-alpha-05: rgba(238, 238, 238, 0.05);
  --light-alpha-40: rgba(238, 238, 238, 0.4);
  --light-alpha-50: rgba(238, 238, 238, 0.5);
  --light-alpha-60: rgba(238, 238, 238, 0.6);
  --dark: #21222E;
  --dark-darken: #1a1b24;
  --dark-alpha-05: rgba(33, 34, 46, 0.05);
  --dark-alpha-40: rgba(33, 34, 46, 0.4);
  --dark-alpha-50: rgba(33, 34, 46, 0.5);
  --dark-alpha-60: rgba(33, 34, 46, 0.6);
  --grey: #999999;
  --grey-darken: #7a7a7a;
  --grey-alpha-05: rgba(153, 153, 153, 0.05);
  --grey-alpha-40: rgba(153, 153, 153, 0.4);
  --grey-alpha-50: rgba(153, 153, 153, 0.5);
  --grey-alpha-60: rgba(153, 153, 153, 0.6);
  --default: #CCCCCC;
  --default-darken: #a3a3a3;
  --default-alpha-05: rgba(204, 204, 204, 0.05);
  --default-alpha-40: rgba(204, 204, 204, 0.4);
  --default-alpha-50: rgba(204, 204, 204, 0.5);
  --default-alpha-60: rgba(204, 204, 204, 0.6);
  --black: #000000;
  --black-darken: #000000;
  --black-alpha-05: rgba(0, 0, 0, 0.05);
  --black-alpha-40: rgba(0, 0, 0, 0.4);
  --black-alpha-50: rgba(0, 0, 0, 0.5);
  --black-alpha-60: rgba(0, 0, 0, 0.6);
  --white: #ffffff;
  --white-darken: #cccccc;
  --white-alpha-05: rgba(255, 255, 255, 0.05);
  --white-alpha-40: rgba(255, 255, 255, 0.4);
  --white-alpha-50: rgba(255, 255, 255, 0.5);
  --white-alpha-60: rgba(255, 255, 255, 0.6);
  --transparent: #FFFFFF00;
  --transparent-darken: #cccccc;
  --transparent-alpha-05: transparent;
  --transparent-alpha-40: transparent;
  --transparent-alpha-50: transparent;
  --transparent-alpha-60: transparent;
  --disabled: #F2F2F2;
  --disabled-darken: #c1c1c1;
  --disabled-alpha-05: rgba(242, 242, 242, 0.05);
  --disabled-alpha-40: rgba(242, 242, 242, 0.4);
  --disabled-alpha-50: rgba(242, 242, 242, 0.5);
  --disabled-alpha-60: rgba(242, 242, 242, 0.6);
  --base-font-size: 16px;
  --base-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  --base-font-weight: 400;
  --base-line-height: 1.5;
  --border-width: 2px;
  --border-radius: 8px;
  --text-color: #212121;
  --muted-color: rgba(0, 0, 0, .54);
  --placeholder-color: #A7A7A7;
  --icon-color: #DEDEDE;
  --bg-color: white;
  --bg-color-light: #F2F2F2;
  --overlay-color: rgba(86, 87, 117, .7);
  --border-color: #EEEEEE;
  --border-color-darken: #d6d6d6;
  --hover-color: #EEEEEE;
  --hover-color-darken: #bebebe;
  --disabled-color: #F2F2F2;
  --disabled-color-darken: #c1c1c1;
}

.maz-is-dark {
  --text-color: #EEEEEE;
  --muted-color: rgba(255, 255, 255, .54);
  --placeholder-color: rgba(255, 255, 255, .6);
  --icon-color: #65678F;
  --bg-color: #21222E;
  --bg-color-light: #303144;
  --overlay-color: rgba(86, 87, 117, .7);
  --border-color: #3B3C53;
  --border-color-darken: #35364a;
  --hover-color: #2E2F40;
  --hover-color-darken: #242533;
  --disabled-color: #CCCCCC;
  --disabled-color-darken: #a3a3a3;
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
