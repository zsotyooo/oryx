'use strict';

const prefix = {
    info:   '\u2648 ',
    task:   null,
    step:   '\u25CF',
    done:   '\u2713',
    error:  '\u2718',
    debug:  '\u25CF [DEBUG]'
};

function getArgs(prefixArg, ...args) {
    args = args.map(arg => {
        if (typeof(arg) === 'object') {
            return '\n' + JSON.stringify(arg, '  ', 2);
        }
        return arg;
    });

    if (prefixArg) {
        return [prefixArg].concat(args);
    }

    return args;
}

function info() {
    console.info.apply(console, getArgs(prefix.task, ...arguments));
}

function task() {
    console.log();
    console.log.apply(console, getArgs(prefix.task, ...arguments));
}

function step() {
    console.log.apply(console, getArgs(prefix.step, ...arguments));
}

function debug() {
    console.log.apply(console, getArgs(prefix.debug, ...arguments));
}

function done() {
    console.log.apply(console, getArgs(prefix.done, ...arguments));
}

function error() {
    console.error.apply(console, getArgs(prefix.error, ...arguments));
}

module.exports = {
    info,
    task,
    step,
    done,
    error,

    debug: !!process.env.DEBUG ? debug : function(){}
}
