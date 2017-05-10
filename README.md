# babel-plugin-module-selector

This plugin allows you to replace one module reference with another module reference based on your setting. You can use this plugin if you have a project where customization of modules is a requirement.

## Installation

```bash
npm install babel-plugin-module-selector
```

## Usage

Configure your `.babelrc` to use this plugin. An example of it is provided below.

```json
{
  "plugins": [
    ["module-selector", {
      "roots": ["src"],
      "selectorsRoot": "customizations"
    }]
  ]
}
```

In `roots` you define the folders under which transformations will apply. `selectorsRoot` is the root folder where you place all your customization selectors. `selectorsRoot` should be within `roots`. Each customization selector can mirror a part of the folder structure of your root. I.e:

```
project
  src
    a
    b
    customizations
      selectorA
        a
      selectorB
        b
```

With the example folder structure above, when we build with selector `selectorA`, `src/customizations/selectorA/a` is used whenever `a` is required/imported. However `b` is still required/imported from `src/b`.

This model allows you to partialy replace a standard version of your app while still reusing most of the code.

You can use the `BABEL_MODULE_SELECTOR` environment variable to control which selector to use for builds, or you can add a `selector` config to your `.babelrc` to do the same.
