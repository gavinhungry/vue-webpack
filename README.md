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
To manually lint JavaScript with [ESLint](https://eslint.org):

```sh
npm run jslint
```

To lint CSS with [stylelint](https://stylelint.io/) (including component
styles):

```sh
npm run csslint
```

To lint both JavaScript and CSS, use:

```sh
npm run lint
```

### Testing
Run all tests defined in `test/**/*.spec.js`:

```sh
npm run test
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
