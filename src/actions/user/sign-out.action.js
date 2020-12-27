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
    return async (name, token) => {
        await redis.del(`${config.redis.TOKEN_PREFIX}:${token}`);
        await redis.zrem(config.redis.USERS_KEY, name);
        await publish({name});
    };
};
