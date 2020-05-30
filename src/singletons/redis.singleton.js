'use strict';

const
    redis = require('redis'),
    bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

exports.singletons = ['config'];

exports.start = async({singletons: {config}, state}) => {
    const [mainClient, subClient] = await Promise.all([createClient(), createClient()]);
    state.mainClient = mainClient;
    state.subClient = subClient;

    return {mainClient, subClient};

    function createClient() {
        return new Promise((resolve, reject) => {
            const client = redis.createClient({port: config.redis.port, host: config.redis.host});
            client.on('connect', () => {
                client.removeListener('error', reject);
                resolve(client);
            });
            client.on('error', reject);
        });
    }
};

exports.stop = async({state: {mainClient, subClient}}) => {
    mainClient.end(true);
    subClient.end(true);
};
