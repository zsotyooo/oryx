'use strict';

const colors = require('colors/safe');

const prefix = {
    info:   '\u2648 ',
    task:   null,
    step:   colors.blue('\u25cf'),
    done:   colors.green('\u2714'),
    error:  colors.red('\u2718'),
    debug:  colors.dim('\u25cf [DEBUG]')
};

function getArgs(color, prefixArg, ...args) {
    args = args.map(arg => {
        let output = arg;

        if (typeof(arg) === 'object') {
            output = '\n' + JSON.stringify(arg, '  ', 2);
        }

        if (color) {
            return colors[color].apply(null, [output]);
        }

        return output;
    });

    if (prefixArg) {
        return [prefixArg].concat(args);
    }

    return args;
}

function info() {
    console.info.apply(console, getArgs('magenta', prefix.info, ...arguments));
}

function task() {
    console.log();
    console.log.apply(console, getArgs('blue', prefix.task, ...arguments));
}

function step() {
    console.log.apply(console, getArgs(null, prefix.step, ...arguments));
}

function debug() {
    console.log.apply(console, getArgs('dim', prefix.debug, ...arguments));
}

function done() {
    console.log.apply(console, getArgs(null, prefix.done, ...arguments));
}

function error() {
    console.error.apply(console, getArgs(null, prefix.error, ...arguments));
}

module.exports = {
    info,
    task,
    step,
    done,
    error,

    debug: !!process.env.DEBUG ? debug : function(){}
}
