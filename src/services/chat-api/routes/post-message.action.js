'use strict';

const
    {BadRequest} = require('yahel');


exports.singletons = ['config'];

exports.actions = ['message.sendMessage'];

exports.fn = ({singletons: {config}, actions: {message}}) => {

    /**
     * @alias localActions.postMessage
     * @param {ClientRequest} req
     * @param {ServerResponse} res
     * @param {function} next
     */
    return (req, res, next) => {
        const
            name = req.user.name,
            text = req.body.text,
            maxLength = config.common.maxMessageLength;

        if (!text)
            throw BadRequest('Parameter "text"  is required');

        if (text.length > maxLength)
            throw BadRequest(`Text is too long: ${text.length}. Maximum is ${maxLength} characters`);

        message
            .sendMessage(name, text)
            .then(msg => {
                res.json({result: msg});
            })
            .catch(next);
    };
};
