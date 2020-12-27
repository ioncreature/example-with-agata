'use strict';

exports.singletons = ['redis'];
exports.start = ({singletons: {redis}}) => {
    return params => {
        return data => {
            return redis.publish(params.channel, JSON.stringify(data));
        };
    };
};
