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

function toObject(paths, defineName) {
    return paths.reduce((results, currentPath) => {
        let name = defineName ? defineName(currentPath) : path.basename(currentPath);
        results[name] = currentPath;
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

    let results = glob(options.glob, options.dirs, options.patterns);
    let count = 0;

    if (Array.isArray(initial)) {
        results = initial.concat(results);
        count = results.length;
    } else {
        results = Object.assign({}, initial, toObject(results, options.defineName));
        count = Object.keys(results).length;
    }

    log.debug('output:', results);
    log.done(count, 'found');

    return results;
}

module.exports = find;
