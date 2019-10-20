'use strict';

const
    {Broker} = require('agata'),
    log = require('./lib/logger');


module.exports = Broker({
    servicesPath: './services',
});

process.on('uncaughtException', error => {
    log.error(error);
    process.nextTick(() => process.exit(1));
});

process.on('unhandledRejection', reason => {
    // Todo: print stack when it would run on Node 10+
    log.error(`Unhandled promise rejection, reason: ${reason}`);
});

let shuttingDown = false;
process.on('SIGINT', shutdown);

async function shutdown() {
    if (shuttingDown)
        return;

    log.notice('Stopping service');
    shuttingDown = true;
    const {common} = require('../../config');

    let timer;
    await Promise
        .race([
            ms.stop().then(() => clearTimeout(timer)),
            new Promise((r, reject) => {
                timer = setTimeout(
                    () => reject(new Error('Shutdown timed out')),
                    common.shutdown_interval || 5000
                );
            })
        ])
        .then(() => log.notice('Service stopped'))
        .catch(e => {
            log.error(`Unable to gracefully shutdown service "${name}".`, e.stack);
            process.exitCode = 1;
        })
        .then(() => {
            process.exit();
        });
}