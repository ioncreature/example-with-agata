'use strict';

exports.singletons = ['redis'];
exports.start = ({singletons: {redis}}) => {
    return params => {
        return data => redis.pubClient.publish(params.channel, data);
    };
};
