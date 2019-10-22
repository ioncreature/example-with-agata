'use strict';

exports.singletons = ['redis'];

exports.plugins = {
    publish: {channel: 'user-logout'},
};

exports.fn = ({singletons: {redis}, plugins: {publish}}) => {
    const client = redis.mainClient;

    /**
     * @alias user.signOut
     * @param {string} name
     * @param {string} token
     * @return {Promise<void>}
     */
    return async(name, token) => {
        await client.delAsync(`token:${token}`);
        await client.zremAsync('users', name);
        await publish(name);
    };
};
