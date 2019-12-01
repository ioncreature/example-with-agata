'use strict';

const
    broker = require('../src/broker'),
    log = require('../src/lib/logger');

log.info('Start script');

broker
    .start({singletons: ['redis']})
    .then(async({singletons: {redis}}) => {
        log.info('Dependencies loaded');
        const client = redis.mainClient;
        const tokens = await client.keysAsync('token:*');
        await client.delAsync(...tokens, 'users');
        log.info(`${tokens.length} users removed`);
    })
    .then(() => {
        log.info('Job done');
        process.exit();
    })
    .catch(e => {
        log.error(e);
        process.exit(1);
    });
