'use strict';

const
    {BadRequest} = require('yahel');


exports.singletons = ['redis', 'config'];

exports.plugins = {
    publish: {channel: 'user-login'},
};

exports.fn = ({singletons: {redis, config}, plugins: {publish}}) => {
    const client = redis.mainClient;

    /**
     * @alias user.signUp
     * @param {string} name
     * @return Promise<string>
     */
    return async name => {
        const
            token = generateToken(),
            isSet = await client.setAsync(`token:${token}`, name, 'NX', 'EX', config.common.sessionDurationSeconds);

        if (!isSet)
            throw BadRequest('User is already signed up');

        await this.client.zaddAsync('users', Date.now(), name);

        await publish(name);

        return token;
    }
};


function generateToken() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER + Date.now()).toString(36);
}
