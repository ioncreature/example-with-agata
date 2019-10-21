'use strict';

const
    {Broker} = require('agata'),
    log = require('./lib/logger');

const broker = Broker({
    servicesPath: './services',
    actionsPath: './actions',
    singletonsPath: './singletons',
});

module.exports = broker;

process.on('uncaughtException', error => {
    log.error('Uncaught exception', error);
    process.exit(1);
});

process.on('unhandledRejection', reason => {
    log.error('Unhandled promise rejection', reason);
    process.exit(1);
});
