'use strict';

const {BadRequest} = require('yahel');

exports.singletons = ['redis', 'config'];

exports.plugins = {
    publish: {channel: 'user-login'},
};

exports.fn = ({singletons: {redis, config}, plugins: {publish}}) => {
    /**
     * @alias user.signUp
     * @param {string} name
     * @return {Promise<string>}
     */
    return async name => {
        const
            token = generateToken(),
            isSet = await redis.setAsync(`${config.redis.TOKEN_PREFIX}:${token}`, name, 'NX', 'EX', config.common.sessionDurationSeconds);

        if (!isSet)
            throw BadRequest('User is already signed up');

        await redis.zaddAsync(config.redis.USERS_KEY, Date.now(), name);

        await publish(name);

        return token;
    };
};


function generateToken() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER + Date.now()).toString(36);
}
