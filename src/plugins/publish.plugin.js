'use strict';

exports.singletons = ['redis'];
exports.start = ({singletons: {redis}}) => {
    return params => {
        return data => redis.publish(params.channel, data);
    };
};
