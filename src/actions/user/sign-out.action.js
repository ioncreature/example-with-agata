'use strict';

exports.singletons = ['redis', 'config'];

exports.plugins = {
    publish: {channel: 'user-logout'},
};

exports.fn = ({singletons: {redis, config}, plugins: {publish}}) => {
    /**
     * @alias user.signOut
     * @param {string} name
     * @param {string} token
     * @return {Promise<void>}
     */
    return async(name, token) => {
        await redis.delAsync(`${config.redis.TOKEN_PREFIX}:${token}`);
        await redis.zremAsync(config.redis.USERS_KEY, name);
        await publish(name);
    };
};
