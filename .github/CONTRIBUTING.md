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

- Generate docs (all README.md) files
- Lint all files
- Push modifications if it's necessary

## Lint

Manage by Husky
