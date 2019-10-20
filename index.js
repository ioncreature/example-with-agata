'use strict';

const
    program = require('commander'),
    log = require('./src/lib/logger'),
    broker = require('./src/broker');

console.log(require('./config'));
program
    .command('run <service>')
    .description('Runs service')
    .action(service => {
        broker
            .startService(service)
            .then(() => log.notice(`Service "${service}" started`))
            .catch(e => {
                log.error(e);
                process.exit(1);
            });
    });
