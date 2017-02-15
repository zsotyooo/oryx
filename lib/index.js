'use strict';

const find = require('./find');
const build = require('./build');
const log = require('./log');

log.info();

module.exports = {
    find,
    build,
    log
};
