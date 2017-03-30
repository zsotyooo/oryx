'use strict';

const colors = require('colors/safe');
const moment = require('moment');
const log = require('./log');

function build(configuration) {
    log.task('build');

    if (!build.webpack) {
        build.loadCompiler();
    }

    log.step('using webpack', build.webpackVersion);

    if (configuration.watch) {
        log.step('watchers enabled', colors.dim('(press [ctrl+c] to exit)'));
    }

    log.step('building assets...');

    return new Promise((resolve, reject) => {
        build.webpack(configuration, (error, stats) => {
            if (error) {
                log.error('build aborted');
                log.error(colors.red('message:'), error.toString());
                log.error(colors.red('details:'), error.details);
                return reject(error);
            }

            let output = !!stats && stats.toString(configuration.stats);
            let duration = moment(stats.endTime - stats.startTime).format('s.SS');
            let message = 'built in ' + duration + 's';
            let logFn = 'done';

            if (output) {
                log.step('webpack output:\n' + output);
            }

            if (stats.hasErrors()) {
                message = 'build failed';
                logFn = 'error';
            }

            if (configuration.watch) {
                let endTime = moment(stats.endTime).format('HH:mm:ss');
                message = colors.dim('[' + endTime + '] ') + message + '...';
            }

            log[logFn].apply(log, [message]);

            return resolve(stats);
        });
    });
}

build.loadCompiler = function(webpack, webpackVersion) {
    this.webpack = webpack || require('webpack');
    this.webpackVersion = webpackVersion || require('webpack/package').version;
}

module.exports = build;
