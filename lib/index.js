'use strict';

const find = require('./find');
const build = require('./build');
const log = require('./log');
const pkg = require('../package');

log.info(pkg.name, pkg.version);

module.exports = {
    find,
    build,
    log
};
