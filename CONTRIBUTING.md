# Contribute

## Informations

You always should use `npm` not `yarn`

## Developing

### Setting up development server

Install the development dependencies by running:

```shell
make install
```

Before start the developing app, you should build the library:

```shell
make build-lib
```

Once your dependencies are installed and the library builded, to run the server of the developing vue 3 app, use this command:

```shell
make serve-testing
```

This will start the development server available at [http://localhost:2000](http://localhost:2000).

### More

Import all modules & components in the Vue App from `maz-ui` do you need and then, clean all your changes and don't commit anything in `package/testing`

## Documentation

The documentation app (Vuepress) works only with the library builded

So, when you change anything in the library, you must re-build it to have these changes in the documentation app

```shell
make build-lib
```

To run the documentation app, use this command

```shell
make serve-doc
```

This will start the development server available at [http://localhost:8080](http://localhost:8080).

## Pull request

When you submit your PR, you should provide all informations asked in the description
