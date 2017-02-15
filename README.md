# sable

Frontend helper for Spryker projects

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Setup](#setup)
4. [Usage](#usage)
5. [API](#api)

---

## Introduction

sable is a frontend helper for Spryker projects. 
Its aim is to replace antelope tool and simplify the assets building process.
It relies on `webpack` as building tool.



## Requirements

- `nodejs` version 6.x
- `npm` version 3.x **OR** `yarn` version 0.x

It comes with a peer dependency:

- `webpack` version 2.x (needed when you build assets using sable api)



## Setup

Open the terminal, go to your project root folder and type:

```bash
$ npm install sable --save-dev
$ # or 
$ yarn add sable --dev
```


## Usage

Once installed locally, sable can be used:

- to enrich your webpack configuration (i.e. entry points)
- to run webpack (but with a nicer terminal output)

#### webpack.config.js

```js
const sable = require('sable');

const sableFindSettings = {
    // look at API section
}

const webpackConfiguration = {
    // ...
    entry: sable.find(sableFindSettings, {
        // your project entry points
    }),
    // ...
}

module.exports = webpackConfiguration;
```

#### build.js

```js
const sable = require('sable');
const configuration = require('./webpack.config.js');

sable.build(configuration);
```

#### package.json

```json
{
    "scripts": {
        "build": "node ./path/to/build"
    }
}
```


## API

#### sable.find(setting, [initial])

Perform a search on a glob pattern and return the result paths as an object or as an array. 
It's mainly used to collect the Spryker Yves entry ponts provided by core bundles.

- `settings` {object}:
    - `roots` {array[string]}: absolute paths used to search into
    - `patterns` {array[string]}: glob pattern to apply for the search
    - `glob` {object} [optional]: glob configuration
    - `description` {string} [optional]: log description
    - `toObject(absolutePath)` {function} [optional]: return the object key
- `initial` {object|array}: initial value

If `initial` is an object (or `null` - default), 
the `find` function will return an object with:

- key: filename (or `toObject` return value)
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

#### sable.build(configuration, [callback])

Build the assets using `webpack` and print a nice terminal output.
This functon is just a wrapper around `webpack(configuration, callback)`:
feel free to use the webpack one if you want more control over the process.

- `configuration` {object}: webpack configuration file
- `callback(error, stats)` {function} [optional]: function called once webpack build task is completed

```js
sable.build(configuration, (error, stats) => {
    // do your stuff here
});
```

