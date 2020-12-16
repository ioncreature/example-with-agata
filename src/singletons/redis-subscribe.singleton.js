'use strict';

const Redis = require('ioredis');
const log = require('../lib/logger');

exports.singletons = ['config'];

exports.start = async ({singletons: {config}, state}) => {
    const redisClient = await createClient();
    state.client = redisClient;

    return redisClient;

    function createClient() {
        return new Promise((resolve, reject) => {
            const client = new Redis({
                port: config.redis.port,
                host: config.redis.host,
            });
            client.on('connect', () => {
                client.removeListener('error', reject);
                resolve(client);
            });
            client.on('error', e => {
                log.warn(`[redis] error ${e.message}`);
                reject(e);
            });
            client.on('close', () => {
                log.debug('[redis] close');
            });
            client.on('reconnecting', () => {
                log.debug('[redis] reconnecting');
            });
            client.on('end', () => {
                log.debug('[redis] end');
            });
        });
    }
};

exports.stop = async ({state: {client}}) => {
    client && (await client.quit());
};
