'use strict';

const
    {Unauthorized} = require('yahel'),
    log = require('../../lib/logger');


exports.singletons = ['redis', 'config'];

exports.fn = ({singletons: {redis, config}}) => {
    const client = redis.mainClient;

    /**
     * @alias httpMiddleware.checkAuth
     */
    return (req, res, next) => {
        const token = req.cookies[config.common.authCookieName];

        if (!token)
            return next(Unauthorized('No authorization cookie provided'));

        getUser()
            .then(userName => {
                req.userName = userName;
                next();
            })
            .catch(next);
    };

    async function getUser(token) {
        const
            key = `token:${token}`,
            userName = await client.getAsync(key);

        if (!userName)
            throw Unauthorized('Unknown token');

        client
            .expireAsync(key, config.common.sessionDurationSeconds)
            .catch(e => log.error(`Error updating expiration for "${userName}"`, e));

        return userName;
    }
};
