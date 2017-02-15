'use strict';

const log = require('./log');

function build(configuration, callback) {
    log.task('build');

    const webpack = require('webpack');
    const webpackPkg = require('webpack/package');

    log.step(webpackPkg.name, webpackPkg.version, 'loaded');
    log.step('building assets...');

    if (configuration.watch) {
        log.step('watching for changes, press [ctrl+c] to exit');
    }

    return webpack(configuration, (error, stats) => {
        if (error) {
            log.error(error);
            log.error('aborted');
        }

        const output = stats.toString(configuration.stats);

        if (output) {
            log.step('output:\n' + output);
        }

        if (stats.hasErrors()) {
            log.error('done with errors');
        } else {
            log.done('done');
        }

        if (configuration.watch) {
            log.stepWithTimestamp('watching...');
        }

        if (callback) {
            callback(error, stats);
        }
    });
}

module.exports = build;
