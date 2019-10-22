'use strict';


exports.actions = ['user.signOut'];
exports.fn = ({actions: {user}}) => {

    return (req, res, next) => {
        const {name, token} = req.user;
        user
            .signOut(name, token)
            .then(() => res.json({result: 'ok'}))
            .catch(next);
    };
};
