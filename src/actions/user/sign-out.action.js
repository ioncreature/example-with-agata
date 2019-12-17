'use strict';

exports.singletons = ['redis', 'config'];

exports.plugins = {
    publish: {channel: 'user-logout'},
};

exports.fn = ({singletons: {redis, config}, plugins: {publish}}) => {
    const client = redis.mainClient;

    /**
     * @alias user.signOut
     * @param {string} name
     * @param {string} token
     * @return {Promise<void>}
     */
    return async(name, token) => {
        await client.delAsync(`${config.redis.TOKEN_PREFIX}:${token}`);
        await client.zremAsync(config.redis.USERS_KEY, name);
        await publish(name);
    };
};
