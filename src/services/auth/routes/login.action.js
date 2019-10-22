'use strict';

const
    {BadRequest} = require('yahel');


exports.singletons = ['config'];

exports.actions = ['user.signUp'];

exports.fn = ({actions: {user}, singletons: {config}}) => {
    return (req, res, next) => {
        if (!req.body.name)
            return next(BadRequest('Parameter name is required'));

        singUp(req.body.name).catch(next);

        async function singUp(name) {
            const token = await user.signUp(name);

            res
                .cookie(
                    config.common.authCookieName,
                    token,
                    {maxAge: config.common.sessionDurationSeconds * 1000},
                )
                .json({result: {token}});
        }
    };
};
