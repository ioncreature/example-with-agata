'use strict';

exports.singletons = ['redis', 'config'];

exports.fn = ({singletons: {redis, config}}) => {

    /**
     * @alias users.getUsers
     * @return {Promise<Array<string>>}
     */
    return async() => {
        const users = await redis.zrangeAsync(config.redis.USERS_KEY, 0, -1);
        return users.map(JSON.parse);
    };
};
