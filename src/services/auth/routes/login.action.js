'use strict';

const {BadRequest} = require('yahel');

exports.singletons = ['config'];

exports.actions = ['user.signUp'];

exports.fn = ({actions: {user}, singletons: {config}}) => {
    return (req, res, next) => {
        const name = req.body.name;
        if (!name) return next(BadRequest('Parameter name is required'));

        user.signUp(req.body.name)
            .then(token => {
                res.cookie(config.common.authCookieName, token, {maxAge: config.common.sessionDurationSeconds * 1000});
                res.json({token, name});
            })
            .catch(next);
    };
};
