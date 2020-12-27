'use strict';

exports.actions = ['message.getMessages'];

exports.fn = ({actions: {message}}) => {
    /**
     * @alias localActions.getMessages
     * @param {ClientRequest} req
     * @param {ServerResponse} res
     * @param {function} next
     */
    return (req, res, next) => {
        message
            .getMessages()
            .then(list => {
                res.json({result: list});
            })
            .catch(next);
    };
};
