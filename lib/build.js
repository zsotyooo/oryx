'use strict';

const colors = require('colors/safe');
const moment = require('moment');
const log = require('./log');

function build(...configurations) {
    return new Promise((resolve, reject) => {
        log.task('build');

        if (!build.webpack) {
            build.loadCompiler();
        }

        log.step('using webpack', build.webpackVersion);
        log.step('loading', configurations.length, 'configuration' + (configurations.length === 1 ? ' only' : 's'));

        configurations.forEach((configuration, index) => {
            if (configuration.watch) {
                log.step('watchers enabled on', colors.yellow(`configuration ${index + 1}`), colors.dim('(press [ctrl+c] to exit)'));
            }
        });

        log.step('building assets...');

        try {
            build.webpack(configurations, (error, statsArray) => {
                statsArray.stats.forEach((stats, index) => {
                    let output = !!stats && stats.toString(configurations[index].stats);
                    let duration = moment(stats.endTime - stats.startTime).format('s.SS');
                    let message = `built in ${duration}s`;
                    let logFn = 'done';

                    if (error || stats.hasErrors()) {
                        message = 'build failed';
                        logFn = 'error';
                    }

                    if (error) {
                        log.error(colors.red('webpack configuration:'), error.toString());
                        log.error(colors.red('details:'), error.details);

                        return reject(error);
                    }

                    if (output) {
                        log.step('webpack output:\n' + output);
                    }

                    message = colors.yellow(`[configuration ${index + 1}] `) + message;

                    if (configurations[index].watch) {
                        let endTime = moment(stats.endTime).format('HH:mm:ss');
                        message = colors.dim(`[${endTime}] `) + message + '...';
                    }

                    log[logFn].apply(log, [message]);
                });

                return resolve(statsArray);
            });
        } catch (error) {
            log.error(colors.red('webpack configuration:'), error.toString());
            log.error('build aborted');

            return reject(error);
        }
    });
}

build.loadCompiler = function (webpack, webpackVersion) {
    this.webpack = webpack || require('webpack');
    this.webpackVersion = webpackVersion || require('webpack/package').version;
}

module.exports = build;
