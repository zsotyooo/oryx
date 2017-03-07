'use strict';

const moment = require('moment');
const log = require('./log');

function build(configuration, callback) {
    log.task('build');

    const webpack = require('webpack');
    const webpackPkg = require('webpack/package');

    log.step('using', webpackPkg.name, webpackPkg.version);
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
        const timestamp = moment().format('HH:mm:ss');
        let message = 'built';

        if (output) {
            log.step('output:\n' + output);
        }

        if (stats.hasErrors()) {
            log.error('build errors');
        }

        if (configuration.watch) {
            message = '[' + timestamp + '] built, watching...';
        }

        log.done(message);

        if (callback) {
            callback(error, stats);
        }
    });
}

module.exports = build;
