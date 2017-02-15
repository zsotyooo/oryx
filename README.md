# sable

Frontend helper for Spryker projects

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Setup](#setup)
4. [Usage](#usage)
5. [API](#api)

**If you're looking for sable ZED dedicated soltion, [click here (sable-for-zed)](https://github.com/spryker/sable-for-zed).**

---

## Introduction

Sable is a frontend helper for Spryker projects. 
Its aim is to simplify the assets building process (by replacing Antelope tool, too), 
giving the developer the freedom to choose and configure the preprocessor for frontend.

Sable relies on `webpack` 2.

## Requirements

- `nodejs` version 6.x
- `npm` version 3.x **OR** `yarn` version 0.x

It comes with a peer dependency:

- `webpack` version 2.x (needed when you build assets using sable api)

## Setup

You need to add sable to your `package.json`; 
open the terminal, go to your project root folder and type:

```bash
npm install sable --save-dev
# or 
yarn add sable --dev
```

## Usage

Once installed, sable can be used:

- to enrich your webpack configuration
- to programmatically execute webpack (with a nicer terminal output)

The following example shows a basic sable integration with `webpack`:

#### webpack.config.js
Use sable to find Spryker Yves core entry points and add them to your public folder.
The following `sableFindSettings` constant defines where to search for them (roots),
what pattern to adopt to find them (patterns), a description to log in the terminal
(description) and how to name the entry points (toObject).

You can now decide to ask sable to look for your entry points (by changing the settings)
or add them directly as you always did with webpack (like shown in the example).

```js
const sable = require('sable');

const sableFindSettings = {
    roots: [path.resolve('vendor/spryker')],
    patterns: ['**/Yves/**/*.entry.js'],
    description: 'looking for entry points...',

    toObject: p => path.basename(p, '.entry.js')
}

const webpackConfiguration = {
    // ...
    entry: sable.find(sableFindSettings, {
        // your project entry points go here
        'app': './path/to/app',
        'commons': './path/to/commons'
    }),
    // ...
}

module.exports = webpackConfiguration;
```

#### build.js
This file is called by `package.json` scripts and contains the programmatic call to
`webpack` using `sable.build()` function. Sable will take care of printing a minimal
log in terminal console.

```js
const sable = require('sable');
const configuration = require('./webpack.config.js');

sable.build(configuration);
```

#### package.json
Add a script into your `package.json`. 

```json
{
    "scripts": {
        "build": "node ./path/to/build"
    }
}
```

You can run it now directly from the terminal console.

```bash
npm run build
# or 
yarn run build
```

## API

- find()
- build()

Advanced use:

- log.head()
- log.task()
- log.step()
- log.stepWithTimestamp()
- log.done()
- log.error()

#### find()

```
sable.find(settings, [initial])
```

Perform a glob search into provided root paths, using provided patterns.
Return all the matching paths as an object {key-value} or as an array (path array). 

- `settings {object}`:
    - `roots {array[string]}`: directories in which to search 
    - `patterns {array[string]}`: glob pattern to apply for the search
    - `glob {object} [optional]`: glob system configuration 
    (for the available options, [click here](https://github.com/isaacs/node-glob#options))
    - `description {string} [optional]`: text to log in terminal
    - `toObject(absolutePath) {function} [optional]`: define the key in returned {key-value} object
    (the value will be the found absolute path)
- `initial {object|array}`: initial value 

If `initial` is an object (or `undefined`, `null`) the `find` will return an object with:

- key: filename (or `toObject()` returned value)
- value: absolute path

If `initial` is an array, the `find` function will return an array.


##### Yves default configuration

```js
const sableFindSettings = {
    roots: [path.resolve('vendor/spryker')],
    patterns: ['**/Yves/**/*.entry.js'],
    glob: {},
    description: 'looking for entry points...',

    toObject: p => path.basename(p, '.entry.js')
}
```

#### build()

```
sable.build(configuration, [callback])
```

Build the assets using `webpack` and print a nice terminal output.
This functon is just a wrapper around `webpack(configuration, callback)`:
feel free to use the webpack one if you want more control over the process.

- `configuration {object}`: webpack configuration file
- `callback(error, stats) {function} [optional]`: function called once webpack build task is completed

```js
sable.build(configuration, (error, stats) => {
    // add youre code here
});
```

