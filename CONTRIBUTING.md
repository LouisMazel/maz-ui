# Contribute

## Prerequisites

- You should always use `pnpm`
- To have good support of linters and typescript, use the extensions: [Mono Workspace](https://marketplace.visualstudio.com/items?itemName=folke.vscode-monorepo-workspace) and select all packages

## Developing

### Fork the project

To create a PR, you should fork the project, not clone it.

### Create new component

Use the CLI with this command:

```shell
pnpm -F cli cli create-files -f MazNewComponent
```

The component name should always start with **Maz**

The CLI ask the new component name, then choose **All files** with the space bar and all new base files will be created:

- documentation file in `packages/docs/docs/components/maz-new-component.md` (you should add your component in `packages/cli/docs/docs/.vitepress/configs/components.mts`)
- test unit file in `packages/lib/tests/specs/components/maz-new-component.spec.ts`
- and the component file in `packages/lib/src/components/MazNewComponent.vue`

Then, let's go to create 🙂

### Create something other than a component

You should make it manually

### Setting up the development server

Install the development dependencies by running:

```shell
pnpm install
```

Once your dependencies are installed, to run the server of the developing nuxt 3 app, use this command:

```shell
pnpm -F nuxt-app dev
```

This will start the development server available at [http://localhost:3333](http://localhost:3333).

This Nuxt application uses the [maz-ui nuxt module](https://maz-ui.com/guide/nuxt), so all components are auto-imported and have `maz-ui` as a dependency, so you can import all modules.

## Documentation

To run the documentation Vitepress app, use this command:

```shell
pnpm -F docs dev
```

This will start the development server available at [http://localhost:5173/](http://localhost:5173/).

## Pull request

When you submit your PR, you should provide all information asked in the description and let the pipelines test your code.

## Be clean

Please, clean all your changes and don't commit anything in `package/nuxt-app`

---

If you have any questions, don't hesitate to contact me: you can contact me here: [https://www.loicmazuel.com/en/contact](https://www.loicmazuel.com/en/contact)
