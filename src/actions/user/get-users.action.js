'use strict';

exports.singletons = ['redis'];

exports.fn = ({singletons: {redis}}) => {

    /**
     * @alias users.getUsers
     * @return {Promise<Array<string>>}
     */
    return async() => {
        const users = await redis.zrangeAsync('users', 0, -1);
        return users.map(JSON.parse);
    };
};
