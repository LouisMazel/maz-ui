# maz-ui

[![license](https://img.shields.io/github/license/LouisMazel/maz-ui.svg?style=flat-square)](https://github.com/LouisMazel/maz-ui/blob/master/LICENSE)
[![vue 2](https://img.shields.io/badge/vue-2-42b983.svg?style=flat-square)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/maz-ui.svg?style=flat-square)](https://www.npmjs.com/package/maz-ui)
[![npm](https://img.shields.io/npm/dt/maz-ui.svg?style=flat-square)](https://www.npmjs.com/package/maz-ui)
[![Codacy grade](https://img.shields.io/codacy/grade/3d15a7c11bfe47c69a2aed93cc67cc29.svg?style=flat-square)](https://www.codacy.com/app/LouisMazel/maz-ui)

[![npm](https://nodei.co/npm/maz-ui.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/maz-ui)

> [Maz-ui](https://github.com/LouisMazel/maz-ui) is a component & CSS library for [Vue](https://vuejs.org)

## Documentation & Components

[Documentation & Components](https://louismazel.github.io/maz-ui/)

## Install

[Detail & CDN](https://louismazel.github.io/maz-ui/#/documentation/install)

```shell
npm install maz-ui -S
```

## Quick Start

[Detail](https://louismazel.github.io/maz-ui/#/documentation/get-started)

```javascript
import Vue from "vue";
import "maz-ui/lib/maz-ui.css";
import MazUi from "maz-ui";

Vue.use(MazUi);

// or
import {
  MazInput,
  MazButton
  // ...
} from "maz-ui";

Vue.component(MazInput.name, MazInput);
Vue.component(MazButton.name, MazButton);
```

## Contribute

### Setting up development server

Install the development dependencies by running:

```shell
npm install # npm ci
```

Once your dependencies are installed, start the development server with:

```shell
npm run serve
```

### Lint

```shell
npm run lint
```

This will start the development server available at http://localhost:8080.

For more informations, see the [Install Documentation](https://louismazel.github.io/maz-ui/#/documentation/install)

## LICENSE

[MIT](LICENSE)
