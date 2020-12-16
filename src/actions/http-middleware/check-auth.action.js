'use strict';

const
    {Unauthorized} = require('yahel'),
    log = require('../../lib/logger');


exports.singletons = ['redis', 'config'];

exports.fn = ({singletons: {redis, config}}) => {
    /**
     * @alias httpMiddleware.checkAuth
     * @param {ClientRequest} req
     * @param {ServerResponse} res
     * @param {Function} next
     * @return {void}
     */
    return (req, res, next) => {
        const token = req.cookies[config.common.authCookieName];

        if (!token)
            return next(Unauthorized('No authorization cookie provided'));

        getUser(token)
            .then(name => {
                req.user = {name, token};
                next();
            })
            .catch(next);
    };

    async function getUser(token) {
        const
            key = `${config.redis.TOKEN_PREFIX}:${token}`,
            name = await redis.getAsync(key);

        if (!name)
            throw Unauthorized('Unknown token');

        redis
            .expireAsync(key, config.common.sessionDurationSeconds)
            .catch(e => log.error(`Error updating token expiration for "${name}"`, e));

        return name;
    }
};
