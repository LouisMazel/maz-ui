# Contribute

## Setting up development server

Install the development dependencies by running:

```shell
make install
```

Once your dependencies are installed, start the development server with:

```shell
make serve
```

This will start the development server available at [http://localhost:2000](http://localhost:2000).

## Before submitting your pull request

```shell
make pre-publish
```

Will:
- Generate doc (all README.md) files
- Lint all files
- Bump version
- Push a version commit

## Lint

Manage by Husky
