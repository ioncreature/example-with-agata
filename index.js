'use strict';

const
    program = require('commander'),
    log = require('./src/lib/logger'),
    broker = require('./src/broker');


program
    .command('dev')
    .description('Start all services for DEV purposes')
    .action(() => {
        Promise.all([
            broker.startService('auth'),
            broker.startService('chatApi'),
            broker.startService('updates'),
        ]).catch(error => {
            log.error(`Error starting services: ${error.stack}`);
            Promise
                .all([
                    broker.stopService('auth'),
                    broker.stopService('chatApi'),
                    broker.stopService('updates'),
                ])
                .catch(e => {
                    log.error(e);
                    process.exit(1);
                });
        });
    });

program
    .command('run <service>')
    .description('Start service')
    .action(service => {
        broker
            .startService(service)
            .then(() => log.info(`Service "${service}" started`))
            .catch(e => {
                log.error(e.stack);
                process.exit(1);
            });
    });


program
    .command('deps')
    .description('Return dependencies description in JSON')
    .action(() => {
        log.info(JSON.stringify(broker.getDependencies(), null, 2));
    });

program.parse(process.argv);
