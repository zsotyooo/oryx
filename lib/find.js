'use strict';

const path = require('path');
const globby = require('globby');
const log = require('./log');
const cwd = process.cwd();

function parseOrigin(initial) {
    return initial || {};
}

function parseOptions(options) {
    return Object.assign({}, {
        glob: {}
    }, options);
}

function glob(configuration, roots, patterns) {
    return roots.reduce((results, root) => {
        let relativeRoot = root.replace(cwd, '.');
        log.step('searching in', relativeRoot + '...');

        let rootConfiguration = Object.assign({}, configuration, {
            cwd: root
        });

        let rootResults = globby
            .sync(patterns, rootConfiguration)
            .map(result => path.join(root, result));

        return results.concat(rootResults);
    }, []);
}

function toObject(paths, replace) {
    return paths.reduce((results, currentPath) => {
        let key = replace ? replace(currentPath) : path.basename(currentPath);
        results[key] = currentPath;
        return results;
    }, {});
}

function find(options, initial) {
    log.task('find');

    options = parseOptions(options);
    initial = parseOrigin(initial);

    if (options.description) {
        log.step(options.description);
    }

    log.debug('options:', options);
    log.debug('initial:', initial);

    let results = glob(options.glob, options.roots, options.patterns);
    let count = 0;

    if (Array.isArray(initial)) {
        results = initial.concat(results);
        count = results.length;
    } else {
        results = Object.assign({}, initial, toObject(results, options.toObject));
        count = Object.keys(results).length;
    }

    log.debug('output:', results);
    log.done(count, 'found');

    return results;
}

module.exports = find;
