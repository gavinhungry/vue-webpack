vue-webpack
===========
Opinionated [Vue.js](https://vuejs.org) with [webpack](https://webpack.js.org)
boilerplate from scratch. Mostly created to further my own understanding of
webpack and Babel.

Development
-----------
To start `webpack-dev-server`, which serves the application locally, watches for
changes to source code to recompile and live-reload the browser:

```sh
npm run dev
```

### Linting
To manually lint with [ESLint](https://eslint.org):

```sh
npm run lint # or `npm run lint -- -w` to watch
```

### Testing
Run all tests defined in `test/**/*.spec.js`:

```sh
npm run test # or `npm run test -- -w` to watch
```

Production
----------
To build a production-ready bundle in `dist` (will fail if either `lint` or
`test` fails):

```sh
npm run build
```

License
-------
This software is released under the terms of the **MIT license**. See `LICENSE`.
