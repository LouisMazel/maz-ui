# Theme

You must override `--maz-***` CSS variables

> **Tip**: Use color palette generator: [noeldelgado.github.io](https://noeldelgado.github.io/shadowlord/#1e90ff) (and set the percent parameter to 17,5%)

## List of CSS variables

```css
:root {
  /* PRIMARY */
  --maz-color-primary-50: #e3f1ff;
  --maz-color-primary-100: #bcdeff;
  --maz-color-primary-200: #94caff;
  --maz-color-primary-300: #6db7ff;
  --maz-color-primary-400: #45a3ff;
  --maz-color-primary: #1e90ff;
  --maz-color-primary-600: #1977d2;
  --maz-color-primary-700: #145ea6;
  --maz-color-primary-800: #0e4479;
  --maz-color-primary-900: #092b4d;
  --maz-color-primary-contrast: white;
  --maz-color-primary-alpha: rgb(30 144 255 / 60%);

  /* SECONDARY */
  --maz-color-secondary-50: #e3f9f3;
  --maz-color-secondary-100: #bbf1e3;
  --maz-color-secondary-200: #93e9d2;
  --maz-color-secondary-300: #6be1c2;
  --maz-color-secondary-400: #44d9b1;
  --maz-color-secondary: #1cd1a1;
  --maz-color-secondary-600: #17ac85;
  --maz-color-secondary-700: #128869;
  --maz-color-secondary-800: #0d634c;
  --maz-color-secondary-900: #083f30;
  --maz-color-secondary-contrast: white;
  --maz-color-secondary-alpha: rgb(28 209 161 / 60%);

  /* INFO */
  --maz-color-info-50: #e2f3f6;
  --maz-color-info-100: #b9e3ea;
  --maz-color-info-200: #91d3dd;
  --maz-color-info-300: #68c3d1;
  --maz-color-info-400: #40b2c4;
  --maz-color-info: #17a2b8;
  --maz-color-info-600: #138698;
  --maz-color-info-700: #0f6978;
  --maz-color-info-800: #0b4d57;
  --maz-color-info-900: #073137;
  --maz-color-info-contrast: white;
  --maz-color-info-alpha: rgb(23 162 184 / 60%);

  /* SUCCESS */
  --maz-color-success-50: #f2f9e5;
  --maz-color-success-100: #e1f0c2;
  --maz-color-success-200: #cfe79e;
  --maz-color-success-300: #bddf7a;
  --maz-color-success-400: #acd656;
  --maz-color-success: #9acd32;
  --maz-color-success-600: #7fa929;
  --maz-color-success-700: #648521;
  --maz-color-success-800: #496118;
  --maz-color-success-900: #2e3e0f;
  --maz-color-success-contrast: white;
  --maz-color-success-alpha: rgb(154 205 50 / 60%);

  /* WARNING */
  --maz-color-warning-50: #fff6e5;
  --maz-color-warning-100: #fee9c1;
  --maz-color-warning-200: #fedd9d;
  --maz-color-warning-300: #fdd079;
  --maz-color-warning-400: #fdc455;
  --maz-color-warning: #fcb731;
  --maz-color-warning-600: #d09728;
  --maz-color-warning-700: #a47720;
  --maz-color-warning-800: #785717;
  --maz-color-warning-900: #4c370f;
  --maz-color-warning-contrast: #374151;
  --maz-color-warning-alpha: rgb(252 183 49 / 60%);

  /* DANGER */
  --maz-color-danger-50: #ffedec;
  --maz-color-danger-100: #ffd3d2;
  --maz-color-danger-200: #ffbab8;
  --maz-color-danger-300: #ffa09e;
  --maz-color-danger-400: #ff8784;
  --maz-color-danger: #ff6d6a;
  --maz-color-danger-600: #d25a57;
  --maz-color-danger-700: #a64745;
  --maz-color-danger-800: #793432;
  --maz-color-danger-900: #4d2120;
  --maz-color-danger-contrast: white;
  --maz-color-danger-alpha: rgb(255 109 106 / 60%);

  /* WHITE */
  --maz-color-white: white;
  --maz-color-white-contrast: black;

  /* BLACK */
  --maz-color-black: black;
  --maz-color-black-contrast: white;

  /* TEXT COLOR LIGHT */
  --maz-color-text-light: #d9d9d9;
  --maz-color-muted-light: rgb(0 0 0 / 54%);

  /* TEXT COLOR DARK */
  --maz-color-text-dark: #212427;
  --maz-color-muted-dark: rgb(228 228 228 / 54%);

  /* BG OVERLAY */
  --maz-bg-overlay: rgb(0 0 0 / 50%);

  /* BG LIGHT COLOR */
  --maz-bg-color-light: white;
  --maz-bg-color-light-light: #efefef;
  --maz-bg-color-light-lighter: #f2f2f2;

  /* BG DARK COLOR */
  --maz-bg-color-dark: #21222e;
  --maz-bg-color-dark-light: #303144;
  --maz-bg-color-dark-lighter: #3b3c53;

  /**
  * FONT FAMILY
  * Not used in the library --> Use this variable on your <html> element (optional)
  **/
  --maz-font-family: system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI',
    roboto, oxygen, ubuntu, cantarell, 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
}
```
