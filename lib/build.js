'use strict';

const moment = require('moment');
const log = require('./log');

function build(configuration, callback) {
    log.task('build');

    const webpack = require('webpack');
    const webpackPkg = require('webpack/package');

    log.step('using', webpackPkg.name, webpackPkg.version);

    if (configuration.watch) {
        log.step('watchers enabled: press [ctrl+c] to exit');
    }

    log.step('building assets...');

    return new Promise((resolve, reject) => {
        webpack(configuration, (error, stats) => {
            if (error) {
                log.error('build aborted');
                log.error('message:', error.toString());
                log.error('details:', error.details);
                return reject(error);
            }

            let output = !!stats && stats.toString(configuration.stats);
            let duration = moment(stats.endTime - stats.startTime).format('s.SS');
            let message = 'built in ' + duration + 's';
            let logFn = 'done';

            if (output) {
                log.step('output:\n' + output);
            }

            if (stats.hasErrors()) {
                message = 'build failed';
                logFn = 'error';
            }

            if (configuration.watch) {
                let endTime = moment(stats.endTime).format('HH:mm:ss');
                message = '[' + endTime + '] ' + message + '...';
            }

            log[logFn].apply(log, [message]);

            return resolve(stats);
        });
    });
}

module.exports = build;
