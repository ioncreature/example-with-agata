'use strict';

const {Broker} = require('agata'),
    log = require('./lib/logger');

const broker = Broker({
    pluginsPath: 'src/plugins',
    servicesPath: 'src/services',
    actionsPath: 'src/actions',
    singletonsPath: 'src/singletons',
});

module.exports = broker;

broker.on('service-starting', name => log.debug(`Service ${name} is starting`));
broker.on('service-started', name => log.debug(`Service ${name} started`));
broker.on('service-stopping', name => log.debug(`Service ${name} is stopping`));
broker.on('service-stopped', name => log.debug(`Service ${name} stopped`));
broker.on('singleton-starting', name => log.debug(`Singleton ${name} is starting`));
broker.on('singleton-started', name => log.debug(`Singleton ${name} started`));
broker.on('singleton-stopping', name => log.debug(`Singleton ${name} is stopping`));
broker.on('singleton-stopped', name => log.debug(`Singleton ${name} stopped`));
broker.on('plugin-starting', name => log.debug(`Plugin ${name} is starting`));
broker.on('plugin-started', name => log.debug(`Plugin ${name} started`));
broker.on('action-starting', name => log.debug(`Action ${name} is starting`));
broker.on('action-started', name => log.debug(`Action ${name} started`));

process.on('uncaughtException', error => {
    log.error('Uncaught exception ', error);
    process.exit(1);
});

process.on('unhandledRejection', reason => {
    log.error('Unhandled promise rejection ', reason);
    process.exit(1);
});
