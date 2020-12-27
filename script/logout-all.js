'use strict';

const
    broker = require('../src/broker'),
    log = require('../src/lib/logger');

log.info('Start script');

broker
    .start({singletons: ['redis']})
    .then(async({singletons: {redis}}) => {
        log.info('Dependencies loaded');
        const tokens = await redis.keys('token:*');
        await redis.del(...tokens, 'users');
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
