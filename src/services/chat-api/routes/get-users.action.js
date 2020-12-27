'use strict';

exports.actions = ['user.getUsers'];

exports.fn = ({actions: {user}}) => {
    /**
     * @alias localActions.getUsers
     * @param {ClientRequest} req
     * @param {ServerResponse} res
     * @param {function} next
     */
    return (req, res, next) => {
        user.getUsers()
            .then(users => res.json({result: users}))
            .catch(next);
    };
};
