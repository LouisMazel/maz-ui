# maz-ui

[![license](https://img.shields.io/github/license/LouisMazel/maz-ui.svg?style=flat-square)](https://github.com/LouisMazel/maz-ui/blob/master/LICENSE)
[![vue 2](https://img.shields.io/badge/vue-2-42b983.svg?style=flat-square)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/maz-ui.svg?style=flat-square)](https://www.npmjs.com/package/maz-ui)
[![npm](https://img.shields.io/npm/dt/maz-ui.svg?style=flat-square)](https://www.npmjs.com/package/maz-ui)
[![Codacy grade](https://img.shields.io/codacy/grade/3d15a7c11bfe47c69a2aed93cc67cc29.svg?style=flat-square)](https://www.codacy.com/app/LouisMazel/maz-ui)

[![npm](https://nodei.co/npm/maz-ui.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/maz-ui)

> [Maz-ui](https://louismazel.github.io/maz-ui/) is a stand-alone components library for [VueJS](https://vuejs.org) & [NuxtJS](https://nuxtjs.org/)

## Documentation & Components

[Documentation & Components](https://louismazel.github.io/maz-ui/)

## Install

[Get Started](https://louismazel.github.io/maz-ui/documentation/get-started)

```shell
npm install maz-ui

# Or yarn add maz-ui
```

### On demande install

To optimize your bundle size, it's recommanded to use the [on demand install](https://louismazel.github.io/maz-ui/documentation/get-started)

```javascript
import Vue from 'vue'
import {
  ...
  MazBtn
  MazInput
  MazPicker
  MazPhoneNumberInput
  ...
} from 'maz-ui'

...
Vue.use(MazBtn)
Vue.use(MazInput)
Vue.use(MazPicker)
Vue.use(MazPhoneNumberInput)
...
```

### Quick Start - Fully install (not recommanded)

```javascript
import Vue from "vue";
import "maz-ui/lib/css/index.css";
import MazUi from "maz-ui";

Vue.use(MazUi);
```

## Contribute

### Setting up development server

Install the development dependencies by running:

```shell
make install
```

Once your dependencies are installed, start the development server with:

```shell
make serve
```

This will start the development server available at [http://localhost:3000](http://localhost:3000).

### Lint

Manage by Husky

## LICENSE

[MIT](LICENSE)
