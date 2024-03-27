import { Config } from '@stencil/core';
import tailwind, { tailwindHMR, tailwindGlobal } from 'stencil-tailwind-plugin';
import { postcss } from '@stencil-community/postcss';
import tailwindConfig from './tailwind.config.ts';

export const config: Config = {
  namespace: 'maz-ui',
  plugins: [
    tailwindGlobal({
      tailwindCssPath: './src/styles/tailwind.pcss',
      tailwindConf: tailwindConfig,
      postcss: {
        plugins: [
          require('postcss-url'),
          require('postcss-nested'),
          require('postcss-import'),
          require('tailwindcss/nesting')('postcss-nesting'),
          require("tailwindcss")(tailwindConfig),
          require('autoprefixer'),
        ]
      }
    }),
    tailwind({
      tailwindCssPath: './src/styles/tailwind.pcss',
      tailwindConf: tailwindConfig,
      postcss: {
        plugins: [
          require('postcss-url'),
          require('postcss-nested'),
          require('postcss-import'),
          require('tailwindcss/nesting')('postcss-nesting'),
          require("tailwindcss")(tailwindConfig),
          require('autoprefixer'),
        ]
      }
    }),
    tailwindHMR({
      tailwindCssPath: './src/styles/tailwind.pcss',
      tailwindConf: tailwindConfig,
      postcss: {
        plugins: [
          require('postcss-url'),
          require('postcss-nested'),
          require('postcss-import'),
          require('tailwindcss/nesting')('postcss-nesting'),
          require("tailwindcss")(tailwindConfig),
          require('autoprefixer'),
        ]
      }
    }),
    postcss({
      injectGlobalPaths: [
        'src/styles/global/maz-ui-variables.css',
      ],
      plugins: [
        require('postcss-url'),
        require('postcss-nested'),
        require('postcss-import'),
        require('tailwindcss/nesting')('postcss-nesting'),
        require("tailwindcss")(tailwindConfig),
        require('autoprefixer'),
      ]
    })
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
      dir: 'docs',
      strict: true,
    },
    {
      type: 'docs-json',
      file: 'docs-json/docs.json',
      strict: true,
      // supplementalPublicTypes: 'src/public-interfaces.ts',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'dist-hydrate-script',
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
