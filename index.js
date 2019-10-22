'use strict';

const
    program = require('commander'),
    log = require('./src/lib/logger'),
    broker = require('./src/broker');


program
    .command('run <service>')
    .description('Runs service')
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
