# oryx (beta)

Frontend helper for Spryker projects

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Setup](#setup)
4. [Usage](#usage)
5. [API](#api)

> If you're looking for **oryx ZED dedicated solution**, [click here (oryx-for-zed)](https://github.com/spryker/oryx-for-zed).

---

## Introduction

oryx is a frontend helper for Spryker projects. 
Its aim is to simplify the assets building process (by replacing Antelope tool, too), 
giving a developer the freedom to choose and configure the preprocessor for frontend.

oryx relies on `webpack` 2.

## Requirements

- `nodejs` version 6.x LTS
- `npm` version >= 3.x *or* `yarn` version >= 0.19.x

## Setup

You need to add oryx to your `package.json`; 
open the terminal, go to your project root folder and type:

```bash
npm install @spryker/oryx --save-dev
# or 
yarn add @spryker/oryx --dev
```

oryx comes with a peer dependency:

- `webpack` version >= 2.x (needed when you build assets using oryx api)

## Usage

Once installed, oryx can be used:

- to enrich your webpack configuration
- to programmatically execute webpack (with a nicer terminal output)

The following example shows a basic oryx integration with `webpack`.

#### webpack.config.js
Use oryx to find Spryker Yves core entry points and add them to your configuration.
The following `entrySettings` constant defines where to search for them (`dirs`),
which patterns to adopt to spot them (`patterns`), the description to log in the terminal
(`description`) and how to name the entry points (`defineName(path)`).

You can now decide to ask oryx to look for your own entry points (by changing the settings)
or add them directly as you always did with webpack (like shown in the example).

```js
const oryx = require('@spryker/oryx');

const entrySettings = {
    roots: [path.resolve('vendor/spryker')],
    patterns: ['**/Yves/**/*.entry.js'],
    description: 'looking for entry points...',

    defineName: p => path.basename(p, '.entry.js')
}

const webpackConfiguration = {
    // ...
    entry: oryx.find(entrySettings, {
        // your project entry points go here
        'app': './path/to/app',
        'commons': './path/to/commons'
    }),
    // ...
}

module.exports = webpackConfiguration;
```

#### build.js
This file contains the programmatic call to`webpack` using `oryx.build()` function. 
oryx will take care of printing a minimal log in the terminal console.

```js
const oryx = require('oryx');
const configuration = require('./webpack.config.js');

oryx.build(configuration);
```

#### package.json
Add a script into your `package.json` pointing to `build.js`. 

```json
{
    "scripts": {
        "build": "node ./path/to/build"
    }
}
```

You can now run your script directly from the terminal console.

```bash
npm run build
# or 
yarn run build
```

## API

- [find()](#find)
- [build()](#build)
- [log functions](#log-functions)

### find()

```
oryx.find(settings, [initial])
```

Perform a glob search into provided directories, using provided patterns.
Return all the matching paths as an object {name-path} or as an array (path array). 

- `settings {object}`:
    - `dirs {array[string]}`: directories in which to search 
    - `patterns {array[string]}`: glob patterns to apply for the search
    - `glob {object} [optional]`: glob system configuration 
    (for the available options, [click here](https://github.com/isaacs/node-glob#options))
    - `description {string} [optional]`: text to log in terminal
    - `defineName(path) {function} [optional]`: define the name in returned {name-path} object
- `initial {object|array}`: initial value 

If `initial` is an object (or `undefined`, `null`) the `find` will return 
an extended {name-path} object:

- name: filename (or `defineName(path)` returned value)
- path: matching absolute path

If `initial` is an array, the `find` function will return an extended array of matching absolute paths.
In this case, `defineName(path)` function won't be called.


#### Yves entry default configuration example

```js
const entrySettings = {
    roots: [path.resolve('vendor/spryker')],
    patterns: ['**/Yves/**/*.entry.js'],
    glob: {},
    description: 'looking for entry points...',

    defineName: p => path.basename(p, '.entry.js')
}
```

### build()

```
oryx.build(configuration, [callback])
```

Build the assets using `webpack` and print a nice terminal output.
This functon is just a wrapper around `webpack(configuration, callback)`:
feel free to use the webpack one if you want more control over the process.
Return a `promise`: resolve with `webpack` stats, reject with the error object.

- `configuration {object}`: webpack configuration file
- `callback(error, stats) {function} [optional]`: function called once webpack build task is completed

```js
oryx.build(configuration, (error, stats) => {
    // add youre code here
});
```

### log functions

- `log.info()`: print an info message
- `log.task()`: print a task message
- `log.step()`: print a step message
- `log.done()`: print a done message
- `log.error()`: print an error message
- `log.debug()`: print debug message

To print debug messages, set `process.env.DEBUG` variable to `true`. 
Assuming you have a `build` script in your `package.json`, you can type in terminal:

```bash
DEBUG=true npm run build
# or
DEBUG=true yarn run build
```


