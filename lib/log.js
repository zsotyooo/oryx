'use strict';

const moment = require('moment');
const pkg = require('../package');
const prefix = {
    task:   ' \u2192 ',
    step:   '   ',
    done:   ' \u2713 ',
    error:  ' \u2718 ',
    debug:  'DEBUG -'
};

function getArgs(prefixArg, ...args) {
    args = args.map(arg => {
        if (typeof(arg) === 'object') {
            return JSON.stringify(arg, '  ', 2);
        }
        return arg;
    });

    if (prefixArg) {
        return [prefixArg].concat(args);
    }

    return args;
}

function getTimestamp() {
    let timestamp = moment().format('HH:mm:ss');
    return timestamp + ' -';
}

function init() {
    console.info(pkg.name, pkg.version);
}

function task() {
    console.info();
    console.info.apply(console, getArgs(prefix.task, ...arguments));
}

function step() {
    console.log.apply(console, getArgs(prefix.step, ...arguments));
}

function stepWithTimestamp() {
    console.info.apply(console, getArgs(prefix.step, getTimestamp(), ...arguments));
}

function debug() {
    console.log.apply(console, getArgs(prefix.debug, ...arguments));
}

function done() {
    console.info.apply(console, getArgs(prefix.done, ...arguments));
}

function error() {
    console.error.apply(console, getArgs(prefix.error, ...arguments));
}

module.exports = {
    init,
    task,
    step,
    stepWithTimestamp,
    done,
    error,

    debug: !!process.env.DEBUG ? debug : function(){}
}
